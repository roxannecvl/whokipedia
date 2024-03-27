import { resolvePromise} from "~/model/ResolvePromise"
import type { PromiseState } from "~/model/ResolvePromise"
import { Hint, HintList } from "~/model/HintList"
import { fetchIntro, fetchImageUrl, fetchInfoBox } from "~/api/WikipediaSource"
import { Utils } from "~/utilities/Utils"
import {
    celebrities
} from "~/model/CelebrityList";

/**
 * This class represents the model of the game. It contains all the information needed to play the game.
 * These elements are the name of the celebrity, the URL of an image of the celebrity, the hint list,
 * the blur level, the current hint level,
 */
export class GameModel {

    // Celebrity information
    private _name: string;
    private _imageUrl: string;
    private _intro : string[];
    private _hints : HintList | undefined;

    //game information
    private _blur: number;
    private _curHintLevel: number;
    private _nbGuesses: number;
    private _curGuess : string;
    private _prevGuesses : string[];
    public introPromiseState: PromiseState;
    public imagePromiseState: PromiseState;
    public infoPromiseState: PromiseState;
    private _end: boolean = false;
    private _win: boolean = false;

    /**
     * Model for the game
     */

    public constructor() {
        this._name= "";
        this._imageUrl = "";
        this._intro = [""];
        this._hints = undefined;

        //game information
        this._blur = 4;
        this._curHintLevel = 1;
        this._nbGuesses = 0;
        this._curGuess = '';
        this._prevGuesses = [];
        this.introPromiseState = { data: null, promise: null, error: null };
        this.imagePromiseState = { data: null, promise: null, error: null };
        this.infoPromiseState = { data: null, promise: null, error: null };
        this._end = false;
        this._win = false;
    }
    public init(name: string){
        this._reset();
        this._name = name;
        resolvePromise(fetchIntro(this._name).then(intro => this._intro = intro), this.introPromiseState);
        resolvePromise(fetchImageUrl(this._name, 100).then(url => this._imageUrl = url), this.imagePromiseState);
        resolvePromise(fetchInfoBox(this._name).then(info => this._setHintListACB(info)), this.infoPromiseState);
    }

    /**
     * This method reveals a new hint pseudo-randomly by taking into account the current hint-level
     * that should be revealed
     */
    public getNewHint() : void {
        if (this._hints != undefined && this._imageUrl != ""  && this._intro[0] !== "") {
            const levelHintsLeft = this._hints.toList().filter(
                hint => !hint.revealed && hint.level == this._curHintLevel);
            const listLength = levelHintsLeft.length;
            if (listLength == 0) {
                this._curHintLevel ++;
                if (this._curHintLevel == 2) {
                    this._blur = 2;
                } else if (this._curHintLevel == 3) {
                    this._blur = 0;
                } else { //no more hints available
                    this._end = true;
                }
            } else {
                const rdmHint = Utils.getRandom(levelHintsLeft);
                rdmHint.reveal()
            }

        }
    }

    /**
     * This method is used to set a new guess for the user and to increment the number of guesses counter
     * @param newGuess (the new guess the user wants to enter)
     * @return boolean, true if the guess was correctly set, false either if the guess has already been played
     * or the celebrity entered isn't in our database.
     */
    public makeAGuess(newGuess : string) : boolean {
        if (this._prevGuesses.length != 0 && this._prevGuesses.includes(newGuess)) {
            return false;
        } else {
            this._prevGuesses = [newGuess, ...this._prevGuesses];
            this._curGuess = newGuess;
            this._nbGuesses++;
            if (this._curGuess == this._name) {
                this._end = true;
                this._win = true;
            }
            return true;
        }
    }

    public isReady() : boolean {
        return this.introPromiseState.data !== null && this.imagePromiseState.data !== null && this.infoPromiseState.data !== null;
    }


    get name(): string {
        return this._name;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    get hints(): HintList | undefined{
        return this._hints;
    }

    get blur(): number {
        return this._blur;
    }

    get curGuess() : string {
        return this._curGuess;
    }

    get nbGuesses() : number {
        return this._nbGuesses;
    }

    get end() : boolean {
        return this._end;
    }

    get win() : boolean {
        return this._win;
    }

    get intro() : string[]{
        return this._intro;
    }

    set blur(value: number) {
        if (value < 0 || value > 7) {
            throw new Error("Blur must be between 0 and 7");
        }
        this._blur = value;
    }


    /**
     * this is a private function used to set the Hintlist parameter, it is called once fetchInfoBox resolves.
     * @param infos - infos comming from the fetching of the infobox
     * @private
     */
    private _setHintListACB(infos : any){
        let spouse : Hint<string[]> = new Hint<string[]>("Spouses", 2, infos.spouses);
        let genres : Hint<string[]> = new Hint<string[]>("Genres", 2, infos.genres);
        let political_party : Hint<string> = new Hint<string>("Political party", 2, infos.political_party);
        let instruments : Hint<string[]> = new Hint<string[]>("Instruments", 2, infos.instruments);
        let known_for : Hint<string[]> = new Hint<string[]>("Known for", 3, infos.known_for);
        let education : Hint<string> = new Hint<string>("Education", 2, infos.education);
        let notable_work : Hint<string[]> = new Hint<string[]>("Notable work", 3, infos.notable_work);
        let honours : Hint<string[]> = new Hint<string[]>("Honours", 2, infos.honours);
        let awards : Hint<string[]> = new Hint<string[]>("Awards", 2, infos.awards);
        let television : Hint<string[]> = new Hint<string[]>("Television", 2, infos.television);
        let partners : Hint<string[]> = new Hint<string[]>("Partners", 2, infos.partners);
        let other_names : Hint<string[]> = new Hint<string[]>("Other names", 3, infos.other_names);
        let title : Hint<string> = new Hint<string>("Title", 2, infos.title);
        let children : Hint<number> = new Hint("Children", 2, infos.children);
        let years_active : Hint<string> = new Hint("Years active", 2, infos.years_active);

        let arbitraryHints : Hint<any> [] = [spouse, genres, political_party, instruments, known_for, education,
            notable_work, honours, awards, television, partners, other_names, title, children, years_active].filter(
            h => h.value !== undefined).slice(0,2);

        this._hints = new HintList(infos.birthDate, infos.deathDate, infos.occupation, infos.citizenship,
            Utils.getInitials(this._name), arbitraryHints);

        return this._hints;
    }

    private _reset() {
        this._name= "";
        this._imageUrl = "";
        this._intro = [""];
        this._hints = undefined;

        //game information
        this._blur = 4;
        this._curHintLevel = 1;
        this._nbGuesses = 0;
        this._curGuess = '';
        this._prevGuesses = [];
        this.introPromiseState = { data: null, promise: null, error: null };
        this.imagePromiseState = { data: null, promise: null, error: null };
        this.infoPromiseState = { data: null, promise: null, error: null };
        this._end = false;
        this._win = false;
    }
}


