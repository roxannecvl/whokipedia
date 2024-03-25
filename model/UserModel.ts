import { Utils } from '~/utilities/Utils';

export class UserModel {
    //private fields for the user's statistics

    //name of the user
    private _username: string = '';

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

    constructor(userName: string) {
        this._username = userName;
        this._currentStreak = 12;
        this._maxStreak = 14;
        this._ranks = [36, 2, 12, 44, 17];
        this._averageRank = Utils.getMean(this._ranks);
        this._guesses = [7, 1, 22, 9, 3];
        this._averageGuesses = Utils.getMean(this._guesses);
        this._times = [14, 28, 37, 48, 50];
        this._averageTime = Utils.getMean(this._times);
        this._timesPlayed = 5;
    }

    //getter for userName
    get username(): string {
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

    //method to update the user's statistics
    updateStats(rank: number, guesses: number, time: number) {
        this._ranks.push(rank);
        this._averageRank = Utils.getMean(this._ranks);

        this._guesses.push(guesses);
        this._averageGuesses = Utils.getMean(this._guesses);

        this._times.push(time);
        this._averageTime = Utils.getMean(this._times);

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