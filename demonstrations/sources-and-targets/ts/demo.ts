import { 
    EVENT_CLICK, 
    ready, 
    newInstance,
    DotEndpoint,
    AnchorLocations, ArrayAnchorSpec,    
    BezierConnector
} from "@jsplumb/browser-ui"

ready(() => {

    // list of possible anchor locations for the blue source element
    const sourceAnchors:Array<ArrayAnchorSpec> = [
        [ 0, 1, 0, 1 ],
        [ 0.25, 1, 0, 1 ],
        [ 0.5, 1, 0, 1 ],
        [ 0.75, 1, 0, 1 ],
        [ 1, 1, 0, 1 ]
    ];

    const canvas = document.getElementById("canvas")

    const instance = newInstance({
        // drag options
        dragOptions: { cursor: "pointer", zIndex: 2000 },
        // default to a gradient stroke from blue to green.
        paintStyle: {
            stroke: "#558822",
            strokeWidth: 10
        },
        container: canvas,
        connector:BezierConnector.type
    });

    // click listener for the enable/disable link in the source box (the blue one).
    instance.on(document.querySelector(".sourceWindow .enableDisable"), "click", (e:Event) => {
        instance.toggleClass((e.target as any).parentNode, "sourceWindow");
        instance.consume(e);
    });

    // click listener for enable/disable in the small green boxes
    instance.on(document.getElementById("canvas"), "click", ".smallWindow .enableDisable", (e:Event) => {
        instance.toggleClass((e.target as any).parentNode, "targetWindow");
        instance.consume(e);
    });

    // bind to a connection event, just for the purposes of pointing out that it can be done.
    instance.bind(EVENT_CLICK, function (i, c) {
        if (typeof console !== "undefined")
            console.log("connection", i.connection);
    });

    // manage all the ".smallWindow" elements.
    instance.manageAll(".smallWindow")

    instance.registerConnectionType("link", {
        anchors: [ sourceAnchors, AnchorLocations.Top],
        endpoints:[
            { type:DotEndpoint.type, options:{ radius: 7, cssClass:"small-blue" } },
            { type:DotEndpoint.type, options:{ radius: 11, cssClass:"large-green" } }
        ]
    });

    instance.addSourceSelector(".sourceWindow", {
        maxConnections: -1,
        edgeType:"link"
    });

    instance.addTargetSelector(".targetWindow");

    instance.batch(function() {
        instance.connect({ source: document.getElementById("sourceWindow1"), target: document.getElementById("targetWindow5"), type:"link" });
        instance.connect({ source: document.getElementById("sourceWindow1"), target: document.getElementById("targetWindow2"), type:"link"  });
    })
});	
