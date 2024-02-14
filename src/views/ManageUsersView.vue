<template>
  <NavbarUser :path=Korisnik.putanja :rola=userRole />
  <div class="users-list">
  <div v-for="korisnik in korisnici" :key="korisnik.id" class="card mb-3">
    <div class="row g-0" v-if="korisnik.User.id!=Korisnik.id">
      <div class="col-md-4">
        <img :src="BASE_URL + korisnik.User.image_path" alt="Slika objave" class="card-img-top">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">
            <span class="fw-bold">First name: </span>
            <span>{{ korisnik.User.first_name }}</span>
          </h5>
          <p class="card-text">
            <span class="fw-bold">Last name: </span>
            <span >{{ korisnik.User.last_name }}</span>
          </p>
          <p class="card-text">
            <span class="fw-bold">E-mail: </span>
            <span>{{ korisnik.User.email }}</span>
          </p>
          <!--<p class="card-text">
            <span class="fw-bold">Broj objava: </span>
            <span>korisnik.User.posts_count</span>
          </p>
        -->
          <div class="action-buttons">
            <button class="btn btn-danger" @click="deleteUser(korisnik)">Delete user</button>
          </div>
          <div class="mt-4">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :name="'role' + korisnik.User.id" id="RegularUser" value="3" v-model="korisnik.Role.id">
              <label class="form-check-label" for="RegularUser">RegularUser</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :name="'role' + korisnik.User.id" id="Admin" value="2" v-model="korisnik.Role.id">
              <label class="form-check-label" for="Admin">Admin</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :name="'role' + korisnik.User.id" id="SuperAdmin" value="1" v-model="korisnik.Role.id">
              <label class="form-check-label" for="SuperAdmin">SuperAdmin</label>
          </div>
          <button class="btn btn-success" @click="potvrdiMjenjanjeRole(korisnik.User.id, korisnik.Role.id)">Change role</button>
        </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavbarUser from '@/components/NavbarUser.vue'
import api from '../plugins/api';
export default {
  name: 'ManageUsersView',
  components: {
      NavbarUser,
  },
mounted() {
  this.dohvacanjeUsera();
  this.dohvacanjeSvihKorisnika();
  },
  data(){
    return {
    BASE_URL: process.env.VUE_APP_BASE_URL,
    userRole: 0,
    mjenjanjeRole: false,
    korisnici: [],
    Korisnik: {
      id: '',
      ime: '',
      prezime: '',
      email: '',
      putanja: ''
    }
  }
},
methods: {
  potvrdiMjenjanjeRole(userrole_id, role_id){
    role_id = parseInt(role_id)
    const API_ENDPOINT = `/roles/user/${userrole_id}/${role_id}`;
    const token = localStorage.getItem('token');
    api.put(API_ENDPOINT, null, {
          headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
          }
          })
    .then(response => {
        console.log("Successful");
        window.location.reload();
    })
    .catch(error => {
      // Greška pri čuvanju
      console.error(error.response.data.message);
    });
  },
  dohvacanjeSvihKorisnika(){
    const token = localStorage.getItem('token');
      api.get('/users', {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
      .then(response => {
          this.korisnici = response.data;
          console.log(this.korisnici)
      })
      .catch(error => {
          console.error(error);
      });
  },
  deleteUser(korisnik){
      if (window.confirm('Are you sure you want to delete this user??')) {
          this.izbrisiKorisnika(korisnik);
    }
  },
  izbrisiKorisnika(korisnik){
      const API_ENDPOINT = `/users/${korisnik.User.id}`;
      const token = localStorage.getItem('token');
      api.delete(API_ENDPOINT, {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
      .then(response => {
          console.log("Successful")
          window.location.reload();
      })
      .catch(error => {
          console.error(error);
      });
  },
  dohvacanjeUsera(){
      const token = localStorage.getItem('token');
      if (token) {
        const parts = token.split('.');
        const payload = atob(parts[1]);
        const payloadObject = JSON.parse(payload);
        const userId = payloadObject.user_id;
        const endpoint = 'users/' + userId
          api.get(endpoint, {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
          .then(response => {
          // Dobivene informacije o korisniku
            const korisnik = response.data;
            this.Korisnik.ime = korisnik["User"].first_name;
            this.Korisnik.prezime = korisnik["User"].last_name;
            this.Korisnik.email = korisnik["User"].email;
            this.Korisnik.putanja = korisnik["User"].image_path;
            this.Korisnik.id = userId
            this.userRole = korisnik["Role"].id

          // Ovdje možete spremiti informacije o korisniku u lokalno stanje ili
          // izvršiti druge akcije koje su vam potrebne
          })
          .catch(error => {
          // Greška pri dohvaćanju informacija o korisniku
            console.error(error.response.data.message);
          });
        }else{
          this.$router.push('/error');
        }
      },
}
}
</script>

<style>
  .users-list .card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
  }

  .users-list .card-img-top {
      width: 80%;
      height: 300px;
      object-fit: cover;
  }

  .action-buttons {
  margin-top: 10px;
  }
</style>