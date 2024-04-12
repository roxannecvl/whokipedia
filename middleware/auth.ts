export default defineNuxtRouteMiddleware(async () => {
    const user = await getCurrentUser()
    if (!user) {
        return navigateTo('/')
    }
})