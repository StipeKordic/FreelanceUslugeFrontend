<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
    <div v-if="showSuccessMessage" class="alert alert-success mt-4" role="alert">
      Objava dodana uspješno!
    </div>
    <button class="btn btn-dark mt-3 mb-3" @click="otvoriZatvoriModalUsluga">
        <i class="fas fa-plus"></i> Dodaj novu uslugu
    </button>
    <ModalDodajUslugu v-if="dodavanjeUsluge" @zatvori="otvoriZatvoriModalUsluga" @potvrdjeno="UspjesnoSpremljeno"/>
    <div class="service-list">
    <div v-for="service in usluge" :key="service.id" class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="BASE_URL + '/storage/' + service.image_path" alt="Slika usluge" class="card-img-top">
          <input type="file" id="image" @change="handleImageUpload" accept="image/*" class="form-control">
          <button type="submit" class="btn btn-dark mb-3" @click="promijeniSliku(service)">Promijeni sliku</button>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              <span class="fw-bold">Ime: </span>
              <span v-if="!service.editing">{{ service.name }}</span>
              <input v-else v-model="service.name" class="form-control">
            </h5>
            <p class="card-text">
              <span class="fw-bold">Kratki opis: </span>
              <span v-if="!service.editing">{{ service.short_description }}</span>
              <input v-else v-model="service.short_description" class="form-control">
            </p>
            <p class="card-text">
              <span class="fw-bold">Opis: </span>
              <span v-if="!service.editing">{{ service.description }}</span>
              <textarea v-else v-model="service.description" class="form-control"></textarea>
            </p>
            <p class="card-text">
              <span class="fw-bold">Broj objava: </span>
              <span >{{ service.posts_count }}</span>
            </p>
            <div class="action-buttons">
              <button class="btn btn-dark" @click="toggleEdit(service)" v-if="!service.editing">
                Uredi
              </button>
              <button class="btn btn-dark" v-else @click="ponistiUredjivanje(service)">Poništi</button>
              <button class="btn btn-danger" @click="deleteService(service)">Izbriši</button>
              <button v-if="service.editing" class="btn btn-success" @click="saveChanges(service)">
                Potvrdi
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
        if (window.confirm('Jeste li sigurni da želite izbrisati ovu objavu?')) {
            this.izbrisiObjavu(service);
      }
    },
    izbrisiObjavu(service){
        const API_ENDPOINT = `/api/services/${service.id}`
        api.delete(API_ENDPOINT)
        .then(response => {
            console.log("Uspješno")
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    },
    handleImageUpload(event) {
              // Očitavanje izabrane slike i čuvanje u formData objektu
        this.slika = event.target.files[0];
      },
      promijeniSliku(service) {
              const formData = new FormData();

              if (this.slika) {
                formData.append('image_path', this.slika);
              }
              // Definišemo API endpoint
              const API_ENDPOINT = `/api/services/image/${service.id}`;

              // Slanje POST zahteva na backend
              api.put(API_ENDPOINT, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data', // Ovo je važno kada šaljete sliku
                },
              })
              .then(response => {
                // Uspješno sačuvano
                console.log(response.data.message);
                // Dodajte dodatne akcije po potrebi
              })
              .catch(error => {
                // Greška pri čuvanju
                console.error(error.response.data.message);
              });
            },
    saveChanges(service){
        const API_ENDPOINT = `/api/services/${service.id}`
        let uredjenaUsluga = {
            "name": service.name,
            "description": service.description,
            "short_description": service.short_description
        }
        api.put(API_ENDPOINT, uredjenaUsluga)
        .then(response => {
            console.log("Uspješno");
        })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
      service.editing = !service.editing
    },
    ponistiUredjivanje(service){
        const API_ENDPOINT = `/api/services/${service.id}`
        api.get(API_ENDPOINT)
        .then(response => {
            service.name = response.data.name;
            service.short_description = response.data.short_description;
            service.description = response.data.description;
        })
        .catch(error => {
            console.error(error);
        });
        service.editing = !service.editing
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