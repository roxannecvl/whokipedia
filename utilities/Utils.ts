import { type UserStore, useUserStore } from "~/model/UserModel";

// --------------------------------- String utilities  --------------------------------- //

/**
 * Given a string, this function returns the same string with the first letter capitalized.
 * @param str - the string to capitalize
 */
export function capitalize(str: string): string {
    const s = str.trim()
    return s.charAt(0).toUpperCase() + s.slice(1);
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

// --------------------------------- String cleaning utilities --------------------------------- //

/**
 * Remove all text  between the opening and closing tags in the given string.
 * @param text - a string that may contain tags to remove
 * @param opening - the opening tag
 * @param closings - all the possible closing tag
 */
export function removeTag(text: string, opening: string, ...closings: string[]): string {
    const regexStr = `${opening}[^]*?(${closings.join('|')})`;
    const regex = new RegExp(regexStr, 'g');
    return text.replace(regex, '');
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

// --------------------------------- Miscellaneous --------------------------------- //

/**
 * Method to pick a random element from a list.
 * @param list - a nonempty list
 * @returns any - element from the given list
 */
export function getRandom(list: any[]): any {
    if (list.length == 0) return null;
    return list[Math.floor(Math.random() * list.length)];
}

/**
 * Method to encrypt text.
 * @param text - text to encrypt
 */
export function getEncryptedString(text : string) : string {
    let encrypted : string = "";
    for(let i = 0 ; i < text.length; ++i) {
        // Checks whether char is letter or number
        if(/^[a-zA-Z]$/.test(text[i]) || /^[0-9]$/.test(text[i])){
            const randomChar: number = Math.floor(Math.random() * (122 - 65 + 1)) + 65;
            encrypted = encrypted +  String.fromCharCode(randomChar)
        } else {
            // Keep spaces or new lines
            encrypted = encrypted + text[i];
        }
    }
    return encrypted;
}

//TODO : remove after testing
/**
 * Method to create a random user model, used for testing purposes.
 * @returns UserStore - random user model
 */
export function getRandomUserModel(): UserStore {
    const max_value: number = 100;
    const store: UserStore = useUserStore();
    store.updateStats(
        Math.floor(Math.random() * max_value),
        Math.floor(Math.random() * max_value),
        Math.floor(Math.random() * max_value),
        Math.floor(Math.random() * max_value),
        Math.floor(Math.random() * max_value),
        Math.floor(Math.random() * max_value))
    return store;
}

/**
 * Given a sentence of words separated by "and", returns all
 * possible permutations of the words around these "and".
 * @param input - a sentence of words separated by "and"
 */
export function getAndPermutations(input: string): string[] {
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

// --------------------------------- Data --------------------------------- //

export const months: {[key: number]: string} = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

export const countries: {[key: string]: string} = {
    "Afghanistan": "Afghan",
    "Albania": "Albanian",
    "Algeria": "Algerian",
    "Andorra": "Andorran",
    "Angola": "Angolan",
    "Antigua and Barbuda": "Antiguans",
    "Argentina": "Argentine",
    "Armenia": "Armenian",
    "Australia": "Australian",
    "Austria": "Austrian",
    "Azerbaijan": "Azerbaijani",
    "Bahamas": "Bahamian",
    "Bahrain": "Bahraini",
    "Bangladesh": "Bangladeshi",
    "Barbados": "Barbadian",
    "Belarus": "Belarusian",
    "Belgium": "Belgian",
    "Belize": "Belizean",
    "Benin": "Beninese",
    "Bhutan": "Bhutanese",
    "Bolivia": "Bolivian",
    "Bosnia and Herzegovina": "Bosnian",
    "Botswana": "Batswana",
    "Brazil": "Brazilian",
    "Brunei": "Bruneian",
    "Bulgaria": "Bulgarian",
    "Burkina Faso": "Burkinabe",
    "Burundi": "Burundian",
    "Cabo Verde": "Cape Verdean",
    "Cambodia": "Cambodian",
    "Cameroon": "Cameroonian",
    "Canada": "Canadian",
    "Central African Republic": "Central African",
    "Chad": "Chadian",
    "Chile": "Chilean",
    "China": "Chinese",
    "Colombia": "Colombian",
    "Comoros": "Comoran",
    "Congo (Congo-Brazzaville)": "Congolese",
    "Costa Rica": "Costa Rican",
    "Croatia": "Croatian",
    "Cuba": "Cuban",
    "Cyprus": "Cypriot",
    "Czechia": "Czech",
    "Denmark": "Danish",
    "Djibouti": "Djibouti",
    "Dominica": "Dominican",
    "Dominican Republic": "Dominican",
    "Ecuador": "Ecuadorean",
    "England": "English",
    "Egypt": "Egyptian",
    "El Salvador": "Salvadoran",
    "Equatorial Guinea": "Equatorial Guinean",
    "Eritrea": "Eritrean",
    "Estonia": "Estonian",
    "Eswatini": "Swazi",
    "Ethiopia": "Ethiopian",
    "Fiji": "Fijian",
    "Finland": "Finnish",
    "France": "French",
    "Gabon": "Gabonese",
    "Gambia": "Gambian",
    "Georgia": "Georgian",
    "Germany": "German",
    "Ghana": "Ghanaian",
    "Greece": "Greek",
    "Grenada": "Grenadian",
    "Guatemala": "Guatemalan",
    "Guinea": "Guinean",
    "Guinea-Bissau": "Guinea-Bissauan",
    "Guyana": "Guyanese",
    "Haiti": "Haitian",
    "Honduras": "Honduran",
    "Hungary": "Hungarian",
    "Iceland": "Icelander",
    "India": "Indian",
    "Indonesia": "Indonesian",
    "Iran": "Iranian",
    "Iraq": "Iraqi",
    "Ireland": "Irish",
    "Israel": "Israeli",
    "Italy": "Italian",
    "Jamaica": "Jamaican",
    "Japan": "Japanese",
    "Jordan": "Jordanian",
    "Kazakhstan": "Kazakhstani",
    "Kenya": "Kenyan",
    "Kiribati": "I-Kiribati",
    "Kuwait": "Kuwaiti",
    "Kyrgyzstan": "Kyrgyz",
    "Laos": "Laotian",
    "Latvia": "Latvian",
    "Lebanon": "Lebanese",
    "Lesotho": "Mosotho",
    "Liberia": "Liberian",
    "Libya": "Libyan",
    "Liechtenstein": "Liechtensteiner",
    "Lithuania": "Lithuanian",
    "Luxembourg": "Luxembourger",
    "Madagascar": "Malagasy",
    "Malawi": "Malawian",
    "Malaysia": "Malaysian",
    "Maldives": "Maldivan",
    "Mali": "Malian",
    "Malta": "Maltese",
    "Marshall Islands": "Marshallese",
    "Mauritania": "Mauritanian",
    "Mauritius": "Mauritian",
    "Mexico": "Mexican",
    "Micronesia": "Micronesian",
    "Moldova": "Moldovan",
    "Monaco": "Monacan",
    "Mongolia": "Mongolian",
    "Montenegro": "Montenegrin",
    "Morocco": "Moroccan",
    "Mozambique": "Mozambican",
    "Myanmar (formerly Burma)": "Burmese",
    "Namibia": "Namibian",
    "Nauru": "Nauruan",
    "Nepal": "Nepalese",
    "Netherlands": "Dutch",
    "New Zealand": "New Zealander",
    "Nicaragua": "Nicaraguan",
    "Niger": "Nigerien",
    "Nigeria": "Nigerian",
    "North Korea": "North Korean",
    "North Macedonia": "Macedonian",
    "Norway": "Norwegian",
    "Oman": "Omani",
    "Pakistan": "Pakistani",
    "Palau": "Palauan",
    "Palestine State": "Palestinian",
    "Panama": "Panamanian",
    "Papua New Guinea": "Papua New Guinean",
    "Paraguay": "Paraguayan",
    "Peru": "Peruvian",
    "Philippines": "Filipino",
    "Poland": "Polish",
    "Portugal": "Portuguese",
    "Qatar": "Qatari",
    "Romania": "Romanian",
    "Russia": "Russian",
    "Rwanda": "Rwandan",
    "Saint Kitts and Nevis": "Saint Kittian and Nevisian",
    "Saint Lucia": "Saint Lucian",
    "Saint Vincent and the Grenadines": "Saint Vincentian",
    "Samoa": "Samoan",
    "San Marino": "San Marinese",
    "Sao Tome and Principe": "Sao Tomean",
    "Saudi Arabia": "Saudi",
    "Senegal": "Senegalese",
    "Serbia": "Serbian",
    "Seychelles": "Seychellois",
    "Sierra Leone": "Sierra Leonean",
    "Singapore": "Singaporean",
    "Slovakia": "Slovak",
    "Slovenia": "Slovene",
    "Solomon Islands": "Solomon Islander",
    "Somalia": "Somali",
    "South Africa": "South African",
    "South Korea": "South Korean",
    "South Sudan": "South Sudanese",
    "Spain": "Spanish",
    "Sri Lanka": "Sri Lankan",
    "Sudan": "Sudanese",
    "Suriname": "Surinamer",
    "Sweden": "Swedish",
    "Switzerland": "Swiss",
    "Syria": "Syrian",
    "Taiwan": "Taiwanese",
    "Tajikistan": "Tajik",
    "Tanzania": "Tanzanian",
    "Thailand": "Thai",
    "Togo": "Togolese",
    "Tonga": "Tongan",
    "Trinidad and Tobago": "Trinidadian or Tobagonian",
    "Tunisia": "Tunisian",
    "Turkey": "Turkish",
    "Turkmenistan": "Turkmen",
    "Tuvalu": "Tuvaluan",
    "Uganda": "Ugandan",
    "Ukraine": "Ukrainian",
    "United Arab Emirates": "Emirian",
    "United Kingdom": "British",
    "United States": "American",
    "Uruguay": "Uruguayan",
    "Uzbekistan": "Uzbek",
    "Vanuatu": "Ni-Vanuatu",
    "Venezuela": "Venezuelan",
    "Vietnam": "Vietnamese",
    "Yemen": "Yemeni",
    "Zambia": "Zambian",
    "Zimbabwe": "Zimbabwean"
}

