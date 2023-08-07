<template>
    <NavbarUser />
    <div class="user-profile">
        <div class="text-center">
            <img :src="BASE_URL + '/storage/' + Korisnik.putanja" alt="User Image" class="rounded-circle user-image">
        </div>
        <div class="text-center mt-2">
            <button class="btn btn-dark" @click="changeImage">Promijeni sliku</button>
        </div>
        <div class="user-details mt-4 text-center">
            <p><strong>Ime:</strong> {{Korisnik.ime}}</p>
            <p><strong>Prezime:</strong> {{Korisnik.prezime}}</p>
            <p><strong>E-mail:</strong> {{Korisnik.email}}</p>
        </div>
        <div class="text-center mt-2">
            <button class="btn btn-dark" @click="editProfile">Uredi profil</button>
        </div>
  </div>
  <hr>
  <h2 class="mt-4">Vaše objave:</h2>
  <button class="btn btn-dark" @click="otvoriZatvoriModalObjava">Dodaj objavu</button>
  <ModalDodajObjavu v-if="dodavanjeObjave" @zatvori="otvoriZatvoriModalObjava" :user_id="Korisnik.id" @potvrdjeno="UspjesnoSpremljeno"/>
</template>

<script>
  import NavbarUser from '@/components/NavbarUser.vue'
  import ModalDodajObjavu from '@/components/ModalDodajObjavu.vue'
  import api from '../plugins/api'

  export default {
    name: 'UserProfileView',
    components: {
        NavbarUser,
        ModalDodajObjavu
    },
  mounted() {
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
        this.Korisnik.id = korisnik.id

        // Ovdje možete spremiti informacije o korisniku u lokalno stanje ili
        // izvršiti druge akcije koje su vam potrebne
        })
        .catch(error => {
        // Greška pri dohvaćanju informacija o korisniku
        console.error(error.response.data.message);
        });
        }
    },
    data(){
      return {
      BASE_URL: process.env.VUE_APP_BASE_URL,
      dodavanjeObjave: false,
      showSuccessMessage: false,
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
    otvoriZatvoriModalObjava(){
        this.dodavanjeObjave = !this.dodavanjeObjave
    },
    UspjesnoSpremljeno(){
      this.dodavanjeObjave = !this.dodavanjeObjave
      this.showSuccessMessage = true;
      setTimeout(() => {
          this.showSuccessMessage = false;
        }, 2000);
    }
  }
}

</script>

<style>
.user-profile {
  text-align: center;
}
.user-image {
  width: 250px;
  height: 250px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>