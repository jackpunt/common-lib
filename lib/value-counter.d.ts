import { Container, Event, Shape, Text, EventDispatcher } from 'createjs-module';
import { XY } from './basic-intfs';
/** send a simple value of type to target. */
export declare class ValueEvent extends Event {
    value: number | string;
    constructor(type: string, value: number | string);
    /** dispatch ValueEvent via target */
    static dispatchValueEvent(target: EventDispatcher, type: string, value: number | string): boolean;
}
/** Text in a colored circle, possibly with a lable */
export declare class ValueCounter extends Container {
    color: string;
    text: Text;
    textColor: string;
    shape: Shape;
    value: number | string;
    /** width of curently displayed ellipse */
    wide: number;
    /** height of curently displayed ellipse */
    high: number;
    /** font size in px */
    fontSize: number;
    fontName: string;
    fontSpec: string;
    label: Text;
    labelFontSize: number;
    constructor(name: string, initValue?: number | string, color?: string, fontSize?: number, fontName?: string);
    /** repaint shape and text with new color/size/font.
     * Invoked by supplying extra args to setValue().
     */
    private setFont;
    /**
     *
     * @param value string to display near value
     * @param offset from center of text to origin of oval
     * @param fontSize
     */
    setLabel(value: string | Text, offset?: XY, fontSize?: number): void;
    /** return width, height and text  */
    static ovalSize(value: number | string | Text, fontSpec?: string, textColor?: string): {
        width: number;
        height: number;
        text: Text;
    };
    /** drawEllipse: wide X high, centered at 0,0  */
    static makeOval(color: string, high: number, wide: number): Shape;
    /** remove and nullify text, remove and replace Oval & label. */
    private newShape;
    getValue(): number | string;
    /** display new value, possilby new color, fontsize, fontName */
    setValue(value: number | string, color?: string, fontSize?: number, fontName?: string): void;
    updateValue(value: number | string): void;
    /**
     * add this ValueCounter to given Container with offsets, listening to target for [Value]Event of type.
     * @param cont likely an overCont
     * @param offest where on cont to place graphic
     * @param target EventDispatcher to listen for updates
     * @param type? type of Event to listen for valf (undefined -> no listener)
     * @param valf? function to extract value from ValueEvent
     */
    attachToContainer(cont: Container, offset?: XY, target?: EventDispatcher, type?: string, valf?: ((ve: Event) => number | string)): void;
}
