import parse from 'infobox-parser'
import {options} from "kolorist";

const BASE_URL: string = "https://en.wikipedia.org"
const ENDPOINT: string = "/w/api.php?"


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
        action: "parse",
        page: pageTitle,
        format: "json",
        prop: "wikitext",
        section: "0",
        origin: "*"
    };

    const queryParams: string = new URLSearchParams(searchParams).toString()
    const url: string = BASE_URL + ENDPOINT + queryParams

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if ('parse' in data && 'wikitext' in data.parse) {
                const wikitext: string = data.parse.wikitext["*"]
                return parse(wikitext, {simplifyDataValues: false}).general
            }
            throw new Error(`Infobox for page ${pageTitle} was not found.`)
        })
        .catch(error => console.error(`Error fetching infobox of Wikipedia page : `, error))
}
