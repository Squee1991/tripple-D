export default defineNuxtRouteMiddleware((to) => {
    const user = useCurrentUser()

    if (!user.value && to.path !== '/login') {
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        })
    }
})