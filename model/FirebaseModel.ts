import { ref as dbRef, set, update, get, Database } from "firebase/database";
import type { UserStore } from "~/model/UserModel.js";
import { getCurrentDayTimestamp } from "~/utilities/Utils";

let database: Database

/**
 * This method initializes Firebase database.
 */
export function initializeFirebase(): void {
    database = useDatabase();
}

/**
 * This method saves a local user model to persistence.
 * @param store - User model to push to persistence
 * @param username - Username to give to user
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function saveUserToFirebase(store: UserStore, username: string, uid: string): void {
    store.updateUser(uid, username);
    const persistence: {[key: string]: string | number} = userStoreToPersistence(store);
    set(dbRef(database, 'users/' + uid), persistence).then();
}

/**
 * This method updates a user model to persistence.
 * @param store - User model to update to persistence
 * @param uid - ID to give to model in order to keep track in persistence
 */
export function updateUserToFirebase(store: UserStore, uid: string): void {
    const persistence = userStoreToPersistence(store)

    // First update user's general stats
    update(dbRef(database, 'users/' + uid), persistence).then()

    // Then update user's daily stats
    store.timedStats?.map((stat) => {
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
    update(dbRef(database, 'users/' + uid + '/stats/' + getCurrentDayTimestamp()), { rank: rank }).then()
}

/**
 * This method fills local user model from persistence.
 * @param store - Local model to fill
 * @param uid - ID to give to model in order to keep track in persistence
 */
export async function readUserFromFirebase(store: UserStore, uid: string): Promise<UserStore> {
    return get(dbRef(database, 'users/' + uid)).then(snapshot => {
        if(snapshot.val()){
            persistenceToUserModel(store, snapshot.val());
        }
        return store;
    });
}

/**
 * This method gets all user stats for leaderboard.
 */
export async function getAllUserFromFirebase(): Promise<UserPersistence[]> {
    return get(dbRef(database, 'users')).then(snapshot => {
        const usersData: UserPersistence[] = [];
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
                stats: child.val().stats === undefined ? [] : Object.keys(child.val().stats)?.map(key => {
                    return {
                        date: parseInt(key),
                        guesses: child.val().stats[key].guesses,
                        rank: child.val().stats[key].rank,
                        time: child.val().stats[key].time
                    }
                })
            });
        });
        return usersData;
    });
}

/**
 * This private method converts our user model to store it as a POJO in persistence.
 * @param store - User model to push to persistence
 * @return UserPersistence - POJO will relevant user info
 */
function userStoreToPersistence(store: UserStore): any {
    return {
        username: store.username,
        currentStreak: store.currentStreak,
        maxStreak: store.maxStreak,
        averageRank: store.averageRank,
        averageGuesses: store.averageGuesses,
        winRate: store.winRate,
        gamesPlayed: store.gamesPlayed,
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
        persistence.winRate,
        persistence.gamesPlayed,
        // Workaround to Firebase saving empty arrays as undefined
        persistence.stats === undefined ? [] : Object.keys(persistence.stats).map(key => {
            return {
                date: parseInt(key),
                guesses: persistence.stats[key].guesses,
                rank: persistence.stats[key].rank,
                time: persistence.stats[key].time
            }
        })
    );
    store.updateUser(persistence.uid, persistence.username);
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
    stats: {
        date: number,
        guesses: number,
        rank: number,
        time: number
    }[]
}
