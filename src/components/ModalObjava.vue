<template>
    <div class="backdrop" @click.self="zatvoriModal">
        <div class="modalObjava">
            <img :src="BASE_URL + '/storage/' + objava.image_path" alt="Slika objave" class="img-fluid rounded">
            <div class="col-md-12">
                <!-- Informacije o objavi -->
                <span class="fw-bold">Opis: </span>
                <span v-if="!objava.editing">{{ objava.description }}</span>
                <input v-else v-model="objava.description" class="form-control">
                <p></p>
                <span class="fw-bold">Cijena: </span>
                <span v-if="!objava.editing">{{ objava.price }} BAM</span>
                <input v-else v-model="objava.price" class="form-control">
                <p></p>
                <p><span class="fw-bold">Ocjena:</span> {{ objava.review }}</p>
                <p><span class="fw-bold">Broj ocjena:</span> {{ objava.num_review }}</p>
                <p><span class="fw-bold">Usluga:</span> {{ objava.service.name }}</p>
                <p><span class="fw-bold">Korisnik:</span> {{ objava.user.email }}</p>
            </div>
            <div class="action-buttons" v-if="showEditButton">
              <button class="btn btn-dark" @click="toggleEdit(objava)" v-if="!objava.editing">
                Uredi
              </button>
              <button class="btn btn-dark" v-else @click="ponistiUredjivanje(objava)">Poništi</button>
              <button class="btn btn-danger" @click="deleteObjava(objava)">Izbriši</button>
              <button v-if="objava.editing" class="btn btn-success" @click="saveChanges(objava)">
                Potvrdi
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
      zatvoriModal() {
            this.$emit('zatvori');
        },
        toggleEdit(objava) {
            objava.editing = !objava.editing;
        },
        deleteObjava(objava){
        if (window.confirm('Jeste li sigurni da želite izbrisati ovu objavu?')) {
            this.izbrisiObjavu(objava);
      }
    },
    izbrisiObjavu(objava){
        const API_ENDPOINT = `/api/posts/${objava.id}`
        api.delete(API_ENDPOINT)
        .then(response => {
            console.log("Uspješno")
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    },
    saveChanges(objava){
        const API_ENDPOINT = `/api/posts/${objava.id}`
        let uredjenaObjava = {
            "description": objava.description,
            "price": objava.price,
            "review": objava.review,
            "num_reviews": objava.num_review
        }
        api.put(API_ENDPOINT, uredjenaObjava)
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
  