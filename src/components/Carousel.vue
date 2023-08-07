<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel" :data-bs-interval="0">
          <div class="carousel-inner">
            <div v-for="(item, index) in itemsToShow" :key="index" :class="['carousel-item', 'active']">
              <div class="card">
                <img :src="BASE_URL + '/storage/' + item.image" class="card-img-top" alt="Image">
                <div class="card-body">
                  <h5 class="card-title">{{ item.title }}</h5>
                  <p class="card-text">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" @click="prevSlide">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" @click="nextSlide">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
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
      carouselItems: [], // Ovdje ćemo spremiti podatke o karticama
      activeIndex: 0,
    };
  },
  mounted() {
    // Dohvatite podatke i postavite kartice kad se komponenta montira
    api.get('/api/services')
      .then(response => {
        const usluge = response.data;
        this.carouselItems = usluge.slice(0, 6).map(usluga => ({
          id: usluga.id,
          image: usluga.image_path,
          title: usluga.name,
          description: usluga.short_description,
        }));
      })
      .catch(error => {
        console.error(error);
      });
  },
  computed: {
    itemsToShow() {
      // Računa broj prikazanih kartica ovisno o veličini ekrana
      if (window.innerWidth >= 992) {
        return this.carouselItems.slice(this.activeIndex, this.activeIndex + 4);
      } else if (window.innerWidth >= 768) {
        return this.carouselItems.slice(this.activeIndex, this.activeIndex + 2);
      } else {
        return this.carouselItems.slice(this.activeIndex, this.activeIndex + 1);
      }
    }
  },
  methods: {
    nextSlide() {
      this.activeIndex = (this.activeIndex + 1) % this.carouselItems.length;
    },
    prevSlide() {
      this.activeIndex = (this.activeIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    },
  },
};
</script>

<style>
.card {
  width: 100%;
  max-width: 300px; /* Prilagodite širinu kartice po potrebi */
}
</style>