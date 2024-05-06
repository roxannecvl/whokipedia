import {
    type Auth,
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateEmail as updateEmailFirebase,
    updatePassword as updatePasswordFirebase,
    deleteUser,
    type UserCredential
} from "firebase/auth";
import { displayErrorNotification, displaySuccessNotification } from "~/utilities/Utils"
import { saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel"

/**
 * Method to log in the user.
 * @param username - Username used for login
 * @param password - Password used for login
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 * @param redirect - Redirect to 'daily-challenge' after logging in
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
 * @param userModel - User model of user signing up
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 * @param redirect - Redirect to 'daily-challenge' after signing up
 */
export function signup(username: string, email: string, password: string, userModel : UserStore, auth : Auth, toast : any, redirect : boolean = false): void {
    createUserWithEmailAndPassword(auth, email, password)
        .then((credentials: UserCredential) => {
            saveUserToFirebase(userModel, username, credentials.user?.uid).then(() => {
                displaySuccessNotification(toast, "Signed up successfully.")
            })
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
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 * @param path - Current path of the user
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
 * Method to update the user's email.
 * @param newEmail - New email
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 */
export async function updateEmail(
    newEmail: string,
    auth: Auth,
    toast: any
): Promise<void> {
    const user = auth.currentUser
    if (user) {
        return updateEmailFirebase(user, newEmail)
            .then(() => displaySuccessNotification(toast, "Email updated successfully."))
            .catch((error) => {
                console.error(error)
                displayErrorNotification(toast, "Failed to update email.")
            })
    }
}

/**
 * Method to update the user's email.
 * @param newPassword - New password
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 */
export async function updatePassword(
    newPassword: string,
    auth: Auth,
    toast: any
): Promise<void> {
    const user = auth.currentUser
    if (user) {
        return updatePasswordFirebase(user, newPassword)
            .then(() => displaySuccessNotification(toast, "Password updated successfully."))
            .catch((error) => {
                console.error(error)
                displayErrorNotification(toast, "Failed to update password.")
            })
    }
}

/**
 * Method to delete user's account.
 * @param email - Email to reauthenticate
 * @param password - User password to reauthenticate
 * @param auth - firebase auth
 * @param toast - for alert notification
 */
export async function deleteAccount(email: string, password: string, auth : Auth, toast : any): Promise<void> {
    const user = auth.currentUser
    if (user) {
        return deleteUser(user)
            .catch((error) => {
                console.error(error)
                displayErrorNotification(toast, "Failed to delete account.")
            })
            .finally(() => {
                useRouter().push('/').then()
        })
    }
}

/**
 * Method to reauthenticate user.
 * @param email - Email to reauthenticate
 * @param password - User password to reauthenticate
 * @param auth - firebase auth
 */
export async function reauthenticate(email: string, password: string, auth: Auth): Promise<any> {
    const user = auth.currentUser
    if (user) return reauthenticateWithCredential(user, EmailAuthProvider.credential(email, password))
}

