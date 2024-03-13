export class GameModel {
    private _name: string;
    private _imageUrl: string;
    private _birthYear: number;
    private _blur: number = 0;

    /**
     * Model for the game
     */
    constructor(name: string, imageUrl: string, birthYear: number) {
        this._name = name;
        this._imageUrl = imageUrl;
        this._birthYear = birthYear;
    }


    get name(): string {
        return this._name;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    get birthYear(): number {
        return this._birthYear;
    }

    get blur(): number {
        return this._blur;
    }

    set blur(value: number) {
        if (value < 0 || value > 7) {
            throw new Error("Blur must be between 0 and 7");
        }
        this._blur = value;
    }
}