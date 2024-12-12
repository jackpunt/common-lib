import { Random } from "./random";

/** extra name field from constructor/class */
export function className (obj: { constructor: { name: any; }; }): string { 
  return (obj === undefined) ? 'undefined' : (!!obj && obj.constructor) ? obj.constructor.name : 'no_class'
}
// https://www.typescriptlang.org/docs/handbook/mixins.html

export type Constructor<T = {}> = new (...args: any[]) => T;
/** runtime construction of object with merged prototype. */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
/** timestamp, annotation, prefix (constructor name) and initial/format string. */
export function stime (obj?: string | { constructor: { name: string; }; }, f: string = ''): string { 
  let anno = stime.anno(obj)
  let name = (typeof obj === 'object') ? className(obj) : (obj || '')
  let spac = (name == '') && (f == '') ? '' : ' '
  return `${stime.fs()}${anno}${spac}${name}${f}`
}
/** supply an annotation after the time stamp. */
stime.anno = (obj: string | { constructor: { name: string; }; }) => {
  let stage = obj?.['stage'] || obj?.['table']?.['stage']
  return !!stage ? (!!stage.canvas ? " C" : " N") : " -" as string
}
/** fields to extract from toISOString; see stime.fs.
 * 
 * Default: MM-DDTkk:mm:ss.SSSL
 */
stime.fmt = "MM-DD kk:mm:ss.SSSL";
stime.isoFields = {
    YYYY: [0, 4], YY: [2, 4], MM: [5, 7], DD: [8, 10], T: [10, 11],
    kk: [11, 13], mm: [14, 16], ss: [17, 19], SSS: [20, 23], SS: [20, 22], S: [20, 21], Z: [23, 24]
  } as {[index:string]: [start: number, end: number]};
/** format fields of ISO date string: YYYY MM DD kk mm ss SSS L/ll/LL/OO
 * replace fmt letters with indicated substring of Date.toISOString()
 * @param fmt YYYY-MM-DDTkk:mm:ss.SSSZ
 * @param hh - 12Hr (zero filled); optionally with: PM/pm
 * @param HH - 12Hr (space filled); optionally with: PM/pm
 * @param L - use local timezone, LL -> show Z+/-offset (no-fill), LLL (zero-fill) 
 * @param OO - force include minute offset: LLLOO or LLOO
 */
stime.fs = ((fmt = stime.fmt, date = new Date()) => {
  const isoTZ = (fmt: string, date: Date) => {
    if (fmt.includes('L')) {
      let tzo = date.getTimezoneOffset(), hoff = -Math.floor(tzo / 60)
      date.setMinutes(date.getMinutes() - tzo) // Zulu -> Local
      if (fmt.includes('LL')) {
        let LLL = fmt.includes('LLL')
        let moff = (tzo % 60).toString().padStart(2, '0')
        let LLOO = fmt.includes('OO')
        let ooff = `${(LLOO || moff != '00') ? moff : ''}`
        let zoff = `${hoff > 0 ? '+' : '-'}${Math.abs(hoff).toString().padStart(2, LLL ? '0' : '')}${!LLOO ? ooff : ''}`
        let rv = fmt.replace('LLL', zoff).replace('LL', zoff).replace('OO', ooff)
        return [rv, date.toISOString()]
      } else {
        return [fmt.replace('L', ''), date.toISOString()]
      }
    }
    return [fmt, date.toISOString()]
  }
  let [rv, isoString] = isoTZ(fmt, date)
  if (fmt.includes('hh') || fmt.includes('HH')) {
    let kk = Number.parseInt(isoString.substring(...stime.isoFields['kk']))
    let hh = (kk > 12 ? kk - 12 : kk).toString().padStart(2, '0')
    let HH = (kk > 12 ? kk - 12 : kk).toString().padStart(2, ' ')
    rv = rv.replace('hh', hh)
    rv = rv.replace('HH', HH)
    if (kk > 12 && fmt.includes('am')) rv = rv.replace('am', 'pm')
    if (kk > 12 && fmt.includes('AM')) rv = rv.replace('AM', 'PM')
  }
  Object.keys(stime.isoFields).forEach(key => rv = rv.replace(key, isoString.substring(...stime.isoFields[key])));
  return rv
}) as ((fmt?: string, date?: Date) => string);

/** compact JSON.stringify(obj) ["key": -> key:][\\ -> \] */
export function json(obj: object, unquoteKeys = true, rm2Esc = true) {
  let rv = JSON.stringify(obj)
  if (rm2Esc) rv = rv.replace(/\\\\/g, '\\') // remove double-escape 
  if (unquoteKeys) rv = rv.replace(/"(\w*)":/g, '$1:') // BEWARE: "key": '"foo":bar'  -> key: 'foo:bar'
  if (unquoteKeys) rv = rv.replace(/([{,])"(\w*)":/g, '$1$2:')
  return rv
}
/** check process.arg then process.env then defVal */
export function argVal(name: string, defVal: string, k: string = '--'): string {
  const envVal = process.env[name] || defVal
  const argKey = (k == '=') ? `${name}${k}` : `${k}${name}`
  const argVal = process.argv.find((val, ndx, ary) => (ndx > 0 && ary[ndx - 1] == argKey)) || envVal
  return argVal
}
/** suitable input to new URL(url) */
export function buildURL(scheme: string, host: string, domain: string, port: number, path?: string): string {
  return `${scheme}://${host}.${domain}:${port}/${!!path?path:''}`
}
/** drill down through value of inner fields. */
export function findFieldValue(obj: object, ... names: Array<string|Array<string>> ): any {
  let n = names.shift(), next: any
  if (!n) return obj            // return obj when no more field accessors
  if (typeof(n) == 'string') {
    next = obj[n]
  } else {
    let nn = n.find(n => !!obj[n])
    next = !!nn ? obj[nn] : !!n[0] ? undefined : obj // [null, foo, bar] -> next = obj
  }
  return !!next ? findFieldValue(next, ... names) : undefined
}

/** promise functions */
/**
 * While predicate returns truthy, invoke actionP and then recurse (when Promise is fulfilled)
 * @param pred if true then invoke actionP().then(-recurse-)
 * @param actionP preforms some computation and returns a Promise\<T>
 * @param v value: \<T> returned when actionP promise fulfills
 * @param args context args supplied to pred and actionP (v, ...args)
 */
 export function whileP<T>(pred: (v?: T, ...args: any) => boolean, actionP: (v?: T, ...args: any) => Promise<T>, v?: T, ...args: any) {
  if (pred(v, ...args)) {
    let p = actionP(v, ...args)
    p.then((v: T) => whileP(pred, actionP, v, ...args))
  }
}

/**
 * Invoke actionP and then (when Promise is fulfilled) if (pred is false) recurse 
 * @param pred if false then (-recurse-)
 * @param actionP preforms some computation and returns a Promise\<T>
 * @param v value: \<T> returned when actionP promise fulfills
 * @param args context args supplied to pred and actionP (v, ...args)
 */
export function untilP<T>(pred: (v?: T, ...args: any) => boolean, actionP: (v?: T, ...args: any) => Promise<T>, v?: T, ...args: any) {
  let p = actionP(v, ...args)
  p.then((v: T) => !pred(v, ...args) && untilP(pred, actionP, v, ...args))
}

/**
 * A Promise that resolves to the given value after ms msecs.
 * @param ms how long to wait before resolving.
 * @param value any value.
 * @returns a Promise that resolves to the given value in ms msecs.
 */
export function timedPromise<T>(ms: number, value?: T): Promise<T> {
  return new Promise((res, rej) => setTimeout(() => res(value), ms))
}

/** TODO: get es2015 Iterable of Map.entries work... */
// https://github.com/Microsoft/TypeScript/issues/9030
export function entriesArray<K,V>(k: Map<K,V>) {
  let rv: [K,V][] = []
  for (let m of k) { rv.push(m) }
  return rv
}

/** randomly select N elements from given array. 
 * @param bag the array of selectable elements.
 * @param remove splice selected elements from from bag.
 * @return an array containing the selected elements.
 */
export function selectN<T>(bag: T[], n = 1, remove = true) {
  const rv: T[] = [];
  for (let i = 0; i < n; i++) {
    const index = Random.random(bag.length);
    rv.push(remove ? bag.splice(index, 1)[0] : bag[index]);
  }
  return rv;
}

/** Randomly re-order the elements of the given array (in place) and return it. */
export function permute<T>(stack: T[]): T[] {
  for (let i = 0, len = stack.length; i < len; i++) {
    let ndx: number = Random.random(len - i) + i;
    let tmp = stack[i];
    stack[i] = stack[ndx]
    stack[ndx] = tmp;
  }
  return stack;
}

/** rotate elements of Array by n positions.
 * @example
 * abcdef: n=1 -> bcdefa; n=2 -> cdefab (CCW)
 * abcdef: n=1 -> fabcde; n=2 -> efabcd (CW)
 * 
 * @param ary
 * @param cw [true] false for ccw rotation
 */
export function rotateAry(ary: any[], n = 1, cw = true) {
  if (cw) n = ary.length - n;
  const tail = ary.slice(n);
  const head = ary.slice(0, n);
  tail.push(...head);
  return tail;
}

/** 
 * Select items from 'a' that are also in 'b' (based on keyf).
 * 
 * That is: select a[i] where keyf(a[i]) === keyf(b[j]), for each i (in a) and some j (in b).
 * 
 * Like: a.filter(va => b.find(vb => keyf(va) === keyf(vb)))
 * 
 * elements of 'a' that appear (& match) twice appear in result twice.
 */
export function Arrays_intersect<T>(a: T[], b: T[], keyf: ((v: T) => any) = v => v) {
  // return a.filter(va => b.find(vb => keyf(va)===keyf(vb)))
  const [outer, inner] = [a, b];
  const outerKey = outer.map(keyf);
  const innerKey = inner.map(keyf);
  return outer.filter((av, n) => innerKey.includes(outerKey[n]));
}

/** splice first instance of 'elt' from given 'array' */
export function removeEltFromArray<T>(elt: T, array: T[]): T[] {
  return array.splice(array.indexOf(elt), 1);
}

/** reduce to one of each element: ary.forEach(elt => (!rv.includes(elt) -> rv.push(elt))) */
export function uniq<T>(ary: T[]) {
  const rv: T[] = [];
  ary.forEach(elt => rv.includes(elt) || rv.push(elt));
  return rv;
}
