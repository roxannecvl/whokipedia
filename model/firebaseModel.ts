import { ref as dbRef, push, update, get, Database, type DatabaseReference } from "firebase/database";
import type { UserModel } from "./UserModel.js";

let database: Database;
let userRef: DatabaseReference;

// Initialise firebase app, database, ref
function initialiseFirebase() {
    database = useDatabase();
    userRef = dbRef(database, 'users');
}

function userModelToPersistence(model: UserModel): any {
    return {
        currentStreak: model.currentStreak,
        maxStreak: model.maxStreak,
        averageRank: model.averageRank,
        averageGuesses: model.averageGuesses,
        averageTime: model.averageTime,
        timesPlayed: model.timesPlayed,
    }
}

function persistenceToUserModel(persistence: any, model: UserModel) {
    model.updateStats(persistence.currentStreak, persistence.maxStreak, persistence.averageRank, persistence.averageGuesses, persistence.averageTime, persistence.timesPlayed);
}

function saveUserToFirebase(model: UserModel, uid: string) {
        const persistence = userModelToPersistence(model);
    persistence.uid = uid;
    push(userRef, persistence);
}

function updateUserToFirebase(model: UserModel, uid: string) {
    const persistence = userModelToPersistence(model);
    persistence.uid = uid;
    update(userRef, persistence);
}

function readUserFromFirebase(model: UserModel) {
    return get(userRef).then(snapshot => {
                persistenceToUserModel(snapshot.val(), model);
        return model;
    });
}



// Remember to uncomment the following line:
export { initialiseFirebase, userModelToPersistence, saveUserToFirebase, updateUserToFirebase, readUserFromFirebase }