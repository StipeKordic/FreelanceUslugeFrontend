<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
    <div class="post-list">
    <div v-for="post in objave" :key="post.id" class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="BASE_URL + post.Post.image_path" alt="Slika objave" class="card-img-top">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              <span class="fw-bold">Description: </span>
              <span>{{ post.Post.description }}</span>
            </h5>
            <p class="card-text">
              <span class="fw-bold">Price: </span>
              <span >{{ post.Post.price }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Review: </span>
              <span>{{ post.Review }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Number of reviews: </span>
              <span>{{ post["Number of reviews"] }}</span>
            </p>
            <p class="card-text">
              <span class="fw-bold">Service: </span>
              <span> {{post.name}} </span>
            </p>
            <p class="card-text">
              <span class="fw-bold">User: </span>
              <span>{{ post.email }}</span>
            </p>
            <div class="action-buttons">
              <button class="btn btn-danger" @click="deletePost(post)">Delete</button>
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
    dohvacanjeObjava(){
      const token = localStorage.getItem('token');
      api.get('/posts/?page=1', {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
      .then(response => {
        this.objave = response.data;
      })
      .catch(error => {
        console.error(error);
      });
    },
    deletePost(post){
        if (window.confirm('Are you sure you want to delete this post?')) {
            this.izbrisiObjavu(post);
      }
    },
    izbrisiObjavu(post){
      const API_ENDPOINT = `/posts/${post.Post.id}`;
        const token = localStorage.getItem('token');
        api.delete(API_ENDPOINT, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
       })
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
            this.dohvacanjeObjava();

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