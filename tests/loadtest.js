;(function() {

// add a few functions to the console.
var times = {}, indent = 0, handleMap = {};
console.cTimeStart = function(handle) {
    //var h = (new Array(indent).join("-")) + handle;
    var h = handle;
    //handleMap[handle] = h;
    times[h] = times[h] || {s:null, e:null, time_ms:0, time_sec:0, calls:0, avg:0};
    times[h].s = new Date().getTime();
    times[h].calls++;
    indent += 2;
};

console.cTimeEnd = function(handle) {
    //handle = handleMap[handle];
    times[handle].e = new Date().getTime();
    times[handle].time_ms += (times[handle].e - times[handle].s);
    // times[handle].time_sec = times[handle].time_ms / 1000;
    // times[handle].avg = times[handle].time_ms / times[handle].calls;
    indent -= 2;
};

console.cTimeSummary = function() {
    console.log("Cumulative");
    for (var handle in times) {
        times[handle].time_sec = times[handle].time_ms / 1000;
        times[handle].avg = times[handle].time_ms / times[handle].calls;
    }
    console.table(times, [ "time_ms", "time_sec", "calls", "avg" ]);
    //console.table(times);
};

    console.cTimeSummaryClear = function() {
        times = {};
    };

})();








;(function() {
    var endpoints = {}, instance;
    
    var html = function(els, val) {
            _each(els, function(id) {
                document.getElementById(id).innerHTML = val;
            });
        },
        _each = function(els, fn) {
            els = typeof els == "string" ? [ els ] : els;
            for (var i = 0; i < els.length; i++)
                fn(els[i]);
        },
        empty = function(els) {
            html(els, "");
        },
        val = function(sel) {
            return document.querySelectorAll(sel)[0].value;
        };

    window.jsPlumbLoadTest = {
        anchors:{
            "normal":[ "Top", "Bottom" ],
            "dynamic":[ "AutoDefault", "AutoDefault" ],
            "continuous":[ "Continuous", "Continuous" ]
        },
        spacing:100,
        endpoint:{
            endpoint: {type:"Dot", options:{ radius:10 } },
            paintStyle:{ fill:"#456", outlineStroke:"black", outlineWidth:2 },
            connectorPaintStyle:{strokeWidth:1, stroke:"red"},
            connectorHoverStyle:{stroke:"#943"},
            source:true,
            target:true,
            maxConnections:-1
        },

        reset : function(thenRun) {
            console.cTimeSummaryClear();
            endpoints = {};
            var t = new Date().getTime();
            instance.reset();
            var t2 = new Date().getTime();

            empty(["numConnections", "createTime", "totalCreateTime", "averageCreateTime", "repaintTime", "averageRepaintTime", "demo", 'epCreateTime', 'averageEpCreateTime' ]);
            html("resetTime", (t2 - t) + "ms");

            if (thenRun !== false) window.setTimeout(jsPlumbLoadTest.run, 250);
        },

        run : function() {



            var numElements = val("#txtElements"),
                anchors = val("input[name='anchors']:checked"),
                suspend = val("input[name='chkSuspend']:checked") === "yes",
                setLabel = val("input[name='chkLabel']:checked") === "yes",
                actuallyPaint = val("input[name='chkPaint']:checked") === "yes";

            instance.importDefaults({
                connectionOverlays:[ "Arrow" ]
            });
                    

            // for bulk drawing operations this is recommended.
            if (!actuallyPaint || suspend) instance.setSuspendDrawing(true);

            var st = (new Date()).getTime(),
                ww = window.offsetWidth,
                x = 0, y = 0;

        var et = 0, epCount = 0;

            for (var i = 0; i < numElements; i++) {
                var div = document.createElement("div");
                div.style.left = x + "px";
                div.style.top = y + "px";
                div.style.zIndex = 100;
                div.className = "jspLoad";
                div.setAttribute("id", "div-" + i);

                instance.manage(div);

                x += jsPlumbLoadTest.spacing;
                if (x > ww) {
                    x = 0;
                    y += jsPlumbLoadTest.spacing;
                }
                div.style.backgroundColor = "#123";
                document.getElementById("demo").appendChild(div);
                var _e = [];
                for (var j = 0; j < jsPlumbLoadTest.anchors[anchors].length; j++) {
                    //console.cTimeStart("add endpoint");
                    var edt = (new Date()).getTime();
                    var ep = instance.addEndpoint( div, { anchor:jsPlumbLoadTest.anchors[anchors][j] }, jsPlumbLoadTest.endpoint );
                    et += ((new Date()).getTime() - edt);
                    epCount++;
                    _e.push(ep);
                }
                endpoints["div-" + i] = _e;
            }

            var connCount = 0, time = 0;
            for (var i = 0; i < numElements; i++) {
                for (var j = 0; j < numElements; j++) {
                    if (i != j) {
                        var ep1 = endpoints["div-" + i],
                            ep2 = endpoints["div-" + j];

                        for (var k = 0; k < ep1.length; k++) {
                            for (var l = 0; l < ep2.length; l++) {
                                var ct = (new Date()).getTime();
                                //console.cTimeStart("add connection");
                                var c = instance.connect({
                                    source:ep1[k],
                                    target:ep2[l],
                                    paintStyle:{
                                        strokeWidth:1, stroke:"red"
                                    },
                                    connector:"Bezier"
                                });

                                //console.cTimeStart("  set label");
                                if (setLabel) c.setLabel("FOO");
                                //console.cTimeEnd("  set label");

                                //console.cTimeEnd("add connection");

                                var ctt = (new Date()).getTime();
                                time += (ctt - ct);
                                connCount ++;
                            }
                        }
                    }
                }
            }

            //alert(connCount);

            var t = (new Date()).getTime();

            //jsPlumb.draggable($(".jspLoad"));

            var st2 = (new Date()).getTime();
            // instruct jsplumb to unsuspend drawing, and to do a repaint.
            if (actuallyPaint && suspend)
                instance.setSuspendDrawing(false, true);
            var t2 = (new Date()).getTime();

            html("numConnections", connCount);
            html("totalCreateTime", (t-st) + (t2-st2) + "ms");

            html("numEndpoints", epCount);
            html("epCreateTime", (et) + "ms");
            html("averageEpCreateTime", ((et)/epCount).toFixed(2) + "ms");

            html("createTime", (t-st) + "ms");
            html("averageCreateTime", ((t-st)/connCount).toFixed(2) + "ms");
            html("repaintTime", (t2-st2) + "ms");
            html("averageRepaintTime", ((t2-st2)/connCount).toFixed(2) + "ms");

            console.cTimeSummary();
            
        }
    };


    jsPlumbBrowserUI.ready(function() {
        instance = jsPlumbBrowserUI.newInstance({container:demo});

        instance.on(document.getElementById("btnTest"), "click", jsPlumbLoadTest.reset);

        instance.on(document.getElementById("btnReset"), "click", function() { jsPlumbLoadTest.reset(false); });
    });
})();
