import { defineStore } from "pinia"

export const useUserStore = defineStore('user', {
    state: () => ({
        uid: '' as string,
        username: '' as string,
        currentStreak: 0 as number,
        maxStreak: 0 as number,
        averageRank: 0 as number,
        averageGuesses: 0 as number,
        winRate: 0 as number,
        gamesPlayed: 0 as number,
        timedStats: [] as TimedStat[],
    }),
    actions: {
        updateStats(currentStreak: number,
                    maxStreak: number,
                    averageRank: number,
                    averageGuesses: number,
                    winRate: number,
                    gamesPlayed: number,
                    timedStats: TimedStat[]): void {
            this.currentStreak = currentStreak
            this.maxStreak = maxStreak
            this.averageRank = averageRank
            this.averageGuesses = averageGuesses
            this.winRate = winRate
            this.gamesPlayed = gamesPlayed
            this.timedStats = timedStats
        },
        endGame(win: boolean, rank: number, guesses: number, time: number, date: number): void {
            if (win) {
                this.winRate = (this.winRate * this.gamesPlayed + 1) / (this.gamesPlayed+1)
                if(this.timedStats === undefined) this.timedStats = new Array<TimedStat>()
                this.timedStats.push({date, guesses, rank, time})
                this.updateStreak()
                this.averageRank = (this.averageRank * this.gamesPlayed + rank) / (this.gamesPlayed+1)
                this.averageGuesses = (this.averageGuesses * this.gamesPlayed + guesses) / (this.gamesPlayed+1)
            }else {
                this.resetStreak()
                this.winRate = (this.winRate * this.gamesPlayed) / (this.gamesPlayed+1)
            }
            this.gamesPlayed++
        },
        updateUser(uid: string, username: string): void {
            this.uid = uid
            this.username = username
        },
        updateStreak(): void {
            const millisecondsInADay : number = 86400000
            this.currentStreak++
            const lstLength = this.timedStats.length
            // reset streak to 1 if the time difference between the two last games isn't 24 hours 
            if(lstLength >= 2 &&
                this.timedStats[lstLength - 2].date - this.timedStats[lstLength - 3].date !== millisecondsInADay){
                this.currentStreak = 1
            }
            if (this.currentStreak > this.maxStreak) this.maxStreak = this.currentStreak
        },
        resetStreak(): void {
            this.currentStreak = 0
        }
    }
})

export type UserStore = ReturnType<typeof useUserStore>
export type TimedStat = { date: number, guesses: number, rank: number, time: number }
