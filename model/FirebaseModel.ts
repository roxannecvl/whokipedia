import { ref as dbRef, set, update, get, Database } from "firebase/database"
import type { UserStore, TimedStat } from "~/model/UserModel.js"

let database: Database

/**
 * This method initializes Firebase database.
 */
export function initializeFirebase(): void {
    database = useDatabase()
}

/**
 * This method saves a local user model to persistence.
 * @param store - User model to push to persistence
 * @param username - Username to give to user
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function saveUserToFirebase(store: UserStore, username: string, uid: string): void {
    store.updateUsername(username)
    const persistence: UserPersistence = userStoreToPersistence(store)
    set(dbRef(database, 'users/'+uid), persistence).then()
}

/**
 * This method updates a user model to persistence.
 * @param store - User model to update to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function updateUserToFirebase(store: UserStore, uid: string): void {
    const persistence: UserPersistence = userStoreToPersistence(store)
    update(dbRef(database, 'users/'+uid), persistence).then(() => {})
}

/**
 * This method fills local user model from persistence.
 * @param store - Local model to fill
 * @param uid - ID to give to model in order to keep track in persistence
 */
export async function readUserFromFirebase(store: UserStore, uid: string): Promise<UserStore> {
    return get(dbRef(database, 'users/'+uid)).then(snapshot => {
        if(snapshot.val()) persistenceToUserModel(store, snapshot.val())
        return store
    })
}

/**
 * This method gets all user stats for leaderboard.
 */
export async function getAllUserFromFirebase(): Promise<UserPersistence[]> {
    return get(dbRef(database, 'users')).then(snapshot => {
        const usersData: UserPersistence[] = []
        snapshot.forEach((child) => {
            usersData.push({
                username: child.val().username,
                currentStreak: child.val().currentStreak,
                maxStreak: child.val().maxStreak,
                averageRank: child.val().averageRank,
                averageGuesses: child.val().averageGuesses,
                averageTime: child.val().averageTime,
                gamesPlayed: child.val().gamesPlayed,
                timedStats: child.val().timedStats === "empty" ? [] : child.val().timedStats as TimedStat[]
            })
        })
        return usersData
    })
}

/**
 * This private method converts our user model to store it as a POJO in persistence.
 * @param store - User model to push to persistence
 * @return UserPersistence - POJO will relevant user info
 */
function userStoreToPersistence(store: UserStore): UserPersistence {
    return {
        username: store.username,
        currentStreak: store.currentStreak,
        maxStreak: store.maxStreak,
        averageRank: store.averageRank,
        averageGuesses: store.averageGuesses,
        averageTime: store.averageTime,
        gamesPlayed: store.gamesPlayed,
        // Workaround to Firebase saving empty arrays as undefined
        timedStats: store.timedStats.length > 0 ? store.timedStats : "empty"
    }
}

/**
 * This private method converts POJO from persistence to fill our local user model.
 * @param store - The local model to fill
 * @param persistence - The POJO obtained from persistence
 */
function persistenceToUserModel(store: UserStore, persistence: UserPersistence): void {
    store.updateStats(
        persistence.currentStreak,
        persistence.maxStreak,
        persistence.averageRank,
        persistence.averageGuesses,
        persistence.averageTime,
        persistence.gamesPlayed,
        // Workaround to Firebase saving empty arrays as undefined
        persistence.timedStats === "empty" ? [] : persistence.timedStats as TimedStat[]
    )
    store.updateUsername(persistence.username)
}

export type UserPersistence = {
    username: string,
    currentStreak: number,
    maxStreak: number,
    averageRank: number,
    averageGuesses: number,
    averageTime: number,
    gamesPlayed: number,
    timedStats: TimedStat[] | string
}