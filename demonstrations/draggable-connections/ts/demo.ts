
import { 
    AnchorLocations, ArrayAnchorSpec,
    BezierOptions,BezierConnector,
    Connection, Endpoint,
    StraightConnector,
    DotEndpoint,
    EVENT_MAX_CONNECTIONS, EndpointOptions,
    EVENT_CONNECTION,
    EVENT_CONNECTION_DETACHED,
    EVENT_CONNECTION_MOVED,
    RectangleEndpoint,
    EVENT_CLICK, newInstance, ready } from "@jsplumb/browser-ui"

const listDiv = document.getElementById("list")

function showConnectionInfo (s:string) {
    listDiv.innerHTML = s;
    listDiv.style.display = "block";
}

function hideConnectionInfo () {
    listDiv.style.display = "none";
}

const connections:Array<Connection> = []
function updateConnections (conn:Connection, remove?:boolean) {
    if (!remove) connections.push(conn);
    else {
        let idx = -1;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i] === conn) {
                idx = i;
                break;
            }
        }
        if (idx !== -1) connections.splice(idx, 1);
    }
    if (connections.length > 0) {
        let s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
        for (let j = 0; j < connections.length; j++) {
            s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
        }
        showConnectionInfo(s);
    } else
        hideConnectionInfo();
}

ready(() => {

    const canvas = document.getElementById("canvas")

    const instance = newInstance({
        dragOptions: { cursor: 'pointer', zIndex: 2000 },
        paintStyle: { stroke: '#666' },
        endpointHoverStyle: { fill: "orange" },
        hoverPaintStyle: { stroke: "orange" },
        endpointStyle: { width: 20, height: 16, stroke: '#666' },  //<----bum
        endpoint: RectangleEndpoint.type,
        anchors: [AnchorLocations.Top, AnchorLocations.Top],
        container: canvas
    })

    // suspend drawing and initialise.
    instance.batch( () => {

        // bind to connection/connectionDetached events, and update the list of connections on screen.
        instance.bind(EVENT_CONNECTION, (info:{connection:Connection}, originalEvent:Event) => {
            updateConnections(info.connection);
        });
        instance.bind(EVENT_CONNECTION_DETACHED, (info:{connection:Connection}, originalEvent:Event) => {
            updateConnections(info.connection, true);
        });

        instance.bind(EVENT_CONNECTION_MOVED, (info:{connection:Connection}, originalEvent:Event) => {
            //  only remove here, because a 'connection' event is also fired.
            // in a future release of jsplumb this extra connection event will not
            // be fired.
            updateConnections(info.connection, true);
        });

        instance.bind(EVENT_CLICK, (component:any, originalEvent:Event) => {
            alert("click!")
        });

        //
        // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
        // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
        // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
        // that declares 'exampleEndpoint' as its drop scope, and also that
        // only 'exampleConnection' types can be dropped here.
        //
        // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a strokeWidth of
        // 5 pixels, and a gradient.
        //
        // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
        // or not to allow a particular connection to be established.
        //
        const exampleColor = "#00f"
        const exampleEndpoint = {
            endpoint: RectangleEndpoint.type,
            paintStyle: { width: 25, height: 21, fill: exampleColor },
            source: true,
            reattach: true,
            scope: "blue",
            connectorStyle: {
                gradient: {stops: [
                        [0, exampleColor],
                        [0.5, "#09098e"],
                        [1, exampleColor]
                    ]},
                strokeWidth: 5,
                stroke: exampleColor,
                dashstyle: "2 2"
            },
            target: true,
            beforeDrop:  (params:{sourceId:string, targetId:string}) => {
                return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
            }
        }

        //
        // the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
        // and has scope 'exampleConnection2'.
        //
        const color2 = "#316b31"
        const exampleEndpoint2:EndpointOptions = {
            endpoint: {type:DotEndpoint.type, options:{ radius: 11 }},
            paintStyle: { fill: color2 },
            source: true,
            scope: "green",
            connectorStyle: { stroke: color2, strokeWidth: 6 },
            connector: { type:BezierConnector.type, options:{ curviness: 63 } as BezierOptions },
            maxConnections: 3,
            target: true
        }

        //
        // the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
        // 'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
        // overriden, so it appears in the same place on every element.
        //
        // this example also demonstrates the beforeDetach interceptor, which allows you to intercept
        // a connection detach and decide whether or not you wish to allow it to proceed.
        //
        const example3Color = "rgba(229,219,61,0.5)";
        const exampleEndpoint3 = {
            endpoint: { type:DotEndpoint.type, options:{ radius: 17 } },
            anchor: AnchorLocations.BottomLeft,
            paintStyle: { fill: example3Color, opacity: 0.5 },
            source: true,
            scope: 'yellow',
            connectorStyle: {
                stroke: example3Color,
                strokeWidth: 4
            },
            connector: StraightConnector.type,
            target: true,
            beforeDetach:  (conn:Connection) => {
                return confirm("Detach connection?");
            },
            onMaxConnections: (info:{connection:Connection, endpoint:Endpoint}) => {
                alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            }
        };

        const dd1 = document.getElementById('dragDropWindow1'),
            dd2 = document.getElementById('dragDropWindow2'),
            dd3 = document.getElementById('dragDropWindow3'),
            dd4 = document.getElementById('dragDropWindow4');

        // setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
        // of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
        instance.addEndpoint(dd1, { anchor: [0.5, 1, 0, 1] }, exampleEndpoint2);

        // setup some DynamicAnchors for use with the blue endpoints
        // and a function to set as the maxConnections callback.
        const anchors:Array<ArrayAnchorSpec> = [
                [1, 0.2, 1, 0],
                [0.8, 1, 0, 1],
                [0, 0.8, -1, 0],
                [0.2, 0, 0, -1]
            ],
            maxConnectionsCallback = (info:{connection:Connection, endpoint:Endpoint}) => {
                alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            };

        const e1 = instance.addEndpoint(dd1, { anchor: anchors }, exampleEndpoint)
        // you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
        e1.bind(EVENT_MAX_CONNECTIONS, maxConnectionsCallback)

        const e2 = instance.addEndpoint(dd2, { anchor: [0.5, 1, 0, 1] }, exampleEndpoint)
        // again we bind manually. it's starting to get tedious.  but now that i've done one of the blue endpoints this way, i have to do them all...
        e2.bind(EVENT_MAX_CONNECTIONS, maxConnectionsCallback)
        instance.addEndpoint(dd2, { anchor: "Right" }, exampleEndpoint2)

        const e3 = instance.addEndpoint(dd3, { anchor: [0.25, 0, 0, -1] }, exampleEndpoint)
        e3.bind(EVENT_MAX_CONNECTIONS, maxConnectionsCallback);
        instance.addEndpoint(dd3, { anchor: [0.75, 0, 0, -1] }, exampleEndpoint2);

        const e4 = instance.addEndpoint(dd4, { anchor: [1, 0.5, 1, 0] }, exampleEndpoint)
        e4.bind(EVENT_MAX_CONNECTIONS, maxConnectionsCallback);
        instance.addEndpoint(dd4, { anchor: [0.25, 0, 0, -1] }, exampleEndpoint2);

        const windows = document.querySelectorAll(".drag-drop-demo .window");
        for (var i = 0; i < windows.length; i++) {
            instance.addEndpoint(windows[i], exampleEndpoint3);
        }

        instance.on(canvas, EVENT_CLICK, ".hide", (e:Event) => {
            const el = (e.target || e.srcElement) as HTMLElement
            instance.toggleVisible(el.parentNode as Element);
            instance.consume(e);
        });

        instance.on(canvas, EVENT_CLICK, ".drag", (e:Event) => {
            const el = (e.target || e.srcElement) as HTMLElement
            const s = instance.toggleDraggable(el.parentNode as Element);
            el.innerHTML = (s ? 'disable dragging' : 'enable dragging');
            instance.consume(e);
        });

        instance.on(canvas, EVENT_CLICK, ".detach", (e:Event) => {
            const el = (e.target || e.srcElement) as HTMLElement
            instance.deleteConnectionsForElement(el.parentNode as Element);
            instance.consume(e);
        });

        instance.on(document.getElementById("clear"), EVENT_CLICK, (e:Event) => {
            instance.deleteEveryConnection()
            showConnectionInfo("")
            instance.consume(e)
        });
    });

});
