/**
 * This class represents a list of hints necessary for one game. It contains 6 hints, each of them being of type `Hint`.
 * The hints are the birthdate, the death date, the occupation, the citizenship, the initials and the first paragraph
 * of the Wikipedia page of the celebrity.
 */
export class HintList {

    list: Hint<any>[] = [];

    constructor(
        ...params: Hint<any>[]
    ){
        this.list = params
    }

    toList() : Hint<any>[]{
        return this.list ;
    }

}

/**
 * This class represents a hint, with its value and additional information. Attributes are the following :
 * `revealed` tells us if the hint has been revealed yet, `level` gives us the level corresponding to the
 * hint (from 1 to 3) and `value` is the value of the hint (can be of any type).
 * @param T - the type of the value of the hint
 */
export class Hint <T> {
    private _level : number;
    private _value : T | null ;
    private _revealed : boolean;

    constructor(level: number, revealed : boolean = false, value : T | null = null) {
        this._level = level;
        this._revealed = revealed;
        this._value = value;
    }

    get level() : number {
        return this._level;
    }
    get value(): T {
        return (this._value as T);
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
