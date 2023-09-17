<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
    <div class="post-list">
    <div v-for="post in objave" :key="post.id" class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="BASE_URL + '/storage/' + post.image_path" alt="Slika objave" class="card-img-top">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              <span class="fw-bold">Opis: </span>
              <span>{{ post.description }}</span>
            </h5>
            <p class="card-text">
              <span class="fw-bold">Cijena: </span>
              <span >{{ post.price }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Ocjena: </span>
              <span>{{ post.review }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Broj ocjena: </span>
              <span>{{ post.num_reviews }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Usluga: </span>
              <span>{{ post.service.name }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Korisnik: </span>
              <span>{{ post.user.email }}</span>
            </p>
            <div class="action-buttons">
              <button class="btn btn-danger" @click="deletePost(post)">Izbriši</button>
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
    this.dohvacanjeUsluga();
    this.dohvacanjeObjava();
    },
    data(){
      return {
      BASE_URL: process.env.VUE_APP_BASE_URL,
      userRole: 0,
      usluge: [],
      objave: [],
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
        if (this.userRole > 2){
          this.$router.push('/error');
      }
      })
      .catch(error => {
        console.error(error);
      });
    },
    dohvacanjeObjava(){
        api.get('/api/posts')
        .then(response => {
            this.objave = response.data;
        })
        .catch(error => {
            console.error(error);
        });
    },
    deletePost(post){
        if (window.confirm('Jeste li sigurni da želite izbrisati ovu objavu?')) {
            this.izbrisiObjavu(post);
      }
    },
    izbrisiObjavu(post){
        const API_ENDPOINT = `/api/posts/${post.id}`
        api.delete(API_ENDPOINT)
        .then(response => {
            console.log("Uspješno")
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    },
    dohvacanjeUsluga(){
      api.get('/api/services')
      .then(response => {
        this.usluge = response.data;
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
            this.dohvacanjeRole(korisnik.id);

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
    .post-list .card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
    }

    .post-list .card-img-top {
        width: 80%;
        height: 300px;
        object-fit: cover;
    }

    .action-buttons {
    margin-top: 10px;
    }
</style>