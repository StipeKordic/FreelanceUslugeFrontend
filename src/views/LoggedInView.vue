<template>
    <NavbarUser :path=Korisnik.putanja :rola=userRole />
      <div class="filter-container justify-content-around mt-3">
        <div class="row">
          <div class="filter-item col-md-3 col-sm-6">
            <label for="usluga">Service:</label>
            <select v-model="odabranaUsluga" id="usluga" class="form-control">
              <option value="0">All services</option>
              <option v-for="usluga in usluge" :key="usluga.Service.id" :value="usluga.Service.id">{{ usluga["Service"].name }}</option>
            </select>
          </div>
          <div class="filter-item col-md-3 col-sm-6">
            <label for="donjaCijena">Lower bound price:</label>
            <input type="number" v-model="donjaCijena" id="donjaCijena" class="form-control" />
          </div>
          <div class="filter-item col-md-3 col-sm-6">
            <label for="gornjaCijena">Upper bound price:</label>
            <input type="number" v-model="gornjaCijena" id="gornjaCijena" class="form-control" />
          </div>
          <div class="filter-item col-md-3 col-sm-6">
            <label for="ocjena">Review:</label>
            <input type="range" v-model="ocjena" id="ocjena" class="form-range" min="0" max="5" step="0.1" />
            <span class="range-value">{{ ocjena }}</span>
          </div>
        </div>
      </div>
      <div class="filter-button col-md-12 col-sm-12 text-center mt-3">
          <button @click="primijeniFiltere(this.currentPage)" class="btn btn-dark">Apply filters</button>
          <button @click="resetirajFiltere" class="btn btn-light border border-dark border-2">Reset filters</button>
      </div>
      <div v-if="otvorenModalObjava">
          <ModalObjava @zatvori="otvoriZatvoriModalObjava" :showEditButton="false" :objava="objava" />
      </div>
    <div class="card-container-objava">
    <div class="card card-objava shadow" v-for="(objava, index) in objave" :key="objava.Post.id" @click="otvoriZatvoriModalObjava(objava)">
      <img :src="BASE_URL + objava.Post.image_path" alt="Slika objave" class="card-img-top">
      <div class="card-body">
        <p class="card-text">{{ objava["Post"].description }}</p>
        <p class="card-price">{{ objava["Post"].price }} $</p>
        <div class="card-rating">
          <div class="rating-wraper">
            <div class="ratings" @click.stop>
              <span :class="{ 'colored-star': objava.Post.review == 5 && !objava.Post.isHovered}" 
                @mouseover="handleMouseOver(objava)"
                @mouseout="handleMouseOut(objava)" 
                @click="setRating(objava.Post.id, 5)">&#9733;</span>
              <span :class="{ 'colored-star': objava.Post.review >= 4 && !objava.Post.isHovered}" 
                @mouseover="handleMouseOver(objava)"
                @mouseout="handleMouseOut(objava)" 
                @click="setRating(objava.Post.id, 4)">&#9733;</span>
              <span :class="{ 'colored-star': objava.Post.review >= 3 && !objava.Post.isHovered}" 
                @mouseover="handleMouseOver(objava)"
                @mouseout="handleMouseOut(objava)" 
                @click="setRating(objava.Post.id, 3)">&#9733;</span>
              <span :class="{ 'colored-star': objava.Post.review >= 2 && !objava.Post.isHovered}" 
                @mouseover="handleMouseOver(objava)"
                @mouseout="handleMouseOut(objava)" 
                @click="setRating(objava.Post.id, 2)">&#9733;</span>
              <span :class="{ 'colored-star': objava.Post.review >= 1 && !objava.Post.isHovered}" 
                @mouseover="handleMouseOver(objava)"
                @mouseout="handleMouseOut(objava)" 
                @click="setRating(objava.Post.id, 1)">&#9733;</span>
            </div>
          </div>
          <div class="card-rating-text">
            <p class="card-rating-number text-warning fw-bold">{{ objava["Review"].toFixed(1) }}</p>
            <p class="card-rating-reviews">{{ objava["Number of reviews"] }} reviews</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="pagination-container">
    <button id="prev-btn" @click="prevPage()">Previous</button>
    <div id="page-num">Page: {{this.currentPage}}</div>
    <button id="next-btn" @click="nextPage()">Next</button>
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
      objava: null,
      usluge: [],
      ocjena: 0,
      currentPage: 1,
      totalPages: 5,
      buttonsToShow: 5,
      ocjene: [],
      userRole: 0,
      odabranaUsluga: "0",
      donjaCijena: 0,
      gornjaCijena: 10000,
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
    if (localStorage.getItem("Time")){
      if (parseInt(localStorage.getItem("Time")) < Date.now()-40000) {
        this.currentPage = localStorage.setItem("page", "1");
        localStorage.setItem("Time", String(Date.now()));
        localStorage.setItem("Filtering", "0")
      }
    }else{
      localStorage.setItem("Time", String(Date.now()));
      localStorage.setItem("page", "1");
    }
    this.currentPage = localStorage.getItem('page')
    if (parseInt(localStorage.getItem("Filtering")) != "1"){
      localStorage.removeItem("Usluga")
      localStorage.removeItem("Donja cijena")
      localStorage.removeItem("Gornja cijena")
      localStorage.removeItem("Ocjena")
      this.dohvacanjeObjava(this.currentPage);
    } else{
      this.odabranaUsluga = localStorage.getItem("Usluga")
      this.gornjaCijena = localStorage.getItem("Gornja cijena")
      this.donjaCijena = localStorage.getItem("Donja cijena")
      this.ocjena = localStorage.getItem("Ocjena")
      this.primijeniFiltere(this.currentPage)
    }
    this.dohvacanjeUsera();
    this.dohvacanjeUsluga();
    this.dohvacanjeOcjena();
  },
  methods: {
    /*
    dohvatiOcjene(){
      const token = localStorage.getItem('token');
      api.get('/review', {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
      .then(response => {
        this.reviews = response.data;
        console.log(response.data)
      })
      .catch(error => {
        console.error(error);
      });
    },
    */
    dohvacanjeObjava(page){
      const token = localStorage.getItem('token');
      api.get(`/posts/?page=${page}`, {
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
    setRating(objavaIndex, rating) {
      const payload = {"post_id": objavaIndex, "review": rating}
      const token = localStorage.getItem('token');
      api.post('/review', payload, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        console.log("Uspješno ocjenjivanje!")
        window.location.reload();
        this.updatePageNumber();
    })
    .catch(error => {
        // Handle login error
        console.error(error.response.data.detail); // Use .detail for more specific error message
    });
    },
    /*
    updatePageNumber() {
      const pageButtonsContainer = document.getElementById('page-buttons');
      pageButtonsContainer.innerHTML = '';
      const startPage = Math.max(1, this.currentPage - Math.floor(this.buttonsToShow / 2));
      const endPage = Math.min(this.totalPages, startPage + this.buttonsToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.onclick = () => this.goToPage(i);
        if (i === currentPage) {
          button.classList.add('active');
        }
        pageButtonsContainer.appendChild(button);
      }
      this.primijeniFiltere(this.currentPage);
    },
    */
    updatePageNumber() {
      document.getElementById('page-num').innerText = `Page: ${this.currentPage}`;
      localStorage.setItem("page", this.currentPage);
      localStorage.setItem("Filtering", "1")
      localStorage.setItem("Usluga", String(this.odabranaUsluga))
      localStorage.setItem("Donja cijena", String(this.donjaCijena))
      localStorage.setItem("Gornja cijena", String(this.gornjaCijena))
      localStorage.setItem("Ocjena", String(this.ocjena))
      this.primijeniFiltere(this.currentPage);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePageNumber();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePageNumber();
      }
    },
    /*
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePageButtons();
      }
    },
    */
    primijeniFiltere(page){
      const endpoint = `/posts/filter?service_id=${this.odabranaUsluga}&min_price=${this.donjaCijena}&max_price=${this.gornjaCijena}&review=${this.ocjena}&page=${page}`
      const token = localStorage.getItem('token');
      api.get(endpoint, {
          headers: {
              Authorization: `Bearer ${token}`
          }
          })
      .then(response => {
        this.objave = response.data;
        this.obojiZvijezdu();
      })
      .catch(error => {
        console.log(error.response.detail)
      });
    },
    obojiZvijezdu(){
      for(let i=0;i<this.objave.length;i++){
        for(let j=0;j<this.ocjene.length;j++){
          if (this.objave[i].Post.id == this.ocjene[j].post_id){
            this.objave[i].Post["review"] = this.ocjene[j].review;
            this.objave[i].Post["isHovered"] = false;
          }
        }
      }
    },
    resetirajFiltere(){
      this.odabranaUsluga = "0";
      this.donjaCijena = 0;
      this.gornjaCijena = 10000;
      this.ocjena = 0;
      this.currentPage = 1;
      this.updatePageNumber();
      localStorage.setItem("Filtering", "0");
    },
    otvoriZatvoriModalObjava(objava){
      this.otvorenModalObjava = !this.otvorenModalObjava;
      this.objava = objava;
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
            console.log(korisnik)
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
      dohvacanjeOcjena(){
        const endpoint = '/review'
        const token = localStorage.getItem('token');
        api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
        .then(response => {
          this.ocjene = response.data;
          this.obojiZvijezdu();
        })
        .catch(error => {
          console.log(error.response.detail)
        });
      },
      handleMouseOver(objava) {
      objava.Post.isHovered = true;
      },
      handleMouseOut(objava) {
        objava.Post.isHovered = false;
      }
    
    
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
.colored-star {
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

#pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

#prev-btn,
#next-btn,
button {
  background-color: #333;
  color: #fff;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  margin: 0 5px;
}

button.active {
  background-color: #555;
}

.range-value {
  margin-left: 5px;
}
</style>