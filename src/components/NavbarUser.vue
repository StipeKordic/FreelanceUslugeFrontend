<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/user" class="navbar-brand logo custom-logo">Freelance Usluge</router-link>
      
      <div class="dropdown ms-auto" style="margin-right: 30px;">
        <button
          class="btn btn-dark dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          @click="prikaziOpcije"
        >
          <img
            class="rounded-circle"
            :src="BASE_URL + '/storage/' + path"
            alt="Profilna slika"
            width="50"
            height="50"
          />
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li><router-link to="/user/profile" class="dropdown-item">Profil</router-link></li>
          <li><router-link to="/user/manage/posts" class="dropdown-item" v-if="prikaziZaSuperAdmina||prikaziZaAdmina">Upravljaj objavama</router-link></li>
          <li><router-link to="/user/manage/users" class="dropdown-item" v-if="prikaziZaSuperAdmina">Upravljaj korisnicima</router-link></li>
          <li><router-link to="/user/manage/services" class="dropdown-item" v-if="prikaziZaSuperAdmina||prikaziZaAdmina">Upravljaj uslugama</router-link></li>
          <li><button class="dropdown-item" @click="logoutUsera">Odjavi se</button></li>
        </ul>
      </div>
      
    </nav>
</template>

<script>
import api from '../plugins/api';
export default {
  props: ['path','rola'],
  name: 'NavbarUser',
  data(){
      return {
        BASE_URL: process.env.VUE_APP_BASE_URL,
        prikaziZaAdmina: false,
        prikaziZaSuperAdmina: false,
      }
    },
  methods: {
    logoutUsera(){
      const token = localStorage.getItem('token');
      if (token) {
          api.get('/api/auth/logout', {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
          .then(response => {
          // Dobivene informacije o korisniku
            console.log("Uspješno!");
            this.$router.push('/');

          // Ovdje možete spremiti informacije o korisniku u lokalno stanje ili
          // izvršiti druge akcije koje su vam potrebne
          })
          .catch(error => {
          // Greška pri dohvaćanju informacija o korisniku
            console.error(error.response.data.message);
          });
          }
    },
    prikaziOpcije(){
      if (this.rola == 1){
        this.prikaziZaSuperAdmina = true;
      } else if (this.rola == 2){
        this.prikaziZaAdmina = true;
      }
    },
  }
}
</script>

<style>
  .custom-logo {
        margin-left: 20px;
        color: white !important;
    }

    .custom-logo:hover {
        cursor: pointer; 
    }
    
</style>