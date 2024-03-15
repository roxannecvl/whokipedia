

export class HintList {
    birth: Hint<Date> = new Hint(1,  true);
    death : Hint<Date> = new Hint(1);
    occupation : Hint<string>= new Hint(1);
    citizenship : Hint<string> = new Hint(1);
    initials : Hint<string> = new Hint(2);
    paragraph1 : Hint<string> = new Hint (2);

    toList() : Hint<any>[]{
        return [this.birth, this.death, this.occupation, this.citizenship, this.initials, this.paragraph1] ;
    }

}


/**
 * this class represents a hint, the value being the core of the hint
 * revealed tells us if the hint has been revealed yet while level gives us
 * the level corresponding to the hint (1 being a small hint and 3 a huge hint)
 */
export class Hint <T> {
    private _level : number;
    private _value : T | null = null;
    private _revealed : boolean;

    constructor(level: number, revealed : boolean = false ) {
        this._level = level;
        this._revealed = revealed;
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
