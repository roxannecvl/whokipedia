import { defineStore } from 'pinia';
import { fetchIntro, fetchImage, fetchInfoBox } from "~/api/WikipediaSource"
import { getRandom } from "~/utilities/Utils"
import type { InfoboxHint, ParagraphHint, BlurHint } from "~/model/Hint"

export const useGameStore = defineStore('game', {
    state: () => ({
        name: "" as string,
        images: null as BlurHint[] | null,
        intro: null as ParagraphHint[] | null,
        infobox: null as InfoboxHint[] | null,
        hintLevel: 1 as number,
        nbGuesses: 0 as number,
        curGuess: "" as string,
        prevGuesses: [] as string[],
        end: false as boolean,
        win: false as boolean,
        loading: false as boolean,
    }),
    getters: {
        imageUrl: (state): string | undefined => {
            return state.images ? state.images[0].url : undefined
        },
        blur: (state): number | undefined => {
            return state.images ? state.images
                .filter((image: BlurHint) => image.revealed)
                .reduce((max, curr) => {
                    return max.blur > curr.blur ? max : curr
                }).blur : undefined
        },
    },
    actions: {
        async init (name: string): Promise<void> {
            this.$reset()
            this.name = name
            try {
                this.loading = true
                const [images, infobox, intro] = await Promise.all([
                    fetchImage(this.name, 100),
                    fetchInfoBox(this.name),
                    fetchIntro(this.name),
                ])
                this.images = images
                this.infobox = infobox
                this.intro = intro
            } catch (error) {

            } finally {
                this.loading = false
            }
        },
        makeAGuess(newGuess: string): boolean {
            if (this.prevGuesses.includes(newGuess)) return false;
            this.prevGuesses.push(newGuess);
            this.curGuess = newGuess;
            this.nbGuesses++;
            if (this.curGuess == this.name) {
                this.end = true;
                this.win = true;
            } else this.getNewHint();
            return true;
        },
        getNewHint(): void {
            if (this.infobox !== null && this.images !== null && this.intro !== null) {
                const levelHintsLeft: (InfoboxHint | ParagraphHint | BlurHint)[] = [
                    ...this.images,
                    ...this.infobox,
                    ...this.intro
                ].filter((hint: InfoboxHint | ParagraphHint | BlurHint) => !hint.revealed && hint.level == this.hintLevel)

                if (levelHintsLeft.length == 0) {
                    if (this.hintLevel >= 3) {
                        this.end = true;
                        return;
                    }
                    this.hintLevel ++;
                    this.getNewHint()
                } else {
                    getRandom(levelHintsLeft).revealed = true;
                }
            }
        }
    }
})

export type GameStore = ReturnType<typeof useGameStore>


