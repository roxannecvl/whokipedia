import { UserModel } from "~/model/UserModel";

export class Utils {
    /**
     * Example of a utils function
     * @param x - first number
     * @param y - second number
     * @returns the average of the two numbers
     */
    public static getAverage(x: number, y: number): number {
        return (x + y) / 2.0;
    }

    /**
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
     * Get random user model
     * @returns a random user model
     */
    //TODO : remove after testing
    public static getRandomUserModel(): UserModel {
        const max_value = 100;
        const userModel = new UserModel();
        userModel.updateStats(Math.random() * max_value, Math.random() * max_value, Math.random() * max_value, Math.random() * max_value, Math.random() * max_value, Math.random() * max_value)
        return userModel;
    }

    // Add more utility functions here
}

