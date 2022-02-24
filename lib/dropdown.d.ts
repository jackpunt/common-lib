import { Container, MouseEvent, Rectangle, Shape, Text } from "createjs-module";
import { XY } from "./basic-intfs";
export interface DropdownItem {
    /** text to display in Item */
    text: string;
    /** DisplayObject-Container holding the text (and mouse actions, etc.) */
    button?: DropdownButton;
}
export interface DropdownStyle {
    fillColor: string;
    fillColorOver: string;
    textColor: string;
    textColorOver: string;
    fontSize: number;
    rootColor?: string;
    rootColorOver?: string;
    rootTextColor?: string;
    rootTextColorOver?: string;
    pressdown?: XY;
    arrowColor?: string;
    spacing?: number;
}
export declare class DropdownButton extends Container {
    static defaultStyle: DropdownStyle;
    style: DropdownStyle;
    pressed: boolean;
    hover: boolean;
    shape: Shape;
    text: Text;
    fontsize: number;
    w: any;
    h: any;
    r: any;
    _arrowShape: Shape;
    /** handle click of selected Item. _itemClick(item) OR rootButton._dropdown() */
    click(handler: (item: DropdownItem) => void): void;
    /**
     * Contains a rectangular Shape, a Text|TextBox and maybe an Arrow.
     * @param text supply "" to designate the _rootButton to make an Arrow
     * @param fontsize for Text in the button
     * @param w for RoundedRectangle
     * @param h for RoundedRectangle
     * @param r for RoundedRectangle
     * @param click handler for click(item)=>void
     */
    constructor(text: string, w: number, h: number, r: number, click?: (e: any) => any, style?: DropdownStyle);
    /** update shape.graphics to show background/rectangle */
    render(): void;
    initText(text: string): void;
    onClick(handler: (eventObj: Object) => boolean): void;
}
/**
 * A DropdownMenu, with DropdownItem[], one of which may be 'selected'.
 * When the selected Item changes, the onItemChanged method/function is invoked.
 */
export declare class DropdownChoice extends Container {
    items: DropdownItem[];
    _boundsCollapsed: Rectangle;
    _boundsExpand: Rectangle;
    _expand: boolean;
    _selected: DropdownItem;
    _index: number;
    _rootButton: DropdownButton;
    _itemChanged: (item: DropdownItem) => void;
    /** application sets this callback, to react when selected Item changes. */
    onItemChanged(f: (item: DropdownItem) => void): void;
    /** show or hide all the item.button(s)
     * @param expand true to toggle state, false to collapse
     */
    private dropdown;
    enable(): void;
    /** @return true if mouseEvent is over this Dropdown */
    isMouseOver(e: MouseEvent): boolean;
    /**
     * Show rootButton (value & triangle) or expand to show DropdownItem[] of values.
     * @param items {text: "show this"}
     * @param item_w width of item box (include: text width + space for arrow)
     * @param item_h height of each DropdownButton
     * @param style size and colors applied to each DropdownButton
     */
    constructor(items: DropdownItem[], item_w: number, item_h: number, style?: DropdownStyle);
    static maxItemWidth(items: DropdownItem[], font_h: number, fontName?: string): number;
    /**
     * get or change the selected item.
     * @param item item to select; or null to return currently selected item
     * @returns selected item
     */
    select(item: DropdownItem): DropdownItem;
    selectAt(index: number): number;
    /** delegates to this._itemChanged, as set by this.onItemChanged() */
    changed(item: DropdownItem): void;
}
