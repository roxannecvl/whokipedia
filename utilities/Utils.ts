import { UserModel } from "~/model/UserModel";

export class Utils {
    /**
     * Example of a utils function.
     * @param x - first number
     * @param y - second number
     * @returns the average of the two numbers
     */
    public static getAverage(x: number, y: number): number {
        return (x + y) / 2.0;
    }

    /**
     * Gives you a random element from the list.
     * Get mean function
     * @param tab - the table of numbers to get the mean from
     * @returns the mean of the numbers in the table
     */
    public static getMean(tab: number[]): number {
        return tab.reduce((a, b) => a + b, 0) / tab.length;
    }

    /**
     * Gives you a random element from the list
     * @param list - a nonempty list
     * @returns an element from the given list
     */
    public static getRandom(list : any[]) :any {
        if(list.length == 0) return null;
        return list[Math.floor(Math.random() * list.length)];
    }

    /**
     * Given a name (string) this function returns a string containing the intials of the name
     *
     */
    public static  getInitials(name: string): string {
        // Split the name into individual words
        const words: string[] = name.split(' ');

        // Initialize an empty string to store the initials
        let initials: string = '';

        // Iterate through each word and add its first letter to the initials
        for (const word of words) {
            // If the word is not empty, add its first letter to the initials
            if (word.length > 0) {
                initials += word[0].toUpperCase() + ". ";
            }
        }

        return initials;
    }

    /**
     * Given a sentence of words separated by "and", returns all
     * possible permutations of the words around these "and".
     * @param input - a sentence of words separated by "and"
     */
    public static getAndPermutations(input: string): string[] {
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
     * @param closing - the closing tag
     */
    public static removeTag(text: string, opening: string, closing: string): string {
        const regexStr = `${opening}[^]*?${closing}`;
        const regex = new RegExp(regexStr, 'g');
        return text.replace(regex, '');

     * Get random user model
     * @returns a random user model
     */
    //TODO : remove after testing
    public static getRandomUserModel(): UserModel {
        const max_value = 100;
        const userModel = new UserModel();
        userModel.updateStats(Math.floor(Math.random() * max_value), Math.floor(Math.random() * max_value), Math.floor(Math.random() * max_value), Math.floor(Math.random() * max_value), Math.floor(Math.random() * max_value), Math.floor(Math.random() * max_value))
        return userModel;
    }

    // Add more utility functions here
    static countries: {[key: string]: string} = {
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
    };
}

