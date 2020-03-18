import Vue from 'vue'
import './plugins/vuetify'
import Mainframe from './App.vue'
import router from './router'

Vue.config.productionTip = false


window.Mainframe = new Vue({
  router,
  render: h => h(Mainframe)
}).$mount('#app').$children[0].$children[0].$children[0];