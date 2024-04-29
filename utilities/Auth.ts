import {
    type Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type UserCredential
} from "firebase/auth";
import { saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel"

/**
 * Method to log in the user.
 * @param username - Username used for login
 * @param password - Password used for login
 * @param auth - firebase auth
 * @param toast - for alert notification
 * @param redirect - if the user should be redirected to 'daily-challenge' after logging in
 */
export function login(username: string, password: string, auth : Auth, toast : any, redirect : boolean = false): void {
    signInWithEmailAndPassword(auth, username, password)
        .catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Failed to log in. Your credentials may be wrong.")
        }).finally(() => {
        if (redirect) useRouter().push('/daily-challenge').then()
    })
}

/**
 * Method to sign up the user.
 * @param username - Username used for signup
 * @param email - Email used for signup
 * @param password - Password used for signup
 * @param userModel - the user model of the user signing in
 * @param auth - firebase auth
 * @param toast - for alert notification
 * @param redirect - if the user should be redirected to 'daily-challenge' after logging in
 */
export function signup(email: string, username: string, password: string, userModel : UserStore, auth : Auth, toast : any, redirect : boolean = false): void {
    createUserWithEmailAndPassword(auth, email, password)
        .then((credentials: UserCredential) => {
            saveUserToFirebase(userModel, username, credentials.user?.uid)
        })
        .catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Failed to sign up. Email already in use.")
        }).finally(() => {
        console.log("redirect")
        if (redirect) useRouter().push('/daily-challenge').then()
    })
}

/**
 * Method to log out the user.
 * @param auth - firebase auth
 * @param toast - for alert notification
 * @param path - current path of the user
 */
export function logout(auth : Auth, toast : any, path : string ): void {
    signOut(auth).catch((error) => {
        console.error(error)
        displayErrorNotification(toast, "Failed to log out.")
    }).finally(() => {
        if (path === '/daily-challenge') useRouter().push('/').then()
    })
}

/**
 * Displays an error notification.
 * @param description - The description of the error
 * @param toast - for alert notification
 */
function displayErrorNotification(toast : any, description: string) {
    toast.remove('any')
    toast.add({ id:'any', title: 'Error', description: description, icon: 'i-heroicons-x-circle', color:"red"})
}