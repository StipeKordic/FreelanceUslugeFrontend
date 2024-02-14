<template>
  <Navbar @otvori="otvoriZatvoriModal"/>
  <div v-if="prikaziModal">
    <Modal @zatvori="otvoriZatvoriModal" @potvrdi="handleFormSubmit"/>
  </div>
  <div class="home">
    <div v-if="showSuccessMessage" class="alert alert-success mt-4" role="alert">
      Sign up successful! Please log in!
    </div>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card p-4 bg-light text-dark rounded">
            <h2 class="mb-4">Input data:</h2>
            <form @submit.prevent="submitForm" enctype="multipart/form-data">
              <div class="mb-3">
                <label for="first_name" class="form-label">First Name:</label>
                <input type="text" id="first_name" v-model="formData.first_name" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="last_name" class="form-label">Last Name:</label>
                <input type="text" id="last_name" v-model="formData.last_name" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">E-mail:</label>
                <input type="email" id="email" v-model="formData.email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <div class="d-flex">
                <input v-bind:type="passwordFieldType" id="password" v-model="formData.password" class="form-control" required>
                <button class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
              </div>
              <div class="mb-3">
                <label for="password_confirmation" class="form-label">Confirm Password:</label>
                <div class="d-flex">
                <input v-bind:type="passwordFieldType" id="password_confirmation" v-model="formData.password_confirmation" class="form-control" required>
                <button class="btn btn-link" @click="togglePasswordVisibility">
                  <i v-bind:class="passwordFieldType === 'password' ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                </button>
              </div>
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Upload Image:</label>
                <input type="file" id="image" @change="handleImageUpload" accept="image/*" class="form-control">
              </div>
              <button type="submit" class="btn btn-dark">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
// @ is an alias to /src
import api from '../plugins/api';
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'




export default {
  name: 'RegisterView',
  components: {
    Navbar,
    Footer,
    Modal,
  },
  data() {
    return {
      prikaziModal: false,
      passwordFieldType: 'password',
      showSuccessMessage: false,
      formData: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: null, // Ovde ćemo čuvati izabranu sliku
      },
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    handleFormSubmit(payload){

    // Create a new URLSearchParams object
    const logInFormData = new URLSearchParams();

    // Append email and password to the form data
    logInFormData.append('username', payload.email);
    logInFormData.append('password', payload.password);

    // Define the API endpoint for login
    const API_ENDPOINT2 = '/auth/login';

    // Log the form data for debugging
    console.log(logInFormData);

    // Send a POST request to the login endpoint with form data
    api.post(API_ENDPOINT2, logInFormData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
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
    otvoriZatvoriModal(){
      this.prikaziModal = !this.prikaziModal
    },
    handleImageUpload(event) {
      // Očitavanje izabrane slike i čuvanje u formData objektu
      this.formData.image = event.target.files[0];
    },
    submitForm() {
      // Kreiramo FormData objekat
      const formData = new FormData();

      // Dodajemo polja forme u FormData objekat
      formData.append('first_name', this.formData.first_name);
      formData.append('last_name', this.formData.last_name);
      formData.append('email', this.formData.email);
      formData.append('password', this.formData.password);
      formData.append('confirm_password', this.formData.password_confirmation);
      if (this.formData.image) {
        formData.append('file', this.formData.image);
      }
      // Definišemo API endpoint
      const API_ENDPOINT = '/users/signup';

      // Slanje POST zahteva na backend
      api.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ovo je važno kada šaljete sliku
        },
      })
      .then(response => {
        // Uspješno sačuvano
        console.log(response.data.message);
        // Dodajte dodatne akcije po potrebi
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.otvoriZatvoriModal();
        }, 2000);
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
.home {
  background-color: #212529;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>