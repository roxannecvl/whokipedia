import {
    splitIntoEqualSentenceParts,
    removeNameOccurrences,
    getInitials,
    getAndPermutations,
    removeTag,
    months,
    countries
} from "~/utilities/Utils";
import { type InfoboxHint, type ParagraphHint, type BlurHint, fieldsOf, paragraphsOf, imagesOf } from "~/model/Hint"

/**
 * Fetch and return the introduction as plain text of the Wikipedia page of the given celebrity.
 * Uses the MediaWiki Action API.
 * @param celebrityName the name of the celebrity, must be first-capitalized
 * @return Promise<ParagraphHint[]> - the introduction of the Wikipedia page split in three equal parts as hints
 */
export async function fetchIntro(celebrityName: string): Promise<ParagraphHint[]> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: celebrityName,
        format: "json",
        prop: "extracts",
        exintro: "true",
        explaintext: "true",
        origin: "*"
    }

    const queryParams: string = new URLSearchParams(searchParams).toString()
    const url: string = BASE_URL + ENDPOINT + queryParams

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if ('query' in data && 'pages' in data.query) {
                const pages = data.query.pages
                const pageIds: string[] = Object.keys(pages)
                if (pageIds.length === 1 && pageIds[0] !== '-1') {
                    const pageId: number = Number.parseInt(pageIds[0])
                    let text: string = pages[pageId].extract.replace(/^[^.!?]+[.!?](?:\s|\n)?/, '') // Remove first sentence
                    let paragraphs: string[] = splitIntoEqualSentenceParts(text, NUM_PARAGRAPHS)
                    return paragraphsOf(paragraphs.map(text => removeNameOccurrences(text, celebrityName)) )
                }
            }
            throw new Error(`Page with title ${celebrityName} was not found.`)
        })
        .catch(error => {
            console.error('Error fetching introduction of Wikipedia page : ', error)
            throw error
        })
}

/**
 * Fetch and return the main picture of the Wikipedia page of the given celebrity, with different blur levels.
 * Uses the MediaWiki Action API.
 * @param celebrityName the name of the celebrity, must be first-capitalized
 * @param thumbSize the width in pixels of the wanted thumbnail
 * @return Promise<BlurHint> - an array of the main picture with different blur levels as hints
 */
export async function fetchImage(celebrityName: string, thumbSize: number): Promise<BlurHint[]> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: celebrityName,
        format: "json",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: thumbSize.toString(),
        origin: "*",
    };

    const queryParams: string = new URLSearchParams(searchParams).toString()
    const url: string = BASE_URL + ENDPOINT + queryParams

   return fetch(url)
       .then(response => response.json())
       .then(data => {
           if ('query' in data && 'pages' in data.query) {
               const pages = data.query.pages
               const pageIds: string[] = Object.keys(pages)
               if (pageIds.length === 1 && pageIds[0] !== '-1') {
                   const pageId: number = Number.parseInt(pageIds[0])
                   if ('thumbnail' in pages[pageId]) {
                       return imagesOf(pages[pageId].thumbnail.source)
                   }
               }
           }
           throw new Error(`Image for page with title ${celebrityName} was not found.`)
        })
       .catch(error => {
           console.error('Error fetching image URL of Wikipedia page : ', error)
           throw error
       })
}

/**
 * Fetch and return the infobox of the Wikipedia page of the given celebrity as list of Hint.
 * Uses the MediaWiki Action API.
 * @param celebrityName the name of the celebrity, must be first-capitalized
 * @return Promise<InfoboxHint[]> - the infobox as an array of hints
 */
export async function fetchInfoBox(celebrityName: string): Promise<InfoboxHint[]> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: celebrityName,
        format: "json",
        prop: "revisions",
        rvprop: "content",
        rvsection: "0",
        origin: "*"
    };

    const queryParams: string = new URLSearchParams(searchParams).toString()
    const url: string = BASE_URL + ENDPOINT + queryParams

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if ('query' in data && 'pages' in data.query) {
                let pages = data.query.pages
                let wikitext: string = ""
                for (const key in pages) {
                    if (pages.hasOwnProperty(key)) {
                        wikitext = wikitext.concat(pages[key].revisions[0]["*"])
                    }
                }
                return fieldsOf({Initials: getInitials(celebrityName), ...parseWikitext(wikitext)})
            }
            throw new Error(`Infobox for page ${celebrityName} was not found.`)
        })
        .catch(error => {
            console.error(`Error fetching infobox of Wikipedia page : `, error)
            throw error
        })
}

/**
 * Private function to parse the wikitext of the first section of a Wikipedia page.
 * It returns an object containing all fields of the infobox.
 * @param wikitext the wikitext of the first section of a Wikipedia page
 */
function parseWikitext(wikitext: string): {[key: string]: string} {

    // Remove introduction after infobox
    wikitext = wikitext.slice(0, wikitext.toUpperCase().indexOf("'''"));

    // Remove comments and remaining tags
    wikitext = removeTag(wikitext, "<!--", "-->");
    wikitext = removeTag(wikitext, "<ref", "/>");
    wikitext = removeTag(wikitext, "<ref", "</ref>");

    let hints: {[key: string]: string } = {}

    // Birthdate
    let match = fieldMatchers.birthDate.exec(wikitext)
    if (match) {
        const [, birthYear, birthMonth, birthDay] = match;
        hints["Born"] = `${birthDay} ${months[parseInt(birthMonth)]} ${birthYear}`;
    }

    // Death date
    match = fieldMatchers.deathDate.exec(wikitext)
    if (match) {
        const [, deathYear, deathMonth, deathDay] = match;
        hints["Died"] = `${deathDay} ${months[parseInt(deathMonth)]} ${deathYear}`;
    }

    // Description
    match = fieldMatchers.description.exec(wikitext);
    let description: string | undefined = match ? match[1] : undefined;
    if (description) {
        const {citizenship, occupation} = parseDescription(description)
        if (citizenship !== undefined) hints["Citizenship"] = citizenship
        if (occupation !== undefined) hints["Occupation"] = occupation;
    }

    // Spouses
    let spouses: string[] | undefined = undefined
    while ((match = fieldMatchers.spouses.exec(wikitext)) !== null) {
        spouses = spouses ? [...spouses, match[1]] : [match[1]];
        hints["Spouses"] = spouses.join(', ')
    }

    // Genres
    match = fieldMatchers.genres.exec(wikitext);
    if (match){
        let genre: string = match[0]
        let genres: string[] | undefined = undefined
        while ((match = fieldMatchers.lists.exec(genre)) !== null) {
            genres = genres ?
                [...genres, match[1].split('|')[0].trim()] :
                [match[1].split('|')[0].trim()]
            hints["Genres"] = genres.join(', ')
        }
    }

    return hints
}

function parseDescription(description : string): {citizenship: string | undefined, occupation: string | undefined} {

    let res: {citizenship: string | undefined, occupation: string | undefined} = {
        citizenship: undefined,
        occupation: undefined
    }

    // Check if nationality or country is contained in the description
    for (const country in countries) {
        const nationality: string = countries[country];
        let copy: string = description
        while (copy.includes(nationality) || copy.includes(country)) {
            res.citizenship = res.citizenship !== undefined ? res.citizenship + " and " + nationality : nationality
            copy = copy.replace(nationality, "").replace(country, "")
        }
    }

    // Check if description matches a known occupation
    for (const possibleOccupation in occupationMatchers){
        const matcher: RegExp = occupationMatchers[possibleOccupation];
        if(description.match(matcher)){
            res.occupation = possibleOccupation;
            return res
        }
    }

    // If no occupation was found, occupation is description without citizenship
    res.occupation = description
    for (const permutation of getAndPermutations(res.citizenship || "")){
        res.occupation = res.occupation.replace(permutation, "").trim()
    }

    // Handle the `-born`case (i.e. Albert Einstein)
    if (res.citizenship &&
        description.includes("-born") &&
        (description.indexOf("-born") - description.indexOf(res.citizenship) === res.citizenship.length)) {
        res.citizenship = res.citizenship + '-born'
        res.occupation = res.occupation.replace("-born", "").trim()
    }

    return res
}


const BASE_URL: string = "https://en.wikipedia.org"
const ENDPOINT: string = "/w/api.php?"
const NUM_PARAGRAPHS: number = 3
const fieldMatchers: {[key: string]: RegExp} = {
    description: /{{short description\|([^(){}]*)(?=[(){}])/i,
    birthDate: /\{\{Birth date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    deathDate: /\{\{Death date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    spouses: /\{\{marriage\|\[\[([^|\]]+)]]/gi,
    genres: /\| genre\s*=\s*\{\{(?:flat|h)list\|(?:\n?\*?\s*\[\[([^\]]*)]]\|?)*/gi,
    lists: /\[\[([^\]]+)]]/gi
}
const occupationMatchers: {[key: string]: RegExp} = {
    "Member of the royal family": /(heir\s*apparent\s*to\s*the\s*(\w+)\s*throne)|(Queen of)|(royal)/i,
    "Politician": /^\w+\sof\s\w+(?:\s\w+)*\s(?:from\s\d{4}\sto\s\d{4}|since\s\d{4})$/i,
    "Activist": /\bactivist\b/i,
    "Musician": /\bmusician\b/i
}