<template>
  <div class="about">
    <Navbar @otvori="otvoriZatvoriModal"/>
    <div v-if="prikaziModal">
      <Modal @zatvori="otvoriZatvoriModal" @potvrdi="handleFormSubmit"/>
    </div>
    <div class="container my-4">
    <div class="row">
      <div class="col-lg-6 mb-4">
        <!-- Prva kartica -->
        <div class="card rounded bg-dark text-white shadow">
          <img src="../../usluge/profilna_Stipe.jpg" class="card-img-top rounded-circle mx-auto mt-3" style="width: 100px; height: 100px;" alt="Slika">
          <div class="card-body">
            <h5 class="card-title text-center">Stipe Kordić</h5>
            <p class="card-text text-center">Opis</p>
            <button class="btn btn-light d-block mx-auto">
              <i class="fab fa-github"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <!-- Druga kartica -->
        <div class="card rounded bg-dark text-white shadow">
          <img src="../../usluge/profilna_Antonela.jpg" class="card-img-top rounded-circle mx-auto mt-3" style="width: 100px; height: 100px;" alt="Slika">
          <div class="card-body">
            <h5 class="card-title text-center">Antonela Galić</h5>
            <p class="card-text text-center">Opis</p>
            <button class="btn btn-light d-block mx-auto">
              <i class="fab fa-github"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import api from '../plugins/api';
import Modal from '@/components/Modal.vue'
import Footer from '@/components/Footer.vue'


export default {
    name: 'AboutView',
    components: {
        Navbar,
        Modal,
        Footer
    },
    data() {
    return {
      prikaziModal: false,
    };
  },
  methods: {
    otvoriZatvoriModal(){
      this.prikaziModal = !this.prikaziModal
    },
    handleFormSubmit(payload){
      const logInFormData = new URLSearchParams();
      logInFormData.append('email', payload.email);
      logInFormData.append('password', payload.password);
      const API_ENDPOINT2 = '/api/auth/login'
      api.post(API_ENDPOINT2, logInFormData)
      .then(response => {
        // Uspješno sačuvano
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        this.$router.push('/user');
      })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
    },
}
}

</script>

<style>
  .about .card {
    border: none;
    margin-bottom: 250px;
  }

  .card-img-top {
    object-fit: cover;
  }
</style>
