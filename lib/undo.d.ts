/** Generic Undo record: closure OR {object:, field:, value:} */
export declare class UndoRec {
    aname: string;
    obj: Function | Object;
    key: string | undefined;
    value: any;
    /**
     * supply (obj, "aname", func) OR (obj, "field", value)
     * If typeof(value) == "function", it is called with no parameters: value.call(obj)
     * @param obj the object to be restored/modified during undo ('this' when typeof(value) == 'function')
     * @param name the field to be restored (or aname for supplied value function)
     * @param value the field-value to be stored in obj[name] (or closure: () => obj.method(...args))
     */
    constructor(obj: Object, name: string, value: any);
    /** invoke function() OR obj[key] = value */
    apply(): void;
}
/** a stack of UndoRec */
export declare class Undo extends Array<UndoRec[]> {
    openRec: UndoRec[];
    /** Do not ADD undo records or arrays while doing an Undo! */
    enabled: boolean;
    isUndoing: boolean;
    /** allow addUndoRec & closeUndo */
    enableUndo(): this;
    /** no new undoRecs. */
    disableUndo(): this;
    /** add new UndoRec if enabled. */
    addUndoRec(obj: Object, name: string, value: any): UndoRec | undefined;
    /** close and delete all undoRecs. */
    flushUndo(): this;
    /** push current UndoRec[], open a new one. */
    closeUndo(): this;
    /** Undo.pop() also pops and applies all the UndoRecs before returning.
     * @return the [now empty] UndoRec that was removed and applied (may be undefined)
     */
    pop(): UndoRec[];
}
