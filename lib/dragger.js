import { Container } from 'createjs-module';
import { S, Obj } from './basic-intfs';
import { stime } from './types';
export class Dragole {
    static reset(val = 0) { Dragole.count = val; }
    static inc() { Dragole.count++; }
    static logEvent(msg) {
        if (typeof (Dragole.logCount) == 'function')
            Dragole.logCount(Dragole.count);
    }
    /** console.log(stime(this), msg?, ...args) every n samples */
    static log(n, msg, ...args) {
        Dragole.logEvent(msg);
        if (Dragole.count % n == 0) {
            console.log(stime(this), msg, ...args);
            if (typeof (Dragole.logMsg) == 'function')
                Dragole.logMsg(msg, args);
        }
    }
}
Dragole.count = 0;
Dragole.logRate = 50; // can modify in debugger
/**
 * expect a singleton instance to control drag/drop on a single ScalableContainer
 *
 * TODO: make instance rather than everthing static.
 */
export class Dragger {
    /**
     * Make the Dragger.dragCont dragCont
     * @param parent the createjs Stage, unless you know better
     */
    static DragCont(parent) {
        // Make Singleton instance for mouse drag.
    }
    /**
     * addEventListeners for pressmove/pressup (stagemousedown/up and stagemousemove)
     * Drag this DispObj on stage.dragCont; and drop (addChild) on the orig OR new parent.
     * @param dispObj the object to become dragable
     * @param scope object to use a 'this' when calling dragfunc, dropfunc (default dispObj.parent?)
     * @param dragfunc? f(dispObj|Container, dragCtx) Default: lastCont.addChild(obj)
     * @param dropfunc? f(dispObj|Container, dragCtx)
     * @param asDispObj? true if Container should be dragged as DisplayObject
     */
    static makeDragable(dispObj, scope, dragfunc, dropfunc, asDispObj) {
        // mouse drag events *only* available from stage/HTMLElement layer
        //console.log(stime(this, ".makeDragable dispObj=") ,dispObj, dragfunc, dropfunc)
        /**
         * @param e pressmove MouseEvent
         * @param obj e.currentTarget (the pressmove Listener object)
         * @returns
         */
        let startDrag = (e, obj) => {
            // console.log(stime(this, ".pressmove: target.name="), e.target.name, "dragfunc?", dragfunc,
            // "\n   obj=", obj, "\n   event=", e)
            let par = obj.parent; // original parent
            let dragCont = Dragger.dragCont;
            let scalmat;
            let targetC;
            let targetD;
            let rotation = obj.rotation;
            let dxy = { x: e.localX - obj.regX, y: e.localY - obj.regY }; // offset from mouse to regXY(0,0)
            // for Citymap, all CardContainers are mouse-transparent, so obj == ScaleableContainer, obj.parent == stage
            if ((obj instanceof Container) && !obj["dragAsDispObj"]) {
                // Drag the whole [Scaleable]Container 
                // (cannot add to DragCont, because DragCont is child of ScaleableContainer!)
                // [obj == sc, THE instanceof ScaleableContainer], Dragger.parent == stage
                targetC = obj;
                par.setChildIndex(obj, par.numChildren - 1); // bring to top
                scalmat = obj.getConcatenatedMatrix(); // record original scale and offsets
            }
            else {
                // is a DispObj [Card as Container or PlayerMarker]
                targetD = obj;
                obj.rotation = 0; // else dragging goes backward due to obj.concatMatrix
                obj.parent.localToLocal(obj.x, obj.y, dragCont, obj); // offset to dragCont
                dragCont.addChild(obj); // assert: only 1 child in dragCont; dragCont is in SC
                dragCont.parent.setChildIndex(dragCont, dragCont.parent.numChildren - 1); // dragLayer to top of SC
                scalmat = obj.getConcatenatedMatrix();
            }
            // in all cases, set DRAG_CONTEXT:
            return Dragger.DRAG_CONTEXT = {
                nameD: obj.name, lastCont: par, srcCont: par, first: true,
                eventX: e.stageX, eventY: e.stageY, objx: obj.x, objy: obj.y, scalmat: scalmat, dxy: dxy,
                targetC: targetC, targetD: targetD, rotation: rotation, scope: scope
            };
            //console.log(stime(this, ".pressmove: dragCtx.lastCont.name="), dragCtx.lastCont.name, dragCtx)
            //console.log(stime(this, ".pressmove: dragCtx="), dragCtx, "\n   event=", e, dragfunc)
        };
        let pressmove = (e) => {
            // use currentTarget, so non-dragable Shapes pull whole ScaleableContainer
            let obj = e.currentTarget;
            let dragCtx = Dragger.DRAG_CONTEXT;
            if (e.target[S.doNotDrag])
                return;
            if (!dragCtx) {
                Dragole.reset(-1); // *first* (next) log will trigger
                dragCtx = startDrag(e, obj);
            }
            else {
                dragCtx.first = false;
            }
            /** move the whole scaleContainer, adjusting when it gets scaled. */
            let moveCont = (obj, e) => {
                let dx = e.stageX - dragCtx.eventX;
                let dy = e.stageY - dragCtx.eventY;
                let oscalmat = dragCtx.scalmat;
                let nscalmat = obj.getConcatenatedMatrix();
                if (nscalmat.a != oscalmat.a) { // object has been zoomed (and offset!)
                    dragCtx.objx = obj.x - dx;
                    dragCtx.objy = obj.y - dy;
                    dragCtx.scalmat = nscalmat;
                }
                obj.x = dragCtx.objx + dx;
                obj.y = dragCtx.objy + dy;
                // obj.stage.update()
                //console.log(stime(this, ".moveCont:"), {orig:orig, e:e, pt:pt, sx: obj.scaleX, obj:obj})
            };
            // move obj to follow mouse:
            if (obj == dragCtx.targetC) {
                moveCont(obj, e); // typically: the whole ScaleableContainer
            }
            else if (obj == dragCtx.targetD) {
                obj.parent.globalToLocal(e.stageX, e.stageY, obj);
                obj.x -= dragCtx.dxy.x;
                obj.y -= dragCtx.dxy.y;
            }
            else {
                e.stopPropagation();
                Dragole.logEvent("unexpected currentTarget: " + obj.name);
                console.log(stime(this, ".pressmove: unexpected target:"), { obj: obj, event: e, targetC: dragCtx.targetC, targetD: dragCtx.targetC, dragCtx: Obj.fromEntriesOf(dragCtx) });
                return;
            }
            //console.log(stime(this, ".pressmove: obj.x="), obj.x, "obj.y=", obj.y, "evt_pt=", evt_pt, "\n   event=", e, "\n   obj=",obj, "\n    dragCtx=", dragCtx)
            //e.preventDefault()
            e.stopPropagation();
            //e.stopImmediatePropagation()
            if (dragfunc) {
                if (((typeof dragfunc) === "function")) {
                    try {
                        dragfunc.call(dragCtx.scope || obj.parent, obj, dragCtx);
                    }
                    catch (err) {
                        Dragole.logEvent("dragfunc FAILED");
                        console.log(stime(this, ".pressmove: dragfunc FAILED: "), dragfunc, "dragCtx=", Obj.fromEntriesOf(dragCtx), "\n   err=", err);
                    }
                }
                else {
                    Dragole.logEvent("dragfunc UNKNOWN");
                    console.log(stime(this, ".pressmove: dragfunc UNKNOWN:"), dragfunc, "dragCtx=", Obj.fromEntriesOf(dragCtx));
                }
            }
            obj.stage.update();
        };
        let pressup = (e) => {
            let obj = e.currentTarget; // the SC in phase-3
            let dragCtx = Dragger.DRAG_CONTEXT;
            Dragger.DRAG_CONTEXT = null; // drag is done...
            if (!dragCtx) {
                //console.log(stime(this, ".pressup: (no dragCtx) click event="), e)
                return; // a click, not a Drag+Drop
            }
            obj.rotation = dragCtx.rotation;
            let par = dragCtx.lastCont || dragCtx.srcCont;
            // last dropTarget CardContainer under the dragged Card  (or orig parent)
            //    console.log(stime(this, ".pressup: target.name="), e.target.name, "dropfunc?", dropfunc, " dragCtx?", dragCtx, 
            //     "\n   obj.parent=", obj.parent.name,"obj=", obj, "\n   par.name=",par.name, "(dragCtx.lastCont) par=", par,"\n   event=", e)
            if (par) {
                // Drop obj onto Parent=lastCont in apparent position:
                let inx = obj.x, iny = obj.y; // record for debugger
                obj.parent.localToLocal(obj.x, obj.y, par, obj);
                // console.log(stime(this, ".pressup: obj="), obj.name, obj, "x=", obj.x, obj.parent.x, 
                // "\n   ", par.x, "dropParent=", par.name, par, " obj_pt=", obj_pt)
                par.addChild(obj); // transfer parentage from DragLayerContainer to dropTarget
            }
            if (typeof (dropfunc) === "function") {
                try {
                    dropfunc.call(dragCtx.scope || obj.parent, obj, dragCtx);
                }
                catch (err) {
                    let msg = "Dragger.pressup: dragfunc FAILED=";
                    console.error(msg, err);
                    alert(msg);
                }
            }
            obj.stage.update();
        };
        // on ( type  listener  [scope]  [once=false]  [data]  [useCapture=false] )
        // https://www.createjs.com/docs/easeljs/classes/DisplayObject.html#method_on
        // we *could* pass dragCtx or cont as [data] ??
        // but closure binding works just fine.
        if (!Dragger.dragCont) {
            Dragger.dragCont = new Container();
            Dragger.dragCont.name = "dragCont";
            dispObj.stage.addChild(Dragger.dragCont); // may be re-parented to the ScaleableContainer!
        }
        Dragger.stopDragable(dispObj); // remove prior Drag listeners
        dispObj["dragAsDispObj"] = asDispObj;
        dispObj[S.pressmove] = dispObj.on(S.pressmove, pressmove);
        dispObj[S.pressmove][S.aname] = "Dragger.pressmove";
        dispObj[S.pressup] = dispObj.on(S.pressup, pressup);
        dispObj[S.pressup][S.aname] = "Dragger.pressup";
        //console.log(stime(this, ".makeDragable: name="), dispObj.name, "dispObj=", dispObj, "\n   cont=", cont)
    }
    /** remove pressmove and pressup listenerf from dispObj. */
    static stopDragable(dispObj) {
        //console.log(stime(this, ".stopDragable: dispObj="), dispObj, dispObj[S.pressmove], dispObj["pressup"])
        dispObj.removeEventListener(S.pressmove, dispObj[S.pressmove]);
        delete dispObj[S.pressmove];
        dispObj.removeEventListener(S.pressup, dispObj[S.pressup]);
        delete dispObj[S.pressup];
    }
}
/** Info about the current drag operation, shared between pressmove(s) and pressup. */
Dragger.DRAG_CONTEXT = null; // TODO: make this a field of dragCont [?]
//# sourceMappingURL=dragger.js.map