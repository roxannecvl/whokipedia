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
 */
export function login(username: string, password: string, auth : Auth, toast : any): void {
    signInWithEmailAndPassword(auth, username, password)
        .catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Failed to log in. Your credentials may be wrong.")
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
 */
export function signup(email: string, username: string, password: string, userModel : UserStore, auth : Auth, toast : any): void {
    createUserWithEmailAndPassword(auth, email, password)
        .then((credentials: UserCredential) => {
            saveUserToFirebase(userModel, username, credentials.user?.uid)
        })
        .catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Failed to sign up. Email already in use.")
        })
}

/**
 * Method to log out the user.
 * @param auth - firebase auth
 * @param toast - for alert notification
 */
export function logout(auth : Auth, toast : any ): void {
    signOut(auth).catch((error) => {
        console.error(error)
        displayErrorNotification(toast, "Failed to log out.")
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