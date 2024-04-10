import { ref as dbRef, set, update, get, Database, type DatabaseReference } from "firebase/database";
import type { UserStore } from "~/model/UserModel.js";

let database: Database
let userRef: DatabaseReference

/**
 * This method initializes Firebase database.
 */
export function initializeFirebase(): void {
    database = useDatabase();
}

/**
 * This method saves a local user model to persistence.
 * @param store - User model to push to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function saveUserToFirebase(store: UserStore, uid: string): void {
    const persistence: {[key: string]: string | number} = userStoreToPersistence(store);
    set(dbRef(database, 'users/'+uid), persistence);
}

/**
 * This method updates a user model to persistence.
 * @param store - User model to update to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function updateUserToFirebase(store: UserStore, uid: string): void {
    const persistence = userStoreToPersistence(store);
    update(dbRef(database, 'users/'+uid), persistence).then(() => {});
}

/**
 * This method fills local user model from persistence.
 * @param store - Local model to fill
 */
export async function readUserFromFirebase(store: UserStore, uid: string): Promise<UserStore> {
    return get(dbRef(database, 'users/'+uid)).then(snapshot => {
        if(snapshot.val()){
            persistenceToUserModel(store, snapshot.val());
        }
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