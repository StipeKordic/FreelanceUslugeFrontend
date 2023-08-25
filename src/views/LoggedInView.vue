<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
      <div class="filter-container justify-content-around mt-3">
        <div class="row">
          <div class="filter-item col-md-3 col-sm-6">
            <label for="usluga">Usluga:</label>
            <select v-model="odabranaUsluga" id="usluga" class="form-control">
              <option value="">Sve usluge</option>
              <option v-for="usluga in usluge" :key="usluga.id" :value="usluga.id">{{ usluga.name }}</option>
            </select>
          </div>
          <div class="filter-item col-md-3 col-sm-6">
            <label for="donjaCijena">Donja cijena:</label>
            <input type="number" v-model="donjaCijena" id="donjaCijena" class="form-control" />
          </div>
          <div class="filter-item col-md-3 col-sm-6">
            <label for="gornjaCijena">Gornja cijena:</label>
            <input type="number" v-model="gornjaCijena" id="gornjaCijena" class="form-control" />
          </div>
          <div class="filter-item col-md-3 col-sm-6">
            <label for="ocjena">Ocjena:</label>
            <input type="range" v-model="ocjena" id="ocjena" class="form-range" min="0" max="5" step="0.1" />
            <span class="range-value">{{ ocjena }}</span>
          </div>
        </div>
      </div>
      <div class="filter-button col-md-12 col-sm-12 text-center mt-3">
          <button @click="primijeniFiltere" class="btn btn-dark">Primijeni filtere</button>
      </div>
      <div v-if="otvorenModalObjava">
          <ModalObjava @zatvori="otvoriZatvoriModalObjava" :showEditButton="false" :objava="objava" />
      </div>
    <div class="card-container-objava">
    <div class="card card-objava shadow" v-for="(objava, index) in filtriraneObjave" :key="index" @click="otvoriZatvoriModalObjava(objava)">
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
            <p class="card-rating-number text-warning fw-bold">{{ objava.review.toFixed(1) }}</p>
            <p class="card-rating-reviews">{{ objava.num_reviews }} reviews</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NavbarUser from '@/components/NavbarUser.vue'
  import ModalObjava from '@/components/ModalObjava.vue'
  import api from '../plugins/api';
  export default {
  name: 'LoggedInView',
  components: {
    NavbarUser,
    ModalObjava
  },
  data(){
    return{
      objave: [],
      otvorenModalObjava: false,
      objavePoUsluzi: [],
      objava: null,
      objavePoCijeni: [],
      objavePoOcjeni: [],
      filtriraneObjave: this.objave,
      filtriraneObjavePomocna: [],
      filtriraneObjavePomocna2: [],
      usluge: [],
      ocjena: 0,
      userRole: 0,
      odabranaUsluga: "",
      donjaCijena: 0,
      gornjaCijena: 9999999999,
      BASE_URL: process.env.VUE_APP_BASE_URL,
      Korisnik: {
        id: '',
        ime: '',
        prezime: '',
        email: '',
        putanja: ''
      }
    }
  },
  mounted() {
    this.dohvacanjeObjava();
    this.dohvacanjeUsluga();
    this.dohvacanjeUsera();
  },
  methods: {
    dohvacanjeObjava(){
      api.get('/api/posts')
      .then(response => {
        this.objave = response.data;
        this.filtriraneObjave = response.data;
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
    otvoriZatvoriModalObjava(objava){
      this.otvorenModalObjava = !this.otvorenModalObjava;
      this.objava = objava;
    },
    dohvacanjeUsera(){
      const token = localStorage.getItem('token');
      console.log(token)
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
    filtrirajPoUsluzi(service_id, ocjena, donjaCijena, gornjaCijena){
      this.filtriraneObjavePomocna = [];
      this.filtriraneObjavePomocna2 = [];
      if(service_id){
      
        const API_ENDPOINT = `/api/posts/filterByService/${service_id}`;
        api.get(API_ENDPOINT)
        .then(response => {
          this.objavePoUsluzi = response.data;
        })
        .catch(error => {
          console.error(error);
        });
      }else{
        this.objavePoUsluzi = this.objave;
      }
      const API_ENDPOINT2 = `/api/posts/filterByReview/${ocjena}`;
      api.get(API_ENDPOINT2)
        .then(response => {
          this.objavePoOcjeni = response.data;
          for(let i=0;i<this.objavePoUsluzi.length;i++){
            for(let j=0;j<this.objavePoOcjeni.length;j++){
              if(this.objavePoUsluzi[i].id == this.objavePoOcjeni[j].id){
                this.filtriraneObjavePomocna.push(this.objavePoUsluzi[i]);
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
        const API_ENDPOINT3 = `/api/posts/filterByPrice/${donjaCijena}/${gornjaCijena}`;
        api.get(API_ENDPOINT3)
        .then(response => {
          this.objavePoCijeni = response.data;
          for(let i=0;i<this.filtriraneObjavePomocna.length;i++){
            for(let j=0;j<this.objavePoCijeni.length;j++){
              if(this.filtriraneObjavePomocna[i].id == this.objavePoCijeni[j].id){
                this.filtriraneObjavePomocna2.push(this.filtriraneObjavePomocna[i]);
              }
            }
          }
          this.filtriraneObjave = this.filtriraneObjavePomocna2;
        })
        .catch(error => {
          console.error(error);
        });
    },
    primijeniFiltere(){
      this.filtrirajPoUsluzi(this.odabranaUsluga, this.ocjena, this.donjaCijena, this.gornjaCijena)
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
    setRating(objavaIndex, rating) {
      // Postavite ocjenu objave na temelju ratinga
      // Možete koristiti API za spremanje ocjene u bazu ili druge akcije
      const API_ENDPOINT = `/api/posts/${this.objave[objavaIndex].id}`;
      let num_reviews = this.objave[objavaIndex].num_reviews;
      let review = this.objave[objavaIndex].review;
      review = ((review * num_reviews) + rating)/(num_reviews +1);
      num_reviews = num_reviews + 1;
      let novaObjava = {
          "description": this.objave[objavaIndex].description,
          "price": this.objave[objavaIndex].price,
          "review": review,
          "num_reviews": num_reviews,
      }
      api.put(API_ENDPOINT, novaObjava)
      .then(response => {
        console.log("Uspješno");
        this.dohvacanjeObjava();
      })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
      // Resetirajte highlightedStars nakon postavljanja ocjene
      this.highlightedStars = 0;
    },
  }
}

</script>

<style>
  
  .card-container-objava{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card-objava {
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
.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 10px;
}

.filter-item {
  width: calc(25% - 10px);
  margin-bottom: 5px;
}

.filter-button {
  text-align: right;
}

.range-value {
  margin-left: 5px;
}
</style>