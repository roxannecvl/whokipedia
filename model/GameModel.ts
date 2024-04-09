import { defineStore } from 'pinia';

import { resolvePromise } from "~/model/ResolvePromise"
import { fetchIntro, fetchImage, fetchInfoBox } from "~/api/WikipediaSource"
import { getRandom } from "~/utilities/Utils"

import type { PromiseState } from "~/model/ResolvePromise"
import { type InfoboxHint, type ParagraphHint, type BlurHint } from "~/model/Hint"

export const useGameStore = defineStore('game', {
    state: () => ({
        name: "" as string,
        images: [] as BlurHint[],
        intro: [] as ParagraphHint[],
        infobox: [] as InfoboxHint[],
        hintLevel: 1 as number,
        nbGuesses: 0 as number,
        curGuess: "" as string,
        prevGuesses: [] as string[],
        end: false as boolean,
        win: false as boolean,
        introPromiseState: {} as PromiseState,
        imagePromiseState: {} as PromiseState,
        infoPromiseState: {} as PromiseState,
    }),
    getters: {
        imageUrl: (state): string | undefined => {
            return state.images ? state.images[0].url : undefined
        },
        blur: (state): number | undefined => {
            return state.images.length > 0 ? state.images
                .filter((image: BlurHint) => image.revealed)
                .reduce((max, curr) => {
                    return max.blur > curr.blur ? max : curr
                }).blur : undefined
        },
        ready: (state): boolean => {
            return state.introPromiseState.data !== null
                && state.imagePromiseState.data !== null
                && state.infoPromiseState.data !== null;
        }
    },
    actions: {
        init (name: string): void {
            this.$reset()
            this.name = name
            resolvePromise(
                fetchImage(this.name, 100).then((images: BlurHint[]) => this.images = images),
                this.imagePromiseState
            );
            resolvePromise(
                fetchIntro(this.name).then((intro: ParagraphHint[]) => this.intro = intro),
                this.introPromiseState
            );
            resolvePromise(
                fetchInfoBox(this.name).then((hints: InfoboxHint[]) => this.infobox = hints),
                this.infoPromiseState
            );
        },
        makeAGuess(newGuess: string): boolean {
            if (this.prevGuesses.includes(newGuess)) return false;
            this.prevGuesses.push(newGuess);
            this.curGuess = newGuess;
            this.nbGuesses++;
            if (this.curGuess == this.name) {
                this.end = true;
                this.win = true;
            } else this.getNewHint();
            return true;
        },
        getNewHint(): void {
            if (this.infobox.length > 0 && this.images.length > 0 && this.intro.length > 0) {
                const levelHintsLeft: (InfoboxHint | ParagraphHint | BlurHint)[] = [
                    ...this.images,
                    ...this.infobox,
                    ...this.intro
                ].filter((hint: InfoboxHint | ParagraphHint | BlurHint) => !hint.revealed && hint.level == this.hintLevel)

                if (levelHintsLeft.length == 0) {
                    if (this.hintLevel >= 3) {
                        this.end = true;
                        return;
                    }
                    this.hintLevel ++;
                    this.getNewHint()
                } else {
                    getRandom(levelHintsLeft).revealed = true;
                }
            }
        }
    }
})

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


