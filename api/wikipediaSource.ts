import {Util} from "@google-cloud/storage/build/src/nodejs-common/util";

const BASE_URL: string = "https://en.wikipedia.org"
const ENDPOINT: string = "/w/api.php?"

import { Utils } from "~/utilities/Utils";

/**
 * Fetch and return the introduction as plain text of the given Wikipedia page.
 * Uses the MediaWiki Action API.
 * @param pageTitle the title of the Wikipedia page, must be first-capitalized
 * words (except for name particles) separated by '_', for instance "Leonardo_da_Vinci"
 * @return Promise<string> - the introduction of the Wikipedia page as plain text
 */
export async function fetchIntro(pageTitle: string): Promise<any> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: pageTitle,
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
                    return pages[pageId].extract
                }
            }
            throw new Error(`Page with title ${pageTitle} was not found.`)
        })
        .catch(error => console.error('Error fetching introduction of Wikipedia page : ', error))
}

/**
 * Fetch and return the source URL of the main picture of the given Wikipedia page.
 * Uses the MediaWiki Action API.
 * @param pageTitle the title of the Wikipedia page, must be first-capitalized
 * words (except for name particles) separated by '_', for instance "Leonardo_da_Vinci"
 * @param thumbSize the width in pixels of the wanted thumbnail
 * @return Promise<string> - the URL of the main image of the Wikipedia page
 */
export async function fetchImageUrl(pageTitle: string, thumbSize: number): Promise<any> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: pageTitle,
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
                       return pages[pageId].thumbnail.source
                   }
               }
           }
           throw new Error(`Image for epage with title ${pageTitle} was not found.`)
        })
       .catch(error => console.error('Error fetching image URL of Wikipedia page : ', error))
}

/**
 * Fetch and return the infobox of the given Wikipedia page as an object.
 * Uses the MediaWiki Action API and the external library 'infobox-parser'.
 * @param pageTitle the title of the Wikipedia page, must be first-capitalized
 * words (except for name particles) separated by '_', for instance "Leonardo_da_Vinci"
 * @return Promise<Object> - the infobox as a JSON object
 */
export async function fetchInfoBox(pageTitle: string): Promise<any> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: pageTitle,
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
                return parseWikitext(wikitext)
            }
            throw new Error(`Infobox for page ${pageTitle} was not found.`)
        })
        .catch(error => console.error(`Error fetching infobox of Wikipedia page : `, error))
}

/**
 * Private function to parse the wikitext of the first section of a Wikipedia page.
 * It returns an object containing all fields of the infobox.
 * @param wikitext the wikitext of the first section of a Wikipedia page
 */
function parseWikitext(wikitext: string): any {

    // Remove introduction after infobox
    wikitext = wikitext.slice(0, wikitext.toUpperCase().indexOf("'''"));

    // Remove comments and remaining tags
    wikitext = Utils.removeTag(wikitext, "<!--", "-->");
    wikitext = Utils.removeTag(wikitext, "<ref", "/>");
    wikitext = Utils.removeTag(wikitext, "<ref", "</ref>");

    let alive: boolean | undefined = true
    let description: string | undefined
    let birthDate: Date | undefined = undefined
    let deathDate: Date | undefined = undefined
    let citizenship : string | undefined = undefined
    let occupation : string | undefined = undefined
    let spouses : string[] | undefined = undefined
    let genres : string [] | undefined = undefined

    // Description
    let match = fieldMatchers.description.exec(wikitext);
    description = match ? match[1] : undefined;
    if (description) {
        ({citizenship, occupation} = parseDescription(description));
    }

    // Birthdate
    match = fieldMatchers.birthDate.exec(wikitext)
    if (match) {
        const [, birthYear, birthMonth, birthDay] = match;
        birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
    }

    // Death date
    match = fieldMatchers.deathDate.exec(wikitext)
    if (match) {
        alive = false;
        const [, deathYear, deathMonth, deathDay] = match;
        deathDate = new Date(parseInt(deathYear), parseInt(deathMonth) - 1, parseInt(deathDay));
    }

    // Spouses
    while ((match = fieldMatchers.spouses.exec(wikitext)) !== null) {
        spouses = spouses ? [...spouses, match[1]] : [match[1]];
    }

    // Genres
    match = fieldMatchers.genres.exec(wikitext);
    if (match){
        let genre: string = match[0]
        while ((match = fieldMatchers.lists.exec(genre)) !== null) {
            genres = genres ?
                [...genres, match[1].split('|')[0].trim()] :
                [match[1].split('|')[0].trim()]
        }
    }

    console.log(occupation)
    console.log(citizenship)
}

function parseDescription(description : string): {citizenship: string | undefined, occupation: string | undefined} {

    let res: {citizenship: string | undefined, occupation: string | undefined} = {
        citizenship: undefined,
        occupation: undefined
    }

    // Check if nationality or country is contained in the description
    for (const country in Utils.countries) {
        const nationality: string = Utils.countries[country];
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
    for (const permutation of Utils.getAndPermutations(res.citizenship || "")){
        res.occupation = res.occupation.replace(permutation, "").trim()
    }

    return res
}


const fieldMatchers: {[key: string]: RegExp} = {
    description: /{{short description\|([^(){}]*)(?=[(){}])/i,
    birthDate: /\{\{Birth date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    deathDate: /\{\{Death date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    spouses: /\{\{marriage\|\[\[([^|\]]+)]]/gi,
    genres: /\| genre\s*=\s*\{\{(?:flat|h)list\|(?:\n?\*?\s*\[\[([^\]]*)]]\|?)*/gi,
    lists: /\[\[([^\]]+)]]/gi
}

const occupationMatchers: {[key: string]: RegExp} = {
    "politician": /^\w+\sof\s\w+(?:\s\w+)*\s(?:from\s\d{4}\sto\s\d{4}|since\s\d{4})$/i,
    "member of the royal family": /(heir\s*apparent\s*to\s*the\s*(\w+)\s*throne)/i,
    "activist": /\bactivist\b/i,
    "musician": /\bmusician\b/i
}