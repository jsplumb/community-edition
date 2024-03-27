import {
    ready, 
    newInstance, 
    EVENT_CLICK, 
    BrowserJsPlumbInstance,
    Connection,
    JsPlumbListManager, ListManagerOptions
} from "@jsplumb/browser-ui"

ready(() => {

    const canvas = document.getElementById("canvas")

    const instance = newInstance({
        connector: "Straight",
        paintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        endpoint: { type:"Dot", options:{ radius: 5 } },
        endpointStyle: { fill: "#ffa500" },
        container: canvas,
        listStyle:{
            endpoint:{type:"Rectangle", options:{ width:30, height:30 }}
        }
    });

    const listManager = new JsPlumbListManager(instance)

    // get the two elements that contain a list inside them
    const list1El = document.querySelector("#list-one"),
        list2El = document.querySelector("#list-two"),
        list1Ul = list1El.querySelector("ul"),
        list2Ul = list2El.querySelector("ul");

    instance.manage(list1El);
    instance.manage(list2El);

    // get uls
    const lists = document.querySelectorAll("ul");

    instance.registerConnectionType("link", {
        anchors: [ ["Left", "Right" ], ["Left", "Right" ] ]
    })

    // suspend drawing and initialise.
    instance.batch(function () {

        const selectedSources:Array<Element> = [], selectedTargets:Array<Element> = [];

        // add all list elements to the list of elements managed by the instance
        instance.manageAll(document.querySelectorAll(".list ul li"))

        // register a selector for drag
        instance.addSourceSelector("[source] li", {
            allowLoopback: false,
            edgeType:"link"
        });

        // and a selector for drop
        instance.addTargetSelector("[target] li", {
            anchor: ["Left", "Right" ]
        });

        // this code is just to select a few random elements to connect
        for (let l = 0; l < lists.length; l++) {
            const isSource = lists[l].getAttribute("source") != null;
            const items = lists[l].querySelectorAll("li");
            for (let i = 0; i < items.length; i++) {
                if (Math.random() < 0.2) {
                    (isSource ? selectedSources : selectedTargets).push(items[i])
                }
            }
        }

        const connCount = Math.min(selectedSources.length, selectedTargets.length);
        for (let i = 0; i < connCount; i++) {
            instance.connect({source:selectedSources[i], target:selectedTargets[i], type:"link"});
        }
    });



    // configure list1Ul manually, as it does not have a `jtk-scrollable-list` attribute, whereas list2Ul does, and is therefore
    // configured automatically.
    listManager.addList(list1Ul, {
        endpoint:{type:"Rectangle", options:{width:20, height:20}}
    });

    instance.bind(EVENT_CLICK, (c:Connection) => { instance.deleteConnection(c) })

    instance.on(document as any, "change", "[type='checkbox']", (e:Event) => {
        instance[(e.srcElement as any).checked ? "addList" : "removeList"]((e.srcElement as any).value === "list1" ? list1Ul : list2Ul);
    });
});
