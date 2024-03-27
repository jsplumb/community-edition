import { 
    EVENT_CLICK,
    ready, 
    newInstance,
    DotEndpoint,
    Connection,
    EVENT_CONNECTION,
    EVENT_GROUP_MEMBER_ADDED,
    EVENT_GROUP_MEMBER_REMOVED,
    EVENT_GROUP_ADDED,
    EVENT_GROUP_REMOVED,
    EVENT_NESTED_GROUP_ADDED,
    EVENT_NESTED_GROUP_REMOVED,
    BlankEndpoint,
    AnchorLocations,
    StateMachineConnector 
} from "@jsplumb/browser-ui"

ready(() => {


    const ENDPOINT_SPEC = {type:DotEndpoint.type, options:{radius:3}}
    const canvas = document.getElementById("canvas")
        
    const j = newInstance({
        container:canvas, 
        connector:StateMachineConnector.type, 
        endpoint:ENDPOINT_SPEC, 
        anchor:AnchorLocations.Center
    });

    j.bind(EVENT_CONNECTION, (p) => {
        p.connection.bind(EVENT_CLICK, (c:Connection) => {
            j.deleteConnection(c);
        });
    });

    j.bind(EVENT_GROUP_MEMBER_ADDED, function(p) {
        console.log("group:addMember", p.group.id + " - " + p.el.id);
    });
    j.bind(EVENT_GROUP_MEMBER_REMOVED, function(p) {
        console.log("group:removeMember", p.group.id + " - " + p.el.id);
    });
    j.bind("group:expand", function(p) {
        console.log("group:expand", p.group.id);
    });
    j.bind("group:collapse", function(p) {
        console.log("group:collapse", p.group.id);
    });
    j.bind(EVENT_GROUP_ADDED, function(p) {
        console.log("group:add", p.group.id);
    });
    j.bind(EVENT_GROUP_REMOVED, function(p) {
        console.log("group:remove", p.group.id);
    });
    j.bind(EVENT_NESTED_GROUP_ADDED, function(p) {
        console.log("nestedGroupAdded", p.child.id + " added to " + p.parent.id);
    });
    j.bind(EVENT_NESTED_GROUP_REMOVED, function(p) {
        console.log("nestedGroupRemoved", p.child.id + " removed from " + p.parent.id);
    });

    const $ = (id:string) => { return document.getElementById(id)}

    // connect some before configuring group
    j.connect({source:$("c1_1"), target:$("c2_1")});
    j.connect({source:$("c2_1"), target:$("c3_1")});
    j.connect({source:$("c2_2"), target:$("c6_2")});
    j.connect({source:$("c3_1"), target:$("c4_1")});
    j.connect({source:$("c4_1"), target:$("c5_1")});
    j.connect({source:$("c1_1"),target:$("c1_2")});
    j.connect({source:$("c2_1"),target:$("c2_2")});

    // NOTE ordering here. we make one draggable before adding it to the group, and we add the other to the group
    //before making it draggable. they should both be constrained to the group extents.
    var group1 = j.addGroup({
        el:$("container1"),
        id:"one",
        constrain:true,
        anchor:AnchorLocations.Continuous,
        endpoint:BlankEndpoint.type,
        droppable:false
    });
    j.addToGroup("one", $("c1_1"));
    j.addToGroup("one", $("c1_2"));

    var group2 = j.addGroup({
        el:$("container2"),
        id:"two",
        dropOverride:true,
        endpoint:{type:DotEndpoint.type, options:{ radius:3 }}
    });  //(the default is to revert)
    j.addToGroup("two", $("c2_1"));
    j.addToGroup("two", $("c2_2"));
    group1.addGroup(group2);

    var group3 = j.addGroup({
        el:$("container3"),
        id:"three",
        revert:false,
        endpoint:{type:DotEndpoint.type, options:{ radius:3 }}
    });
    j.addToGroup("three", $("c3_1"));
    j.addToGroup("three", $("c3_2"));

    var group4 = j.addGroup({
        el:$("container4"),
        id:"four",
        prune:true,
        endpoint:{type:DotEndpoint.type, options:{ radius:3 }}
    });
    j.addToGroup("four", $("c4_1"));
    j.addToGroup("four", $("c4_2"));
    group3.addGroup(group4);


    j.addGroup({
        el:$("container5"),
        id:"five",
        orphan:true,
        droppable:false,
        endpoint:{type:DotEndpoint.type, options:{ radius:3 }}
    });
    j.addToGroup("five", $("c5_1"), $("c5_2"));

    j.addGroup({
        el:$("container6"),
        id:"six",
        proxied:false,
        endpoint:{type:DotEndpoint.type, options:{ radius:3 }}
    });
    j.addToGroup("six", $("c6_1"), $("c6_2"));

    j.addGroup({
        el:$("container7"),
        id:"seven",
        ghost:true,
        endpoint:{type:DotEndpoint.type, options:{ radius:3 }}
    });
    j.addToGroup("seven", $("c7_1"), $("c7_2"));

    // the independent element that demonstrates the fact that it can be dropped onto a group
    j.manage(document.getElementById("standalone"));

    //... and connect others afterwards.
    j.connect({source:$("c3_1"),target:$("c3_2")});
    j.connect({source:$("c4_1"),target:$("c4_2")});
    j.connect({source:$("c5_1"),target:$("c5_2")});
    j.connect({source:$("c5_1"),target:$("c3_2")});
    j.connect({source:$("c5_1"),target:$("container5"), anchors:["Center", "Continuous"]});
    j.connect({source:$("c5_2"),target:$("c6_1")});
    j.connect({source:$("c6_2"),target:$("c7_1")});

    // delete group button
    j.on(canvas, EVENT_CLICK, ".del", function() {
        var g = this.parentNode.getAttribute("group");
        j.removeGroup(g, this.getAttribute("delete-all") != null);
    });

    // collapse/expand group button
    j.on(canvas, EVENT_CLICK, ".node-collapse", function() {
        var g = this.parentNode.getAttribute("group"), collapsed = j.hasClass(this.parentNode, "collapsed");

        j[collapsed ? "removeClass" : "addClass"](this.parentNode, "collapsed");
        j[collapsed ? "expandGroup" : "collapseGroup"](g);
    });

    //  jsPlumb.fire("jsPlumbDemoLoaded", j);

});
