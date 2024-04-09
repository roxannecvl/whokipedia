import { resolvePromise } from "~/model/ResolvePromise"
import { fetchIntro, fetchImage, fetchInfoBox } from "~/api/WikipediaSource"
import { getRandom } from "~/utilities/Utils"

import type { PromiseState } from "~/model/ResolvePromise"
import { type InfoboxHint, type ParagraphHint, type BlurHint } from "~/model/Hint"

/**
 * This class represents the model of the game. It contains all the information needed to play the game.
 * These elements are the name of the celebrity, the URL of an image of the celebrity, the hint list,
 * the blur level, the current hint level,
 */
export class GameModel {

    private _name: string = ""
    private _images: BlurHint[] | undefined
    private _intro : ParagraphHint[] | undefined
    private _infobox : InfoboxHint[] | undefined
    private _hintLevel: number = 1
    private _nbGuesses: number = 0
    private _curGuess : string = ""
    private _prevGuesses : string[] = []
    private _end: boolean = false;
    private _win: boolean = false;

    public introPromiseState: PromiseState = { data: null, promise: null, error: null }
    public imagePromiseState: PromiseState = { data: null, promise: null, error: null }
    public infoPromiseState: PromiseState = { data: null, promise: null, error: null }

    public init(name: string){
        this._reset();
        this._name = name;
        resolvePromise(
            fetchImage(this._name, 100).then((images: BlurHint[]) => this._images = images),
            this.imagePromiseState
        );
        resolvePromise(
            fetchIntro(this._name).then((intro: ParagraphHint[]) => this._intro = intro),
            this.introPromiseState
        );
        resolvePromise(
            fetchInfoBox(this._name).then((hints: InfoboxHint[]) => this._infobox = hints),
            this.infoPromiseState
        );
    }

    /**
     * This method is used to register a new guess.
     * @param newGuess - the new guess the user wants to enter
     * @return boolean - true if the guess was correctly set, false otherwise
     */
    public makeAGuess(newGuess : string) : boolean {
        if (this._prevGuesses.includes(newGuess)) return false;
        this._prevGuesses.push(newGuess);
        this._curGuess = newGuess;
        this._nbGuesses++;
        if (this._curGuess == this._name) {
            this._end = true;
            this._win = true;
        } else this._getNewHint();
        return true;
    }

    /**
     * This method is used to check if the model is ready for a game.
     * @return boolean - true if all needed data has been fetched, false otherwise
     */
    public isReady() : boolean {
        return this.introPromiseState.data !== null
            && this.imagePromiseState.data !== null
            && this.infoPromiseState.data !== null;
    }

    get name(): string {
        return this._name;
    }

    get imageUrl(): string | undefined {
        return this._images ? this._images[0].url : undefined
    }

    get blur(): number | undefined {
        return this._images ? this._images
                .filter((image: BlurHint) => image.revealed)
                .reduce((max, curr) => {
                    return max.blur > curr.blur ? max : curr
                }).blur : undefined
    }

    get intro() : ParagraphHint[] | undefined {
        return this._intro;
    }

    get infobox() : InfoboxHint[] | undefined {
        return this._infobox
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

    /**
     * This method reveals a new hint pseudo-randomly, taking into account the current hint level.
     * @private
     */
    private _getNewHint() : void {
        if (this._infobox !== undefined && this._images !== undefined  && this._intro !== undefined) {
            const levelHintsLeft: (InfoboxHint | ParagraphHint | BlurHint)[] = [
                ...this._images,
                ...this._infobox,
                ...this._intro
            ].filter((hint: InfoboxHint | ParagraphHint | BlurHint) => !hint.revealed && hint.level == this._hintLevel)

            if (levelHintsLeft.length == 0) {
                if (this._hintLevel >= 3) {
                    this._end = true;
                    return;
                }
                this._hintLevel ++;
                this._getNewHint()
            } else {
                getRandom(levelHintsLeft).revealed = true;
            }
        }
    }

    /**
     * This method resets the game model to its initial state.
     * @private
     */
    private _reset() {
        this._name= "";
        this._images = undefined;
        this._intro = undefined;
        this._infobox = undefined;
        this._hintLevel = 1;
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


