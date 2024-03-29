jsPlumb.ready(function () {

    var instance = jsPlumb.newInstance({
        // default drag options
        dragOptions: { cursor: 'pointer', zIndex: 2000, grid:[20,20] },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        connectionOverlays: [
            {
                type:"Arrow",
                options:{
                    location: 1,
                    visible:true,
                    width:11,
                    length:11,
                    id:"ARROW",
                    events:{
                        click:function() { alert("you clicked on the arrow overlay")}
                    }
                }
            },
            {
                type: "Label",
                options: {
                    location: 0.1,
                    id: "label",
                    cssClass: "aLabel",
                    events: {
                        tap: function () {
                            alert("hey");
                        }
                    }
                }
            }
        ],
        container: canvas
    });

    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            strokeWidth: 2,
            stroke: "#61B7CF",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2
        },
    // .. and this is the hover style.
        connectorHoverStyle = {
            strokeWidth: 3,
            stroke: "#216477",
            outlineWidth: 5,
            outlineStroke: "white"
        },
        endpointHoverStyle = {
            fill: "#216477",
            stroke: "#216477"
        },
    // the definition of source endpoints (the hollow ones)
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                stroke: "#7AB02C",
                fill: "transparent",
                radius: 7,
                strokeWidth: 1
            },
            source:true,
            connector: { type:"Flowchart", options:{ stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } },
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            overlays: [
                {
                    type: "Label",
                    options: {
                        location: [0.5, 1.5],
                        label: "Drag",
                        cssClass: "endpointSourceLabel",
                        visible: true
                    }
                }
            ]
        },
    // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fill: "#7AB02C", radius: 7 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            target:true,
            overlays: [
                { type:"Label", options:{ location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:true } }
            ]
        },
        init = function (connection) {
            connection.getOverlay("label").setLabel(connection.source.id.substring(15) + "-" + connection.target.id.substring(15));
        };

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(document.getElementById("flowchart" + toId), sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(document.getElementById("flowchart" + toId), targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        }
    };

    // suspend drawing and initialise.
    instance.batch(function () {

        _addEndpoints("Window4", ["Top", "Bottom"], ["Left", "Right"]);
        _addEndpoints("Window2", ["Left", "Bottom"], ["Top", "Right"]);
        _addEndpoints("Window3", ["Right", "Bottom"], ["Left", "Top"]);
        _addEndpoints("Window1", ["Left", "Right"], ["Top", "Bottom"]);

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });

        // connect a few up
        instance.connect({uuids: ["Window2Bottom", "Window3Top"]});
        instance.connect({uuids: ["Window2Left", "Window4Left"]});
        instance.connect({uuids: ["Window4Top", "Window4Right"]});
        instance.connect({uuids: ["Window3Right", "Window2Right"]});
        instance.connect({uuids: ["Window4Bottom", "Window1Top"]});
        instance.connect({uuids: ["Window3Bottom", "Window1Bottom"] });
        //

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", function (conn, originalEvent) {
           if (confirm("Delete connection from " + conn.source.id + " to " + conn.target.id + "?")) {
               instance.deleteConnection(conn);
           }
        });

        instance.bind("connection:drag", function (connection) {
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        });

        instance.bind("connection:move", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });

        instance.bind("connection:abort", function (connection) {
            console.log("connection aborted " + connection);
        });
    });

});
