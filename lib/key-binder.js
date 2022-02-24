import { EventDispatcher, Shape } from 'createjs-module';
import { C, S } from './basic-intfs';
import { stime } from './types';
/** EventDispatcher with keybinding (key->func(e)) */
export class KeyBinder extends EventDispatcher {
    constructor() {
        super();
        this.details = false; // details of event to console.log 
        this.keymap = Array();
        this.keymap["scope"] = "global";
        this.initListeners();
        console.log(stime(this, ".constructor KeyBinder.keyBinder = "), this);
        KeyBinder.keyBinder = this;
    }
    /**
     * Convert shift indicators to binary-mapped number.
     * Extend numeric keycode with SHIFT, CTRL, META, ALT, KEYUP bits
     * @param kcode unicode(char)
     * @param bits KeyBits
     * @returns kcode with higher order bits possibly set
     */
    getKeyCode(kcode, bits = {}) {
        const SHIFT = 512;
        const CTRL = 1024;
        const META = 2048;
        const ALT = 4096;
        const KEYUP = 8192;
        return kcode
            | (bits.shift ? SHIFT : 0)
            | (bits.ctrl ? CTRL : 0)
            | (bits.meta ? META : 0)
            | (bits.alt ? ALT : 0)
            | (bits.keyup ? KEYUP : 0);
    }
    /**
     * setting modifier values for key binding: keyup-ctrl-alt-meta-shift char
     * x or X for shift.
     * @param str "^-C-A-M-X" or "^-C-A-M-x" (in that order, for other bits)
     * @return keyCode of "X" with indicated shift-bits added in.
     */
    getKeyCodeFromChar(str) {
        const UPPER = /[A-Z]/;
        const LOWER = /[a-z]/;
        let obj = {};
        if (str.startsWith("^-")) {
            obj.keyup = true;
            str = str.substring(2);
        }
        if (str.startsWith("C-")) {
            obj.ctrl = true;
            str = str.substring(2);
        }
        if (str.startsWith("M-")) {
            obj.meta = true;
            str = str.substring(2);
        }
        if (str.startsWith("A-")) {
            obj.alt = true;
            str = str.substring(2);
        }
        let char = str.charAt(0); // Assert: a single [ASCII/utf8] char in the string
        if (UPPER.exec(char)) {
            obj.shift = true;
        }
        else if (LOWER.exec(char)) {
            char = char.toUpperCase();
        }
        return this.getKeyCode(char.charCodeAt(0), obj); // numeric unicode for char (OR key)
    }
    getKeyCodeFromEvent(e) {
        // Shift-down = 528 = 16 + 512 (because e.shiftKey is set on keydown)
        // Shift-up = 8208 = 16 + 8192 (because e.keyup)
        // Use key name; but use numeric code for non-char keys: "Shift", "Enter" or whatever
        let key = e.key, kcode = (key.length == 1) ? this.getKeyCodeFromChar(key) : e.keyCode;
        let keycode = this.getKeyCode(kcode, {
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            meta: e.metaKey,
            alt: e.altKey,
            keyup: (e.type == "keyup")
        });
        return keycode;
    }
    _bindKey(keymap, kcode, bind) {
        //console.log(stime(this, "_bindKey: "), { kcode: kcode, func: bind, scope: keymap["scope"] });
        if (typeof (bind.func) == 'function') {
            keymap[kcode] = bind;
        }
        else if (!!bind.func) {
            let msg = "KeyBinder.globalSetKey: unrecognized key-binding";
            console.log(stime(this, "_bindKey:"), msg, { bind: bind });
            alert(msg);
        }
        else {
            delete keymap[kcode];
        }
    }
    // arg:function crashes tsc [3/2017]
    // func:function(e, p, k)
    globalSetKey(kcode, bind) {
        this._bindKey(this.keymap, kcode, bind);
    }
    /**
     * Bind key to event handling function.
     * @param str a string describing a single keychord.
     * @param bind a Binding {thisArg: keymap, func: ()=>void, argVal?: arg}
     */
    globalSetKeyFromChar(str, bind) {
        this.globalSetKey(this.getKeyCodeFromChar(str), bind);
    }
    localSetKey(scope, kcode, bind) {
        this._bindKey(scope["_keymap"], kcode, bind);
    }
    localSetKeyFromChar(scope, str, bind) {
        this._bindKey(scope["_keymap"], this.getKeyCodeFromChar(str), bind);
    }
    // NOTE: bindings will be to kcode chord with a letter, not just shift keys.
    // However, it could happen that C-X is seen before C-M-X, so both would be triggered.
    // Q: Do we need to wait nnn-msecs, so see if another event comes to replace the current one?
    // nnn < ~50 ?
    // Promise to resolve to (func.call(this, e, kcode0))
    // but when new chord comes, attempt to cancel the Promise, and replace
    /** dispatch keyup and keydown events [keypress dispatches to keydown, the default]
     * KeyboardEvent is HTML Event, so current/target path is: window, document, html, body
     * Useless for 'local' bindings; we need a 'focus' on DisplayObject, and target to that.
     * Text/EditBox can listen for 'click' and set focus. (currentTarget)
     * Text/EditBox can listen for 'Enter' and release focus (blur) [also: onCollapse of menu]
     */
    dispatchKey(e) {
        this.dispatchKeyCode(this.getKeyCodeFromEvent(e)); // encode all the C-M-A-Shift bits:
    }
    /** invoke keyBound function as if kcode(str) was received. */
    dispatchChar(str) {
        this.dispatchKeyCode(this.getKeyCodeFromChar(str)); // for ex: "^-C-M-z"
    }
    /**
     * Dispatch based on keycode.
     * @param kcode extracted from KeyboardEvent, or synthesized from getKeyCodeFromChar(str)
     * @param e optional KeyboardEvent for logging
     */
    dispatchKeyCode(kcode, e) {
        let keymap = (!this.focus) ? this.keymap : this.focus["_keymap"];
        let bind = keymap[kcode];
        if (this.details) // TODO: maybe use console.debug()
            console.log(stime(this, "dispatchKeyCode:"), { key: e.key, bind: bind, kcode: kcode, keymap: keymap, focus: this.focus }, e);
        if (!!bind && typeof (bind.func) == 'function') {
            bind.func.call(bind.thisArg, bind.argVal, e);
        }
    }
    initListeners() {
        console.log(stime(this, ".initListeners: THIS (new KeyBinder) ="), this);
        this.on("keydown", this.dispatchKey, this)[S.aname] = "KeyBinder.dispatchKey";
        this.on("keyup", this.dispatchKey, this)[S.aname] = "KeyBinder.dispatchKey";
        // let mousein = (e) => {evtd.showevent("onFocus", e)};
        // this.addEventListener("mouseenter", mousein);
        // let mouseout = (e) => {evtd.showevent("onBlur", e)};
        // this.addEventListener("mouseleave", mouseout);
    }
    showKeyEvent(str, e) {
        console.log(stime(this), str, { Key: JSON.stringify(e.key), Kcode: this.getKeyCodeFromEvent(e), event: e });
    }
}
// if you want to replace deprecated e.keycode:
KeyBinder.key_keyCode = {
    Bel: 7, Backspace: 8, Tab: 9, Enter: 13, Control: 17, Shift: 16, AltLeft: 18, AltRight: 19,
    Escape: 27, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40,
    MetaLeft: 91, MetaRight: 93
}; // '[' : 219
/** a [Rectangle] Shape that holds a Text
 * keystrokes to the Shape are inserted into the Text.
 *
 * EditBox:
 * localSetKey(BS,DEL,C-A, C-K, C-W, C-Y, C-B, C-F) to edit functions...?
 */
class TextBox extends Shape {
    constructor() {
        super();
        let g = this.graphics;
    }
    setText(text, fontSize, fontName, color = C.black) {
    }
    setBind(w, h, init, focus, blur) {
    }
}
//# sourceMappingURL=key-binder.js.map