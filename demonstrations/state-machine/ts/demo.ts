import { ready, newInstance, EVENT_CLICK, EVENT_DBL_CLICK, } from "@jsplumb/browser-ui"
import { Connection, LabelOverlay,
    DotEndpoint,
    EVENT_CONNECTION,
    ArrowOverlay
} from "@jsplumb/core"

import { AnchorLocations } from "@jsplumb/common"
import { uuid } from "@jsplumb/util"
import { StateMachineConnector } from "@jsplumb/connector-bezier"

ready(() => {

    const canvas = document.getElementById("canvas")

    const TYPE_BASIC = "basic"
    const LABEL_OVERLAY_ID = "label"

    // setup some defaults for jsPlumb.
    const instance = newInstance({
        endpoint: { type:DotEndpoint.type, options:{radius: 2} },
        connectionOverlays: [
            {
                type:ArrowOverlay.type,
                options:{
                    location: 1,
                    id: "arrow",
                    length: 14,
                    foldback: 0.8
                }
            },
            {
                type:LabelOverlay.type,
                options:{
                    label: "FOO",
                    id: LABEL_OVERLAY_ID,
                    cssClass: "aLabel"
                }
            }
        ],
        container: canvas
    })

    instance.registerConnectionType(TYPE_BASIC, {
        anchor:AnchorLocations.Continuous,
        connector:StateMachineConnector.type,
        paintStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
        hoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },

    })

    const windows = document.querySelectorAll(".statemachine-demo .w")

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    instance.bind(EVENT_CLICK, (c:Connection) => {
        instance.deleteConnection(c)
    })

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind(EVENT_CONNECTION,  (info:{connection:Connection}) => {
        info.connection.getOverlay<LabelOverlay>(LABEL_OVERLAY_ID).setLabel(info.connection.id)
    })

    // bind a double click listener to "canvas"; add new node when this occurs.
    instance.on(canvas, EVENT_DBL_CLICK, (e:any) => {
        newNode(e.offsetX, e.offsetY)
    })

    function newNode (x:number, y:number) {
        const d = document.createElement("div")
        const id = uuid()
        d.className = "w"
        d.id = id
        d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>"
        d.style.left = x + "px"
        d.style.top = y + "px"
        instance.getContainer().appendChild(d)
        instance.manage(d)
        return d
    }

    instance.addSourceSelector(".ep", {
        edgeType:"basic",
        extract:{
            "action":"the-action"
        },
        maxConnections: 2,
        onMaxConnections: function (info, e) {
            alert("Maximum connections (" + info.maxConnections + ") reached");
        }
    });

    instance.addTargetSelector(".w", {
        anchor: "Continuous",
        allowLoopback: true
    });

    // suspend drawing and initialise.
    instance.batch(function () {
        instance.manageAll(windows)
        // and finally, make a few connections
        instance.connect({ source: document.getElementById("opened"), target: document.getElementById("phone1"), type:TYPE_BASIC })
        instance.connect({ source: document.getElementById("phone1"), target: document.getElementById("phone1"), type:TYPE_BASIC })
        instance.connect({ source: document.getElementById("phone1"), target: document.getElementById("inperson"), type:TYPE_BASIC })

        instance.connect({
            source:document.getElementById("phone2"),
            target:document.getElementById("rejected"),
            type:TYPE_BASIC
        })
    })

})
