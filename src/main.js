import './style.css';
import { createApp } from 'vue';
import App from './App.vue'; // Corregido: Importación relativa
import router from './router/router'


const app = createApp(App);
app.use(router);
app.mount('#app');

