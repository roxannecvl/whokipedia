import { resolvePromise } from "~/model/ResolvePromise"
import type { PromiseState } from "~/model/ResolvePromise"
import { HintList } from "~/model/HintList"
import { fetchIntro, fetchImageUrl, fetchInfoBox } from "~/api/WikipediaSource"
import { getRandom } from "~/utilities/Utils"

/**
 * This class represents the model of the game. It contains all the information needed to play the game.
 * These elements are the name of the celebrity, the URL of an image of the celebrity, the hint list,
 * the blur level, the current hint level,
 */
export class GameModel {

    // Celebrity information
    private _name: string = ""
    private _imageUrl: string = ""
    private _intro : string[] = []
    private _hints : HintList | undefined

    // Game information
    private _blur: number = 4
    private _introPartsRevealed : number[] = [];
    private _curHintLevel: number = 1
    private _nbGuesses: number = 0
    private _curGuess : string = ""
    private _prevGuesses : string[] = []
    public introPromiseState: PromiseState = { data: null, promise: null, error: null }
    public imagePromiseState: PromiseState = { data: null, promise: null, error: null }
    public infoPromiseState: PromiseState = { data: null, promise: null, error: null }
    private _end: boolean = false;
    private _win: boolean = false;

    public init(name: string){
        this._reset();
        this._name = name;
        resolvePromise(fetchIntro(this._name).then(intro => this._intro = intro), this.introPromiseState);
        resolvePromise(fetchImageUrl(this._name, 100).then(url => this._imageUrl = url), this.imagePromiseState);
        resolvePromise(fetchInfoBox(this._name).then(hints => this._hints = hints), this.infoPromiseState);
    }

    /**
     * This method is used to set a new guess for the user and to increment the number of guesses counter
     * @param newGuess (the new guess the user wants to enter)
     * @return boolean, true if the guess was correctly set, false either if the guess has already been played
     * or the celebrity entered isn't in our database.
     */
    public makeAGuess(newGuess : string) : boolean {
        if (this._prevGuesses.includes(newGuess)) {
            return false;
        } else {
            this._prevGuesses = [newGuess, ...this._prevGuesses];
            this._curGuess = newGuess;
            this._nbGuesses++;
            if (this._curGuess == this._name) {
                this._end = true;
                this._win = true;
            } else {
                this._getNewHint();
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

    get intro() : string[] {
        return this._intro;
    }

    get introPartsRevealed(): number[] {
        return this._introPartsRevealed
    }

    set blur(value: number) {
        if (value < 0 || value > 7) {
            throw new Error("Blur must be between 0 and 7");
        }
        this._blur = value;
    }

    /**
     * This method reveals a new hint pseudo-randomly by taking
     * into account the current hint-level that should be revealed.
     * @private
     */
    private _getNewHint() : void {
        if (this._hints != undefined && this._imageUrl != ""  && this._intro[0] !== "") {
            const levelHintsLeft = this._hints.toList().filter(
                hint => !hint.revealed && hint.level == this._curHintLevel
            );
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
                const rdmHint = getRandom(levelHintsLeft);
                rdmHint.reveal()
            }
        }
    }

    /**
     * This method resets the game model to its initial state.
     * @private
     */
    private _reset() {
        this._name= "";
        this._imageUrl = "";
        this._intro = [""];
        this._hints = undefined;
        this._blur = 4;
        this._introPartsRevealed = [];
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


