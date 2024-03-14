import {BASE_URL, ENDPOINT } from "~/api/apiConfig";

/**
 * Fetch and return the HTML of the given Wikipedia page.
 * @param pageTitle the title of the Wikipedia page, must be first-capitalized
 * words (except for name particles) separated by '_', for instance "Leonardo_da_Vinci"
 */
async function fetchHTMLPage(pageTitle: string): Promise<string> {
    const searchParams = {
        action: "parse",
        format: "json",
        prop: "text",
        page: pageTitle
    }

    const queryParams: URLSearchParams = new URLSearchParams(searchParams);
    const url: string = BASE_URL + ENDPOINT + queryParams

    try {
        const response: Response = await fetch(url);
        const data = await response.json();
        return data.parse.text
    } catch (error) {
        console.error('Error fetching page:', error);
        throw error;
    }
}


export { fetchHTMLPage }