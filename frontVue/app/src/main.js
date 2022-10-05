import Vue from 'vue';
import ElementUI from 'element-ui';
import './theme/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import App from './App.vue';
import router from './router';

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
