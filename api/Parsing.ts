import { capitalize, months, countries } from "~/utilities/Utils";

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
    "Politician": /^\w+\sof\s\w+(?:\s\w+)*\s(?:from\s\d{4}\sto\s\d{4}|since\s\d{4})$/i,
    "Activist": /\bactivist\b/i,
    "Musician": /\bmusician\b/i
};


/**
 * Function to parse the wikitext of the first section of a Wikipedia page.
 * It returns an object containing all fields of the infobox.
 * @param wikitext the wikitext of the first section of a Wikipedia page
 */
export function parseWikitext(wikitext: string): {[key: string]: string} {
    // Remove introduction after infobox
    wikitext = wikitext.slice(0, wikitext.toUpperCase().indexOf("'''"));

    // Remove comments and remaining tags
    wikitext = removeTag(wikitext, "<!--", "-->");
    wikitext = removeTag(wikitext, "<ref", "</ref>", "/>");

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
    }else {
        hints["Status"] = "Alive";
    }

    // Description
    match = fieldMatchers.description.exec(wikitext);
    let description: string | undefined = match ? match[1] : undefined;
    if (description) {
        const {citizenship, occupation} = parseDescription(description);
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
    console.log(match)
    let allValues: string = getMultipleValues(match);
    if(allValues !== "") hints["Genres"] = allValues;

    // Instruments
    match = fieldMatchers.instruments.exec(wikitext);
    console.log(match)
    allValues = getMultipleValues(match);
    if(allValues !== "") hints["Instruments"] = allValues;

    return hints;
}

/**
 * Split the given text into parts containing equal number of sentences.
 * @param text - the text to split
 * @param num - the number of parts to split the text into
 */
export function splitIntoEqualSentenceParts(text: string, num: number): string[] {
    // Split the text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (!sentences) return [text];

    const totalSentences = sentences.length;
    const sentencesPerPart = Math.floor(totalSentences / num); // Number of sentences per part
    const parts: string[] = [];

    // Distribute sentences evenly across the three parts
    let start = 0;
    for (let i = 0; i < num - 1; i++) {
        const end = start + sentencesPerPart;
        parts.push(sentences.slice(start, end).join(''));
        start = end;
    }

    // Add the remaining sentences to the last part
    parts.push(sentences.slice(start).join(''));

    return parts;
}


/**
 * Given a name (string) this function returns a string containing the initials of the name
 * @param name - name we want the initials of
 */
export function getInitials(name: string): string {
    const words: string[] = name.split(' ');
    let initials: string = '';
    for (const word of words) {
        if (word.length > 0) {
            initials += word[0].toUpperCase() + ". ";
        }
    }
    return initials;
}

/**
 * Remove all occurrences of the given name in the given text, including
 * first name and last name, excluding name particles (e.g. "von", "de", ...).
 * @param name - celebrity first name(s) and last name(s)
 * @param text - text from which to remove the name
 */
export function removeNameOccurrences(text: string, name: string): string {
    // Get lists of all first names and names, without name particle (i.e. von, de, of...)
    const names: string[] = [
        ...name.split(" ").map(n => n.trim()).filter(n => n === capitalize(n)), name
    ]
    names.forEach(n => {
        const regex = new RegExp(n, 'gi');
        text = text.replace(regex, "???");
    })
    return text
}

/**
 * Private function to parse the description of a wikitext. It returns an object
 * containing the citizenship and occupation retrieved from the description.
 * @param description the description part of a wikitext
 */
function parseDescription(description : string): {citizenship: string | undefined, occupation: string | undefined} {

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
 * Given a sentence of words separated by "and", returns all
 * possible permutations of the words around these "and".
 * @param input - a sentence of words separated by "and"
 */
function getAndPermutations(input: string): string[] {
    const words = input.split(" and ").map(word => word.trim());

    function generatePermutations(arr: string[], index: number) {
        if (index === arr.length - 1) {
            return [arr.slice()];
        }

        const result: string[][] = [];
        for (let i = index; i < arr.length; i++) {
            [arr[index], arr[i]] = [arr[i], arr[index]]; // Swap
            result.push(...generatePermutations(arr, index + 1));
            [arr[index], arr[i]] = [arr[i], arr[index]]; // Restore
        }
        return result;
    }

    const permutations: string[] = [];
    const permutedArrays = generatePermutations(words, 0);
    for (const permutedArray of permutedArrays) {
        permutations.push(permutedArray.join(" and "));
    }

    return permutations;
}

/**
 * Remove all text  between the opening and closing tags in the given string.
 * @param text - a string that may contain tags to remove
 * @param opening - the opening tag
 * @param closings - all the possible closing tag
 */
function removeTag(text: string, opening: string, ...closings: string[]): string {
    const regexStr = `${opening}[^]*?(${closings.join('|')})`;
    const regex = new RegExp(regexStr, 'g');
    return text.replace(regex, '');
}

function getMultipleValues(match : RegExpExecArray | null ): string {
    if(match){
        let type: string = match[0];
        console.log(match[0])
        let array: string[] = [];
        while ((match = fieldMatchers.lists.exec(type)) !== null) {
            console.log(match[1] || match[2] )
            // Extract the content from the matched item
            const content = match[1] || match[2];
            const cleanContent = content.split('|')[0]
                                               .replace("[[", "")
                                               .replace("]]", "")
                                               .trim()
            array.push(cleanContent);
        }
        if(array.length !== 0) return array.join(", ");
    }
    return "";
}