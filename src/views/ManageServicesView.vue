<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
    <div v-if="showSuccessMessage" class="alert alert-success mt-4" role="alert">
      Post added successfully!
    </div>
    <button class="btn btn-dark mt-3 mb-3" @click="otvoriZatvoriModalUsluga">
        <i class="fas fa-plus"></i> Add new service
    </button>
    <ModalDodajUslugu v-if="dodavanjeUsluge" @zatvori="otvoriZatvoriModalUsluga" @potvrdjeno="UspjesnoSpremljeno"/>
    <div class="service-list">
    <div v-for="service in usluge" :key="service.id" class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="BASE_URL + service.Service.image_path" alt="Slika usluge" class="card-img-top">
          <input type="file" id="image" @change="handleImageUpload2" accept="image/*" class="form-control">
          <button type="submit" class="btn btn-dark mb-3" @click="promijeniSliku(service)">Change image</button>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              <span class="fw-bold">Name: </span>
              <span v-if="!service.editing">{{ service.Service.name }}</span>
              <input v-else v-model="uredjenaUsluga.name" class="form-control" :placeholder="service.Service.name">
            </h5>
            <p class="card-text">
              <span class="fw-bold">Short description: </span>
              <span v-if="!service.editing">{{ service.Service.short_description }}</span>
              <input v-else v-model="uredjenaUsluga.short_description" class="form-control" :placeholder="service.Service.short_description">
            </p>
            <p class="card-text">
              <span class="fw-bold">Description: </span>
              <span v-if="!service.editing">{{ service.Service.description }}</span>
              <textarea v-else v-model="uredjenaUsluga.description" class="form-control" :placeholder="service.Service.description"></textarea>
            </p>
            <p class="card-text">
              <span class="fw-bold">Number of posts: </span>
              <span >{{ service["Number of posts"] }}</span>
            </p>
            <div class="action-buttons">
              <button class="btn btn-dark" @click="toggleEdit(service)" v-if="!service.editing">
                Edit
              </button>
              <button class="btn btn-dark" v-else @click="ponistiUredjivanje(service)">Undo</button>
              <button class="btn btn-danger" @click="deleteService(service)">Delete</button>
              <button v-if="service.editing" class="btn btn-success" @click="saveChanges(service)">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarUser from '@/components/NavbarUser.vue'
import ModalDodajUslugu from '@/components/ModalDodajUslugu.vue'
import api from '../plugins/api';
export default {
    name: 'ManageUsersView',
    components: {
        NavbarUser,
        ModalDodajUslugu,
    },
  mounted() {
    this.dohvacanjeUsera();
    this.dohvacanjeUsluga();
    },
    data(){
      return {
      BASE_URL: process.env.VUE_APP_BASE_URL,
      userRole: 0,
      dodavanjeUsluge: false,
      showSuccessMessage: false,
      slika: null,
      usluge: [],
      Korisnik: {
        id: '',
        ime: '',
        prezime: '',
        email: '',
        putanja: ''
      },
      uredjenaUsluga: {
        "name": "",
        "short_description": "",
        "description": ""
      }
    }
  },
  methods: {
    otvoriZatvoriModalUsluga(){
        this.dodavanjeUsluge = !this.dodavanjeUsluge
    },
    UspjesnoSpremljeno(){
      this.dodavanjeUsluge = !this.dodavanjeUsluge
      this.showSuccessMessage = true;
      this.dohvacanjeUsluga();
      setTimeout(() => {
          this.showSuccessMessage = false;
        }, 2000);
    },
    toggleEdit(service) {
      service.editing = !service.editing;
    },
    deleteService(service){
        if (window.confirm('Are you sure you want to delete this service?')) {
            this.izbrisiUslugu(service);
      }
    },
    izbrisiUslugu(service){
        const API_ENDPOINT = `/services/${service.Service.id}`;
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
    handleImageUpload2(event) {
              // Očitavanje izabrane slike i čuvanje u formData objektu
        this.slika = event.target.files[0];
      },
      promijeniSliku(service) {
              const formData = new FormData();
              const token = localStorage.getItem('token');

              if (this.slika) {
                formData.append('file', this.slika);
              }
              // Definišemo API endpoint
              const API_ENDPOINT = `services/image/${service.Service.id}`;

              // Slanje POST zahteva na backend
              api.put(API_ENDPOINT, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data', // Ovo je važno kada šaljete sliku
                  Authorization: `Bearer ${token}`
                },
              })
              .then(response => {
                // Uspješno sačuvano
                console.log(response.data.message);
                window.location.reload();
                // Dodajte dodatne akcije po potrebi
              })
              .catch(error => {
                // Greška pri čuvanju
                console.error(error.response.data.message);
              });
            },
      saveChanges(service){
        const API_ENDPOINT = `services/${service.Service.id}`;
        const token = localStorage.getItem('token');
        let promjene_na_usluzi = {};
        if (this.uredjenaUsluga.name != ""){
          promjene_na_usluzi["name"] = this.uredjenaUsluga.name;
        }
        if (this.uredjenaUsluga.description != ""){
          promjene_na_usluzi["description"] = this.uredjenaUsluga.description;
        }
        if (this.uredjenaUsluga.short_description != ""){
          promjene_na_usluzi["short_description"] = this.uredjenaUsluga.short_description;
        }

        api.put(API_ENDPOINT, promjene_na_usluzi, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
      })
        .then(response => {
            console.log("Uspješno");
            this.uredjenaUsluga.name = "";
            this.uredjenaUsluga.description = "";
            this.uredjenaUsluga.short_description = "";
            window.location.reload();
        })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
      service.editing = !service.editing
    },
    ponistiUredjivanje(service){
      const token = localStorage.getItem('token');
      const endpoint = `services/${service.Service.id}`
          api.get(endpoint, {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
          .then(response => {
            const new_data = response.data
          // Dobivene informacije o korisniku
            service.Service.name = new_data.Service.name;
            service.Service.short_description = new_data.Service.short_description;
            service.Service.description = new_data.Service.description;
            this.uredjenaUsluga.name = "";
            this.uredjenaUsluga.description = "";
            this.uredjenaUsluga.short_description = "";

          // Ovdje možete spremiti informacije o korisniku u lokalno stanje ili
          // izvršiti druge akcije koje su vam potrebne
          })
          .catch(error => {
          // Greška pri dohvaćanju informacija o korisniku
            console.error(error.response.data.message);
          });
          service.editing = !service.editing
      },
    dohvacanjeUsluga(){
      api.get('/services')
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
    .service-list .card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
    }

    .service-list .card-img-top {
        width: 50%;
        height: 300px;
        object-fit: cover;
    }

    .action-buttons {
    margin-top: 10px;
    }
</style>