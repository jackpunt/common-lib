import { Container, DisplayObject, Matrix2D } from 'createjs-module';
import { XY } from './basic-intfs';
export declare class Dragole {
    /** external injection point */
    static logCount: (count: number) => void;
    /** external injection point */
    static logMsg: (msg: any, ...args: any[]) => void;
    static count: number;
    static logRate: number;
    static reset(val?: number): void;
    static inc(): void;
    static logEvent(msg: string): void;
    /** console.log(stime(this), msg?, ...args) every n samples */
    static log(n: number, msg?: any, ...args: any[]): void;
}
/** the 'dragCtx' values, and scale things. */
export interface DragInfo {
    first: boolean;
    nameD: string;
    srcCont: Container;
    lastCont: Container;
    eventX: number;
    eventY: number;
    dxy: XY;
    objx: number;
    objy: number;
    scalmat: Matrix2D;
    targetC: Container;
    targetD: DisplayObject;
    rotation: number;
    scope: Object;
}
/**
 * expect a singleton instance to control drag/drop on a single ScalableContainer
 *
 * TODO: make instance rather than everthing static.
 */
export declare class Dragger {
    /** Info about the current drag operation, shared between pressmove(s) and pressup. */
    static DRAG_CONTEXT: DragInfo;
    static dragCont: Container;
    /**
     * Make the Dragger.dragCont dragCont
     * @param parent the createjs Stage, unless you know better
     */
    static DragCont(parent?: Container): void;
    /**
     * addEventListeners for pressmove/pressup (stagemousedown/up and stagemousemove)
     * Drag this DispObj on stage.dragCont; and drop (addChild) on the orig OR new parent.
     * @param dispObj the object to become dragable
     * @param scope object to use a 'this' when calling dragfunc, dropfunc (default dispObj.parent?)
     * @param dragfunc? f(dispObj|Container, dragCtx) Default: lastCont.addChild(obj)
     * @param dropfunc? f(dispObj|Container, dragCtx)
     * @param asDispObj? true if Container should be dragged as DisplayObject
     */
    static makeDragable(dispObj: DisplayObject | Container, scope?: Object, dragfunc?: ((c: DisplayObject | Container, ctx?: DragInfo) => void), dropfunc?: ((c: DisplayObject | Container, ctx?: DragInfo) => void), asDispObj?: boolean): void;
    /** remove pressmove and pressup listenerf from dispObj. */
    static stopDragable(dispObj: DisplayObject): void;
}
