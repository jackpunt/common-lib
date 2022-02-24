import { Container, DisplayObject, Matrix2D, Event } from 'createjs-module';
import { XY } from './basic-intfs';
export declare type SC = ScaleableContainer;
declare type ScaleParams = {
    zscale?: number;
    initScale?: number;
    zero?: number;
    base?: number;
    min?: number;
    max?: number;
    limit?: number;
};
export declare class ScaleEvent extends Event {
    constructor(type: string, scale: number, scaleNdx: number);
    scale: number;
    scaleNdx: number;
}
/** ScalableContainer is a Container, implements transforms to scale the display.
 * Child elements can be scaled with the Container (addChild)
 * or remain a constant size even as the Container scales (addUnscaled)
 */
export declare class ScaleableContainer extends Container {
    transform?: Matrix2D;
    initIndex: number;
    /**
      * Create a Container
      * then makeZoomable: so can Zoom/unZoom at the mouse-point
      * if there are interposed transforms, it may not work right.
      * @param parent If supplied: parent.addChild(this); [createjs.stage]
      */
    constructor(parent?: Container, params?: ScaleParams);
    /** scale factor of  for each increment of zoom */
    private scaleAry;
    private scaleNdx;
    private scaleMin;
    private scaleMax;
    private scaleBase;
    private scaleZero;
    private scaleLimit;
    private stopEvent;
    /**
     * addEventListener for mousewheel and DOMMouseScroll to zoom to/from XY.
     * @param zscale sensitivity to event.wheelDelta (.3)
     * @return initial {index, scale}
    */
    makeZoomable(params?: ScaleParams): number;
    /** reset the zoom-scaling array:
     *
     * Note: unscaled objects *are* scaled when scaleNdx\<0 (if min\<0)
     *
     * Note: unscaled objests are super-scaled (1.5x) when scaleNdx>(max-2)
     * @param params: {initScale = 1, zero: 0.625}
     * @param zero: default scale: 0.625
     * @param base: scale per increment: 1.26
     * @param min: lowest index: -3  (zero*base^(-min) =? ~1) ==> scaleAry[0] = ~1
     * @param max: highest index: 30
     * @param limit: highest scale: 1000
     * @return scaleIndex to scale to 1 (or close as possible)
     */
    scaleInit(params?: ScaleParams): number;
    /** find scaleIndex that gets closest to scale
     * @param initScale the scale factor you want to get
     * @param setAry true to setup the scaleAry, false to simply query [default]
     * @return index that gets closest so given scale
     */
    findIndex(initScale: number, set?: boolean): number;
    /** set scaleIndex & return associated scale factor */
    getScale(ndx?: number): number;
    /** add di to find new index into scale array
     * @param di typically: -1, +1 (0 to return currentScale)
     */
    incScale(di: number): number;
    /** zoom to the scale[si] */
    setScaleIndex(si: number, p?: XY): void;
    /** Scale this.cont by the indicated scale factor around the given XY.
     * @param di: +1/-1 to increase/decrease scale; 0 to reset to scale0 @ XY
     * @param p:  scale around this point (so 'p' does not move on display) = {0,0}
     */
    scaleContainer(di: number, p?: XY): void;
    /** convert from os to ns; if os=0 then reset to ns
     * unscaleObj all this._unscale objects.
     * @param os oldScale
     * @param ns newScale
     * @param p  fixed point around which to scale; default: (0,0) OR when os==0: reset to (x,y)
     */
    scaleInternal(os: number, ns: number, p?: XY): void;
    /** Scalable.container.addChild() */
    addChildXY(child: DisplayObject, x: number, y: number): DisplayObject;
    private invScale;
    private _unscaled;
    addUnscaled(dobj: DisplayObject): void;
    removeUnscaled(dobj: DisplayObject): void;
    private unscaleObj;
    private unscaleAll;
}
export {};
