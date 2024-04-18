import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '' as string,
        currentStreak: 0 as number,
        maxStreak: 0 as number,
        averageRank: 0 as number,
        averageGuesses: 0 as number,
        averageTime: 0 as number,
        gamesPlayed: 0 as number,
        timedStats: [] as TimedStat[],
    }),
    actions: {
        updateStats(currentStreak: number,
                    maxStreak: number,
                    averageRank: number,
                    averageGuesses: number,
                    averageTime: number,
                    gamesPlayed: number,
                    timedStats: TimedStat[]): void {
            this.currentStreak = currentStreak;
            this.maxStreak = maxStreak;
            this.averageRank = averageRank;
            this.averageGuesses = averageGuesses;
            this.averageTime = averageTime;
            this.gamesPlayed = gamesPlayed;
            this.timedStats = timedStats
        },
        updateUsername(username: string): void {
            this.username = username;
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
export type TimedStat = { date: string, guesses: number, rank: number }