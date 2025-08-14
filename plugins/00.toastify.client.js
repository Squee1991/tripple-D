import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(Vue3Toastify, {
		limit: 3,
		autoClose: 411111000,
		position: 'top-center',
		newestOnTop: true,
		closeOnClick: false,
		draggable: false,
		pauseOnHover: true,


	})
})
