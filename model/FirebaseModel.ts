import { ref as dbRef, push, update, get, Database, type DatabaseReference } from "firebase/database";
import type { UserStore } from "./UserModel.js";

let database: Database
let userRef: DatabaseReference

/**
 * This method initializes Firebase database.
 */
export function initializeFirebase(): void {
    database = useDatabase();
    userRef = dbRef(database, 'users');
}

/**
 * This method saves a local user model to persistence.
 * @param store - User model to push to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function saveUserToFirebase(store: UserStore, uid: string): void {
    const persistence: {[key: string]: string | number} = userStoreToPersistence(store);
    persistence.uid = uid;
    push(userRef, persistence);
}

/**
 * This method updates a user model to persistence.
 * @param store - User model to update to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function updateUserToFirebase(store: UserStore, uid: string): void {
    const persistence = userStoreToPersistence(store);
    persistence.uid = uid;
    update(userRef, persistence).then(() => {});
}

/**
 * This method fills local user model from persistence.
 * @param store - Local model to fill
 */
export async function readUserFromFirebase(store: UserStore): Promise<UserStore> {
    return get(userRef).then(snapshot => {
        persistenceToUserModel(store, snapshot.val());
        return store;
    });
}

/**
 * This private method converts our user model to store it as a POJO in persistence.
 * @param store - User model to push to persistence
 * @return {[key: string]: string | number} - POJO will relevant user info
 */
function userStoreToPersistence(store: UserStore): {[key: string]: string | number} {
    return {
        currentStreak: store.currentStreak,
        maxStreak: store.maxStreak,
        averageRank: store.averageRank,
        averageGuesses: store.averageGuesses,
        averageTime: store.averageTime,
        timesPlayed: store.timesPlayed,
    }
}

/**
 * This private method converts POJO from persistence to fill our local user model.
 * @param store - The local model to fill
 * @param persistence - The POJO obtained from persistence
 */
function persistenceToUserModel(store: UserStore, persistence: any): void {
    store.updateStats(
        persistence.currentStreak,
        persistence.maxStreak,
        persistence.averageRank,
        persistence.averageGuesses,
        persistence.averageTime,
        persistence.timesPlayed
    );
}