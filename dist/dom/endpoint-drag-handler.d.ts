import { DragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint-impl";
import { Dictionary } from "../core";
import { EndpointRepresentation } from "../endpoint/endpoints";
export declare class EndpointDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    jpc: Connection<HTMLElement>;
    existingJpc: boolean;
    ep: Endpoint<HTMLElement>;
    endpointRepresentation: EndpointRepresentation<HTMLElement, any>;
    existingJpcParams: any;
    placeholderInfo: any;
    floatingElement: HTMLElement;
    floatingEndpoint: Endpoint<HTMLElement>;
    _stopped: boolean;
    inPlaceCopy: any;
    endpointDropTargets: Array<any>;
    currentDropTarget: any;
    payload: any;
    floatingConnections: Dictionary<Connection<HTMLElement>>;
    _forceReattach: boolean;
    _forceDetach: boolean;
    _mousedownHandler: (e: any) => void;
    _mouseupHandler: (e: any) => void;
    constructor(instance: BrowserJsPlumbInstance);
    _makeDraggablePlaceholder(ipco: any, ips: any): HTMLElement;
    _cleanupDraggablePlaceholder(): void;
    reset(): void;
    init(katavorioDraggable: any): void;
    selector: string;
    onStart(p: any): boolean;
    onBeforeStart(beforeStartParams: any): void;
    onDrag(params: any): boolean;
    maybeCleanup(ep: Endpoint<HTMLElement>): void;
    private _reattachOrDiscard;
    onStop(p: any): void;
    private _getSourceDefinition;
    private _getTargetDefinition;
    _getDropEndpoint(p: any, jpc: Connection<HTMLElement>): Endpoint<HTMLElement>;
    _doForceReattach(idx: number): void;
    _shouldReattach(originalEvent?: Event): boolean;
    _maybeReattach(idx: number, originalEvent?: Event): void;
    private _discard;
    private _drop;
    _registerFloatingConnection(info: any, conn: Connection<HTMLElement>, ep: Endpoint<HTMLElement>): void;
    getFloatingAnchorIndex(jpc: Connection<HTMLElement>): number;
}