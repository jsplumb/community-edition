import { 
    newInstance, 
    ready,
    DotEndpoint,
    StateMachineConnector,
    AnchorOptions, PerimeterAnchorOptions } 
from "@jsplumb/browser-ui";

ready(() => {

    const canvas = document.getElementById("canvas")

    const instance = newInstance({
        connector: StateMachineConnector.type,
        paintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        endpoint: { type:DotEndpoint.type, options:{ radius: 5 } },
        endpointStyle: { fill: "#ffa500" },
        container: canvas
    });

    const shapes = document.querySelectorAll(".shape");

    // suspend drawing and initialise.
    instance.batch( () => {

        // loop through them and connect each one to each other one.
        for (let i = 0; i < shapes.length; i++) {
            for (let j = i + 1; j < shapes.length; j++) {
                const sourceOptions = { shape: shapes[i].getAttribute("data-shape"), rotation: parseFloat(shapes[i].getAttribute("data-rotation")) } as PerimeterAnchorOptions
                const targetOptions = { shape: shapes[j].getAttribute("data-shape"), rotation: parseFloat(shapes[j].getAttribute("data-rotation")) } as PerimeterAnchorOptions
                instance.connect({
                    source: shapes[i],  // just pass in the current node in the selector for source
                    target: shapes[j],
                    // here we supply a different anchor for source and for target, and we get the element's "data-shape"
                    // attribute to tell us what shape we should use, as well as, optionally, a rotation value.
                    anchors: [
                        { type:"Perimeter", options:sourceOptions},
                        { type:"Perimeter", options:targetOptions}
                    ]
                });
            }
        }
    });
});
