const compulsoryLabels: {[key: string]: number} = {
    'birthDate': 1,
    'deathDate': 1,
    'occupation': 1,
    'citizenship': 1,
    'initials': 2,
}

const arbitraryLabels: {[key: string]: number} = {
    'spouses': 2,
    'genres': 2,
    'politicalParty': 2,
    'instruments': 2,
    'education': 2,
    'awards': 2,
    'honours': 2,
    'television': 2,
    'partners': 2,
    'title': 2,
    'children': 2,
    'yearsActive': 2
}

/**
 * This class represents a list of hints necessary for one game. It contains 6 hints, each of them being of type `Hint`.
 * The hints are the birthdate, the death date, the occupation, the citizenship, the initials and the first paragraph
 * of the Wikipedia page of the celebrity.
 */
export class HintList {

    static fromObject(obj: {[key: string]:  string}): HintList {
        let compulsoryHints: Hint<any>[] = [];
        let arbitraryHints: Hint<any>[] = [];
        Object.entries(obj).forEach(([key, value]) => {
            if(arbitraryLabels.hasOwnProperty(key)) {
                arbitraryHints.push(new Hint(key, arbitraryLabels[key], value, ))
            } else if (compulsoryLabels.hasOwnProperty(key)) {
                compulsoryHints.push(new Hint(key, compulsoryLabels[key], value))
            }
        })
        return new HintList([...compulsoryHints, ...arbitraryHints.slice(0, 2)]);
    }

    hints: Hint<any>[] = [];

    constructor(hints: Hint<any>[]) {
        this.hints = hints;
    }

    toList() : Hint<any>[] {
        return [...this.hints];
    }
}

/**
 * This class represents a hint, with its value and additional information. Attributes are the following :
 * `revealed` tells us if the hint has been revealed yet, `level` gives us the level corresponding to the
 * hint (from 1 to 3) and `value` is the value of the hint (can be of any type).
 * @param T - the type of the value of the hint
 */
export class Hint <T> {
    private readonly _level : number;
    private readonly _value : T | undefined;
    private _revealed : boolean;
    private readonly _label : string;

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
