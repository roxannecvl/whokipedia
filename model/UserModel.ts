import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        currentStreak: 0 as number,
        maxStreak: 0 as number,
        averageRank: 0 as number,
        ranks: [] as number[],
        averageGuesses: 0 as number,
        guesses: [] as number[],
        averageTime: 0 as number,
        times: [] as number[],
        timesPlayed: 0 as number,
    }),
    actions: {
        updateStats(currentStreak: number,
                    maxStreak: number,
                    averageRank: number,
                    averageGuesses: number,
                    averageTime: number,
                    timesPlayed: number): void {
            this.currentStreak = currentStreak;
            this.maxStreak = maxStreak;
            this.averageRank = averageRank;
            this.averageGuesses = averageGuesses;
            this.averageTime = averageTime;
            this.timesPlayed = timesPlayed;
        },
        updateStreak(): void {
            this.currentStreak++;
            if (this.currentStreak > this.maxStreak) this.maxStreak = this.currentStreak;
        },
        resetStreak(): void {
            this.currentStreak = 0
        }
    }
})

export type UserStore = ReturnType<typeof useUserStore>