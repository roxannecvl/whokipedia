import { parseWikitext, splitIntoEqualSentenceParts, removeNameOccurrences, getInitials } from "~/api/Parsing";
import { type Hint, hintListFromObject } from "~/model/Hint"

/**
 * Fetch and return the introduction as plain text of the Wikipedia page of the given celebrity.
 * Uses the MediaWiki Action API.
 * @param celebrityName the name of the celebrity, must be first-capitalized
 * @return Promise<string[]> - the introduction of the Wikipedia page as plain text, split in three equal parts
 */
export async function fetchIntro(celebrityName: string): Promise<string[]> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: celebrityName,
        format: "json",
        prop: "extracts",
        exintro: "true",
        explaintext: "true",
        origin: "*"
    }

    const queryParams: string = new URLSearchParams(searchParams).toString();
    const url: string = BASE_URL + ENDPOINT + queryParams;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if ('query' in data && 'pages' in data.query) {
                const pages = data.query.pages;
                const pageIds: string[] = Object.keys(pages);
                if (pageIds.length === 1 && pageIds[0] !== '-1') {
                    const pageId: number = Number.parseInt(pageIds[0]);
                    let text: string = pages[pageId].extract.replace(/^[^.!?]+[.!?](?:\s|\n)?/, ''); // Remove first sentence
                    let texts: string[] = splitIntoEqualSentenceParts(text, 3);
                    return texts.map(text => removeNameOccurrences(text, celebrityName)); // Remove name occurrences
                }
            }
            throw new Error(`Page with title ${celebrityName} was not found.`);
        })
        .catch(error => {
            console.error('Error fetching introduction of Wikipedia page : ', error);
            throw error;
        })
}

/**
 * Fetch and return the source URL of the main picture of the Wikipedia page of the given celebrity;
 * Uses the MediaWiki Action API.
 * @param celebrityName the name of the celebrity, must be first-capitalized
 * @param thumbSize the width in pixels of the wanted thumbnail
 * @return Promise<string> - the URL of the main image of the Wikipedia page
 */
export async function fetchImageUrl(celebrityName: string, thumbSize: number): Promise<string> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: celebrityName,
        format: "json",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: thumbSize.toString(),
        origin: "*",
    };

    const queryParams: string = new URLSearchParams(searchParams).toString();
    const url: string = BASE_URL + ENDPOINT + queryParams;

   return fetch(url)
       .then(response => response.json())
       .then(data => {
           if ('query' in data && 'pages' in data.query) {
               const pages = data.query.pages;
               const pageIds: string[] = Object.keys(pages);
               if (pageIds.length === 1 && pageIds[0] !== '-1') {
                   const pageId: number = Number.parseInt(pageIds[0]);
                   if ('thumbnail' in pages[pageId]) {
                       return pages[pageId].thumbnail.source;
                   }
               }
           }
           throw new Error(`Image for epage with title ${celebrityName} was not found.`);
        })
       .catch(error => {
           console.error('Error fetching image URL of Wikipedia page : ', error);
           throw error;
       })
}

/**
 * Fetch and return the infobox of the Wikipedia page of the given celebrity as list of Hint.
 * Uses the MediaWiki Action API.
 * @param celebrityName the name of the celebrity, must be first-capitalized
 * @return Promise<Hint[]> - the infobox as a list of Hint
 */
export async function fetchInfoBox(celebrityName: string): Promise<Hint[]> {
    const searchParams: Record<string, string> = {
        action: "query",
        titles: celebrityName,
        format: "json",
        prop: "revisions",
        rvprop: "content",
        rvsection: "0",
        origin: "*"
    };

    const queryParams: string = new URLSearchParams(searchParams).toString();
    const url: string = BASE_URL + ENDPOINT + queryParams;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if ('query' in data && 'pages' in data.query) {
                let pages = data.query.pages;
                let wikitext: string = "";
                for (const key in pages) {
                    if (pages.hasOwnProperty(key)) {
                        wikitext = wikitext.concat(pages[key].revisions[0]["*"]);
                    }
                }
                return hintListFromObject({Initials: getInitials(celebrityName), ...parseWikitext(wikitext)});
            }
            throw new Error(`Infobox for page ${celebrityName} was not found.`)
        })
        .catch(error => {
            console.error(`Error fetching infobox of Wikipedia page : `, error);
            throw error;
        })
}




const BASE_URL: string = "https://en.wikipedia.org";
const ENDPOINT: string = "/w/api.php?";
const fieldMatchers: {[key: string]: RegExp} = {
    description: /{{short description\|([^(){}]*)(?=[(){}])/i,
    birthDate: /\{\{Birth date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    deathDate: /\{\{Death date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    spouses: /\{\{marriage\|\[\[([^|\]]+)]]/gi,
    genres: /\| genre\s*=\s*\{\{(?:flat|h)list\|(?:\n?\*?\s*\[\[([^\]]*)]]\|?)*/gi,
    lists: /\[\[([^\]]+)]]/gi
};
const occupationMatchers: {[key: string]: RegExp} = {
    "Member of the royal family": /(heir\s*apparent\s*to\s*the\s*(\w+)\s*throne)|(Queen of)|(royal)/i,
    "Politician": /^\w+\sof\s\w+(?:\s\w+)*\s(?:from\s\d{4}\sto\s\d{4}|since\s\d{4})$/i,
    "Activist": /\bactivist\b/i,
    "Musician": /\bmusician\b/i
};