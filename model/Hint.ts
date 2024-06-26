/**
 * This interface represents a Hint for the game, and all its possible attributes.
 * Its purpose is to be extended with types that omit certain attributes.
 */
interface Hint {
    readonly label: string,
    readonly level: number,
    readonly value: string,
    readonly number: number,
    readonly url: string,
    revealed: boolean
}

/**
 * This type represents an infobox field. It contains attributes
 * `label`, `level`, `value` and `revealed`.
 */
export type InfoboxHint = Omit<Hint, 'number' | 'url'>

/**
 * This type represents an intro paragraph. It contains attributes
 * `level`, `value`, `number` and `revealed`.
 */
export type ParagraphHint = Omit<Hint, 'label' | 'url'>

/**
 * This type represents a level of blur for image. It contains attributes
 * `level`, `blur`, `url` and `revealed`.
 */
export type BlurHint = Omit<Hint, 'label' | 'value' | 'number'>

/**
 * This method creates an array of infobox field hints with these fields passed as an object.
 * @param obj - the infobox fields
 */
export function fieldsOf(obj: {[key: string]:  string}): InfoboxHint[] {
    let compulsoryFields: InfoboxHint[] = []
    let arbitraryFields: InfoboxHint[] = []
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
                revealed: false
            })
        }
    })
    return [...compulsoryFields, ...arbitraryFields.slice(0, 3)]
}

/**
 * This method creates an array of intro paragraph hints with these paragraphs passed as an array.
 * First paragraph has higher hint level than others.
 * @param arr - the intro paragraphs in order
 */
export function paragraphsOf(arr: string[]): ParagraphHint[] {
    let paragraphs: ParagraphHint[] = []
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

/**
 * This method creates an array of blur level hints with the image url passed as argument.
 * @param url - the image to blur url
 */
export async function imagesOf(url: string): Promise<BlurHint[]> {

    const urlBlur1: string = await $fetch('/api/blur-image', {
        method: 'POST',
        body: JSON.stringify({
            url: url,
            blur: 20
        })
    })

    const urlBlur2: string = await $fetch('/api/blur-image', {
        method: 'POST',
        body: JSON.stringify({
            url: url,
            blur: 8
        })
    })

    const urlBlur3: string = await $fetch('/api/blur-image', {
        method: 'POST',
        body: JSON.stringify({
            url: url,
            blur: 0
        })
    })

    return [{
            url: urlBlur1,
            level: 0,
            revealed: true
        }, {
            url: urlBlur2,
            level: 2,
            revealed: false
        }, {
            url: urlBlur3,
            level: 3,
            revealed: false
        }]
}

export const compulsoryLabels: {[key: string]: number} = {
    'Born': 1,
    'Occupation': 1,
    'Citizenship': 1,
    'Initials': 3,
}

const arbitraryLabels: {[key: string]: number} = {
    'Died': 1,
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