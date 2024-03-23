import { HintList } from "~/model/HintList";

export function parseHints (infoBox: any): HintList {

    let birth: Date | undefined;
    let ageOrDeath: Date | number | undefined
    let occupation: string | undefined

    if (infoBox.hasOwnProperty('birthDate')) {
        birth = new Date(infoBox['birthDate']['date'])
        ageOrDeath = infoBox['birthDate']['age']
    }


    if (infoBox.hasOwnProperty('deathDate')) {
        ageOrDeath = infoBox['deathDate']['date']
    }

    if (infoBox.hasOwnProperty('occupation')) {
        occupation = infoBox['occupation'][0]
    }

    return new HintList(birth, ageOrDeath, occupation, "", "", "");
}