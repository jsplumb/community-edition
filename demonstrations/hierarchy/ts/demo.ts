import { 
    BezierConnector, 
    BezierOptions,
    ArrowOverlay, 
    AnchorLocations, 
    newInstance, 
    ready 
} from "@jsplumb/browser-ui"

ready(() =>{

    const color = "gray";
    const canvas = document.getElementById("canvas");

    const instance = newInstance({
        // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
        // than the curves on the first demo, which use the default curviness value.
        connector: { type:BezierConnector.type, options:{ curviness: 50 } as BezierOptions },
        dragOptions: { cursor: "pointer", zIndex: 2000 },
        paintStyle: { stroke: color, strokeWidth: 2 },
        endpointStyle: { radius: 9, fill: color },
        hoverPaintStyle: {stroke: "#ec9f2e" },
        endpointHoverStyle: {fill: "#ec9f2e" },
        container: canvas
    });

    // suspend drawing and initialise.
    instance.batch(function () {
        const overlays = [
            { type:ArrowOverlay.type, options:{ location: 0.7, foldback:0.7, fill:color, width:14 }},
            { type:ArrowOverlay.type, options:{ location: 0.3, direction: -1, foldback:0.7, fill:color, width:14 }}
        ];

        // add endpoints, giving them a UUID.
        // you DO NOT NEED to use this method. You can use your library's selector method.
        // the jsPlumb demos use it so that the code can be shared between all three libraries.
        const windows = document.querySelectorAll(".chart-demo .window");
        for (let i = 0; i < windows.length; i++) {
            instance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-bottom",
                anchor: AnchorLocations.Bottom,
                maxConnections: -1
            });
            instance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-top",
                anchor: AnchorLocations.Top,
                maxConnections: -1
            });
        }

        instance.connect({uuids: ["chartWindow3-bottom", "chartWindow6-top" ], overlays: overlays, detachable: true, reattach: true});
        instance.connect({uuids: ["chartWindow1-bottom", "chartWindow2-top" ], overlays: overlays});
        instance.connect({uuids: ["chartWindow1-bottom", "chartWindow3-top" ], overlays: overlays});
        instance.connect({uuids: ["chartWindow2-bottom", "chartWindow4-top" ], overlays: overlays});
        instance.connect({uuids: ["chartWindow2-bottom", "chartWindow5-top" ], overlays: overlays});

    });
});
