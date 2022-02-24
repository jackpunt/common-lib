import { Container, Text } from "createjs-module";
import { DropdownChoice, DropdownItem, DropdownStyle } from "./dropdown";
export declare type ParamType = any;
/** Supplied by user */
export interface ParamOpts {
    fontName?: string;
    fontSize?: number;
    fontColor?: string;
    style?: DropdownStyle;
    onChange?: (item: ParamItem) => void;
}
/** Created by ParamGUI */
export interface ParamSpec extends ParamOpts {
    fieldName: string;
    type?: string;
    chooser?: DropdownChoice;
    choices?: ParamItem[];
}
export interface ParamItem extends DropdownItem {
    text: string;
    fieldName?: string;
    value?: ParamType;
    bgColor?: string;
}
export declare class ParamLine extends Container {
    get height(): number;
    get width(): number;
    chooser_w: number;
    chooser_x: number;
    chooser: DropdownChoice;
    spec: ParamSpec;
    nameText: Text;
}
export declare class ParamGUI extends Container {
    constructor(target: object);
    specs: ParamSpec[];
    lines: ParamLine[];
    linew: number;
    lineh: number;
    lead: number;
    makeLines(specs: ParamSpec[]): void;
    findLine(fieldName: string): ParamLine;
    setNameText(fieldName: string, name?: string): Text;
    addLine(spec: ParamSpec, nth: number): void;
    addChooser(line: ParamLine): void;
    /** suitable entry-point for eval_params: (fieldName, value) */
    selectValue(fieldName: string, value: ParamType, line?: ParamLine): ParamItem | undefined;
    target: object;
    /** return target[fieldName]; suitable for override */
    getValue(fieldName: string): any;
    /** update target[item.fieldname] = item.value; suitable for override */
    setValue(item: ParamItem): void;
}
