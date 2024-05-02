import { ref as dbRef, set, update, get, remove, Database, push } from "firebase/database"
import type { TimedStat, UserStore } from "~/model/UserModel.js"
import type { GameStore } from "~/model/GameModel"
import { getCurrentDayTimestamp } from "~/utilities/Utils"

let database: Database

/**
 * This method initializes Firebase database.
 */
export function initializeFirebase(): void {
    database = useDatabase()
}

/**
 * This method saves a local user model to persistence.
 * @param model - User model to push to persistence
 * @param username - Username to give to user
 * @param uid - ID to give to model in order to keep track in persistence
 * @param userIndex - number the new place of the username in the usernames list
 */
export function saveUserToFirebase(model: UserStore, username: string, uid: string, userIndex : number): void {
    model.updateUser(uid, username)
    const persistence: { [key: string]: string | number } = userStoreToPersistence(model)
    set(dbRef(database, 'users/' + uid), persistence).then()
    set(dbRef(database, 'usernames/' + userIndex), username.toLowerCase()).then()
}

/**
 * This method saves a local user model to persistence.
 * @param model - Game model to push to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function saveCurrentGameToFirebase(model: GameStore, uid: string): void {
    if(model.end) remove(dbRef(database, 'users/' + uid + '/currentGame')).then()
    else set(dbRef(database, 'users/' + uid + '/currentGame'),model.$state).then()
}

/**
 * This method updates a user model to persistence.
 * @param model - User model to update to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function updateUserToFirebase(model: UserStore, uid: string): void {
    const persistence = userStoreToPersistence(model)

    // First update user's general stats
    update(dbRef(database, 'users/' + uid), persistence).then()

    // Then update user's daily stats
    model.timedStats?.map((stat: TimedStat) => {
        update(dbRef(database, 'users/' + uid + '/stats/' + stat.date), {
            guesses: stat.guesses,
            rank: stat.rank,
            time: stat.time
        }).then()
    })
}

/**
 * This method updates a user rank in a particular stat to persistence.
 * @param rank - Rank to update to persistence
 * @param uid - User ID to update
 */
export function updateUserRankToFirebase(rank: number, uid: string): void {
    getCurrentDayTimestamp().then(timestamp => {
        update(dbRef(database, 'users/' + uid + '/stats/' + timestamp), { rank: rank }).then()
    })
}

/**
 * This method updates a user averageRank
 * @param diff - the difference in rank
 * @param uid - User ID to update
 */
export function updateUserAVGRankToFirebase(diff : number, uid: string): void {
    get(dbRef(database, 'users/' + uid)).then(snapshot => {
        if (snapshot.val() && snapshot.val().averageRank) {
            let newAverage = snapshot.val().averageRank + (diff / snapshot.val().gamesPlayed)
            update(dbRef(database, 'users/' + uid), {averageRank : newAverage}).then()
        }
    })
}

/**
 * This method fills local user model from persistence.
 * @param model - Local model to fill
 * @param uid - ID to give to model in order to keep track in persistence
 */
export async function readUserFromFirebase(model: UserStore, uid: string): Promise<void> {
    get(dbRef(database, 'users/' + uid)).then(snapshot => {
        if (snapshot.val()) {
            persistenceToUserModel(model, snapshot.val())
        }
    })
}


/**
 * This method fills local user model from persistence.
 * @param model - Local model to fill
 * @param uid - ID to give to model in order to keep track in persistence
 */
export async function readCurGameFromFirebase(model : GameStore, uid: string): Promise<void> {
    get(dbRef(database, 'users/' + uid + '/currentGame')).then(snapshot => {
        if (snapshot.val()) {
            // Make sure we do not get an old gameState
            if (snapshot.val().name == model.name) {
                model.$state = snapshot.val()
                return model
            } else {
                // Remove old game
                remove(dbRef(database, 'users/' + uid + '/currentGame')).then()
            }
        }
        // Reset daily challenge if needed
        if (model.nbGuesses > 0) model.init(model.name, true).then()
    })
}

/**
 * This method updates user's username in both local store and persistence.
 * @param store - User model to update
 * @param username - New username to update
 * @param uid - User ID to update
 * @param toast - Toast to display success message
 */
export async function updateUsernameToFirebase(store: UserStore, username: string, uid: string, toast: any): Promise<void> {
    if (store.username === username) return
    store.updateUser(uid, username)
    update(dbRef(database, 'users/' + uid), { username: username }).then()
}

/**
 * This method deletes a user from persistence.
 * @param uid - User ID to delete
 */
export async function deleteUserFromFirebase(uid: string): Promise<void> {
    remove(dbRef(database, 'users/' + uid)).then()
}

/**
 * This method gets all user stats for leaderboard.
 */
export async function getAllUserFromFirebase(): Promise<UserPersistence[]> {
    return get(dbRef(database, 'users')).then(snapshot => {
        const usersData: UserPersistence[] = []
        snapshot.forEach((child) => {
            usersData.push({
                uid: child.key,
                username: child.val().username,
                currentStreak: child.val().currentStreak,
                maxStreak: child.val().maxStreak,
                averageRank: child.val().averageRank,
                averageGuesses: child.val().averageGuesses,
                winRate: child.val().winRate,
                gamesPlayed: child.val().gamesPlayed,
                stats: child.val().stats === undefined ? [] : Object.keys(child.val().stats)?.map((key: string): TimedStat => {
                    return {
                        date: parseInt(key),
                        guesses: child.val().stats[key].guesses,
                        rank: child.val().stats[key].rank,
                        time: child.val().stats[key].time
                    }
                })
            })
        })
        return usersData
    })
}

/**
 * This method gets all usernames to assure uniqueness
 */
export async function getAllUsernamesFromFirebase(): Promise<string[]> {
    return get(dbRef(database, 'usernames')).then(snapshot => {
        const usernames: string[] = snapshot.val() ? snapshot.val() : []
        return usernames
    })
}

/**
 * This private method converts our user model to store it as a POJO in persistence.
 * @param model - User model to push to persistence
 * @return UserPersistence - POJO will relevant user info
 */
function userStoreToPersistence(model: UserStore): any {
    return {
        username: model.username,
        currentStreak: model.currentStreak,
        maxStreak: model.maxStreak,
        averageRank: model.averageRank,
        averageGuesses: model.averageGuesses,
        winRate: model.winRate,
        gamesPlayed: model.gamesPlayed,
    }
}

/**
 * This private method converts POJO from persistence to fill our local user model.
 * @param model - The local model to fill
 * @param persistence - The POJO obtained from persistence
 */
function persistenceToUserModel(model: UserStore, persistence: any): void {
    model.updateStats(
        persistence.currentStreak || 0,
        persistence.maxStreak || 0,
        persistence.averageRank || 0,
        persistence.averageGuesses ||0 ,
        persistence.winRate || 0,
        persistence.gamesPlayed || 0,
        // Workaround to Firebase saving empty arrays as undefined
        persistence.stats === undefined ? [] : Object.keys(persistence.stats).map((key: string): TimedStat => {
            return {
                date: parseInt(key),
                guesses: persistence.stats[key].guesses,
                rank: persistence.stats[key].rank,
                time: persistence.stats[key].time
            }
        })
    )
    model.updateUser(persistence.uid, persistence.username)
}

export type UserPersistence = {
    uid: string,
    username: string,
    currentStreak: number,
    maxStreak: number,
    averageRank: number,
    averageGuesses: number,
    winRate: number,
    gamesPlayed: number,
    stats: TimedStat[]
}

