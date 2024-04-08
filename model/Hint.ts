/**
 * This interface represents an infobox field, with the following attributes.
 * `label` is the label of the field,
 * `level` is the level of this hint (from 1 to 3),
 * `value` is the value of the field,
 * `revealed` tells us if the hint has been revealed yet.
 */
export interface InfoboxField {
    readonly label: string,
    readonly level: number,
    readonly value: string,
    revealed: boolean
}

/**
 * This interface represents a paragraph of the introduction, with the following attributes.
 * `number` is the position of the paragraph within intro,
 * `level` is the level of this hint (from 1 to 3),
 * `value` is the content of the paragraph,
 * `revealed` tells us if the hint has been revealed yet.
 */
export interface IntroParagraph {
    readonly number: number,
    readonly level: number,
    readonly value: string,
    revealed: boolean
}

/**
 * This interface represents a blurred image as a hint, with the following attributes.
 * `value` is the blur intensity,
 * `level` is the level of this hint (from 1 to 3),
 * `revealed` tells us if the hint has been revealed yet.
 */
export interface BlurredImage {
    readonly url: string
    readonly level: number
    readonly blur: number,
    revealed: boolean
}

export function fieldsOf(obj: {[key: string]:  string}): InfoboxField[] {
    let compulsoryFields: InfoboxField[] = [];
    let arbitraryFields: InfoboxField[] = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (arbitraryLabels.hasOwnProperty(key)) {
            arbitraryFields.push({
                label: key,
                level: arbitraryLabels[key],
                value: value,
                revealed: false
            })
        } else if (compulsoryLabels.hasOwnProperty(key)) {
            compulsoryFields.push({
                label: key,
                level: compulsoryLabels[key],
                value: value,
                revealed: key === 'Born'
            })
        }
    })
    return [...compulsoryFields, ...arbitraryFields.slice(0, 2)]
}

export function paragraphsOf(arr: string[]): IntroParagraph[] {
    let paragraphs: IntroParagraph[] = [];
    paragraphs.push({
        number: 1,
        level: 3,
        value: arr[0],
        revealed: false
    })
    for (let [index, paragraph] of arr.slice(1).entries()) {
        paragraphs.push({
            number: index + 2,
            level: 2,
            value: paragraph,
            revealed: false
        })
    }
    return paragraphs
}

export function imagesOf(url: string): BlurredImage[] {
    return [
        {
            url: url,
            level: 0,
            blur: 4,
            revealed: true
        },
        {
            url: url,
            level: 2,
            blur: 2,
            revealed: false
        },
        {
            url: url,
            level: 3,
            blur: 0,
            revealed: false
        },
    ]
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