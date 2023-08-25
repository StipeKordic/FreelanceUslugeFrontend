<template>
  <NavbarUser :path=Korisnik.putanja :rola=userRole />
  <div class="users-list">
  <div v-for="korisnik in korisnici" :key="korisnik.id" class="card mb-3">
    <div class="row g-0" v-if="korisnik.id!=Korisnik.id">
      <div class="col-md-4">
        <img :src="BASE_URL + '/storage/' + korisnik.image_path" alt="Slika objave" class="card-img-top">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">
            <span class="fw-bold">Ime: </span>
            <span>{{ korisnik.first_name }}</span>
          </h5>
          <p class="card-text">
            <span class="fw-bold">Prezime: </span>
            <span >{{ korisnik.last_name }}</span>
          </p>
          <p class="card-text">
            <span class="fw-bold">Email: </span>
            <span>{{ korisnik.email }}</span>
          </p>
          <p class="card-text">
            <span class="fw-bold">Broj objava: </span>
            <span>{{ korisnik.posts_count }}</span>
          </p>
          <div class="action-buttons">
            <button class="btn btn-danger" @click="deleteUser(korisnik)">Izbriši korisnika</button>
          </div>
          <div class="mt-4">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="role" id="korisnik" value="3" v-model="korisnik.user_role.role_id">
              <label class="form-check-label" for="korisnik">Korisnik</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="role" id="admin" value="2" v-model="korisnik.user_role.role_id">
              <label class="form-check-label" for="admin">Admin</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="role" id="superadmin" value="1" v-model="korisnik.user_role.role_id">
              <label class="form-check-label" for="superadmin">SuperAdmin</label>
          </div>
          <button class="btn btn-success" @click="potvrdiMjenjanjeRole(korisnik.user_role.id, korisnik.user_role.role_id)">Promijeni rolu</button>
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
  dohvacanjeRole(id){
    const API_ENDPOINT = `/api/userroles/getRoleByUser/${id}`;
    api.get(API_ENDPOINT)
    .then(response => {
      this.userRole = response.data[0].role_id;
    })
    .catch(error => {
      console.error(error);
    });
  },
  potvrdiMjenjanjeRole(userrole_id, role_id){
    const API_ENDPOINT = `/api/userroles/${userrole_id}`
    let novaRola = {
            "role_id": role_id,
        }
    api.put(API_ENDPOINT, novaRola)
    .then(response => {
        console.log("Uspješno");
        window.location.reload();
    })
    .catch(error => {
      // Greška pri čuvanju
      console.error(error.response.data.message);
    });
  },
  dohvacanjeSvihKorisnika(){
      api.get('/api/auth')
      .then(response => {
          this.korisnici = response.data;
      })
      .catch(error => {
          console.error(error);
      });
  },
  deleteUser(korisnik){
      if (window.confirm('Jeste li sigurni da želite izbrisati ovu objavu?')) {
          this.izbrisiKorisnika(korisnik);
    }
  },
  izbrisiKorisnika(korisnik){
      const API_ENDPOINT = `/api/auth/${korisnik.id}`
      api.delete(API_ENDPOINT)
      .then(response => {
          console.log("Uspješno")
          window.location.reload();
      })
      .catch(error => {
          console.error(error);
      });
  },
  dohvacanjeUsera(){
    const token = localStorage.getItem('token');
    if (token) {
        api.get('/api/auth/user', {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
        // Dobivene informacije o korisniku
          const korisnik = response.data;
          this.Korisnik.ime = korisnik.first_name;
          this.Korisnik.prezime = korisnik.last_name;
          this.Korisnik.email = korisnik.email;
          this.Korisnik.putanja = korisnik.image_path;
          this.Korisnik.id = korisnik.id;
          this.dohvacanjeRole(korisnik.id)

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