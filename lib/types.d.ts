import type { EventDispatcher } from 'createjs-module';
export declare function className(obj: {
    constructor: {
        name: any;
    };
}): string;
/** timestamp and prefix string from constructor name. */
export declare function stime(obj?: {
    constructor: {
        name: string;
    };
}, f?: string): string;
export declare namespace stime {
    var fmt: string;
}
/** compact string of JSON from object */
export declare function json(obj: object): string;
/** drill down through value of inner fields. */
export declare function findFieldValue(obj: object, ...names: Array<string | Array<string>>): any;
/**
 * Hack to createjs: remove listener from target before invoking listener.
 * @param target the EventDispatcher emitting Event(type)
 * @param type the Event to listener for
 * @param listener the function to run
 * @param scope a thisArg for invoking the listener
 * @param wait if supplied: setTimeout() for wait msecs before calling listener
 */
export declare function dispatchOnce(target: EventDispatcher, type: string, listener: (evt?: Object, ...args: any[]) => void, scope?: Object, wait?: number): void;
