/**
 * This class represents a list of hints necessary for one game. It contains 6 hints, each of them being of type `Hint`.
 * The hints are the birthdate, the death date, the occupation, the citizenship, the initials and the first paragraph
 * of the Wikipedia page of the celebrity.
 */
export class HintList {
    birth: Hint<Date> ;
    ageOrDeath : Hint<Date | number> ;
    occupation : Hint<string> ;
    citizenship : Hint<string> ;
    initials : Hint<string> ;
    paragraph : Hint<string> ;

    constructor(
        birth: Date | undefined ,
        ageOrDeath: Date | number | undefined,
        occupation: string | undefined,
        citizenship: string | undefined,
        initials: string | undefined,
        paragraph: string | undefined
    ){
        this.birth = new Hint(1,  true, birth)
        this.ageOrDeath = new Hint(1, true, ageOrDeath);
        this.occupation = new Hint(1, true, occupation);
        this.citizenship = new Hint(1, true, citizenship);
        this.initials = new Hint(2, true, initials);
        this.paragraph = new Hint(2, true, paragraph);
    }

    toList() : Hint<any>[]{
        return [this.birth, this.ageOrDeath, this.occupation, this.citizenship, this.initials, this.paragraph] ;
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
