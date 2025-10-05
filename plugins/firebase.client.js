import { getAuth, onAuthStateChanged } from 'firebase/auth'

function waitForAuthReady() {
    const auth = getAuth()
    if (auth.currentUser !== null) return Promise.resolve(auth.currentUser)
    return new Promise((resolve) => {
        const off = onAuthStateChanged(auth, (u) => { off(); resolve(u) })
    })
}

export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return

    const publicPaths = new Set(['/', '/login', '/register', '/faq', '/pay'])
    const user = await waitForAuthReady()

    if (!user && !publicPaths.has(to.path)) {
        return navigateTo({ path: '/', query: { redirect: to.fullPath } })
    }

    if (user && (to.path === '/login' || to.path === '/register')) {
        return navigateTo(to.query.redirect || '/cabinet')
    }
})



