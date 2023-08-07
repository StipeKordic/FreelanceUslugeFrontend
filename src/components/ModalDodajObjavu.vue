<template>
    <div class="backdrop" @click.self="zatvoriModal">
      <div class="modall">
          <h3>Dodaj objavu</h3>
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
              <div class="mb-3">
                <label for="service">Usluga:</label>
                    <select id="service" v-model="formData.service_id" class="form-control">
                        <option value="">Odaberi uslugu</option>
                        <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
                    </select>
              </div>
              <div class="mb-3">
                <label for="price">Cijena:</label>
                <input type="number" id="price" v-model="formData.price" class="form-control" required>
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
      props: ['user_id'],
      data(){
          return{
            services: [],
            formData: {
                service_id: '',
                price: '',
                description: '',
                image: null,
                user_id: this.user_id,
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
              formData.append('user_id', this.formData.user_id);
              formData.append('service_id', this.formData.service_id);
              formData.append('price', this.formData.price);
              formData.append('description', this.formData.description);
              if (this.formData.image) {
                formData.append('image_path', this.formData.image);
              }
              // Definišemo API endpoint
              const API_ENDPOINT = '/api/posts';

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