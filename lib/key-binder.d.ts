import { DisplayObject, EventDispatcher } from 'createjs-module';
/**
 * Must insert code into app.components.ts
 * which will instantiate a KeyBinder, and use @HostListener to forward keyboard events.
 *
  constructor(private keyBinder: KeyBinder) { }

  // app.component has access to the 'Host', so we use @HostListener here
  // Listen to all Host events and forward them to our internal EventDispatcher
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('mouseenter', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('focus', ['$event'])
  @HostListener('blur', ['$event'])
  dispatchAnEvent(event) {
    //console.log(stime(this), "dispatch: "+event.type);
    this.keyBinder.dispatchEvent(event);
  }
 *
 * and in app.modules.ts:

 providers: [
    KeyBinder,
  ],

 *
 */
declare type KeyBits = {
    shift?: boolean;
    ctrl?: boolean;
    meta?: boolean;
    alt?: boolean;
    keyup?: boolean;
};
declare type BindFunc = (arg?: any, e?: KeyboardEvent) => void;
/**
 * kcode is bound to Binding, invokes: func.call(scope, argVal, event)
 */
export declare type Binding = {
    thisArg?: object;
    func: BindFunc;
    argVal?: any;
};
/** EventDispatcher with keybinding (key->func(e)) */
export declare class KeyBinder extends EventDispatcher {
    static keyBinder: KeyBinder;
    constructor();
    private keymap;
    private focus;
    /**
     * Convert shift indicators to binary-mapped number.
     * Extend numeric keycode with SHIFT, CTRL, META, ALT, KEYUP bits
     * @param kcode unicode(char)
     * @param bits KeyBits
     * @returns kcode with higher order bits possibly set
     */
    getKeyCode(kcode: number, bits?: KeyBits): number;
    /**
     * setting modifier values for key binding: keyup-ctrl-alt-meta-shift char
     * x or X for shift.
     * @param str "^-C-A-M-X" or "^-C-A-M-x" (in that order, for other bits)
     * @return keyCode of "X" with indicated shift-bits added in.
     */
    getKeyCodeFromChar(str: string): number;
    static key_keyCode: {
        Bel: number;
        Backspace: number;
        Tab: number;
        Enter: number;
        Control: number;
        Shift: number;
        AltLeft: number;
        AltRight: number;
        Escape: number;
        ArrowLeft: number;
        ArrowUp: number;
        ArrowRight: number;
        ArrowDown: number;
        MetaLeft: number;
        MetaRight: number;
    };
    getKeyCodeFromEvent(e: KeyboardEvent): number;
    _bindKey(keymap: object, kcode: number, bind: Binding): void;
    globalSetKey(kcode: number, bind: Binding): void;
    /**
     * Bind key to event handling function.
     * @param str a string describing a single keychord.
     * @param bind a Binding {thisArg: keymap, func: ()=>void, argVal?: arg}
     */
    globalSetKeyFromChar(str: string, bind: Binding): void;
    localSetKey(scope: DisplayObject, kcode: number, bind: Binding): void;
    localSetKeyFromChar(scope: DisplayObject, str: string, bind: Binding): void;
    /** dispatch keyup and keydown events [keypress dispatches to keydown, the default]
     * KeyboardEvent is HTML Event, so current/target path is: window, document, html, body
     * Useless for 'local' bindings; we need a 'focus' on DisplayObject, and target to that.
     * Text/EditBox can listen for 'click' and set focus. (currentTarget)
     * Text/EditBox can listen for 'Enter' and release focus (blur) [also: onCollapse of menu]
     */
    dispatchKey(e: KeyboardEvent): void;
    /** invoke keyBound function as if kcode(str) was received. */
    dispatchChar(str: string): void;
    /**
     * Dispatch based on keycode.
     * @param kcode extracted from KeyboardEvent, or synthesized from getKeyCodeFromChar(str)
     * @param e optional KeyboardEvent for logging
     */
    dispatchKeyCode(kcode: number, e?: KeyboardEvent): void;
    details: boolean;
    private initListeners;
    showKeyEvent(str: string, e: KeyboardEvent): void;
}
export {};
