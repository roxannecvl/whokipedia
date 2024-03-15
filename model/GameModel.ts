import {resolvePromise} from "./resolvePromise.js";

export class GameModel {

    //celebrity information
    private _name: string;
    private _imageUrl: string = '';
    private _birth: Hint<Date> = new Hint(1, new Date(0,0,0), true);
    private _death : Hint<Date> = new Hint(1, new Date(0,0,0));
    private _occupation : Hint<string>= new Hint(1, '');
    private _citizenship : Hint<string> = new Hint(1, '');
    private _initials : Hint<string> = new Hint(2, '');
    private _paragraph1 : Hint<string> = new Hint (2, '');

    //game information
    private _blur: number = 4;
    private _curHintLevel: number = 1;
    private _hints: Hint<any>[] = [this._death, this._occupation, this._citizenship, this._initials, this._paragraph1];
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
        resolvePromise(this.dummyPromise(), this._promiseState); //TODO: change the promise to a call to the api
        //TODO : initiate hints with parsing instead
        this._birth.value = new Date(1879,2, 14);
        this._death.value = new Date(1955,3, 18);
        this._occupation.value = "Physicist";
        this._citizenship.value = "Switzerland";
        this._initials.value = "A. E."
        this._paragraph1.value = "... was a German-born theoretical physicist who is widely held to be one of the " +
            "greatest and most influential scientists of all time. Best known for developing the theory of relativity," +
            " ... also made important contributions to quantum mechanics, and was thus a central figure in the revolutionary" +
            " reshaping of the scientific understanding of nature that modern physics accomplished in the first decades of " +
            "the twentieth century theory..."
        this._imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Albert_Einstein_1947.jpg/440px-Albert_Einstein_1947.jpg";
    }

    //TODO: remove this method, needed only for testing purposes while api promises are not implemented
    async dummyPromise() : Promise <any> {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(response => response.json());
    }

    /**
     * This method reveals a new hint pseudo-randomly by taking into account the current hint-level
     * that should be revealed
     */
    getNewHint() : void {
        const levelHintsLeft = this._hints.filter(
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
            const rdmHint = levelHintsLeft[Math.floor(Math.random() * listLength)];
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

    get birth(): Hint<Date> {
        return this._birth;
    }

    get death(): Hint<Date> {
        return this._death;
    }

    get occupation(): Hint<string> {
        return this._occupation;
    }

    get citizenship(): Hint<string> {
        return this._citizenship;
    }

    get initials(): Hint<string> {
        return this._initials;
    }

    get paragraph1(): Hint<string> {
        return this._paragraph1;
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


/**
 * this class represents a hint, the value being the core of the hint
 * revealed tells us if the hint has been revealed yet while level gives us
 * the level corresponding to the hint (1 being a small hint and 3 a huge hint)
 */
export class Hint <T> {
    private _level : number;
    private _value : T;
    private _revealed : boolean;

    constructor(level: number, value : T, revealed : boolean = false ) {
        this._level = level;
        this._value = value;
        this._revealed = revealed;
    }

    get level() : number {
        return this._level;
    }
    get value(): T {
        return this._value;
    }

    get revealed() : boolean {
        return this._revealed;
    }

    set value(value : T){
        this._value = value;
    }

    reveal(){
        this._revealed = true;
    }
}
