import type { UidIdentifier } from "firebase-admin/auth";

export class UserModel {
    private _userName: string = '';

    private _currentStreak: number = 0;
    private _maxStreak: number = 0;

    private _averageRank: number = 0;
    private _ranks: number[] = [];

    private _averageGuesses: number = 0;
    private _guesses: number[] = [];

    private _averageTime: number = 0;
    private _times: number[] = [];

    private _timesPlayed: number = 0;

    constructor(userName: string) {
        this._userName = userName;
        this._currentStreak = 12;
        this._maxStreak = 14;
        this._ranks = [36, 2, 12, 44, 17];
        this._averageRank = this._ranks.reduce((a, b) => a + b, 0) / this._ranks.length;
        this._guesses = [7, 1, 22, 9, 3];
        this._averageGuesses = this._guesses.reduce((a, b) => a + b, 0) / this._guesses.length;
        this._times = [14, 28, 37, 48, 50];
        this._averageTime = this._times.reduce((a, b) => a + b, 0) / this._times.length;
        this._timesPlayed = 5;
    }

    //getter for userName
    get userName(): string {
        return this._userName;
    }

    //getter and setter for currentStreak
    get currentStreak(): number {
        return this._currentStreak;
    }
    set currentStreak(value: number) {
        this._currentStreak = value;
    }

    //getter and setter for maxStreak
    get maxStreak(): number {
        return this._maxStreak;
    }
    set maxStreak(value: number) {
        this._maxStreak = value;
    }

    //getter and setter for averageRank
    get averageRank(): number {
        return this._averageRank;
    }
    set averageRank(value: number) {
        this._averageRank = value;
    }

    //getter for ranks
    get ranks(): number[] {
        return this._ranks;
    }

    //getter and setter for averageGuesses
    get averageGuesses(): number {
        return this._averageGuesses;
    }
    set averageGuesses(value: number) {
        this._averageGuesses = value;
    }

    //getter for guesses
    get guesses(): number[] {
        return this._guesses;
    }

    //getter and setter for averageTime
    get averageTime(): number {
        return this._averageTime;
    }
    set averageTime(value: number) {
        this._averageTime = value;
    }

    //getter for times
    get times(): number[] {
        return this._times;
    }

    //getter and setter for timesPlayed
    get timesPlayed(): number {
        return this._timesPlayed;
    }
    set timesPlayed(value: number) {
        this._timesPlayed = value;
    }

    //method to update the user's statistics
    updateStats(rank: number, guesses: number, time: number) {
        this._ranks.push(rank);
        this._averageRank = this._ranks.reduce((a, b) => a + b, 0) / this._ranks.length;

        this._guesses.push(guesses);
        this._averageGuesses = this._guesses.reduce((a, b) => a + b, 0) / this._guesses.length;

        this._times.push(time);
        this._averageTime = this._times.reduce((a, b) => a + b, 0) / this._times.length;

        this._timesPlayed++;
    }

    //method to update the user's streak
    updateStreak() {
        this._currentStreak++;
        if (this._currentStreak > this._maxStreak) {
            this._maxStreak = this._currentStreak;
        }
    }

    //method to reset the user's streak
    resetStreak() {
        this._currentStreak = 0;
    }

    //method to reset the user's statistics
    resetStats() {
        this._averageRank = 0;
        this._ranks = [];

        this._averageGuesses = 0;
        this._guesses = [];

        this._averageTime = 0;
        this._times = [];

        this._timesPlayed = 0;
    }
};