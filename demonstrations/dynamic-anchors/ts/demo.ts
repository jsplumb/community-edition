import { 
    ready, 
    newInstance,
    INTERCEPT_BEFORE_DETACH,
    Connection,
    DotEndpoint,
    DiamondOverlay,
    BezierConnector,
    EVENT_CLICK,
    ArrayAnchorSpec 
} from "@jsplumb/browser-ui"

ready( () => {

    const sourceAnchors: Array<ArrayAnchorSpec> = [
            [0.2, 0, 0, -1],
            [1, 0.2, 1, 0],
            [0.8, 1, 0, 1],
            [0, 0.8, -1, 0]
        ],
        targetAnchors: Array<ArrayAnchorSpec> = [
            [0.6, 0, 0, -1],
            [1, 0.6, 1, 0],
            [0.4, 1, 0, 1],
            [0, 0.4, -1, 0]
        ],

        exampleColor = '#00f',
        connector = {type: BezierConnector.type, options: {cssClass: "connectorClass", hoverClass: "connectorHoverClass"}},
        connectorStyle = {
            gradient: {
                stops: [
                    [0, exampleColor],
                    [0.5, '#09098e'],
                    [1, exampleColor]
                ]
            },
            strokeWidth: 5,
            stroke: exampleColor
        },
        hoverStyle = {
            stroke: "#449999"
        },
        overlays = [
            {type: DiamondOverlay.type, options: {fill: "#09098e", width: 15, length: 15, location:0.5}}
        ],
        endpoint = {type: DotEndpoint.type, options: {cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass"}},
        endpointStyle = {fill: exampleColor},
        anEndpoint = {
            endpoint: endpoint,
            paintStyle: endpointStyle,
            hoverPaintStyle: {fill: "#449999"},
            maxConnections: -1,
            connector: connector,
            connectorStyle: connectorStyle,
            connectorHoverStyle: hoverStyle,
            connectorOverlays: overlays
        };

    const canvas = document.getElementById("canvas")
    const instance = newInstance({
        dragOptions: {cursor: 'pointer', zIndex: 2000},
        container: canvas
    });

    // suspend drawing and initialise.
    instance.batch(function () {

        const connections = {
                "dynamicWindow1": ["dynamicWindow4"],
                "dynamicWindow3": ["dynamicWindow1"],
                "dynamicWindow5": ["dynamicWindow3"],
                "dynamicWindow6": ["dynamicWindow5"],
                "dynamicWindow2": ["dynamicWindow6"],
                "dynamicWindow4": ["dynamicWindow2"]

            },
            endpoints = {},
            // ask jsPlumb for a selector for the window class
            divsWithWindowClass = document.querySelectorAll(".dynamic-demo .window");

        // add endpoints to all of these - one for source, and one for target, configured so they don't sit
        // on top of each other.
        for (let i = 0; i < divsWithWindowClass.length; i++) {
            let id = divsWithWindowClass[i].getAttribute("id")
            endpoints[id] = [
                // note the three-arg version of addEndpoint; lets you re-use some common settings easily.
                instance.addEndpoint(document.getElementById(id), anEndpoint, {anchor: sourceAnchors}),
                instance.addEndpoint(document.getElementById(id), anEndpoint, {anchor: targetAnchors})
            ];
        }
        // then connect everything using the connections map declared above.
        for (let e in endpoints) {
            if (connections[e]) {
                for (let j = 0; j < connections[e].length; j++) {
                    instance.connect({
                        source: endpoints[e][0],
                        target: endpoints[connections[e][j]][1]
                    });
                }
            }
        }

        // bind click listener; delete connections on click
        instance.bind(EVENT_CLICK, (conn: Connection) => {
            instance.deleteConnection(conn);
        })

        // bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
        // will be prompted to confirm deletion.
        instance.bind(INTERCEPT_BEFORE_DETACH, (conn: Connection) => {
            return confirm("Delete connection?");
        })
    })

})
