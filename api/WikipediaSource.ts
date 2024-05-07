import { splitIntoEqualSentenceParts, getInitials } from "~/utilities/Utils"
import { type InfoboxHint, type ParagraphHint, type BlurHint, fieldsOf, paragraphsOf, imagesOf } from "~/model/Hint"
import { extractInfoboxFromWikitext } from "~/api/Parsing"

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
                    let paragraphs: string[] = splitIntoEqualSentenceParts(pages[pageId].extract, NUM_PARAGRAPHS)
                    return paragraphsOf(paragraphs)
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
    }

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
                return fieldsOf({Initials: getInitials(celebrityName), ...extractInfoboxFromWikitext(wikitext)})
            }
            throw new Error(`Infobox for page ${celebrityName} was not found.`)
        })
        .catch(error => {
            console.error(`Error fetching infobox of Wikipedia page : `, error)
            throw error
        })
}

const BASE_URL: string = "https://en.wikipedia.org"
const ENDPOINT: string = "/w/api.php?"
const NUM_PARAGRAPHS: number = 3