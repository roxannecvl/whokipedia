/**
 * This interface represents a hint, with the following attributes.
 * `label` is the label of the hint.
 * `level` is the level of the hint (from 1 to 3).
 * `value` is the value of the hint
 * `revealed` tells us if the hint has been revealed yet.
 */
export interface Hint {
    readonly label: string,
    readonly level: number,
    readonly value: string,
    revealed: boolean
}

export function hintListFromObject(obj: {[key: string]:  string}): Hint[] {
    let compulsoryHints: Hint[] = [];
    let arbitraryHints: Hint[] = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (arbitraryLabels.hasOwnProperty(key)) {
            arbitraryHints.push({label: key, level: arbitraryLabels[key], value: value, revealed: false})
        } else if (compulsoryLabels.hasOwnProperty(key)) {
            compulsoryHints.push({label: key, level: compulsoryLabels[key], value: value, revealed: key === 'Born'})
        }
    })
    return [...compulsoryHints, ...arbitraryHints.slice(0, 2)]
}

export const compulsoryLabels: {[key: string]: number} = {
    'Born': 1,
    'Died': 1,
    'Status': 1,
    'Occupation': 1,
    'Citizenship': 1,
    'Initials': 3,
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
    'Years active': 2,
    'Known for': 3,
    'Notable work': 3,
    'Other names': 3
}