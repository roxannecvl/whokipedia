import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        currentStreak: 0 as number,
        maxStreak: 0 as number,
        averageRank: 0 as number,
        ranks: [] as TimedStat[],
        averageGuesses: 0 as number,
        guesses: [] as TimedStat[],
        averageTime: 0 as number,
        times: [] as TimedStat[],
        gamesPlayed: 0 as number,
    }),
    actions: {
        updateStats(currentStreak: number,
                    maxStreak: number,
                    averageRank: number,
                    averageGuesses: number,
                    averageTime: number,
                    gamesPlayed: number): void {
            this.currentStreak = currentStreak;
            this.maxStreak = maxStreak;
            this.averageRank = averageRank;
            this.averageGuesses = averageGuesses;
            this.averageTime = averageTime;
            this.gamesPlayed = gamesPlayed;
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
export type TimedStat = { number: number, date: Date }
