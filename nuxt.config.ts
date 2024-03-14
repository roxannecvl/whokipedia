export default defineNuxtConfig({
    modules: [
        '@nuxt/ui',
        'nuxt-vuefire',
    ],
    ui: {
        icons: ['simple-icons']
    },
    vuefire: {
        auth: {
            enabled: true
        },
        config: {
            apiKey: "AIzaSyA7geOEExyTu28Kg4M7Y9hNjHQn8ktouI0",
            authDomain: "whokipedia-challenge.firebaseapp.com",
            projectId: "whokipedia-challenge",
            storageBucket: "whokipedia-challenge.appspot.com",
            messagingSenderId: "797330362930",
            appId: "1:797330362930:web:ab6d37fbfa9273573d222b"
            // there could be other properties depending on the project
        }
    },
})
