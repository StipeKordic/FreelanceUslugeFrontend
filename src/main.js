import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';





const app = createApp(App);
app.use(router);
app.use(store);
app.config.globalProperties.$axios = axios;
app.mount('#app');
