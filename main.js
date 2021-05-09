import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.$api='https://gank.io/api/v2/'
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
