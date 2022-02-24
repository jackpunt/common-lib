/** Font things */
export var F;
(function (F) {
    function fontSpec(size = 32, font = S.defaultFont) { return "" + size + "px " + font; }
    F.fontSpec = fontSpec;
    function timedPromise(ms, v) {
        return new Promise((res, rej) => setTimeout(() => res(v), ms));
    }
    F.timedPromise = timedPromise;
})(F || (F = {}));
/** Math things */
export var M;
(function (M) {
    /**  @return given value rounded to n decimal places. */
    function decimalRound(value, n) {
        let d = 10 ** n;
        return Math.round(value * d) / d;
    }
    M.decimalRound = decimalRound;
})(M || (M = {}));
/** String things */
export var S;
(function (S_1) {
    S_1.C = "C"; // Center of ChooseDir buttons
    S_1.N = "N";
    S_1.S = "S";
    S_1.E = "E";
    S_1.W = "W";
    S_1.NE = "NE";
    S_1.SE = "SE";
    S_1.SW = "SW";
    S_1.NW = "NW";
    S_1.dirRot = { N: 0, E: 90, S: 180, W: 270, NE: 30, SE: 150, SW: 210, NW: 330 };
    S_1.dirRev = { N: S_1.S, S: S_1.N, E: S_1.W, W: S_1.E, NE: S_1.SW, SE: S_1.NW, SW: S_1.NE, NW: S_1.SE };
    S_1.defaultFont = "sans-serif";
    S_1.rgbColor = "rgbColor"; // card prop
    S_1.scaled = "scaled"; // Event name on ScaledContainer
    S_1.aname = "Aname"; // anonymous function field name, any object name
    S_1.add = "add"; // HexEvent type add Stone to board
    S_1.remove = "remove"; // HexEvent type removeStone from board
    S_1.onTurnStart = "onTurnStart"; // onTrigger for Effects
    S_1.onMove = "onMove"; // onTrigger for Effects
    S_1.turn = "turn"; // ValueEvent on Table & Counter name
    S_1.turnOver = "turnOver"; // ValueEvent on Table: endOfTurn (before setNextPlayer)
    S_1.undo = "undo"; // ValueEvent on Table
    S_1.click = "click"; // MouseEvent on Stage
    S_1.clicked = "clicked"; // CardEvent type
    S_1.pressmove = "pressmove"; // Createjs Event
    S_1.pressup = "pressup"; // Createjs Event
    S_1.actionEnable = "actionEnable"; // RoboEvent type
    S_1.doNotDrag = "doNotDrag"; // mouse Target property for Dragger
})(S || (S = {}));
/** color strings */
export var C;
(function (C) {
    /** Returns array<number> in RGBA order in the range 0 to 255 */
    function nameToRgba(name) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.fillStyle = name;
        context.fillRect(0, 0, 1, 1);
        return context.getImageData(0, 0, 1, 1).data;
    }
    C.nameToRgba = nameToRgba;
    /** add alpha value to an "rgb(r,g,b)" string */
    function rgba(rgb, a) { return "rgba" + rgb.substring(3, rgb.length - 1) + ", " + a + ")"; }
    C.rgba = rgba;
    /** array of color components: [r, g, b, a] */
    function values(rgb) { return rgb.match(/[.|\d]+/g).map(Number); }
    C.values = values;
    /** distance between two rgb colors */
    function dist(rgb1, rgb2) {
        let v1 = C.nameToRgba(rgb1), v2 = C.nameToRgba(rgb2);
        let ds = (v1, v2, i) => { return (v1[i] - v2[i]) * (v1[i] - v2[i]); };
        return Math.sqrt(ds(v1, v2, 0) + ds(v1, v2, 1) + ds(v1, v2, 2));
    }
    C.dist = dist;
    C.RED = "RED"; // nominal player color
    C.BLUE = "BLUE"; // nominal player color
    C.GREEN = "GREEN"; // nominal player color
    C.ORANGE = "ORANGE"; // nominal player color
    C.PURPLE = "PURPLE"; // nominal player color
    C.YELLOW = "YELLOW"; // nominal player color
    C.BLACK = "BLACK"; // vcPlayer color
    C.WHITE = "WHITE"; // vcPlayer color
    C.BROWN = "rgba(185, 83, 0, 1)";
    C.black = "black"; // text color
    C.white = "white";
    C.vpWhite = "rgba(255, 255, 255,  1)";
    C.briteGold = "rgba(255, 213,  77,  1)";
    C.coinGold = "rgba(235, 188,   0,  1)";
    C.debtRust = "rgba(225,  92,   0,  1)"; // Rust color
    C.legalGreen = "rgba(  0, 100,   0, .3)";
    C.legalRed = "rgba(100,   0,   0, .3)";
    C.demoRed = "rgba(100,   0,   0, .8)";
    C.dimYellow = "rgba(235, 235, 108,  1)"; // contrasts with 'white' [also: khaki]
    C.targetMark = "rgba(190, 250, 190, .8)";
    C.debtMark = "rgba( 50,   0,   0, .3)";
    C.markColor = "rgba( 50,  50,  50, .3)";
    C.capColor = "rgba(100,   0,   0, .8)";
    C.scaleBack = "rgba(155, 100, 150, .3)";
    C.policyBack = "rgba(255, 100, 200, .3)";
    C.auctionBack = "rgba(180, 230, 180, .3)";
    C.discardBack = "rgba(120, 230, 120, .6)";
    C.counterColor = "lightblue";
    C.debtCounter = "lightgreen";
    C.phaseCounter = "lightgreen";
    C.dropTarget = "lightpink";
    C.roundCounter = "lightgreen";
    C.turnCounter = "lightgreen";
    C.policySlots = "rgba(255, 100, 200, .3)";
})(C || (C = {}));
// Copied from: https://dev.to/svehla/typescript-object-fromentries-389c
// export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
// type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
// type Cast<X, Y> = X extends Y ? X : Y
// type FromEntries<T> = T extends [infer Key, any][]
//   ? { [K in Cast<Key, string>]: Extract<ArrayElement<T>, [K, any]>[1]}
//   : { [key in string]: any }
// export type FromEntriesWithReadOnly<T> = FromEntries<DeepWriteable<T>>
// declare global {
//    interface ObjectConstructor {
//      fromEntries<T>(obj: T): FromEntriesWithReadOnly<T>
//   }
// }
export class Obj {
    /** like Object.fromEntries(...[string, any])
     * @param rv supply empty object (of prototype)
     */
    static fromEntries(ary, rv = {}) {
        ary.forEach(([k, v]) => { rv[k] = v; }); // QQQQ: is Object.fromEntries() sufficient? is it just <T>?
        return rv;
    }
    /** clone: make a shallow copy of obj, using Obj.fromEntries(ary, rv?:T) */
    static fromEntriesOf(obj) {
        return Obj.fromEntries(Object.entries(obj), Object.create(obj));
    }
    /** clone: make a shallow copy of obj, using Object.fromEntries(ary) */
    static objectFromEntries(obj) {
        return Object.fromEntries(Object.entries(obj)); // Object.fromEntries now available in TypeScript!
    }
}
//# sourceMappingURL=basic-intfs.js.map