/**
 * This class represents a list of hints necessary for one game. It contains 6 hints, each of them being of type `Hint`.
 * The hints are the birthdate, the death date, the occupation, the citizenship, the initials and the first paragraph
 * of the Wikipedia page of the celebrity.
 */
export class HintList {
    birth: Hint<Date> ;
    alive : boolean
    death : Hint<Date | undefined> ;
    occupation : Hint<string> ;
    citizenship : Hint<string> ;
    initials : Hint<string> ;
    others: Hint<any>[] = [];

    constructor(
        birth: Date,
        death: Date | undefined,
        occupation: string,
        citizenship: string,
        initials: string,
        others: Hint<any>[]
    ){
        this.birth = new Hint<Date>("Birth", 1, birth, true);
        this.alive = (death === undefined);
        this.death = new Hint<Date>("Death", 1, death);
        this.occupation = new Hint<string>("Occupation", 1, occupation);
        this.citizenship = new Hint<string>("Citizenship", 1, citizenship);
        this.initials = new Hint<string>("Initials", 2, initials);
        this.others = others;
    }

    toList() : Hint<any>[]{
        return [this.birth, this.death, this.occupation, this.citizenship, this.initials, ...this.others];
    }


    //For testing purposes, will be removed
    toString() : string {
        let retVal : string = "";
        let list : Hint<any>[] = this.toList()
        for(let i = 0; i < list.length ; i++){
            let h = list[i];
            if(h.value != undefined) retVal += h.label + " : "  + h.value + "\n"
        }
        return retVal;
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
    private _value : T | undefined;
    private _revealed : boolean;
    private _label : string;

    constructor(label : string, level: number, value : T | undefined, revealed : boolean = false) {
        this._label = label;
        this._level = level;
        this._revealed = revealed;
        this._value = value;
    }

    get level() : number {
        return this._level;
    }
    get value(): T | undefined {
        return this._value;
    }

    get revealed() : boolean {
        return this._revealed;
    }

    get label() : string {
        return this._label;
    }
    reveal(){
        this._revealed = true;
    }
}
