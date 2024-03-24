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

    let wikitextEndIndex: number = wikitext.toUpperCase().indexOf("'''");
    wikitext = wikitext.slice(0, wikitextEndIndex);

    let alive: boolean | undefined = true
    let description: string | undefined
    let birthDate: Date | undefined = undefined
    let deathDate: Date | undefined = undefined
    let citizenship : string | undefined = undefined
    let occupation : string | undefined = undefined
    let spouses : string[] | undefined = undefined
    let genres : string [] | undefined = undefined

    // Description
    let match = wikitext.match(matchers.description);
    description = match ? match[1] : undefined;
    if(description == undefined) console.log(wikitext);
    else{
        let occAndCiti = seperateDescription(description);
        citizenship = occAndCiti.citizenship;
        occupation = occAndCiti.occupation;
    }

    // Birthdate
    match = wikitext.match(matchers.birthDate);
    if (match) {
        const [, birthYear, birthMonth, birthDay] = match;
        birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
    }

    // Death date
    match = wikitext.match(matchers.deathDate);
    if (match) {
        alive = false;
        const [, deathYear, deathMonth, deathDay] = match;
        deathDate = new Date(parseInt(deathYear), parseInt(deathMonth) - 1, parseInt(deathDay));
    }

    //spouses
    while ((match = matchers.spouses.exec(wikitext)) !== null) {
        if(spouses == undefined) spouses = [match[1]];
        else spouses = [...spouses, match[1]];
    }

    //genres
    match = wikitext.match(matchers.genres);
    if(!match) match = wikitext.match(matchers.genresV2);
    if (match){
        let allGenres : string = match[1];
        while((match = matchers.flatList.exec(allGenres)) !=null){
            if(genres == undefined) genres = [match[1]];
            else genres = [...genres, match[1]]
        }
    }


    return {
        birthDate: birthDate,
        deathDate: deathDate,
        alive: alive,
        occupation : occupation,
        citizenship : citizenship,
        spouses :  spouses,
        genres : genres,
    }
}

const matchers = {
    description: /{{short description\|([^(){}]*)(?=[(){}])/i,
    birthDate: /\{\{Birth date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    deathDate: /\{\{Death date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    spouses: /\{\{marriage\|\[\[([^|\]]+)]]/gi,
    genres: /genre\s*=\s*{{flatlist\|((?:.*?\n*)+?)}}/i,
    genresV2 : /genre\s*=\s*(?:<!--.*?-->)?{{hlist\|((?:.*?\|)*.*?)}}/i,
    flatList: /\[\[([^|\]]+)(?:\|[^|\]]+)?\]\]/g,
}

function seperateDescription(description : string){
    let occupation_index = description.length -1;
    while(!(description.charCodeAt(occupation_index) >= 65 && description.charCodeAt(occupation_index) <= 90)) {
        occupation_index--;
    }
    occupation_index += description.substring(occupation_index, description.length).indexOf(" ");
    let occupation = description.substring(occupation_index + 1);
    let citizenship = description.substring(0, occupation_index);

    //Handle exceptions
    if(citizenship.search("President of France") != -1){
        citizenship = "French";
        occupation = "politician";
    }else if(citizenship.search("President of South Africa ") != -1){
        citizenship = "South African";
        occupation = "politician";
    }else if(citizenship.search("Pakistani education activist") != -1){
        citizenship = "Pakistani";
        occupation = "education activist";
    }else if(citizenship.search("the British") != -1 || citizenship.search("the United Kingdom") != -1) {
        citizenship = "British";
        occupation = "member of the British royal family";
    }else if(citizenship.search("of Queen") != -1 || citizenship.search("the Beatles") != -1 ){
        citizenship = "British";
        occupation = "musician";
    }else if(citizenship.search("President of the United States") != -1){
        citizenship = "American";
        occupation = "politician";
    }else if(citizenship.search("Chancellor of Germany") != -1){
        citizenship = "German";
        occupation = "politician";
    }

    return {
        citizenship : citizenship,
        occupation: occupation
    };

}
