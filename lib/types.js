import * as moment from 'moment';
export function className(obj) {
    return (obj === undefined) ? 'undefined' : (!!obj && obj.constructor) ? obj.constructor.name : 'no_class';
}
// Logially, stime could have been in basicIntfs, but don't want to pollute that with import/dependencies
/** timestamp and prefix string from constructor name. */
export function stime(obj, f) {
    let stage = !!obj && (obj['stage'] || (!!obj['table'] && obj['table']['stage']));
    let canv = !!stage ? (!!stage.canvas ? " C" : " N") : " -";
    let name = !!obj ? (" " + className(obj)) : "";
    if (!!f)
        name = name + f;
    return moment().format(stime.fmt) + canv + name;
}
stime.fmt = "MM-DD kk:mm:ss.SSS";
/** compact string of JSON from object */
export function json(obj) {
    return JSON.stringify(obj).replace(/"/g, '');
}
/** drill down through value of inner fields. */
export function findFieldValue(obj, ...names) {
    let n = names.shift(), next;
    if (!n)
        return obj; // return obj when no more field accessors
    if (typeof (n) == 'string') {
        next = obj[n];
    }
    else {
        let nn = n.find(n => !!obj[n]);
        next = !!nn ? obj[nn] : !!n[0] ? undefined : obj; // [null, foo, bar] -> next = obj
    }
    return !!next ? findFieldValue(next, ...names) : undefined;
}
/**
 * Hack to createjs: remove listener from target before invoking listener.
 * @param target the EventDispatcher emitting Event(type)
 * @param type the Event to listener for
 * @param listener the function to run
 * @param scope a thisArg for invoking the listener
 * @param wait if supplied: setTimeout() for wait msecs before calling listener
 */
export function dispatchOnce(target, type, listener, scope = target, wait) {
    let removeMe = (evt, ...args) => {
        target.off(type, listnr);
        if (!wait) {
            listener.call(scope, evt, ...args);
        }
        else {
            setTimeout(() => listener.call(scope, evt, ...args), wait);
        }
    };
    let listnr = target.on(type, removeMe, scope, true); // on Event(type), remove, wait, then run *once*
}
//# sourceMappingURL=types.js.map