import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ClickOutside from './directive/click-outside'
import VueLocalStorage from "vue-localstorage";

Vue.config.productionTip = false
Vue.directive('click-outside', ClickOutside)

Vue.use(VueLocalStorage);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
