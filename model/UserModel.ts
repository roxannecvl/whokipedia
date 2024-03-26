import { Utils } from '~/utilities/Utils';

export class UserModel {
    //private fields for the user's statistics

    //name of the user (undefined if not logged in)
    private _username: string | undefined;

    //current streak of the user
    private _currentStreak: number = 0;
    //max streak of the user
    private _maxStreak: number = 0;

    //average rank of the user
    private _averageRank: number = 0;
    //array of ranks of the user
    private _ranks: number[] = [];

    //average number of guesses of the user
    private _averageGuesses: number = 0;
    //array of number of guesses of the user
    private _guesses: number[] = [];

    //average time taken by the user
    private _averageTime: number = 0;
    //array of times taken by the user
    private _times: number[] = [];

    //number of times the user has played
    private _timesPlayed: number = 0;

    //getter for userName
    get username(): string | undefined{
        return this._username;
    }

    //getter for currentStreak
    get currentStreak(): number {
        return this._currentStreak;
    }

    //getter for maxStreak
    get maxStreak(): number {
        return this._maxStreak;
    }

    //getter for averageRank
    get averageRank(): number {
        return this._averageRank;
    }

    //getter for ranks
    get ranks(): number[] {
        return this._ranks;
    }

    //getter for averageGuesses
    get averageGuesses(): number {
        return this._averageGuesses;
    }

    //getter for guesses
    get guesses(): number[] {
        return this._guesses;
    }

    //getter for averageTime
    get averageTime(): number {
        return this._averageTime;
    }

    //getter for times
    get times(): number[] {
        return this._times;
    }

    //getter for timesPlayed
    get timesPlayed(): number {
        return this._timesPlayed;
    }

    //update the user's username
    updateUsername(username: string | undefined) {
        this._username = username;
    }
    
    //method to update the user's statistics
    updateStats(currentStreak: number, maxStreak: number, averageRank: number, averageGuesses: number, averageTime: number, timesPlayed: number) {
        this._currentStreak = currentStreak;
        this._maxStreak = maxStreak;
        this._averageRank = averageRank;
        this._averageGuesses = averageGuesses;
        this._averageTime = averageTime;
        this._timesPlayed = timesPlayed;
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
        this._username = undefined;

        this._currentStreak = 0;
        this._maxStreak = 0;

        this._averageRank = 0;
        this._ranks = [];

        this._averageGuesses = 0;
        this._guesses = [];

        this._averageTime = 0;
        this._times = [];

        this._timesPlayed = 0;
    }
};