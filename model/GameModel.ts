import {resolvePromise} from "./resolvePromise";
import {HintList, Hint} from "~/model/HintList";
import {Utils} from "~/utilities/Utils"
import {fetchIntro} from "~/api/wikipediaSource";



export class GameModel {

    //celebrity information
    private _name: string;
    private _imageUrl: string = '';
    private _hints : HintList = new HintList();

    //game information
    private _blur: number = 4;
    private _curHintLevel: number = 1;
    private _nbGuesses = 0;
    private _curGuess : string = '';
    private _prevGuesses : string[] = [];
    private _promiseState: any = {};
    private _end: boolean = false;
    private _win: boolean = false;

    /**
     * Model for the game
     */
    constructor(name: string) {
        this._name = name;
        resolvePromise(fetchIntro('Albert_Einstein'), this._promiseState);
        //TODO : initiate hints with parsing instead
        this._hints.birth.value = new Date(1879,2, 14);
        this._hints.death.value = new Date(1955,3, 18);
        this._hints.occupation.value = "Physicist";
        this._hints.citizenship.value = "Switzerland";
        this._hints.initials.value = "A. E."
        this._hints.paragraph1.value = "... was a German-born theoretical physicist who is widely held to be one of the " +
            "greatest and most influential scientists of all time. Best known for developing the theory of relativity," +
            " ... also made important contributions to quantum mechanics, and was thus a central figure in the revolutionary" +
            " reshaping of the scientific understanding of nature that modern physics accomplished in the first decades of " +
            "the twentieth century theory..."
        this._imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Albert_Einstein_1947.jpg/440px-Albert_Einstein_1947.jpg";
    }

    /**
     * This method reveals a new hint pseudo-randomly by taking into account the current hint-level
     * that should be revealed
     */
    getNewHint() : void {
        const levelHintsLeft = this._hints.toList().filter(
            hint => !hint.revealed && hint.level == this._curHintLevel);
        const listLength = levelHintsLeft.length;
        if(listLength == 0){
            this._curHintLevel ++;
            if(this._curHintLevel == 2){
                this._blur = 2;
            }else if(this._curHintLevel == 3){
                this._blur = 0;
            }else{ //no more hints available
                this._end = true;
            }
        }else{
            const rdmHint = Utils.getRandom(levelHintsLeft);
            rdmHint.reveal()
        }
    }

    /**
     * This method is used to set a new guess for the user and to increment the number of guesses counter
     * @param newGuess (the new guess the user wants to enter)
     * @return boolean, true if the guess was correctly set, false either if the guess has already been played
     * or the celebrity entered isn't in our database.
     */
    makeAGuess(newGuess : string) : boolean {
        if(this._prevGuesses.includes(newGuess) || false){ //TODO: replace false by "!(ourCelebList.includes(newGuess)"
            return false;
        }else {
            this._prevGuesses.push(newGuess);
            this._curGuess = newGuess;
            this._nbGuesses++;
            if(this._curGuess == this._name){
                this._end = true;
                this._win = true;
            }
            return true;
        }
    }


    get name(): string {
        return this._name;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    get hints(): HintList {
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

    set blur(value: number) {
        if (value < 0 || value > 7) {
            throw new Error("Blur must be between 0 and 7");
        }
        this._blur = value;
    }
}


