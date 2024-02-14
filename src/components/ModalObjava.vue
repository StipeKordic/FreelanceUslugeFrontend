<template>
    <div class="backdrop" @click.self="zatvoriModal(objava)">
      <div class="modalObjava">
          <img :src="BASE_URL + objava.Post.image_path" alt="Slika objave" class="card-img-top rounded">
          <div v-if="showEditButton" class="tooltipp-container">
            <input type="file" ref="fileInput" @change="handleImageUpload2($event, objava)" accept="image/*" style="display: none">
            <button class="btn btn-dark mb-3 rounded-pill" @click="openFileInput">
              <i class="fa-regular fa-image"></i>          
            </button>
            <div class="tooltipp">Change image</div>
          </div> 
          <div class="col-md-12">
              <!-- Informacije o objavi -->
              <span class="fw-bold">Description: </span>
              <span v-if="!objava.editing">{{ objava.Post.description }}</span>
              <input v-else v-model="objava.Post.description" class="form-control">
              <p></p>
              <span class="fw-bold">Price: </span>
              <span v-if="!objava.editing">{{ objava.Post.price }} $</span>
              <input v-else v-model="objava.Post.price" class="form-control">
              <p></p>
              <p><span class="fw-bold">Review:</span> {{ objava.Review }}</p>
              <p><span class="fw-bold">Number of reviews:</span> {{ objava["Number of reviews"] }}</p>
              <p><span class="fw-bold">Service:</span> {{ objava.name }}</p>
              <p><span class="fw-bold">User:</span> {{ objava.email }}</p>
          </div>
          <div class="action-buttons" v-if="showEditButton">
              <button class="btn btn-dark" @click="toggleEdit(objava)" v-if="!objava.editing">
                  Edit
              </button>
              <button class="btn btn-dark" v-else @click="ponistiUredjivanje(objava)">Undo</button>
              <button class="btn btn-danger" @click="deleteObjava(objava)">Delete</button>
              <button v-if="objava.editing" class="btn btn-success" @click="saveChanges(objava)">
                  Confirm
              </button>
          </div>
      </div>
        </div>
  </template>
  
  <script>
  import api from '../plugins/api';

  export default {
    data() {
        return {
            BASE_URL: process.env.VUE_APP_BASE_URL,
        }
    },
    props: {
      objava: Object, // Podaci o objavi koji se prikazuju u modalu
      showEditButton: Boolean // Prikazuje button za uređivanje (ako je true)
    },
    methods: {
      zatvoriModal(objava) {
            this.$emit('zatvori');
            if (objava.editing){
              objava.editing = !objava.editing;
            }
            console.log(objava.Post.description)
        },
        toggleEdit(objava) {
            objava.editing = !objava.editing;
            const element = document.querySelector('.tooltipp-container');
            element.style.visibility = "hidden";
        },
        deleteObjava(objava){
        if (window.confirm('Are you sure you want to delete this post?')) {
            this.izbrisiObjavu(objava);
      }
    },
    izbrisiObjavu(objava){
        const API_ENDPOINT = `/posts/${objava.Post.id}`;
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
    handleImageUpload2(event, objava) {

        const formData = new FormData();
        const token = localStorage.getItem('token');

        if (event.target.files[0]) {
          formData.append('file', event.target.files[0]);
        }
        // Definišemo API endpoint
        const API_ENDPOINT = `posts/image/${objava.Post.id}`;

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
      openFileInput() {
      this.$refs.fileInput.click();
    },
    saveChanges(objava){
        const API_ENDPOINT = `/posts/${objava.Post.id}`;
        const token = localStorage.getItem('token');
        let uredjenaObjava = {
            "description": objava.Post.description,
            "price": objava.Post.price
        }
        api.put(API_ENDPOINT, uredjenaObjava, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
       })
        .then(response => {
            console.log("Uspješno");
        })
      .catch(error => {
        // Greška pri čuvanju
        console.error(error.response.data.message);
      });
      objava.editing = !objava.editing
    },
    ponistiUredjivanje(service){
        this.$emit('zatvori');
        window.location.reload();
    }
    }
  };
  </script>
  
  <style>
  .modalObjava{
        width: 400px;
        padding: 20px;
        margin: 100px auto;
        background: white;
        border-radius: 10px;
        z-index: 99999;
        position: relative;
    }
    .tooltipp-container {
      position: absolute;
      display: inline-block;
      margin-top: 124%;
      margin-left: -5%;
      transform: translateX(-50%);
    }
    .tooltipp {
      visibility: hidden;
      width: 120px;
      background-color: #333;
      color: #fff;
      text-align: center;
      padding: 5px;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
      top: -20%; /* Position above the button */
      left: 50%;
      margin-left: -60px; /* Center the tooltip */
      opacity: 0;
      transition: opacity 0.3s;
    }
    .tooltipp-container:hover .tooltipp {
      visibility: visible;
      opacity: 1;
    }
    .backdrop{
        top: 0;
        position: fixed;
        background: rgba(0, 0, 0, 0.7);
        width: 100%;
        height: 100%;
        z-index: 99998;
    }
    .card-img-top {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  .btn-dark.rounded-pill {
    border-radius: 10px; 
    height: 40px; 
    width: 40px;
    border: 1px solid black; 
    position: absolute;
    bottom: 2px; 
    left: 85%;
    transform: translateX(-50%);
  }

  .btn-light.rounded-pill .bi {
    font-size: 1.5rem;
  }
  .btn-dark.rounded-pill:hover {
    border-radius: 10px; 
    height: 40px; 
    width: 40px;
    background-color: white;
    border: 1px solid black; 
    color: black;
    position: absolute;
    left: 85%;
    transform: translateX(-50%);
  }
    
  </style>
  