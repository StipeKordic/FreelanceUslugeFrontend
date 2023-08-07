import axios from 'axios';

// Kreirajte novu instancu Axiosa
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL // Ovdje postavite baseURL na adresu iz .env fajla
});

export default instance;