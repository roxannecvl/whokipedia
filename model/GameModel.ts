import {resolvePromise} from "./resolvePromise.js";

export class GameModel {

    //celebrity information
    private _name: string;
    private _imageUrl: string = '';
    private _birth: Hint<Date> = new Hint(1, new Date(0,0,0), true);
    private _death : Hint<Date> = new Hint(1, new Date(0,0,0));
    private _occupation : Hint<String>= new Hint(1, '');
    private _citizenship : Hint<String> = new Hint(1, '');
    private _initials : Hint<String> = new Hint(2, '');
    private _paragraph1 : Hint<String> = new Hint (2, '');

    //game information
    private _blur: number = 4;
    private _curHintLevel: number = 1;
    private _hints: Hint<any>[] = [this._death, this._occupation, this._citizenship, this._initials, this._paragraph1];
    private _promiseState: any = {};

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
            "the twentieth centuryy theory..."
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
        var levelHintsLeft = this._hints.filter(
            hint => !hint.revealed && hint.level == this._curHintLevel);
        var listLength = levelHintsLeft.length;
        if(listLength == 0){
            this._curHintLevel ++;
            if(this._curHintLevel == 2){
                this._blur = 2;
            }else{
                this._blur = 0;
            }
        }else{
            var rdmHint = levelHintsLeft[Math.floor(Math.random() * listLength)];
            rdmHint.reveal()
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

    get occupation(): Hint<String> {
        return this._occupation;
    }

    get citizenship(): Hint<String> {
        return this._citizenship;
    }

    get initials(): Hint<String> {
        return this._initials;
    }

    get paragraph1(): Hint<String> {
        return this._paragraph1;
    }

    get blur(): number {
        return this._blur;
    }

    set blur(value: number) {
        if (value < 0 || value > 7) {
            throw new Error("Blur must be between 0 and 7");
        }
        this._blur = value;
    }
}


/**
 * this class reprensents a hint, the value being the core of the hint
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
