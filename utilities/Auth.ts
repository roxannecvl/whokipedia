import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateEmail as updateEmailFirebase,
    updatePassword as updatePasswordFirebase,
    deleteUser,
    verifyPasswordResetCode,
    confirmPasswordReset,
    type Auth,
    type User,
    type UserCredential
} from "firebase/auth";
import { displayErrorNotification, displaySuccessNotification } from "~/utilities/Utils"
import { deleteUserFromFirebase, saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel"

/**
 * Method to log in the user.
 * @param username - Username used for login
 * @param password - Password used for login
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 */
export async function login(
    username: string,
    password: string,
    auth : Auth,
    toast : any,
): Promise<void> {
    return signInWithEmailAndPassword(auth, username, password)
        .then(() => displaySuccessNotification(toast, "Logged in successfully."))
        .catch(() => displayErrorNotification(toast, "Failed to log in. Your credentials may be wrong."))
}

/**
 * Method to sign up the user.
 * @param username - Username used for signup
 * @param email - Email used for signup
 * @param password - Password used for signup
 * @param userModel - User model of user signing up
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 */
export async function signup(
    username: string,
    email: string,
    password: string,
    userModel : UserStore,
    auth : Auth,
    toast : any,
): Promise<void> {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((credentials: UserCredential) => {
            saveUserToFirebase(userModel, username, credentials.user?.uid)
                .then(() => displaySuccessNotification(toast, "Signed up successfully."))
                .catch(() => displayErrorNotification(toast, "Failed to sign up."))
        })
        .catch(() => displayErrorNotification(toast, "Failed to sign up. Email already in use."))
}

/**
 * Method to log out the user.
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 */
export async function logout(auth : Auth, toast : any): Promise<void> {
    return signOut(auth)
        .catch(() => displayErrorNotification(toast, "Failed to log out."))
}

/**
 * Method to update the user's email.
 * @param newEmail - New email
 * @param user - User to update
 * @param toast - Used for alert notification
 */
export async function updateEmail(
    newEmail: string,
    user: User,
    toast: any
): Promise<void> {
    return updateEmailFirebase(user, newEmail)
        .then(() => displaySuccessNotification(toast, "Email updated successfully."))
        .catch(() => displayErrorNotification(toast, "Failed to update email."))
}

/**
 * Method to update the user's password.
 * @param newPassword - New password
 * @param user - User to update
 * @param toast - Used for alert notification
 */
export async function updatePassword(
    newPassword: string,
    user: User,
    toast: any
): Promise<void> {
    return updatePasswordFirebase(user, newPassword)
        .then(() => displaySuccessNotification(toast, "Password updated successfully."))
        .catch(() => displayErrorNotification(toast, "Failed to update password."))
}

/**
 * Method to delete user's account.
 * @param user - User to delete
 * @param toast - Used for alert notification
 */
export async function deleteAccount(user: User, toast : any): Promise<void> {
    return deleteUserFromFirebase(user.uid)
        .then(() => {
            deleteUser(user)
                .then(() => displaySuccessNotification(toast, "Account deleted successfully."))
                .catch(() => displayErrorNotification(toast, "Failed to delete account."))
        })
        .catch(() => displayErrorNotification(toast, "Failed to delete account."))
}

/**
 * Method to reauthenticate user.
 * @param email - Email to reauthenticate
 * @param password - User password to reauthenticate
 * @param user - User to reauthenticate
 * @param toast - Used for alert notification
 */
export async function reauthenticate(email: string, password: string, user: User, toast: any): Promise<UserCredential | void> {
    return reauthenticateWithCredential(user, EmailAuthProvider.credential(email, password))
        .catch((error) => {
            displayErrorNotification(toast, "Your password is incorrect.")
            throw error
        })
}

/**
 * Method to reset user's password.
 * @param email - Email to reset password
 * @param auth - Firebase auth
 * @param toast - Used for alert notification
 */
export async function resetPassword(email: string, auth: Auth, toast: any): Promise<void> {
    return sendPasswordResetEmail(auth, email)
        .then(() => displaySuccessNotification(toast, "Password reset email sent."))
        .catch(() => {})
}

/**
 * Method to handle reset password.
 * @param auth - Firebase auth
 * @param actionCode - Action code ensuring request is legitimate
 * @param newPassword - New password
 * @param toast - Used for alert notification
 */
export async function handleResetPassword(auth: Auth, actionCode: any, newPassword: string, toast: any) {
    verifyPasswordResetCode(auth, actionCode).then((email) => {
        confirmPasswordReset(auth, actionCode, newPassword).then(() => {
            signInWithEmailAndPassword(auth, email, newPassword)
                .then(() => displaySuccessNotification(toast, "Password reset successfully. You are now logged in."))
        }).catch(() => displayErrorNotification(toast, "Password reset failed. Code might be expired."))
    }).catch(() => displayErrorNotification(toast, "Password reset failed. Invalid action code."))
}
