// import { getAuth, onAuthStateChanged } from 'firebase/auth'
// import { initializeApp } from 'firebase/app'
//
// // Firebase configuration
// const firebaseConfig = {
//     apiKey: 'AIzaSyClEXgfnzOXXECQTtNaZ9dl2HKDQjObAAc',
//     authDomain: 'tripple-d.firebaseapp.com',
//     projectId: 'tripple-d',
//     storageBucket: 'tripple-d.appspot.com',
//     messagingSenderId: '232501751388',
//     appId: '1:232501751388:web:abcdef123456'
// }
//
// // Initialize Firebase only on client side
// let app
// let auth
//
// if (process.client) {
//     app = initializeApp(firebaseConfig)
//     auth = getAuth(app)
// }
//
// function waitForAuthReady() {
//     if (!auth) return Promise.resolve(null)
//     if (auth.currentUser !== null) return Promise.resolve(auth.currentUser)
//     return new Promise((resolve) => {
//         const off = onAuthStateChanged(auth, (u) => { off(); resolve(u) })
//     })
// }
//
// export default defineNuxtRouteMiddleware(async (to) => {
//     if (process.server) return
//
//     const publicPaths = new Set(['/', '/login', '/register', '/faq', '/pay'])
//     const user = await waitForAuthReady()
//
//     if (!user && !publicPaths.has(to.path)) {
//         return navigateTo({ path: '/', query: { redirect: to.fullPath } })
//     }
//
//     if (user && (to.path === '/login' || to.path === '/register')) {
//         return navigateTo(to.query.redirect || '/cabinet')
//     }
// })
