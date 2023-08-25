<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
    <div v-if="showSuccessMessage" class="alert alert-success mt-4" role="alert">
      Objava dodana uspješno!
    </div>
    <div class="user-profile">
        <div class="text-center">
            <img :src="BASE_URL + '/storage/' + Korisnik.putanja" alt="User Image" class="rounded-circle user-image">
        </div>
        <div class="text-center mt-2">
            <button class="btn btn-dark" @click="changeImage">Promijeni sliku</button>
        </div>
        <div class="user-details mt-4 text-center">
          <h5 class="card-title">
              <span class="fw-bold">Ime: </span>
              <span v-if="!Korisnik.editing">{{ Korisnik.ime }}</span>
              <input v-else v-model="Korisnik.ime" class="form-control text-center">
            </h5>
            <p class="card-text">
              <span class="fw-bold">Prezime: </span>
              <span v-if="!Korisnik.editing">{{ Korisnik.prezime }}</span>
              <input v-else v-model="Korisnik.prezime" class="form-control text-center">
            </p>
            <div class="card-text">
              <span v-if="Korisnik.editing" class="fw-bold">Stara lozinka: </span>
              <div class="d-flex">
              <input v-bind:type="passwordFieldType" v-if="Korisnik.editing" v-model="Korisnik.lozinka" class="form-control text-center">
              <button v-if="Korisnik.editing" class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
            </div>
            <div class="card-text">
              <span v-if="Korisnik.editing" class="fw-bold">Nova lozinka: </span>
              <div class="d-flex">
              <input v-bind:type="passwordFieldType" v-if="Korisnik.editing" v-model="Korisnik.nova_lozinka" class="form-control text-center">
              <button v-if="Korisnik.editing" class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
            </div>
            <div class="card-text">
              <span v-if="Korisnik.editing" class="fw-bold">Potvrdi novu lozinku: </span>
              <div class="d-flex">
              <input v-bind:type="passwordFieldType" v-if="Korisnik.editing" v-model="Korisnik.potvrda_lozinke" class="form-control text-center">
              <button v-if="Korisnik.editing" class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
            </div>
            <p class="card-text">
              <span class="fw-bold">E-mail: </span>
              <span v-if="!Korisnik.editing">{{ Korisnik.email }}</span>
              <input v-else v-model="Korisnik.email" class="form-control text-center">
            </p>
        </div>
        <div class="text-center mt-2">
          <button class="btn btn-dark" @click="toggleEdit(Korisnik)" v-if="!Korisnik.editing">
                Uredi
          </button>
          <button class="btn btn-dark" v-else @click="ponistiUredjivanje(Korisnik)">Poništi</button>
          <button v-if="Korisnik.editing" class="btn btn-success" @click="saveChanges(Korisnik)">
                Potvrdi
          </button>
        </div>
  </div>
  <hr>
  <h2 class="mt-4" v-if="!showNoPostsMessage">Vaše objave:</h2>
  <button class="btn btn-dark" @click="otvoriZatvoriModalObjava">
    <i class="fas fa-plus"></i> Dodaj novu objavu
  </button>
  <h2 class="mt-4" v-if="showNoPostsMessage">Nemate objava</h2>
  <div v-if="otvorenModalObjava">
          <ModalObjava @zatvori="otvoriZatvoriModalObjava" :showEditButton="true" :objava="objava" />
      </div>
  <ModalDodajObjavu v-if="dodavanjeObjave" @zatvori="otvoriZatvoriModalObjava" :user_id="Korisnik.id" @potvrdjeno="UspjesnoSpremljeno"/>
  <div class="card-container-objava-user">
    <div class="card card-objava-user shadow" v-for="(objava, index) in objave" :key="index" @click="otvoriZatvoriModalObjava(objava)">
      <img :src="BASE_URL + '/storage/' + objava.image_path" alt="Slika objave" class="card-img-top">
      <div class="card-body">
        <p class="card-text">{{ objava.description }}</p>
        <p class="card-price">{{ objava.price }} BAM</p>
        <div class="card-rating">
          <div class="rating-wraper">
            <div class="ratings" @click.stop>
              <span @click="setRating(index, 5)">&#9733;</span>
              <span @click="setRating(index, 4)">&#9733;</span>
              <span @click="setRating(index, 3)">&#9733;</span>
              <span @click="setRating(index, 2)">&#9733;</span>
              <span @click="setRating(index, 1)">&#9733;</span>
            </div>
          </div>
          <div class="card-rating-text">
            <p class="card-rating-number">{{ objava.review.toFixed(1) }}</p>
            <p class="card-rating-reviews">{{ objava.num_reviews }} reviews</p>
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
      Korisnik: {
        id: '',
        ime: '',
        prezime: '',
        email: '',
        putanja: '',
        lozinka: '',
        nova_lozinka: '',
        potvrda_lozinke: '',
      }
    }
  },
  methods: {
    otvoriZatvoriModalObjava(){
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
    setRating(objavaIndex, rating) {
      console.log("Ne možete ocjeniti svoju objavu!")
    },
    otvoriZatvoriModalObjava(objava){
      this.otvorenModalObjava = !this.otvorenModalObjava;
      this.objava = objava;
    },
    dohvacanjeObjava(id){
      const API_ENDPOINT = `/api/posts/filterByUser/${id}`;
      api.get(API_ENDPOINT)
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
    toggleEdit(Korisnik) {
      Korisnik.editing = !Korisnik.editing;
    },
    saveChanges(Korisnik){
        const API_ENDPOINT = `/api/auth/updateUser/${Korisnik.id}`
        if(Korisnik.lozinka != ''){
          this.uredjenKorisnik = {
              "first_name": Korisnik.ime,
              "last_name": Korisnik.prezime,
              "email": Korisnik.email,
              "password": Korisnik.lozinka,
              "new_password": Korisnik.nova_lozinka,
              "new_password_confirmation": Korisnik.potvrda_lozinke,
          }
       }
       else{
        this.uredjenKorisnik = {
              "first_name": Korisnik.ime,
              "last_name": Korisnik.prezime,
              "email": Korisnik.email,
        }
       }
        console.log(this.uredjenKorisnik)
        api.put(API_ENDPOINT, this.uredjenKorisnik)
        .then(response => {
            console.log("Uspješno");
        })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
        window.location.reload();
      });
      Korisnik.editing = !Korisnik.editing
    },
    ponistiUredjivanje(Korisnik){
        const token = localStorage.getItem('token');
        if (token) {
          api.get('/api/auth/user', {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
          .then(response => {
            Korisnik.ime = response.data.first_name;
            Korisnik.prezime = response.data.last_name;
            Korisnik.email = response.data.email;
        })
        .catch(error => {
            console.error(error);
        });
        Korisnik.editing = !Korisnik.editing
    }
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
            this.dohvacanjeObjava(korisnik.id);
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
.user-profile {
  text-align: center;
}
.user-image {
  width: 250px;
  height: 250px;
  margin-bottom: 10px;
  margin-top: 10px;
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