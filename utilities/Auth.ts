import {
    type Auth,
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    deleteUser,
    type UserCredential
} from "firebase/auth";
import { displayErrorNotification, displaySuccessNotification } from "~/utilities/Utils"
import { getAllUsernamesFromFirebase, saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel"

/**
 * Method to log in the user.
 * @param username - Username used for login
 * @param password - Password used for login
 * @param auth - firebase auth
 * @param toast - for alert notification
 * @param redirect - if the user should be redirected to 'daily-challenge' after logging in
 */
export async function login(
    username: string,
    password: string,
    auth : Auth,
    toast : any,
    redirect : boolean = false
): Promise<void> {
    return signInWithEmailAndPassword(auth, username, password)
        .then(() => {
            displaySuccessNotification(toast, "Logged in successfully.")
        })
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
export function signup(username: string, email: string, password: string, userModel : UserStore, auth : Auth, toast : any, redirect : boolean = false): void {
    createUserWithEmailAndPassword(auth, email, password)
        .then((credentials: UserCredential) => {
            saveUserToFirebase(userModel, username, credentials.user?.uid)
            displaySuccessNotification(toast, "Signed up successfully.")
        })
        .catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Failed to sign up. Email already in use.")
        }).finally(() => {
        if (redirect) useRouter().push('/daily-challenge').then()
    })
}

/**
 * Method to log out the user.
 * @param auth - firebase auth
 * @param toast - for alert notification
 * @param path - current path of the user
 */
export async function logout(auth : Auth, toast : any, path : string ): Promise<void> {
    return signOut(auth).catch((error) => {
        console.error(error)
        displayErrorNotification(toast, "Failed to log out.")
    }).finally(() => {
        if (path === '/daily-challenge') useRouter().push('/').then()
    })
}

/**
 * Method to update the user's email and password.
 * @param oldEmail - Old email used for login
 * @param oldPassword - Old password used for login
 * @param email - Email used for login
 * @param password - Password used for login
 * @param auth - firebase auth
 * @param toast - for alert notification
 */
export async function updateEmailAndPassword(
    oldEmail: string,
    oldPassword: string,
    email: string,
    password: string,
    auth: Auth,
    toast: any
): Promise<void> {
    const user = auth.currentUser
    if (user && oldEmail !== email && oldPassword !== password) {
        // Firebase requires re-authentication before updating email and password
        return reauthenticateWithCredential(user, EmailAuthProvider.credential(oldEmail, oldPassword)).then(() => {
            Promise.all([updateEmail(user, email), updatePassword(user, password)])
                .catch((error) => {
                    console.error(error)
                    displayErrorNotification(toast, "Failed to update information.")
                })
        }).catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Your current password is incorrect.")
        })
    }
}

/**
 * Method to delete user's account.
 * @param auth - firebase auth
 * @param toast - for alert notification
 */
export async function deleteAccount(auth : Auth, toast : any): Promise<void> {
    const user = auth.currentUser
    if (user) {
        return deleteUser(user).catch((error) => {
            console.error(error)
            displayErrorNotification(toast, "Failed to delete account.")
        }).finally(() => {
            useRouter().push('/').then()
        })
    }
}

