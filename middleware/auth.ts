/**
 * This middleware is used for pages which depend on user authentication, e.g. their content differ if user
 * is authenticated or not. When using this middleware, a page is sure that authentication state will be retrieved
 * prior to page display.
 */
export default defineNuxtRouteMiddleware(async (_to, from) => {
    const user = await getCurrentUser()
    if (!user) {
        await useRouter().push("/")
    }
})