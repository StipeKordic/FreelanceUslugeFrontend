<template>
    <div class="backdrop" @click.self="zatvoriModal">
      <div class="modall">
          <h3>Dodaj novu uslugu</h3>
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="name">Ime:</label>
                    <input type="text" id="name" v-model="formData.name" required>
                </div>
                <div class="mb-3">
                    <label for="name">Kratki opis:</label>
                    <input type="text" id="short_description" v-model="formData.short_description" required>
                </div>
              <div class="mb-3">
                <label for="description">Opis:</label>
                <textarea id="description" v-model="formData.description" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label for="image">Slika:</label>
                <input type="file" id="image" @change="handleImageUpload" accept="image/*" class="form-control">
              </div>
              <button type="submit" class="btn btn-dark mb-3">Dodaj</button>
          </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../plugins/api';

  export default {
      data(){
          return{
            services: [],
            formData: {
                name: '',
                short_description: '',
                description: '',
                image: null,
            },
          }
      },
      methods: {
          zatvoriModal() {
              this.$emit('zatvori');
          },
          handleImageUpload(event) {
              // Očitavanje izabrane slike i čuvanje u formData objektu
              this.formData.image = event.target.files[0];
            },
          submitForm() {
              const formData = new FormData();

              // Dodajemo polja forme u FormData objekat
              formData.append('name', this.formData.name);
              formData.append('short_description', this.formData.short_description);
              formData.append('description', this.formData.description);
              if (this.formData.image) {
                formData.append('image_path', this.formData.image);
              }
              // Definišemo API endpoint
              const API_ENDPOINT = '/api/services';

              // Slanje POST zahteva na backend
              api.post(API_ENDPOINT, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data', // Ovo je važno kada šaljete sliku
                },
              })
              .then(response => {
                // Uspješno sačuvano
                console.log(response.data.message);
                this.$emit('potvrdjeno');
                // Dodajte dodatne akcije po potrebi
              })
              .catch(error => {
                // Greška pri čuvanju
                console.error(error.response.data.message);
              });
            },
          },

  mounted() {
    api.get('/api/services')
      .then(response => {
        this.services = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
  }
  </script>
  
  <style>
      .modall{
          width: 400px;
          padding: 20px;
          margin: 100px auto;
          background: white;
          border-radius: 10px;
          z-index: 99999;
      }
      .backdrop{
          top: 0;
          position: fixed;
          background: rgba(0, 0, 0, 0.7);
          width: 100%;
          height: 100%;
          z-index: 99998;
      }
  </style>