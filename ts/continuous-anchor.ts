import {AnchorId, Axis, Face, Orientation, X_AXIS_FACES, Y_AXIS_FACES, AnchorOptions} from "./anchor/anchors";
import {Anchor} from "./anchor/anchor";
import {Dictionary, jsPlumbInstance} from "./core";
import {Endpoint} from "./endpoint/endpoint-impl";
import {EventGenerator} from "./event-generator";

export interface ContinuousAnchorOptions extends AnchorOptions {
    faces?:Array<Face>;
    clockwise?:boolean;
}

const faces = ["top", "right", "bottom", "left"];
export type FACE_MAP = Dictionary<boolean>;//{ [Key in faces]?:boolean }
const opposites:Dictionary<Face> = {"top": "bottom", "right": "left", "left": "right", "bottom": "top"};
const clockwiseOptions:Dictionary<Face> = {"top": "right", "right": "bottom", "left": "top", "bottom": "left"};
const antiClockwiseOptions:Dictionary<Face> = {"top": "left", "right": "top", "left": "bottom", "bottom": "right"};


export class ContinuousAnchor<E> extends Anchor<E> {

    type:AnchorId  = "Continuous";
    isDynamic:boolean = true;
    isContinuous:boolean = true;

    private clockwise:boolean;
    private faces:Array<Face>;
    private secondBest:Dictionary<Face>;
    private lastChoice:Dictionary<Face>;
    private _currentFace:Face;
    private _lockedFace:Face;
    private _lockedAxis:Axis;

    private availableFaces:FACE_MAP = {};

    constructor(public instance:jsPlumbInstance<E>, anchorParams:ContinuousAnchorOptions) {

        super(instance, anchorParams);

        this.faces = anchorParams.faces || ["top", "right", "bottom", "left"];
        this.clockwise = !(anchorParams.clockwise === false);
        this.secondBest = this.clockwise ? clockwiseOptions : antiClockwiseOptions;
        this.lastChoice = this.clockwise ? antiClockwiseOptions : clockwiseOptions;;
        this._currentFace = null;
        this._lockedFace = null;
        this._lockedAxis = null;

        for (let i = 0; i < this.faces.length; i++) {
            this.availableFaces[this.faces[i]] = true;
        }
    }

    getDefaultFace ():Face {
        return this.faces.length === 0 ? "top" : this.faces[0];
    }

    //isRelocatable = function() { return true; };
    //isSnapOnRelocate = function() { return true; };

    // if the given edge is supported, returns it. otherwise looks for a substitute that _is_
    // supported. if none supported we also return the request edge.
    verifyEdge (edge:Face):Face {
        if (this.availableFaces[edge]) {
            return edge;
        }
        else if (this.availableFaces[opposites[edge]]) {
            return opposites[edge];
        }
        else if (this.availableFaces[this.secondBest[edge]]) {
            return this.secondBest[edge];
        }
        else if (this.availableFaces[this.lastChoice[edge]]) {
            return this.lastChoice[edge];
        }
        return edge; // we have to give them something.
    }

    isEdgeSupported (edge:Face):boolean {
        return  this._lockedAxis == null ?
            (this._lockedFace == null ? this.availableFaces[edge] === true : this._lockedFace === edge)
            : this._lockedAxis.indexOf(edge) !== -1;
    }

    setCurrentFace (face:Face, overrideLock?:boolean) {
        this._currentFace = face;
        // if currently locked, and the user wants to override, do that.
        if (overrideLock && this._lockedFace != null) {
            this._lockedFace = this._currentFace;
        }
    }

    getCurrentFace ():Face { return this._currentFace; }

    getSupportedFaces ():Array<Face> {
        let af:Array<Face> = [];
        for (let k in this.availableFaces) {
            if (this.availableFaces[k]) {
                af.push(k as Face);
            }
        }
        return af;
    }

    lock () {
        this._lockedFace = this._currentFace;
    }

    unlock () {
        this._lockedFace = null;
    }

    isLocked ():boolean {
        return this._lockedFace != null;
    }

    lockCurrentAxis () {
        if (this._currentFace != null) {
            this._lockedAxis = (this._currentFace === "left" || this._currentFace === "right") ? X_AXIS_FACES : Y_AXIS_FACES;
        }
    }

    unlockCurrentAxis () {
        this._lockedAxis = null;
    }

    compute (params:any) {
        return this.instance.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0];
    }

    getCurrentLocation (params:any) {
        return this.instance.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0];
    }

    getOrientation (endpoint?:Endpoint<E>):Orientation {
        return this.instance.anchorManager.continuousAnchorOrientations[endpoint.id] || [0, 0];
    }

    getCssClass ():string {
        return this.cssClass;
    }
}