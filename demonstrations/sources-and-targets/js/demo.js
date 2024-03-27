jsPlumb.ready(function () {

    // list of possible anchor locations for the blue source element
    var sourceAnchors = [
        [ 0, 1, 0, 1 ],
        [ 0.25, 1, 0, 1 ],
        [ 0.5, 1, 0, 1 ],
        [ 0.75, 1, 0, 1 ],
        [ 1, 1, 0, 1 ]
    ];

    var instance = window.instance = jsPlumb.newInstance({
        // drag options
        dragOptions: { cursor: "pointer", zIndex: 2000 },
        // default to a gradient stroke from blue to green.
        paintStyle: {
            gradient: { stops: [
                [ 0, "#0d78bc" ],
                [ 1, "#558822" ]
            ] },
            stroke: "#558822",
            strokeWidth: 10
        },
        container: canvas,
        connector:"Bezier"
    });

    // click listener for the enable/disable link in the source box (the blue one).
    instance.on(document.querySelector(".sourceWindow .enableDisable"), "click", function (e) {
        instance.toggleClass((e.target|| e.srcElement).parentNode, "sourceWindow");
        instance.consume(e);
    });

    // click listener for enable/disable in the small green boxes
    instance.on(document.getElementById("canvas"), "click", ".smallWindow .enableDisable", function (e) {
        instance.toggleClass((e.target || e.srcElement).parentNode, "targetWindow");
        instance.consume(e);
    });

    // manage all the ".smallWindow" elements.
    instance.manageAll(".smallWindow");

    instance.registerConnectionType("link", {
        anchors: [ sourceAnchors, "Top"],
        endpoints:[
            {type:"Dot", options:{ radius: 7, cssClass:"small-blue" } },
            {type:"Dot", options:{ radius: 11, cssClass:"large-green" } }
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
