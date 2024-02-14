<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
    <div v-if="showSuccessMessage" class="alert alert-success mt-4" role="alert">
      Post added successfully!
    </div>
    <div class="user-profile">
        <div class="text-center">
            <img :src="BASE_URL + Korisnik.putanja" alt="User Image" class="rounded-circle user-image">
        </div>
        <div class="text-center mt-2">
          <input type="file" ref="fileInput" @change="handleImageUpload2" accept="image/*" style="display: none">
          <button type="button" class="btn btn-dark mb-3" @click="openFileInput">Change image</button>
          <div class="tooltip-container">
            <button type="button" class="btn btn-light mb-3 rounded-pill" @click="ukloniSliku">
              <img width="15" height="15" src="https://img.icons8.com/material-outlined/24/remove-image.png" alt="remove-image"/> 
            </button>
            <div class="tooltip">Remove image (change to default)</div>
          </div>
        </div>
        <div class="user-details mt-4 text-center">
          <h5 class="card-title">
              <span class="fw-bold">First name: </span>
              <span v-if="!Korisnik.editing">{{ Korisnik.ime }}</span>
              <input v-else v-model="Korisnik.ime" class="form-control text-center">
            </h5>
            <p class="card-text">
              <span class="fw-bold">Last name: </span>
              <span v-if="!Korisnik.editing">{{ Korisnik.prezime }}</span>
              <input v-else v-model="Korisnik.prezime" class="form-control text-center">
            </p>
            <p class="card-text">
              <span class="fw-bold">E-mail: </span>
              <span v-if="!Korisnik.editing">{{ Korisnik.email }}</span>
              <input v-else v-model="Korisnik.email" class="form-control text-center">
            </p>
            <div class="card-text">
              <span v-if="Lozinke.editing" class="fw-bold">Old password: </span>
              <div class="d-flex">
              <input v-bind:type="passwordFieldType" v-if="Lozinke.editing" v-model="Lozinke.lozinka" class="form-control text-center">
              <button v-if="Lozinke.editing" class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
            </div>
            <div class="card-text">
              <span v-if="Lozinke.editing" class="fw-bold">New password: </span>
              <div class="d-flex">
              <input v-bind:type="passwordFieldType" v-if="Lozinke.editing" v-model="Lozinke.nova_lozinka" class="form-control text-center">
              <button v-if="Lozinke.editing" class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
            </div>
            <div class="card-text">
              <span v-if="Lozinke.editing" class="fw-bold">Confirm new password: </span>
              <div class="d-flex">
              <input v-bind:type="passwordFieldType" v-if="Lozinke.editing" v-model="Lozinke.potvrda_lozinke" class="form-control text-center">
              <button v-if="Lozinke.editing" class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
            </div>
        </div>
        <div class="text-center mt-2">
          <button class="btn btn-dark" @click="toggleEdit(Korisnik)" v-if="!Korisnik.editing">
                Edit
          </button>
          <button class="btn btn-dark" v-else @click="ponistiUredjivanje(Korisnik)">Undo</button>
          <button v-if="Korisnik.editing" class="btn btn-success" @click="saveChanges(Korisnik)">
                Confirm
          </button>
          <button class="btn btn-dark" @click="togglePasswordEdit(Lozinke)" v-if="Korisnik.editing && !Lozinke.editing">
                Change password
          </button>
          <button class="btn btn-dark" @click="ponistiUredjivanjeLozinke(Lozinke)" v-if="Lozinke.editing">Undo password changing</button>
        </div>
  </div>
  <hr>
  <h2 class="mt-4" v-if="!showNoPostsMessage">Your posts:</h2>
  <button class="btn btn-dark" @click="otvoriZatvoriModalDodavanjeObjava">
    <i class="fas fa-plus"></i> Add new post
  </button>
  <h2 class="mt-4" v-if="showNoPostsMessage">You don't have any posts</h2>
  <div v-if="otvorenModalObjava">
          <ModalObjava @zatvori="otvoriZatvoriModalObjava" :showEditButton="true" :objava="objava" />
      </div>
  <ModalDodajObjavu v-if="dodavanjeObjave" @zatvori="otvoriZatvoriModalDodavanjeObjava" :user_id="Korisnik.id" @potvrdjeno="UspjesnoSpremljeno"/>
  <div class="card-container-objava-user">
    <div class="card card-objava-user shadow" v-for="(objava, index) in objave" :key="index" @click="otvoriZatvoriModalObjava(objava)">
      <img :src="BASE_URL + objava.Post.image_path" alt="Slika objave" class="card-img-top">
      <div class="card-body">
        <p class="card-text">{{ objava.Post.description }}</p>
        <p class="card-price">{{ objava.Post.price }} $</p>
        <div class="card-rating">
         <!--<div class="rating-wraper">
            <div class="ratings" @click.stop>
              <span @click="setRating(index, 5)">&#9733;</span>
              <span @click="setRating(index, 4)">&#9733;</span>
              <span @click="setRating(index, 3)">&#9733;</span>
              <span @click="setRating(index, 2)">&#9733;</span>
              <span @click="setRating(index, 1)">&#9733;</span>
            </div>
          </div>-->
          <div class="card-rating-text">
            <p class="card-rating-number">{{ objava.Review.toFixed(1) }}</p>
            <p class="card-rating-reviews">{{ objava["Number of reviews"] }} reviews</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NavbarUser from '@/components/NavbarUser.vue'
  import ModalDodajObjavu from '@/components/ModalDodajObjavu.vue'
  import ModalObjava from '@/components/ModalObjava.vue'
  import api from '../plugins/api'


  export default {
    name: 'UserProfileView',
    components: {
        NavbarUser,
        ModalDodajObjavu,
        ModalObjava
    },
  mounted() {
    this.dohvacanjeUsera();
    },
    data(){
      return {
      BASE_URL: process.env.VUE_APP_BASE_URL,
      userRole: 0,
      dodavanjeObjave: false,
      objava: null,
      passwordFieldType: 'password',
      otvorenModalObjava: false,
      showSuccessMessage: false,
      prikaziObjave: true,
      showNoPostsMessage: false,
      objave: [],
      uredjenKorisnik: {},
      passwords: {},
      Lozinke: {
        lozinka: '',
        nova_lozinka: '',
        potvrda_lozinke: '',
      },
      Korisnik: {
        id: '',
        ime: '',
        prezime: '',
        email: '',
        putanja: '',
      }
    }
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click();
    },
    ukloniSliku(){
      const API_ENDPOINT = '/users/image_delete';
      const token = localStorage.getItem('token');
      if (window.confirm('Are you sure you want to set image to default?')) {
        api.put(API_ENDPOINT, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
        .then(response => {
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        });
      }
    },
    otvoriZatvoriModalDodavanjeObjava(){
        this.dodavanjeObjave = !this.dodavanjeObjave
    },
    togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
    UspjesnoSpremljeno(){
      this.dodavanjeObjave = !this.dodavanjeObjave
      this.showSuccessMessage = true;
      this.dohvacanjeObjava(this.Korisnik.id);
      setTimeout(() => {
          this.showSuccessMessage = false;
        }, 2000);
    },
    otvoriZatvoriModalObjava(objava){
      this.otvorenModalObjava = !this.otvorenModalObjava;
      this.objava = objava;
    },
    dohvacanjeObjava(){
      const API_ENDPOINT = '/posts/userPosts';
      const token = localStorage.getItem('token');
      api.get(API_ENDPOINT, {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
      .then(response => {
        this.objave = response.data;
        console.log(this.objave.length)
        if(this.objave.length==0){
          this.showNoPostsMessage = true;
        }else{
          this.showNoPostsMessage = false;
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
    toggleEdit(Korisnik) {
      Korisnik.editing = !Korisnik.editing;
    },
    togglePasswordEdit(Lozinke) {
      Lozinke.editing = !Lozinke.editing;
    },
    changePassword(Lozinke){
      const API_ENDPOINT = '/users/change_password';
      const token = localStorage.getItem('token');
      if (Lozinke.nova_lozinka != Lozinke.potvrda_lozinke){
        alert("Lozinke koje ste unijeli se ne podudaraju!");
        Lozinke.editing = !Lozinke.editing
        this.Lozinke = {
          lozinka: '',
          nova_lozinka: '',
          potvrda_lozinke: ''
        }
        return 1;
      }
      this.passwords = {"old_password": Lozinke.lozinka,
                        "new_password": Lozinke.nova_lozinka}
                        
      api.put(API_ENDPOINT, this.passwords, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
       })
        .then(response => {
            console.log("Uspješno");
        })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
      Lozinke.editing = !Lozinke.editing
      this.Lozinke = {
        lozinka: '',
        nova_lozinka: '',
        potvrda_lozinke: ''
      }
    },
    saveChanges(Korisnik){
        const API_ENDPOINT = '/users';
        const token = localStorage.getItem('token');
        this.uredjenKorisnik = {"first_name": Korisnik.ime,
                                "last_name": Korisnik.prezime,
                                "email": Korisnik.email}
        if (this.Lozinke.editing){
          this.changePassword(this.Lozinke);
        } 
        api.put(API_ENDPOINT, this.uredjenKorisnik, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
       })
        .then(response => {
            console.log("Uspješno");
        })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
      Korisnik.editing = !Korisnik.editing
    },
    ponistiUredjivanjeLozinke(Lozinke){
      Lozinke.lozinka = '';
      Lozinke.nova_lozinka = '';
      Lozinke.potvrda_lozinka = '';
      Lozinke.editing = !Lozinke.editing;
    },
    ponistiUredjivanje(Korisnik){
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
        Korisnik.editing = !Korisnik.editing
      },
      handleImageUpload2(event) {

        const formData = new FormData();
        const token = localStorage.getItem('token');

        if (event.target.files[0]) {
          formData.append('file', event.target.files[0]);
        }
        // Definišemo API endpoint
        const API_ENDPOINT = 'users/image_update';

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
.user-profile {
  text-align: center;
}
.user-image {
  width: 250px;
  height: 250px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.btn-light.rounded-pill {
  border-radius: 10px; 
  height: 40px; 
  width: 40px;
  border: 1px solid black; 
  margin-left: 2px;
}

.btn-light.rounded-pill .bi {
  font-size: 1.5rem;
}
.card-container-objava-user{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card-objava-user {
  width: 300px;
  margin: 10px;
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-price {
  font-weight: bold;
  font-size: 1.25rem;
}
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  visibility: hidden;
  width: 120px;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 120%; /* Position above the button */
  left: 50%;
  margin-left: -60px; /* Center the tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
.card-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.ratings{
  display: flex;
  flex-direction: row-reverse;
}
.ratings span{
  cursor: pointer;
  transition: color .2s, transform .2s;
  font-size: 30px;
}
.ratings span:hover{
  color:orange;
}
.ratings span:hover ~ span {
  color: orange;
}
.card-rating-text {
  font-size: 1rem;
  color: gray;
}
</style>