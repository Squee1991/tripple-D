import SimpleBar from 'simplebar';
export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.provide('SimpleBar', SimpleBar);
});
