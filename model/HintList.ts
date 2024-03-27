const compulsoryLabels: {[key: string]: number} = {
    'Born': 1,
    'Died': 1,
    'Occupation': 1,
    'Citizenship': 1,
    'Initials': 2,
}

const arbitraryLabels: {[key: string]: number} = {
    'Spouses': 2,
    'Genres': 2,
    'Political party': 2,
    'Instruments': 2,
    'Education': 2,
    'Awards': 2,
    'Honours': 2,
    'Television': 2,
    'Partners': 2,
    'Title': 2,
    'Children': 2,
    'Years active': 2
}

/**
 * This class represents a list of hints necessary for one game. It contains 6 hints, each of them being of type `Hint`.
 * The hints are the birthdate, the death date, the occupation, the citizenship, the initials and the first paragraph
 * of the Wikipedia page of the celebrity.
 */
export class HintList {

    static fromObject(obj: {[key: string]:  string}): HintList {
        let compulsoryHints: Hint[] = [];
        let arbitraryHints: Hint[] = [];
        Object.entries(obj).forEach(([key, value]) => {
            if(arbitraryLabels.hasOwnProperty(key)) {
                arbitraryHints.push(new Hint(key, arbitraryLabels[key], value))
            } else if (compulsoryLabels.hasOwnProperty(key)) {
                compulsoryHints.push(new Hint(key, compulsoryLabels[key], value))
            }
        })
        return new HintList([...compulsoryHints, ...arbitraryHints.slice(0, 2)]);
    }

    hints: Hint[] = [];

    constructor(hints: Hint[]) {
        this.hints = hints;
    }

    toList() : Hint[] {
        return [...this.hints];
    }
}

/**
 * This class represents a hint, with its value and additional information. Attributes are the following :
 * `revealed` tells us if the hint has been revealed yet, `level` gives us the level corresponding to the
 * hint (from 1 to 3) and `value` is the value of the hint (can be of any type).
 * @param T - the type of the value of the hint
 */
export class Hint {
    private readonly _level : number;
    private readonly _value : string;
    private _revealed : boolean;
    private readonly _label : string;

    constructor(label : string, level: number, value: string, revealed : boolean = false) {
        this._label = label;
        this._level = level;
        this._revealed = revealed;
        this._value = value;
    }

    get level() : number {
        return this._level;
    }
    get value(): string {
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
