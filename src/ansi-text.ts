import { C } from "./index.js"
// https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
export namespace AT {
  const ansiReset = ['reset', '_reset'] as const
  type AnsiEnd = 'reset' | '_reset'
  type AnsiKey_ = 'reset' | 'rgb' | 'n256'
    | 'bold' | 'dim' | 'italic' | 'under' | 'blink' | 'inv' | 'hide' | 'strike'
    | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'default'
    | '$black' | '$red' | '$green' | '$yellow' | '$blue' | '$magenta' | '$cyan' | '$white'

  /**
   * @param style use style (bold, dim, italic, under, blink, inv, hide, strike)
   * @param _style remove style
   * @param Foreground_Color:
   * @param default use extant default FG color
   * @param color use FG color (black, red, green, yellow, blue, magenta, cyan, white)
   * @param $color use Bright FG color
   * @param rgb use rgb from colorName in next element as FG color
   * @param n256 use color-N from N in next element as FG color
   * @param Background_Color:
   * @param _default use extant default BG color
   * @param _color use BG color
   * @param $_color use Bright BG color
   * @param _rgb use rgb from colorName in next element as FG color
   * @param _n256 use color-N from N in next element as BG color
   * @param Last_Element:
   * @param reset code 0 = reset all modes (added after text by default)
   * @param _reset suppress adding reset after text
   */
  export type AnsiKey = AnsiKey_ | `_${AnsiKey_}`
  const ansiCode: { [key in AnsiKey]: string } = {
    // reset all modes
    reset: '0', _reset: '',
    bold: '1', _bold: '22', dim: '2', _dim: '22',
    italic: '3', under: '4', blink: '5', inv: '7', hide: '8', strike: '9',
    _italic: '23', _under: '24', _blink: '25', _inv: '27', _hide: '28', _strike: '29',
    // foreground:
    black: '30', red: '31', green: '32', yellow: '33', blue: '34', magenta: '35', cyan: '36', white: '37',
    $black: '90', $red: '91', $green: '92', $yellow: '93', $blue: '94', $magenta: '95', $cyan: '96', $white: '97',
    rgb: '38;2', n256: '38:5', default: '39',
    // background:
    _black: '40', _red: '41', _green: '42', _yellow: '43', _blue: '44', _magenta: '45', _cyan: '46', _white: '47',
    _$black: '100', _$red: '101', _$green: '102', _$yellow: '103', _$blue: '104', _$magenta: '105', _$cyan: '106', _$white: '107',
    _rgb: '48;2', _n256: '48;5', _default: '49',
  }
  /**
   * @param modes an array of AnsiKey indicating Color/Graphics modes.
   * @returns modes prefixed with ESC and separated by ';' terminated with 'm'
   */
  export function ansiEsc(modes: AnsiKey[], term = 'm') {
    if (modes[0] == '_reset') return ''
    let rv = '\x1b[', l = modes.length - 1
    modes.forEach((m, n, a) => rv += `${ansiCode[m]}${n < l ? ';' : term}`)
    return rv
  }
  export function ansiText(modes: AnsiKey[], text: string) {
    let end = modes.pop()
    if (!ansiReset.includes(end as AnsiEnd)) { modes.push(end); end = 'reset' }
    return `${ansiEsc(modes)}${text}` + `${ansiEsc([end])}`

  }
  /** extended form of colors() that allows modes to contain:
   * [..., 'rgb', [r,g,b], 'rgb', 'colorname', 'n256', colorNum]
   * 
   * Note: using [rbg: 'colorname'] delegates to C.nameToRgba(name) and requires Document & Canvas
   */
  export function ansiText2(modes: (AnsiKey | string | number[])[], text: string): string {
    let end = modes.pop() as AnsiKey
    if (!ansiReset.includes(end as AnsiEnd)) { modes.push(end); end = 'reset' }
    let esc = ansiEsc([]), l = modes.length - 1
    modes.forEach((m, n) => {
      if (n > 0 && modes[n - 1] == 'rgb') {
        if (typeof m == 'string') {
          let [r, g, b] = C.nameToRgba(m)
          esc += `${r};${g};${b}`
        } else {
          let [r, g, b] = m
          esc += `${r};${g};${b}`
        }
      } else if (n > 0 && modes[n - 1] == 'n256') {
        esc += `${m}`
      } else {
        esc += ansiCode[m as AnsiKey]
      }
      esc += (n < l) ? ';' : 'm'
    })
    return `${esc}${text}` + `${ansiEsc([end])}`
  }
  // console.log(stime('', `//Hello ${ansiText2(['bold','rgb', ([20,150,80] as any as AnsiKey)], 'Green', )} world`))
  // console.log(stime('', `//Hello ${ansiText(['under', 'green'], 'Green', )} world`))
  // console.log(stime('', `//Hello ${ansiText(['under', 'bold', 'green'], 'Bold Green', )} world`))
  // console.log(stime('', `//Hello ${ansiText(['under', 'dim', '$green'], 'Dim $Green', )} world`))
  // console.log(stime('', `//Hello ${ansiText(['under', '$green'], ' $Green', )} world`))
  // console.log(stime('', `//Hello ${ansiText(['under', 'bold', '$green'], 'Bold $Green', )} world`))
}