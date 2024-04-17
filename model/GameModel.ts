import { defineStore } from 'pinia';
import { fetchIntro, fetchImage, fetchInfoBox } from "~/api/WikipediaSource"
import type { InfoboxHint, ParagraphHint, BlurHint } from "~/model/Hint"
import { getRandom } from "~/utilities/Utils"

export const useGameStore = defineStore('game', {
    state: () => ({
        name: "" as string,
        images: [] as BlurHint[],
        paragraphs: [] as ParagraphHint[],
        infobox: [] as InfoboxHint[],
        hintLevel: 1 as number,
        nbGuesses: 0 as number,
        totalGuesses: 1 as number,
        blur: 0 as number,
        time: 0 as number,
        curGuess: "" as string,
        prevGuesses: [] as string[],
        end: false as boolean,
        win: false as boolean,
        loading: false as boolean,
    }),
    getters: {
        imageUrl(state): string {
            return state.images && state.images.length > 0 ? state.images[0].url : ""
        },
        intro(state): ParagraphHint[] {
            let intro: ParagraphHint[] = state.paragraphs.slice()
            intro[0] = {...intro[0], value: intro[0].value.replace(this.firstSentence, "")}
            return intro.filter(paragraph => paragraph.value !== "")
        },
        firstSentence(state): string {
            if(state.paragraphs.length === 0) return ""
            const match: RegExpMatchArray | null = state.paragraphs[0].value.match(/[^.!?]+[.!?]+/g)
            return match ? match[0] : state.paragraphs[0].value
        }
    },
    actions: {
        async init (name: string): Promise<void> {
            this.$reset()
            this.name = name
            try {
                this.loading = true
                const [images, infobox, paragraphs] = await Promise.all([
                    fetchImage(this.name, 100),
                    fetchInfoBox(this.name),
                    fetchIntro(this.name),
                ])
                this.images = images
                this.totalGuesses += images.length - 1
                this.infobox = infobox
                this.totalGuesses += infobox.length - 1
                this.paragraphs = paragraphs
                if (this.intro) this.totalGuesses += this.intro.length
                this.blur = this.updateBlur()
            } catch (error) {
                console.error("'Error initializing new game : ', error")
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
                this.blur = this.updateBlur()
            } else this.getNewHint();
            return true;
        },
        getNewHint(): void {
            if (this.infobox.length !== 0 && this.images.length !== 0 && this.paragraphs.length !== 0) {
                const levelHintsLeft: (InfoboxHint | ParagraphHint | BlurHint)[] = [
                    ...this.images,
                    ...this.infobox,
                    ...this.paragraphs.filter(paragraph =>
                        paragraph.value !== "" && paragraph.value !== this.firstSentence
                     ),
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
                    this.blur = this.updateBlur()
                }
            }
        },
        updateBlur(): number {
            return this.images.length > 0 ?
                this.images.filter((image: BlurHint) => image.revealed)
                    .reduce((min, curr) => {
                        return min.blur < curr.blur ? min : curr
                    }).blur
                : 5
        },
    }
})

export type GameStore = ReturnType<typeof useGameStore>


