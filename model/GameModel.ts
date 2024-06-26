import { defineStore } from 'pinia'
import { fetchIntro, fetchImage, fetchInfoBox } from "~/api/WikipediaSource"
import type { InfoboxHint, ParagraphHint, BlurHint } from "~/model/Hint"
import { getCurrentDayTimestamp, randomPermutation } from "~/utilities/Utils"

export const useGameStore = defineStore('game', {
    state: () => ({
        name: "" as string,
        images: [] as BlurHint[],
        imageUrl: "" as string,
        firstSentence : "" as string,
        intro: [] as ParagraphHint[],
        infobox: [] as InfoboxHint[],
        order : [] as number[],
        nbGuesses: 0 as number,
        totalGuesses: 1 as number,
        time: 0 as number,
        curGuess: "" as string,
        prevGuesses: [] as string[],
        end: false as boolean,
        win: false as boolean,
        loading: false as boolean,
        isDaily: false as boolean,
    }),
    actions: {
        async init (name: string, isDaily : boolean = false): Promise<void> {
            this.$reset()
            this.name = name
            this.isDaily = isDaily
            try {
                this.loading = true
                const [images, infobox, paragraphs] = await Promise.all([
                    fetchImage(this.name, 100),
                    fetchInfoBox(this.name),
                    fetchIntro(this.name),
                ])
                this.images = images
                this.infobox = infobox
                this.totalGuesses += infobox.length + images.length - 2
                this.intro = paragraphs.slice()
                if(this.intro.length !== 0){
                    const match: RegExpMatchArray | null = paragraphs[0].value.match(/[^.!?]+[.!?]+/g)
                    this.firstSentence =  match ? match[0] : paragraphs[0].value
                    this.intro[0] = {...this.intro[0], value: this.intro[0].value.replace(this.firstSentence, "")}
                }
                if (this.intro) this.totalGuesses += this.intro.length
                this.imageUrl = this.updateImage()
                let nbHintLV1 = [...this.images, ...this.infobox, ...this.intro]
                    .filter((hint: InfoboxHint | ParagraphHint | BlurHint) => !hint.revealed && hint.level == 1).length
                let nbHintLV2 = [...this.images, ...this.infobox, ...this.intro]
                    .filter((hint: InfoboxHint | ParagraphHint | BlurHint) => !hint.revealed && hint.level == 2).length
                let nbHintLV3 = [...this.images, ...this.infobox, ...this.intro]
                    .filter((hint: InfoboxHint | ParagraphHint | BlurHint) => !hint.revealed && hint.level == 3).length
                let seed = 0
                let timestamp = await getCurrentDayTimestamp()
                let date = new Date(timestamp)
                if(isDaily) seed = (date.getMonth() + date.getDate()) / 42
                this.order = [...randomPermutation(1,nbHintLV1, seed),
                    ...randomPermutation(nbHintLV1 + 1, nbHintLV1 + nbHintLV2, seed),
                    ...randomPermutation(nbHintLV1 + nbHintLV2 + 1, nbHintLV1 + nbHintLV2 + nbHintLV3, seed)]
                this.getNewHint()
            } catch (error) {
                console.error("'Error initializing new game : ', error")
            } finally {
                this.loading = false
            }
        },
        makeAGuess(newGuess: string): boolean {
            if (this.prevGuesses.includes(newGuess)) return false
            this.prevGuesses.push(newGuess)
            this.curGuess = newGuess
            this.nbGuesses++
            if (this.curGuess == this.name) {
                this.end = true
                this.win = true
                this.imageUrl = this.updateImage()
            } else this.getNewHint()
            return true
        },
        getNewHint(): void {
            if(this.nbGuesses >= this.order.length){
                this.end = true
                this.win = false
                this.imageUrl = this.updateImage()
                return
            }
            let index = this.order[this.nbGuesses]
            const hints: (InfoboxHint | ParagraphHint | BlurHint)[] = [
                ...this.images,
                ...this.infobox,
                ...this.intro,
            ].sort((hintA, hintB) => hintA.level - hintB.level)
            hints[index].revealed = true
            this.imageUrl = this.updateImage()
        },
        updateImage(): string {
            return this.images.length > 0 ?
                this.images.filter((image: BlurHint) => this.end || image.revealed)
                    .reduce((max, curr) =>  max.level > curr.level ? max : curr).url
                : ""
        },
    }
})

export type GameStore = ReturnType<typeof useGameStore>
