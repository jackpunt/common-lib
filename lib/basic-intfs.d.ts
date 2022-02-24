export declare type WH = {
    width: number;
    height: number;
};
export declare type XY = {
    x: number;
    y: number;
};
export declare type RC = {
    row: number;
    col: number;
};
/** Font things */
export declare namespace F {
    function fontSpec(size?: number, font?: string): string;
    function timedPromise<T>(ms: number, v?: T): Promise<T>;
}
/** Math things */
export declare namespace M {
    /**  @return given value rounded to n decimal places. */
    function decimalRound(value: number, n: number): number;
}
/** String things */
export declare namespace S {
    const C: string;
    const N: string;
    const S: string;
    const E: string;
    const W: string;
    const NE: string;
    const SE: string;
    const SW: string;
    const NW: string;
    const dirRot: object;
    const dirRev: object;
    const defaultFont: string;
    const rgbColor: string;
    const scaled: string;
    const aname: string;
    const add: string;
    const remove: string;
    const onTurnStart: string;
    const onMove: string;
    const turn: string;
    const turnOver: string;
    const undo: string;
    const click: string;
    const clicked: string;
    const pressmove: string;
    const pressup: string;
    const actionEnable: string;
    const doNotDrag: string;
}
/** color strings */
export declare namespace C {
    /** Returns array<number> in RGBA order in the range 0 to 255 */
    function nameToRgba(name: string): Uint8ClampedArray;
    /** add alpha value to an "rgb(r,g,b)" string */
    function rgba(rgb: string, a: number): string;
    /** array of color components: [r, g, b, a] */
    function values(rgb: string): number[];
    /** distance between two rgb colors */
    function dist(rgb1: string, rgb2: string): number;
    const RED: string;
    const BLUE: string;
    const GREEN: string;
    const ORANGE: string;
    const PURPLE: string;
    const YELLOW: string;
    const BLACK: string;
    const WHITE: string;
    const BROWN: string;
    const black: string;
    const white: string;
    const vpWhite: string;
    const briteGold: string;
    const coinGold: string;
    const debtRust: string;
    const legalGreen: string;
    const legalRed: string;
    const demoRed: string;
    const dimYellow: string;
    const targetMark: string;
    const debtMark: string;
    const markColor: string;
    const capColor: string;
    const scaleBack: string;
    const policyBack: string;
    const auctionBack: string;
    const discardBack: string;
    const counterColor: string;
    const debtCounter: string;
    const phaseCounter: string;
    const dropTarget: string;
    const roundCounter: string;
    const turnCounter: string;
    const policySlots: string;
}
export declare class Obj {
    /** like Object.fromEntries(...[string, any])
     * @param rv supply empty object (of prototype)
     */
    static fromEntries<T extends object>(ary: [string, any][], rv?: T): T;
    /** clone: make a shallow copy of obj, using Obj.fromEntries(ary, rv?:T) */
    static fromEntriesOf<T extends object>(obj: T): T;
    /** clone: make a shallow copy of obj, using Object.fromEntries(ary) */
    static objectFromEntries<T extends object>(obj: T): T;
}
