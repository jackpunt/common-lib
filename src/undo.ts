import { stime } from './index.js';

/** Generic Undo record: closure OR {object:, field:, value:} */
export class UndoRec {
  aname: string
  obj: Function | Object
  key: string | undefined // if obj, use: () => { obj[key] = value }
  value: any
  /** 
   * supply (obj, "aname", func) OR (obj, "field", value)
   * If typeof(value) == "function", it is called with no parameters: value.call(obj)
   * @param obj the object to be restored/modified during undo ('this' when typeof(value) == 'function')
   * @param name the field to be restored (or aname for supplied value function)
   * @param value the field-value to be stored in obj[name] (or closure: () => obj.method(...args))
   */
  constructor(obj: Object, name: string, value: any) {
    // aname is only used for testing/debugging, to identify the function being used:
    let vname = (value && !!value.name ? value.name : value)
    this.aname = (value instanceof Function) ? (!!name ? name : value.name) : `${obj["name"] || obj.constructor.name}[${name}]=${vname}`
    this.obj = obj
    this.key = name
    this.value = value
  }

  /** invoke function() OR obj[key] = value */
  apply() {
    if (typeof(this.value) == "function") {
      (this.value as Function).call(this.obj)
    } else {
      this.obj[this.key] = this.value
    }
  }
}
/** a stack of UndoRec */
export class Undo extends Array<UndoRec[]> {
  openRec: UndoRec[] = new Array<UndoRec>(0)
  /** Do not ADD undo records or arrays while doing an Undo! */
  enabled: boolean = false;
  isUndoing: boolean = false;

  /** allow addUndoRec & closeUndo */
  enableUndo(): this { this.enabled = true; return this; }
  /** no new undoRecs. */
  disableUndo(): this { this.enabled = false; return this } // this.length = 0?
  /** add new UndoRec if enabled. */
  addUndoRec(obj: Object, name: string, value: any): UndoRec | undefined {
    let rec: UndoRec
    if (this.enabled) {
      rec = new UndoRec(obj, name, value)
      this.openRec.push(rec)
    }
    return rec
  }
  /** close and delete all undoRecs. */
  flushUndo(): this { this.openRec = new Array<UndoRec>(0); this.length = 0; return this } 
  /** push current UndoRec[], open a new one. */
  closeUndo(): this {
    if (this.enabled && this.openRec.length > 0) {
      this.push(this.openRec)
      this.openRec = new Array<UndoRec>(0)
    }
    return this
  }
  /** push openRec, even if empty or !this.enabled 
   * @param note aid to debug, mark the push'd UndoRec
  */
  saveUndo(note?: string): this {
    this.openRec['_enabled'] = this.enabled // marker of save point
    this.openRec['_note'] = note
    this.push(this.openRec)
    this.openRec = new Array(0) // Array<UndoRec>(0)
    return this
  }

  /** pop all UndoRecs back to previous saveUndo; restore that openRec, and reseet this.enabled. */
  restoreUndo(popAll = true): this {
    if (popAll) while (this[this.length-1]['_enabled'] == undefined) this.pop() // popAll
    this.openRec = super.pop()
    this.enabled = this.openRec['_enabled']
    delete this.openRec['_enabled']; delete this.openRec['_note']
    return this
  }
  /** Undo.pop() also pops and applies all the UndoRecs before returning. 
   * @return the [now empty] UndoRec that was removed and applied (may be undefined)
   */
  override pop(): UndoRec[] {
    let enable = this.enabled
    this.enabled = false   // prevent new Undo
    this.isUndoing = true;
    let undoRec = super.pop()
    try {
      while (!!undoRec && undoRec.length > 0) { // process undo records in reverse order
        undoRec.pop().apply()
      }
    } catch(err) {
      console.log(stime(this, `.pop: Error=`), err)
    } finally {
      this.isUndoing = false;
      this.enabled = enable
      return undoRec
    }
  }
}
