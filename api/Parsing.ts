import { removeTag, getAndPermutations, countries, months } from "~/utilities/Utils";

/**
 * Function to parse the wikitext of the first section of a Wikipedia page.
 * @param wikitext the wikitext of the first section of a Wikipedia page
 * @return {[key: string]: string} - an object containing all fields of the infobox
 */
export function extractInfoboxFromWikitext(wikitext: string): {[key: string]: string} {

    // Remove introduction after infobox
    wikitext = wikitext.slice(0, wikitext.toUpperCase().indexOf("'''"));

    // Remove comments and remaining tags
    wikitext = removeTag(wikitext, "<!--", "-->");
    wikitext = removeTag(wikitext, "<ref", "</ref>", "/>");

    if(wikitext.includes("known")){
        console.log(wikitext)
    }

    let hints: {[key: string]: string } = {};

    // Birthdate
    let match = fieldMatchers.birthDate.exec(wikitext);
    if (match) {
        const [, birthYear, birthMonth, birthDay] = match;
        hints["Born"] = `${birthDay} ${months[parseInt(birthMonth)]} ${birthYear}`;
    }

    // Death date
    match = fieldMatchers.deathDate.exec(wikitext);
    if (match) {
        const [, deathYear, deathMonth, deathDay] = match;
        hints["Died"] = `${deathDay} ${months[parseInt(deathMonth)]} ${deathYear}`;
    } else {
        hints["Status"] = "Alive";
    }

    // Description
    match = fieldMatchers.description.exec(wikitext);
    let description: string | undefined = match ? match[1] : undefined;
    if (description) {
        const {citizenship, occupation} = extractInfoFromDescription(description);
        if (citizenship !== undefined) hints["Citizenship"] = citizenship;
        if (occupation !== undefined) hints["Occupation"] = occupation;
    }

    // Spouses
    let spouses: string[] | undefined = undefined;
    while ((match = fieldMatchers.spouses.exec(wikitext)) !== null) {
        spouses = spouses ? [...spouses, match[1]] : [match[1]];
        hints["Spouses"] = spouses.join(', ');
    }

    // Genres
    match = fieldMatchers.genres.exec(wikitext);
    if (match) {
        hints["Genres"] = extractFromList(match);
    }

    // Instruments
    match = fieldMatchers.instruments.exec(wikitext);
    if (match) {
        hints["Instruments"] = extractFromList(match);
    }

    return hints;
}


/**
 * Private function to parse the description of a wikitext and extract citizenship and occupation.
 * @param description the description part of a wikitext
 * @return {citizenship: string | undefined, occupation: string | undefined} - citizenship and occupation as an object
 */
function extractInfoFromDescription(description : string): {
    citizenship: string | undefined,
    occupation: string | undefined
} {

    let res: {citizenship: string | undefined, occupation: string | undefined} = {
        citizenship: undefined,
        occupation: undefined
    };

    // Check if nationality or country is contained in the description
    for (const country in countries) {
        const nationality: string = countries[country];
        let copy: string = description;
        while (copy.includes(nationality) || copy.includes(country)) {
            res.citizenship = res.citizenship !== undefined ? res.citizenship + " and " + nationality : nationality;
            copy = copy.replace(nationality, "").replace(country, "");
        }
    }

    // Check if description matches a known occupation
    for (const possibleOccupation in occupationMatchers){
        const matcher: RegExp = occupationMatchers[possibleOccupation];
        if(description.match(matcher)){
            res.occupation = possibleOccupation;
            return res;
        }
    }

    // If no occupation was found, occupation is description without citizenship
    res.occupation = description;
    for (const permutation of getAndPermutations(res.citizenship || "")){
        res.occupation = res.occupation.replace(permutation, "").trim();
    }

    // Handle the `-born`case (i.e. Albert Einstein)
    if (res.citizenship &&
        description.includes("-born") &&
        (description.indexOf("-born") - description.indexOf(res.citizenship) === res.citizenship.length)) {
        res.citizenship = res.citizenship + '-born';
        res.occupation = res.occupation.replace("-born", "").trim();
    }

    return res
}

/**
 * Private function to extract elements from a wikitext list, which has the following syntax.
 *
 * {{plainlist|
 * * [[first item]]
 * * [[second item]]
 * * [[third item]]
 * }} OR {{hlist|first item|second item|third item|...}}
 * @param match - The regex matching array containing a wikitext list to parse
 */
function extractFromList(match : RegExpExecArray | null): string {
    match = match!
    let text: string = match[0];
    let array: string[] = [];
    while ((match = fieldMatchers.lists.exec(text)) !== null) {

        // Extract the content from the matched item
        const content = match[1] || match[2];
        const cleanContent = content.split('|')[0]
                                           .replace("[[", "")
                                           .replace("]]", "")
                                           .trim()
        array.push(cleanContent);
    }
    return array.join(", ");
}

const fieldMatchers: {[key: string]: RegExp} = {
    description: /{{short description\|([^(){}]*)(?=[(){}])/i,
    birthDate: /\{\{Birth date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    deathDate: /\{\{Death date(?: and age)?(?:\|df=yes|\|mf=yes|\|df=y|\|mf=y)?\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
    spouses: /\{\{marriage\|\[\[([^|\]]+)]]/gi,
    genres: /\| genre\s*=\s*\{\{(?:flat|h)list\|(?:\n?\*?\s*\[\[([^\]]*)]]\|?)*/gi,
    instruments: /\|\s*instruments\s*=\s*\{\{\s*(?:flat|h)list\s*\|\s*(?:\n?\*?\s*\[\[([^\]]*)]]\|?|\n?\*\s*([^\n]*)\n*)*\s*/gi,
    lists: /\[\[([^[\]]+)]]|\*\s*([^\n]+)/gi,
};
const occupationMatchers: {[key: string]: RegExp} = {
    "Member of the royal family": /(heir\s*apparent\s*to\s*the\s*(\w+)\s*throne)|(Queen of)|(royal)/i,
    "Politician": /^[\w\s]+of[\w\s]+(?:from\s\d{4}\sto\s\d{4}|since\s\d{4})$/i,
    "Activist": /\bactivist\b/i,
    "Musician": /\bmusician\b/i
};