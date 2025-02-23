
export type WH = { width: number, height: number };
export type XY = { x: number, y: number }; // less than a Point
export type RC = { row: number, col: number}
export type XYWH = { x: number, y: number, w: number, h: number }; // like a Rectangle

/** Font things */
export class F {
  static defaultStyle = 'normal';
  static defaultWght = 410;
  static defaultSize = 32; // px
  static defaultFont = 'sans-serif'
  // https://stackoverflow.com/questions/64583689/setting-font-weight-on-canvas-text
  /**
   * Compose a font specifier: 'style weight NNpx family'
   * 
   * For historical reasons [GIMP], fam_wght may include a wght, which gets moved to front
   * 
   * @param size nominal height of font to use; defaults to F.defaultSize [32]
   * @param fam_wght font family, may have wght appended; defaults to F.defaultFont ['sans-serif']
   * @param wght the wght to be used; defaults to wght in fam_wght or F.defaultWght ['410']
   * @param style optional style [normal, italic]; defaults to F.defaultStyle ['normal']
   * @returns 
   */
  static fontSpec(size: number = F.defaultSize, fam_wght: string = F.defaultFont, wght: string | number = F.defaultWght, style = F.defaultStyle) {
    // extract weight info, compose: ${style} ${weight} ${family}
    // ASSERT: style is NOT included in given font_fam: 'nnpx family weight'
    const regex = / (\d+|thin|light|regular|normal|bold|semibold|heavy)$/i;
    const match = fam_wght.match(regex);
    const weight = match?.[1];
    const family = weight ? fam_wght.slice(0, match.index) : fam_wght;
    const fontstr = `${style} ${weight ?? wght} ${size}px ${family}`;
    return fontstr;
  }
  static composeFontName(size: number = 32, fam_wght: string = F.defaultFont, wght: string | number = F.defaultWght) { 
    return F.fontSpec(size, fam_wght, wght);
  }
  /** replace weight */
  static family_wght(fam_wght: string, wght?: string | number) {
    // extract weight info, compose: ${style} ${weight} ${family}
    const regex = / (\d+|thin|light|regular|normal|bold|semibold|heavy)$/i;
    const match = fam_wght.match(regex);
    const weight = wght ?? match?.[1];
    const family = weight ? fam_wght.slice(0, match.index) : fam_wght;
    const fontstr = `${family} ${weight ?? 410}`;
    return fontstr;
  }

  /** Extract the 'px' fontSize from fontSpec. */
  static fontSize(fontSpec: string) {
    const pixels = fontSpec ? Number.parseInt(fontSpec.match(/(\d+)px/)?.[1]) : F.defaultSize;
    return pixels;
  }

  /** extract fontName 'family' from fontSpec */
  static fontName(fontSpec: string) {
    const family = fontSpec ? fontSpec.match(/\d+px (.*)/)?.[1] : F.defaultFont;
    return family
  }

}

/** Math things */
export namespace M {
  /**  @return given value rounded to n decimal places. */
  export function decimalRound(value:number, n: number): number {
    const d = 10 ** n;
    return Math.round(value * d) / d;
  }
}

/** String things */
export namespace S {
  export const C: string = 'C'         // Center of ChooseDir buttons
  export const N: string = 'N'
  export const S: string = 'S'
  export const E: string = 'E'
  export const W: string = 'W'
  export const NE: string = 'NE'
  export const SE: string = 'SE'
  export const SW: string = 'SW'
  export const NW: string = 'NW'

  export const infin: string = '∞'; // String.fromCodePoint(0x221E);
  export const sigma: string = 'Σ';

  export const rgbColor: string = 'rgbColor'// card prop

  export const scaled: string = 'scaled'    // Event name on ScaledContainer
  export const Aname:  string = 'Aname'     // anonymous function field name, any object name
  export const add:    string = 'add'       // HexEvent type add Tile to board
  export const remove: string = 'remove'    // HexEvent type remove Tile from board
  
  export const onTurnStart:  string = 'onTurnStart'  // onTrigger for Effects
  export const onMove:       string = 'onMove'       // onTrigger for Effects
  
  export const turn:    string = 'turn'       // ValueEvent on Table & Counter name
  export const turnOver:string = 'turnOver'   // ValueEvent on Table: endOfTurn (before setNextPlayer)
  export const undo:    string = 'undo'       // ValueEvent on Table

  export const click:   string = 'click'      // MouseEvent on Stage
  export const clicked: string = 'clicked'    // CardEvent type
  export const pressmove:string= 'pressmove'  // Createjs Event
  export const pressup: string = 'pressup'    // Createjs Event
  export const splice: string  = 'splice'     // EditBox event

  export const actionEnable: string = 'actionEnable' // RoboEvent type
  export const doNotDrag:   string = 'doNotDrag'   // mouse Target property for Dragger

}
/** color strings, see also: https://www.quackit.com/css/color/charts/css_color_names_chart.cfm */
export namespace C {
  /** Returns array<number> in RGBA order in the range 0 to 255 (requires document & canvas) */
  export function nameToRgba(name: string) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = name;
    context.fillRect(0,0,1,1);
    return context.getImageData(0,0,1,1).data;
  }
  /** convert arbitary CSS color to rgba() notation, reset alpha if supplied. */
  export function nameToRgbaString(name: string, alpha?: number|string) {
    let v = C.nameToRgba(name)
    return `rgba(${v[0]},${v[1]},${v[2]},${alpha ?? (v[3]/255).toFixed(2)})`
  }
  /** add alpha value to an 'rgb(r,g,b)' string */
  export function rgba(rgb: string, a: number): string { return 'rgba' + rgb.substring(3, rgb.length - 1) + ', '+a+')' }
  /** array of color components: [r, g, b, a] */
  export function values(rgb: string) { return rgb.match(/[.|\d]+/g).map(Number)}
  /** distance between two rgb colors */
  export function dist(rgb1: string, rgb2: string): number { 
    let v1 = C.nameToRgba(rgb1), v2 = C.nameToRgba(rgb2) 
    let ds = (v1: Uint8ClampedArray, v2: Uint8ClampedArray, i: number) => { return (v1[i] - v2[i]) * (v1[i] - v2[i]) }
    return Math.sqrt(ds(v1, v2, 0) + ds(v1, v2, 1) + ds(v1, v2, 2))
  }
  export function pickTextColor(bgColor: string, textColors = [C.black, C.white]) {
    const [maxd, maxc] = textColors.map(c => [C.dist(bgColor, c), c] as [number, string])
      .reduce(([pd, pc], [cd, cc]) => cd > pd ? [cd, cc] : [pd, pc], [0, C.black])
    return maxc;
  }
  export const RED:         string = 'RED'          // nominal player color
  export const BLUE:        string = 'BLUE'         // nominal player color
  export const GREEN:       string = 'GREEN'        // nominal player color
  export const ORANGE:      string = 'ORANGE'       // nominal player color
  export const PURPLE:      string = 'PURPLE'       // nominal player color
  export const YELLOW:      string = 'YELLOW'       // nominal player color
  export const BLACK:       string = 'BLACK'        // vcPlayer color
  export const WHITE:       string = 'WHITE'        // vcPlayer color
  export const BROWN:       string = 'rgba(185,83,0,1)'

  export const black:       string = 'black'        // text color
  export const white:       string = 'white'
  export const grey:        string = 'grey'
  export const lightgrey:   string = 'lightgrey'
  export const lightblue:   string = 'lightblue'
  export const lightgreen:  string = 'lightgreen'
  export const lightpink:   string = 'lightpink'
  export const grey32:      string = 'rgb(32,32,32)'
  export const grey64:      string = 'rgb(64,64,64)'
  export const grey92:      string = 'rgb(92,92,92)'
  export const grey128:     string = 'rgb(128,128,128)'
  export const grey224:     string = 'rgb(224,224,224)'
  export const transparent: string = 'rgba(0,0,0,0)'

  // from CityMap:
  export const vpWhite:     string = 'rgba(255,255,255, 1)'
  export const briteGold:   string = 'rgba(255,213, 77, 1)'
  export const coinGold:    string = 'rgba(235,188,  0, 1)'
  export const debtRust:    string = 'rgba(225, 92,  0, 1)' // Rust color
  export const legalGreen:  string = 'rgba(  0,100,  0,.3)'
  export const legalRed:    string = 'rgba(100,  0,  0,.3)'
  export const demoRed:     string = 'rgba(100,  0,  0,.8)'
  export const dimYellow:   string = 'rgba(235,235,108, 1)' // contrasts with 'white' [also: khaki]
  export const targetMark:  string = 'rgba(190,250,190,.8)'
  export const debtMark:    string = 'rgba( 50,  0,  0,.3)'
  export const markColor:   string = 'rgba( 50, 50, 50,.3)' // transparent nearly black
  export const capColor:    string = 'rgba(100,  0,  0,.8)'
  // https://www.quackit.com/css/color/charts/css_color_names_chart.cfm
}

// Copied from: https://dev.to/svehla/typescript-object-fromentries-389c
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
type Cast<X, Y> = X extends Y ? X : Y
type FromEntries<T> = T extends [infer Key, any][]
  ? { [K in Cast<Key, string>]: Extract<T[number], [K, any]>[1]}
  : { [key in string]: any }
export type FromEntriesWithReadOnly<T> = FromEntries<DeepWriteable<T>>

// declare global {
//    interface ObjectConstructor {
//      fromEntries<T>(obj: T): FromEntriesWithReadOnly<T>
//   }
// }
// maybe find types of value when not [infer Key, any][] ? union of values
// : T extends [string, infer Vtype][] 
//   ? { [key in string]: Vtype}
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types

export class Obj {
  /** like Object.fromEntries(...[string, any]) 
   * @param rv supply empty object (of prototype)
   */
  static fromEntries<T extends object>(ary: [string, any][], rv:T = {} as T): T {
    ary.forEach(([k, v]) => { rv[k] = v }) // QQQQ: is Object.fromEntries() sufficient? is it just <T>?
    return rv
  }
  /** clone: make a shallow copy of obj, using Obj.fromEntries(ary, rv?:T) */
  static fromEntriesOf<T extends object>(obj: T): T {
    return Obj.fromEntries(Object.entries(obj), Object.create(obj) as T)
  }
  /** clone: make a shallow copy of obj, using Object.fromEntries(ary) */
  static objectFromEntries<T extends object>(obj: T): T {
    return Object.fromEntries(Object.entries(obj)) as T
  }
  static objectFromEntriesOfReadonly<T extends object>(obj: T): FromEntriesWithReadOnly<T>  {
    return Object.fromEntries(Object.entries(obj)) as FromEntriesWithReadOnly<T>
  }
  /** 
   * return a copy of obj backfilled with def (or copy of def, with obj overwriting)
   *
   * @deprecated use {...def, ...obj}
   *
   * see also: webpack-merge: 
   * https://github.com/just-jeb/angular-builders/blob/13.x.x/packages/custom-webpack
   * 
   * @param obj contains partial elements of T
   * @param def contains all required elements of T
   * @return copy of def with overrides from obj
   */
  static mergeDefaults<T extends object>(obj: T, def: T): T {
    let rv = {}
    Object.entries(def).forEach(([key, value]) => {
      rv[key] = obj[key] || value
    })
    return rv as T
  }
}


