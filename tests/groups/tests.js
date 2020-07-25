QUnit.config.reorder = false;

var defaults = null, _divs = [], support, _jsPlumb;

var testSuite = function () {


    module("Groups", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);

        }
    });

    test("sanity", function() {
        equal(1,1);
    });

    var _addGroup = function(j, name, container, members, params) {
        var g = j.addGroup(jsPlumb.extend({
            el:container,
            id:name,
            anchor:"Continuous",
            endpoint:"Blank"
        }, params || {}));

        for (var i = 0; i < members.length; i++) {
            j.addToGroup(name, members[i]);
        }

        return g;
    };

    var _dragToGroup = function(_jsPlumb, el, targetGroup) {
        targetGroup = _jsPlumb.getGroup(targetGroup);
        var tgo = _jsPlumb.getOffset(targetGroup.el),
            tgs = _jsPlumb.getSize(targetGroup.el),
            tx = tgo.left + (tgs[0] / 2),
            ty = tgo.top + (tgs[1] / 2);

        support.dragNodeTo(el, tx, ty);
    };
    var c1,c2,c3,c4,c5,c6,c1_1,c1_2,c2_1,c2_2,c3_1,c3_2,c4_1,c4_2,c5_1,c5_2, c6_1, c6_2, c_noparent;
    var g1, g2, g3, g4, g5, g6;
    var GROUP_WIDTH = 150;
    var GROUP_HEIGHT = 150;
    var NODE_WIDTH = 50;
    var NODE_HEIGHT = 50;

    var gpointer = 100, gx = 0, gy = 0;
    var _addGroupAndContainer = function(w, h, j) {

        j = j || _jsPlumb;

        w = w || GROUP_WIDTH;
        h = h || GROUP_HEIGHT;
        var cId = "container_" + gpointer;
        var c = support.addDiv(cId, null, "container", gx, gy, w, h);
        c.style.outline = "1px solid black";
        gx += w;
        gy += h;

        var gId = "" + gpointer;
        var g = _addGroup(j, gId, c, []);

        gpointer++;
        return g;
    };

    var npointer = 0;
    var _addNodeToGroup = function(g) {
        var cId = "node_" + npointer;
        var c = support.addDiv(cId, g.getDragArea(), "w", 30, 30, NODE_WIDTH, NODE_HEIGHT);
        _jsPlumb.manage(c);
        _jsPlumb.addToGroup(g, c);

        npointer++;
        return c;
    };

    var _addNode = function(x, y, w, h) {
        var cId = "node_" + npointer;
        var c = support.addDiv(cId, _jsPlumb.getContainer(), "w", x, y, w, h);

        npointer++;
        _jsPlumb.manage(c);
        return c;
    };

    var _setupGroups = function(doNotMakeConnections) {
        c1 = support.addDiv("container1", null, "container", 0, 50);
        c2 = support.addDiv("container2", null, "container", 300, 50);
        c3 = support.addDiv("container3", null, "container", 600, 50);
        c4 = support.addDiv("container4", null, "container", 1000, 400);
        c5 = support.addDiv("container5", null, "container", 300, 400);
        c6 = support.addDiv("container6", null, "container", 800, 1000);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";
        c3.style.outline = "1px solid black";
        c4.style.outline = "1px solid black";
        c5.style.outline = "1px solid black";
        c6.style.outline = "1px solid black";

        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30);
        c1_2 = support.addDiv("c1_2", c1, "w", 180, 130);
        c5_1 = support.addDiv("c5_1", c5, "w", 30, 30);
        c5_2 = support.addDiv("c5_2", c5, "w", 180, 130);
        c4_1 = support.addDiv("c4_1", c4, "w", 30, 30);
        c4_2 = support.addDiv("c4_2", c4, "w", 180, 130);
        c3_1 = support.addDiv("c3_1", c3, "w", 30, 30);
        c3_2 = support.addDiv("c3_2", c3, "w", 180, 130);
        c2_1 = support.addDiv("c2_1", c2, "w", 30, 30);
        c2_2 = support.addDiv("c2_2", c2, "w", 180, 130);
        c6_1 = support.addDiv("c6_1", c6, "w", 30, 30);
        c6_2 = support.addDiv("c6_2", c6, "w", 180, 130);

        c_noparent = support.addDiv("c_noparent", null, "w", 1000, 1000);

      //  _jsPlumb.draggable([c1_1,c1_2,c2_1,c2_2,c3_1,c3_2,c4_1,c4_2,c5_1,c5_2, c6_1, c6_2]);

        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1,c1_2], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1,c2_2], {dropOverride:true});
        g3 = _addGroup(_jsPlumb, "three", c3, [c3_1,c3_2],{ revert:false });
        g4 = _addGroup(_jsPlumb, "four", c4, [c4_1,c4_2], { prune: true });
        g5 = _addGroup(_jsPlumb, "five", c5, [c5_1,c5_2], { orphan:true, droppable:false });
        g6 = _addGroup(_jsPlumb, "six", c6, [c6_1,c6_2], { orphan:true, droppable:false, proxied:false });

        if (!doNotMakeConnections) {

            _jsPlumb.connect({source: c1_1, target: c2_1});
            _jsPlumb.connect({source: c2_1, target: c3_1});
            _jsPlumb.connect({source: c3_1, target: c4_1});
            _jsPlumb.connect({source: c4_1, target: c5_1});

            _jsPlumb.connect({source: c1_1, target: c1_2});
            _jsPlumb.connect({source: c2_1, target: c2_2});
            _jsPlumb.connect({source: c3_1, target: c3_2});
            _jsPlumb.connect({source: c4_1, target: c4_2});
            _jsPlumb.connect({source: c5_1, target: c5_2});
            _jsPlumb.connect({source: c5_1, target: c3_2});

            _jsPlumb.connect({source: c5_1, target: c5, anchors: ["Center", "Continuous"]});

            _jsPlumb.connect({source:c6_1, target:c1_1});
            _jsPlumb.connect({source:c1_2, target:c6_2});
        }
    };

    // test("groups, simple access", function() {
    //
    //     _setupGroups();
    //
    //     // check a group has members
    //     equal(_jsPlumb.getGroup("four").children.length, 2, "2 members in group four");
    //     equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three");
    //     // check an unknown group throws an error
    //     try {
    //         _jsPlumb.getGroup("unknown");
    //         ok(false, "should not have been able to retrieve unknown group");
    //     }
    //     catch (e) {
    //         ok(true, "unknown group retrieve threw exception");
    //     }
    //
    //     // group4 is at [1000, 400]
    //     // its children are
    //
    //     equal(parseInt(c4.style.left), 1000, "c4 at 1000 left");
    //     equal(parseInt(c4.style.top), 400, "c4 at 400 top");
    //     equal(parseInt(c4_1.style.left), 30, "c4_1 at 30 left");
    //     equal(parseInt(c4_1.style.top), 30, "c4_1 at 30 top");
    //     equal(parseInt(c4_2.style.left), 180, "c4_2 at 180 left");
    //     equal(parseInt(c4_2.style.top), 130, "c4_2 at 130 top");
    //
    //
    //     _jsPlumb.removeGroup("four", false);
    //     try {
    //         _jsPlumb.getGroup("four");
    //         ok(false, "should not have been able to retrieve removed group");
    //     }
    //     catch (e) {
    //         ok(true, "removed group subsequent retrieve threw exception");
    //     }
    //     ok(c4_1.parentNode != null, "c4_1 not removed from DOM even though group was removed");
    //     // check positions of child nodes; they should have been adjusted.
    //     equal(parseInt(c4_1.style.left), 1030, "c4_1 at 1030 left");
    //     equal(parseInt(c4_1.style.top), 430, "c4_1 at 430 top");
    //     equal(parseInt(c4_2.style.left), 1180, "c4_2 at 1180 left");
    //     equal(parseInt(c4_2.style.top), 530, "c4_2 at 530 top");
    //
    //
    //     _jsPlumb.removeGroup("five", true);
    //     try {
    //         _jsPlumb.getGroup("five");
    //         ok(false, "should not have been able to retrieve removed group");
    //     }
    //     catch (e) {
    //         ok(true, "removed group subsequent retrieve threw exception");
    //     }
    //     ok(c5_1.parentNode == null, "c5_1 removed from DOM because group 5 also removes its children on group removal");
    //
    //     // reset: all groups should be removed
    //     _jsPlumb.reset();
    //     try {
    //         _jsPlumb.getGroup("three");
    //         ok(false, "should not have been able to retrieve group after reset");
    //     }
    //     catch (e) {
    //         ok(true, "retrieve group after reset threw exception");
    //     }
    //
    // });

    // test("simple adding to group", function() {
    //     var g = _addGroupAndDomElement(_jsPlumb, "g1");
    //     var d1 = support.addDiv("d1");
    //
    //     equal(g.children.length, 0, "0 members in group");
    //
    //     _jsPlumb.addToGroup(g, d1);
    //     equal(g.children.length, 1, "1 member in group");
    //
    //     // var els = _jsPlumb.getDragManager().getElementsForDraggable("g1");
    //     // equal(support.countKeys(els), 1, "1 element for group g1 to repaint");
    //
    //     // add again; should ignore.
    //     _jsPlumb.addToGroup(g, d1);
    //     equal(g.children.length, 1, "1 member in group");
    //
    //     var g2 = _addGroupAndDomElement(_jsPlumb, "g2");
    //     _jsPlumb.addToGroup(g2, d1);
    //     equal(g.children.length, 0, "0 members in group g1 after node removal");
    //     equal(g2.children.length, 1, "1 member in group g2 after node addition");
    //
    //     // els = _jsPlumb.getDragManager().getElementsForDraggable("g1");
    //     // equal(support.countKeys(els), 0, "0 elements for group g1 to repaint");
    //
    //     // els = _jsPlumb.getDragManager().getElementsForDraggable("g2");
    //     // equal(support.countKeys(els), 1, "1 element for group g2 to repaint");
    //
    //     var d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
    //     _jsPlumb.addToGroup(g2, [ d2, d3 ]);
    //     equal(g2.children.length, 3, "3 members in group g2 after node additions");
    //     // els = _jsPlumb.getDragManager().getElementsForDraggable("g2");
    //     // equal(support.countKeys(els), 3, "3 elements for group g2 to repaint");
    //
    // });

    test("groups, dragging between groups, take one", function() {
        _setupGroups();
        var els;

        equal(_jsPlumb.getGroup("four").children.length, 2, "2 members in group four at start");

        // els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        // equal(support.countKeys(els), 2, "2 elements for group 3 to repaint");
        // els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        // equal(support.countKeys(els), 2, "2 elements for group 4 to repaint");

        // drag 4_1 to group 3
        _dragToGroup(_jsPlumb, c4_1, "three");
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four after moving a node out");
        equal(_jsPlumb.getGroup("three").children.length, 3, "3 members in group three");

        // els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        // equal(support.countKeys(els), 3, "3 elements for group 3 to repaint");

        // els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        // equal(support.countKeys(els), 1, "1 element for group 4 to repaint");

        // drag 4_2 to group 5 (which is not droppable)
        equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before drop attempt");
        _dragToGroup(_jsPlumb, c4_2, "five");
        equal(_jsPlumb.getGroup("four").children.length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
        equal(_jsPlumb.getGroup("five").children.length, 2, "but still only 2 members in group five");

        // els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        // equal(support.countKeys(els), 0, "0 elements for group 4 to repaint");
        //
        // els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        // equal(support.countKeys(els), 3, "3 elements for group 3 to repaint");

    });

    test("groups, moving between groups, take one", function() {
        _setupGroups();
        var els;

        // els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        // equal(support.countKeys(els), 2, "2 elements for group 3 to repaint");
        // els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        // equal(support.countKeys(els), 2, "2 elements for group 4 to repaint");

        var addEvt = false, removeEvt = false;
        _jsPlumb.bind("group:addMember", function() {
            addEvt = true;
        });
        _jsPlumb.bind("group:removeMember", function() {
            removeEvt = true;
        });
        // move 4_1 to group 3
        _jsPlumb.addToGroup(_jsPlumb.getGroup("three"), c4_1);
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four");
        equal(_jsPlumb.getGroup("three").children.length, 3, "3 members in group three");

        // els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        // equal(support.countKeys(els), 3, "3 elements for group 3 to repaint");
        //
        // els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        // equal(support.countKeys(els), 1, "1 element for group 4 to repaint");


        ok(addEvt, "add event was fired");
        ok(removeEvt, "remove event was fired");

        // add again: it is already a member and should not be re-added
        addEvt = false;
        removeEvt = false;
        _jsPlumb.addToGroup(_jsPlumb.getGroup("three"), c4_1);
        equal(_jsPlumb.getGroup("three").children.length, 3, "3 members in group three");
        ok(!addEvt, "add event was NOT fired");
        ok(!removeEvt, "remove event was NOT fired");

        // momve 4_2 to group 5 (which is not droppable)
//        equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before drop attempt");
//        _jsPlumb.addToGroup(_jsPlumb.getGroup("five"), c4_2);
//        equal(_jsPlumb.getGroup("four").children.length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
//        equal(_jsPlumb.getGroup("five").children.length, 2, "but still only 2 members in group five");

    });

    test("groups, dragging between groups, take 2", function() {
        _setupGroups();

        // drag 4_2 to group 1 (which is not droppable)
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one before attempted drop from group 1");
        _dragToGroup(_jsPlumb, c4_2, "one");
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four (it prunes on drop outside)");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after failed drop: group 1 not droppable");

        // drag 4_1 to group 2 (which is droppable)
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two before drop from group 4");
        _dragToGroup(_jsPlumb, c4_1, "two");
        equal(_jsPlumb.getGroup("four").children.length, 0, "0 members in group four after dropping el on group 2");
        equal(_jsPlumb.getGroup("two").children.length, 3, "3 members in group two after dropping el from group 4");

        // drag 1_2 to group 2 (group 1 has constrain switched on; should not drop even though 2 is droppable)
        _dragToGroup(_jsPlumb, c1_2, "two");
        equal(_jsPlumb.getGroup("two").children.length, 3, "3 members in group two after attempting drop from group 1");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after drop on group 2 failed due to constraint");

    });

    test("dragging nodes out of groups", function() {
        _setupGroups();
        // try dragging 1_2 right out of the box and dropping it. it should not work: c1 has constrain switched on.
        var c12o = _jsPlumb.getOffset(c1_2);
        support.dragtoDistantLand(c1_2);
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one");
        // check the node has not actually moved.
        equal(c12o.left, _jsPlumb.getOffset(c1_2).left, "c1_2 left position unchanged");
        equal(c12o.top, _jsPlumb.getOffset(c1_2).top, "c1_2 top position unchanged");

        // try dragging 2_2 right out of the box and dropping it. it should not work: c1 has revert switched on.
        var c22o = _jsPlumb.getOffset(c2_2);
        support.dragtoDistantLand(c2_2);
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two");
        // check the node has not actually moved.
        equal(c22o.left, _jsPlumb.getOffset(c2_2).left, "c2_2 left position unchanged");
        equal(c22o.top, _jsPlumb.getOffset(c2_2).top, "c2_2 top position unchanged");


        // c3, should also allow nodes to be dropped outside
        var c32o = _jsPlumb.getOffset(c3_2);
        support.dragtoDistantLand(c3_2);
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three");
        // check the node has moved. but just not removed from the group.
        ok(c32o.left != _jsPlumb.getOffset(c3_2).left, "c3_2 left position changed");
        ok(c32o.top != _jsPlumb.getOffset(c3_2).top, "c3_2 top position changed");

        // c4 prunes nodes on drop outside
        support.dragtoDistantLand(c4_2);
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four");
        ok(c4_2.parentNode == null, "c4_2 removed from DOM");

        // c5 orphans nodes on drop outside (remove from group but not from DOM)
        support.dragtoDistantLand(c5_2);
        equal(_jsPlumb.getGroup("five").children.length, 1, "1 member in group five");
        ok(c5_2.parentNode != null, "c5_2 still in DOM");
    });

    test("single group collapse and expand", function() {

        _setupGroups();

        equal(_jsPlumb.select({source:"c3_1"}).length, 2, "2 source connections for c3_1");
        equal(_jsPlumb.select({target:"c3_1"}).length, 1, "1 target connection for c3_1");
        _jsPlumb.collapseGroup("three");

        ok(_jsPlumb.hasClass(c3, "jtk-group-collapsed"), "group has collapsed class");
        var c3_1conns = _jsPlumb.select({source:"c3_1"});
        equal(c3_1conns.length, 2, "still 2 source connections for c3_1");
        equal(_jsPlumb.select({target:"c3_1"}).length, 1, "still 1 target connection for c3_1");
        equal(_jsPlumb.select({source:"container3"}).length, 0, "no source connections for container3. the connections are proxied.");
        equal(_jsPlumb.select({target:"container3"}).length, 0, "no target connections for container3. the connections are proxied.");

        _jsPlumb.expandGroup("three");
        equal(_jsPlumb.select({source:"container3"}).length, 0, "no connections for container3");
        equal(_jsPlumb.select({target:"container3"}).length, 0, "no connections for container3");
        c3_1conns = _jsPlumb.select({source:"c3_1"});
        equal(c3_1conns.length, 2, "still 2 source connections yet for c3_1");
        ok(c3_1conns.get(0).isVisible(), "first c3_1 connection is visible");
        ok(c3_1conns.get(1).isVisible(), "second c3_1 connection is visible");
        ok(!_jsPlumb.hasClass(c3, "jtk-group-collapsed"), "group doesnt have collapsed class");

    });

    test("group in collapsed state to start", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50);
        var g = _addGroup(_jsPlumb, "one", c1, [], { collapsed:true });
        ok(_jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group has collapsed class");
        ok(g.collapsed === true, "Group is collapsed");

        _jsPlumb.expandGroup("one");
        ok(!_jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group doesnt have collapsed class");
        ok(g.collapsed !== true, "Group is not collapsed");

        _jsPlumb.collapseGroup("one");
        ok(_jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group has collapsed class");
        ok(g.collapsed === true, "Group is collapsed");


    });

    test("group collapse that does not wish to be proxied.", function() {

        _setupGroups();

        equal(_jsPlumb.select({source:"c6_1"}).length, 1, "1 source connection for c6_1");
        equal(_jsPlumb.select({target:"c6_2"}).length, 1, "1 target connection for c6_2");
        _jsPlumb.collapseGroup("six");

        var c6_1conns = _jsPlumb.select({source:"c6_1"});
        equal(c6_1conns.length, 1, "still 1 source connection for c6_1");
        equal(_jsPlumb.select({target:"c6_2"}).length, 1, "still 1 target connection for c6_2");
        equal(c6_1conns.get(0).endpoints[0].elementId, "c6_1", "source endpoint unchanged for connection");
        ok(!c6_1conns.get(0).isVisible(), "source connection is not visible.");

        _jsPlumb.expandGroup("six");
        ok(c6_1conns.get(0).isVisible(), "source connection is visible.");

    });

    test("multiple group collapse and expand", function() {
        _setupGroups();

        equal(_jsPlumb.select({source:"c3_1"}).length, 2, "2 source connections for c3_1");
        _jsPlumb.collapseGroup("three");
        var c3_1_source = _jsPlumb.select({source:"c3_1"});
        equal(c3_1_source.length, 2, "still 2 source connections for c3_1");
        equal(c3_1_source.get(0).proxies[0].originalEp.elementId, "c3_1", "proxy configured correctly");
        equal(c3_1_source.get(1).proxies.length, 0, "second source connection from c3_1 not proxied as it goes to c3_2");
        ok(!c3_1_source.get(1).isVisible(), "second source connection from c3_1 not visible as it goes to c3_2");

        _jsPlumb.collapseGroup("five");

        _jsPlumb.expandGroup("five");

        _jsPlumb.expandGroup("three");

        _jsPlumb.collapseGroup("three");
    });

    test("drop element on collapsed group", function()
    {
        _setupGroups(true);

        equal(_jsPlumb.select().length, 0, "0 connections to start");

        // a connection to the group to be collapsed
        var c = _jsPlumb.connect({source:c4_2, target:c3_1});
        // a connection from the group to be collapsed
        var c2 = _jsPlumb.connect({source:c3_2, target:c1_1});
        // a connection between two other elements, but which will become owned by the collapse group.
        var c3 = _jsPlumb.connect({source:c2_1, target:c5_1});

        equal(_jsPlumb.select().length, 3, "3 connections in total");

        // drop an element on a collapsed group
        // expand it afterwards
        // check everything is hunky dory
        _jsPlumb.collapseGroup("three");

        equal(c.proxies[1].originalEp.elementId, "c3_1", "target connection has been correctly proxied");
        ok(c.proxies[0] == null, "source connection has been correctly proxied");

        equal(c2.proxies[0].originalEp.elementId, "c3_2", "source connection has been correctly proxied");
        ok(c2.proxies[1] == null, "target connection has been correctly proxied");

        _dragToGroup(_jsPlumb, c4_2, "three");

        equal(_jsPlumb.getGroup("three").children.length, 3, "there are 3 members in group 3 after node c4_1 dropped in it");
        equal(_jsPlumb.getGroup("four").children.length, 1, "there is 1 member in group 4 after node c4_1 moved out");

        // dragging c4_2 to group 3 means that its connection to c3_1 is now internal to the group,
        // and since the group is collapsed, it should not be visible.
        equal(false, c.isVisible(), "original connection now between two members of collapsed group and is invisible.");
        equal(c.proxies.length, 0, "source and target connection proxy removed now that the connection is internal");
        //ok(c.proxies[1] == null, "target connection proxy removed now that the connection is internal");

        equal(c.endpoints[0].elementId, "c4_2", "source endpoint reset to original");
        equal(c.endpoints[1].elementId, "c3_1", "target endpoint reset to original");

        _dragToGroup(_jsPlumb, c5_1, "three");
        equal(_jsPlumb.getGroup("three").children.length, 4, "there are 4 members in group 3 after node moved dropped ");
        equal(_jsPlumb.getGroup("five").children.length, 1, "there is 1 member in group 5 after node moved out");
        ok(c3.proxies[0] == null, "source in connection dropped on collapsed group did not need to be proxied");
        equal(c3.endpoints[0].elementId, "c2_1", "source in connection dropped on collapsed group is unaltered");
        equal(c3.proxies[1].originalEp.elementId, "c5_1", "target in connection dropped on collapsed group has been correctly proxied");

        equal(_jsPlumb.select().length, 3, "3 connections in total");




    });

    test("a series of group collapses and expansions", function()
    {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1}),
            ep1 = c.endpoints[0],
            ep2 = c.endpoints[1];

//        equal(_jsPlumb.getGroup("three").proxies.length, 0, "there are 0 proxies in group 3 to begin");
//        equal(_jsPlumb.getGroup("four").proxies.length, 0, "there are 0 proxies in group 4 to begin");

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
//        equal(_jsPlumb.getGroup("two").proxies.length, 1, "there is 1 proxy in group 2");
//        equal(_jsPlumb.getGroup("three").proxies.length, 0, "there are 0 proxies in group 3");

        equal(_jsPlumb.select().length, 1, "one connection after collapse 2");

        _jsPlumb.collapseGroup("three");

        _jsPlumb.expandGroup("three");

        _jsPlumb.expandGroup("two");

        _jsPlumb.collapseGroup("three");
    });


    test("deletion of proxy connections cleans up their proxied connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].elementId, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.elementId, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the proxy connection. it should clean up the original one. then when we collapse group three
        // there should be no connections of any sort.
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select().length, 0, "no connections");
    });


    test("deletion of proxIED connections cleans up their proxy connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});


        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].elementId, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.elementId, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the connection. it should clean up the original one. then when we collapse group three
        // there should be no connections of any sort.
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select().length, 0, "there should be no connections left after detach");
        ok(c.proxies == null, "proxies removed after detach");
    });

    test("indirect deletion of proxIED connections cleans up their proxy connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].elementId, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.elementId, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the connection's endpoint.
        _jsPlumb.deleteEndpoint(c.endpoints[1]);
        equal(_jsPlumb.select().length, 0, "no connections");

    });

    test("move connections between group children via dragging connections", function() {
        _setupGroups(true);

        equal(_jsPlumb.select().length, 0, "0 connections to start");

        // a connection to the group to be collapsed
        var c = _jsPlumb.connect({source: c4_2, target: c3_1});
        _jsPlumb.makeTarget(c2_1);

        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source conn in group 4");
        equal(_jsPlumb.getGroup("three").connections.target.length, 1, "one target conn in group 3");

        support.relocateTarget(c, c2_1);
        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source conn in group 4 after move");
        equal(_jsPlumb.getGroup("three").connections.target.length, 0, "zero target conns in group 3 after move");
        equal(_jsPlumb.getGroup("two").connections.target.length, 1, "one target conn in group 2 after move");
    });

    test("cannot create duplicate group", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addGroup({el:d1, id:"group"});
        try {
            _jsPlumb.addGroup({el:d2, id:"group"});
            ok(false, "should have thrown an error when trying to a duplicate group")
        }
        catch (e) {
            expect(0);
        }
    });

    test("cannot create a new Group with an element that is already configured as a Group", function() {
        var d1 = support.addDiv("d1");
        _jsPlumb.addGroup({el:d1, id:"group"});
        try {
            _jsPlumb.addGroup({el:d1, id:"group2"});
            ok(false, "should have thrown an error when trying to a add a group element as a new group")
        }
        catch (e) {
            expect(0);
        }

    });

    test("retrieve information about an element's Group, by ID", function() {
        _setupGroups(true);
        equal("four", _jsPlumb.getGroupFor("c4_2").id, "group id is correct, element referenced by ID");
    });

    test("retrieve information about an element's Group, by element", function() {
        _setupGroups(true);
        equal("four", _jsPlumb.getGroupFor(document.getElementById("c4_2")).id, "group id is correct, element referenced by ID");
    });

    test("retrieve information about a non existent element's Group", function() {
        equal(null, _jsPlumb.getGroupFor("unknown"), "group is null because element doesn't exist");
    });

    test("add elements that already have connections to a group", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source:d1, target:d2}),
            c2 = _jsPlumb.connect({source:d1, target:d3}),
            g = support.addDiv("group");

        equal(2, _jsPlumb.select().length, "there are two connections");

        var group = _jsPlumb.addGroup({
            el:g
        });

        // add d1; it has a connection to outside and also one to d3, which will be inside the group. add d3.
        group.add(d1); group.add(d3);
        // collapse the group. the connection from d1 should be proxied. the connection from d3 should not.
        _jsPlumb.collapseGroup(group);
        equal(2, _jsPlumb.select().length, "there are two connections");
        // test for proxied
        equal("d1", c.proxies[0].originalEp.elementId, "endpoint was proxied after collapse");
        // test for proxied
        equal("d1", c2.endpoints[0].elementId, "endpoint to internal element was not proxied after collapse");
        equal("d3", c2.endpoints[1].elementId, "endpoint to internal element was not proxied after collapse");
        equal(0, c2.proxies.length, "connection 2 did not get proxies added");

        // expand and test proxy was cleared
        _jsPlumb.expandGroup(group);
        ok(c.proxies[0] == null, "proxies removed after expand");
        // remove from the group and collapse
        group.remove(d1);
        _jsPlumb.collapseGroup(group);
        // test proxy was not attached
        ok(c.proxies[0] == null, "proxies not setup since element was removed");

        // expand
        _jsPlumb.expandGroup(group);

        // add d1 again; it has a connection
        group.add(d1);
        // collapse the group. the connection from d1 should be proxied.
        _jsPlumb.collapseGroup(group);
        // test for proxied
        equal("d1", c.proxies[0].originalEp.elementId, "endpoint was proxied after collapse");
        equal(2, group.children.length, "two members in group");

        group.removeAll();
        equal(0, group.children.length, "no members in group");
        _jsPlumb.expandGroup(group);

        c.proxies[0] = "flag";

        _jsPlumb.collapseGroup(group);
        // test proxy was not attached
        ok(c.proxies[0] == "flag", "proxies not setup since all elements were removed");
    });

    test("drag a connection from an element to a group", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            //c = _jsPlumb.connect({source:d1, target:d2}),
            //c2 = _jsPlumb.connect({source:d1, target:d3}),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.makeTarget(g);
        _jsPlumb.makeSource(d1);

        var c = support.dragConnection(d1, g);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, g, "target is the group element");
        equal(conns.get(0).source, d1, "source is the node element");
    });

    test("drag a connection from an element to an element inside a group, element added to group before any elements made source/target", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            d2 = support.addDiv("d2", null, null, 0,0, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.addToGroup(group, d2);
        _jsPlumb.makeTarget(g, {rank:0});
        _jsPlumb.makeSource(d1);
        _jsPlumb.makeTarget(d2, {rank:10});

        d2.style.left = "40px";
        d2.style.top = "40px";

        var c = support.dragConnection(d1, d2);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, d2, "target is d2");
        equal(conns.get(0).source, d1, "source is d1");
    });

    test("drag a connection from an element to an element inside a group, element added to group after elements made source/target", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        _jsPlumb.makeSource(d1);

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.makeTarget(g, {rank:0});


        var d2 = support.addDiv("d2", null, null, 0,0, 40, 40);
        _jsPlumb.addToGroup(group, d2);
        _jsPlumb.makeTarget(d2, {rank:10});

        d2.style.left = "40px";
        d2.style.top = "40px";

        var c = support.dragConnection(d1, d2);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, d2, "target is d2");
        equal(conns.get(0).source, d1, "source is d1");
    });

    // -------------------------- drop precedence (required for nodes inside groups that are also droppables)
    test("drop precedence, set positive rank on element to upgrade", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d1, {rank:0});

        _jsPlumb.makeTarget(d2, {rank:10}/*, {
         dropOptions:{
         rank:10
         }
         }*/);

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    // there are no dropOptions on a per-element basis after the rewrite.  is that a bad thing?
    // test("drop precedence, set negative rank on element to downgrade", function() {
    //     var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
    //     var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
    //     var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);
    //
    //     _addGroup(_jsPlumb, "g1", d1, [d2]);
    //
    //     _jsPlumb.makeTarget(d1/*, {
    //      dropOptions:{
    //      rank:-10
    //      }
    //      }*/);
    //
    //     _jsPlumb.makeTarget(d2, {rank:-10});
    //
    //     _jsPlumb.makeSource(d3);
    //
    //     var sourceEvent = support.makeEvent(d3);
    //     var d2TargetEvent = support.makeEvent(d2);
    //
    //     _jsPlumb.trigger(d3, "mousedown", sourceEvent);
    //     _jsPlumb.trigger(document, "mousemove", d2TargetEvent);
    //
    //
    //     ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
    //     ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has.");
    //
    //     _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);
    //
    //     equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
    //     equal(d1, _jsPlumb.select().get(0).target, "connection target is d2");
    //
    // });

    test("drop on node inside group, group configured first", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d1);
        _jsPlumb.makeTarget(d2);

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, even though it was second.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2 (the node)");

    });

    test("drop on node inside group, group configured last", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 20, 20, 20, 20);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d2);
        _jsPlumb.makeTarget(d1);

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    // test("drop precedence, equal ranks, order of droppable is used, group first", function() {
    //     var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
    //     var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
    //     var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);
    //
    //     _addGroup(_jsPlumb, "g1", d1, [d2]);
    //
    //     _jsPlumb.makeTarget(d1, {
    //         dropOptions: {
    //             rank: 5
    //         }
    //     });
    //     _jsPlumb.makeTarget(d2, {
    //         dropOptions: {
    //             rank: 5
    //         }
    //     });
    //
    //     _jsPlumb.makeSource(d3);
    //
    //     var sourceEvent = support.makeEvent(d3);
    //     var d2TargetEvent = support.makeEvent(d2);
    //
    //     _jsPlumb.trigger(d3, "mousedown", sourceEvent);
    //     _jsPlumb.trigger(document, "mousemove", d2TargetEvent);
    //
    //
    //     ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
    //     ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has, and it was first.");
    //
    //     _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);
    //
    //     equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
    //     equal(d1, _jsPlumb.select().get(0).target, "connection target is d1");
    //
    // });

    test("drop precedence, equal ranks, order of droppable is used, group last", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d2, { rank:5 });
        _jsPlumb.makeTarget(d1, { rank:5 });

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    test("drag node out of group and then back in", function() {
        var d1 = support.addDiv("d1", container, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", container, null, 700, 700, 50, 50);

        _jsPlumb.manage(d1);
        _jsPlumb.manage(d2);
        _jsPlumb.manage(d3);

       // _jsPlumb.draggable(d2);

        var g1 = _addGroup(_jsPlumb, "g1", d1, [d2], {orphan:true});
        equal(g1.children.length, 1, "group 1 has one member");

        var removeEvt = false, addEvt = false;
        _jsPlumb.bind("group:removeMember", function() {
            removeEvt = true;
        });

        _jsPlumb.bind("group:addMember", function() {
            addEvt = true;
        });

        support.dragNodeBy(d2, -500,-500);

        equal(g1.children.length, 0, "group 1 has zero members");

        ok(removeEvt, "the remove group member event was fired");

        removeEvt = false;

        support.dragNodeBy(d2, 300,300);

        ok(addEvt, "the add group member event was fired");

    });

    test("drag node out of one group and into another; move flag set in remove and add events", function() {
        var d1 = support.addDiv("d1", container, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        d2.style.zIndex = 5000;
        var d3 = support.addDiv("d3", container, null, 700, 700, 50, 50);

       // _jsPlumb.draggable(d2);

        var g1 = _addGroup(_jsPlumb, "g1", d1, [d2], {orphan:true});

        var g3 = _addGroup(_jsPlumb, "g3", d3, [], {orphan:true});

        _jsPlumb.manage(d1);
        _jsPlumb.manage(d2);
        _jsPlumb.manage(d3);

        equal(g1.children.length, 1, "group 1 has one child");

        var removeEvt = false, addEvt = false, targetGroup, sourceGroup;
        _jsPlumb.bind("group:removeMember", function(p) {
            removeEvt = true;
            targetGroup = p.targetGroup;
        });

        _jsPlumb.bind("group:addMember", function(p) {
            addEvt = true;
            sourceGroup = p.sourceGroup;
        });

        support.dragNodeBy(d2, 510,510);

        equal(g1.children.length, 0, "group 1 has zero children");

        ok(removeEvt, "the remove group member event was fired");
        ok(addEvt, "the add group member event was fired");

        equal(targetGroup.id, "g3", "g3 reported as target group in remove from group event");
        equal(sourceGroup.id, "g1", "g1 reported as source group in add to group event");

    });

    /**
     * create a group and give it two child nodes, each of which has a child node, and these grandchildren nodes are connected. test that the connection is visible.
     * collapse the group and then test that the connection is not visible.  expand the group and test that it is
     * once again.
     */
    test("groups, connections between children of nodes, both nodes child of the group", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50, 600, 600);
        c1.style.position="relative";

        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c1_2 = support.addDiv("c1_2", c1, "w", 480, 130, 150, 150);
        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1, c1_2], { constrain:true, droppable:false});

        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c1_1_2 = support.addDiv("c1_1_2", c1_2, "w", 30, 30, 50, 50);

        var conn = _jsPlumb.connect({source:c1_1_1, target:c1_1_2});
        //equal(g1.connections.source.length, 1, "1 connection in group source connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g1);

        equal(false, conn.isVisible(), "connection is not visible after group collapse");

        _jsPlumb.toggleGroup(g1);

        equal(true, conn.isVisible(), "connection is visible once more");



    });

    test("groups, connections between nodes (sanity test for next test), nodes child of different groups", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50);
        c2 = support.addDiv("container2", null, "container", 300, 50);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);
        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1], { constrain:true, droppable:false});

        _jsPlumb.connect({source:c1_1, target:c2_1});
        equal(g1.connections.source.length, 1, "1 connection in group source connections");

    });

    test("groups, connections between children of nodes, nodes child of different groups", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("container2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);
        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1], { constrain:true, droppable:false});

        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);

        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});
        equal(g1.connections.source.length, 1, "1 connection in group source connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g1);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g1, c1_1);
        equal(g1.connections.source.length, 0, "0 connections in group source connections");

    });

    test("groups, connections between children of nodes, children connected before adding to group", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("container2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);

        // create child elements and connect them
        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);
        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});

        //g1 = _addGroup(_jsPlumb, "one", c1, [], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [], { constrain:true, droppable:false});

        // add c2_1 to group 2.  c2_1 is not connected to anything itself, it has a child that is the target of a connection, though.
        _jsPlumb.addToGroup(g2, c2_1);

        equal(g2.connections.target.length, 1, "1 connection in group target connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g2);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g2, c2_1);
        equal(g2.connections.target.length, 0, "0 connections in group target connections");

    });

    test("groups, remove child while group is collapsed - proxy connection should be cleaned up, reconnected to node", function() {

        c1 = support.addDiv("group1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("group2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);

        // create child elements and connect them
        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);
        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});

        var g2 = _addGroup(_jsPlumb, "two", c2, [], { constrain:true, droppable:false});

        // add c2_1 to group 2.  c2_1 is not connected to anything itself, it has a child that is the target of a connection, though.
        _jsPlumb.addToGroup(g2, c2_1);

        equal(c2, c2_1.parentNode, "group 2's element is parent node of c2_1");

        equal(1, g2.connections.target.length, "1 connection in group target connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g2);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g2, c2_1);
        equal(g2.connections.target.length, 0, "0 connections in group target connections");
        equal(c2_1.parentNode, _jsPlumb.getContainer(), "container is parent node of c2_1 after removal from group");

        var groupConns = _jsPlumb.getConnections({target:c2, scope:'*'});
        equal(0, groupConns.length, "no connections registered for the group element");

        equal(true, conn.isVisible(), "connection is visible ");

        equal(conn.source, c1_1_1, "c1_1_1 is connection source after removal from group");
        equal(conn.target, c2_1_1, "c2_1_1 is connection target after removal from group");

        var conns = _jsPlumb.getConnections({source:c1_1_1, scope:'*'});
        equal(conns.length, 1, "1 connection registered for c1_1_1");

    });

    /**
     * tests a specific problem in the original rewrite: an edge between two nodes which are children of different
     * groups
     */
    test("nodes inside groups, collapse both groups, expand both groups", function() {

        var c1 = support.addDiv("container1", null, "container", 0, 50),
            c2 = support.addDiv("container2", null, "container", 300, 50);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";

        var c1_1 = support.addDiv("c1_1", c1, "w", 30, 30),
            c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);

        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1]);
        var g2 = _addGroup(_jsPlumb, "two", c2, [c2_1]);

        var conn = _jsPlumb.connect({source:"c1_1", target:"c2_1"});

        equal(conn.endpoints[0].element, c1_1, "c1_1 is connection source");
        equal(conn.endpoints[1].element, c2_1, "c2_1 is connection target");

        _jsPlumb.collapseGroup("one");

        equal(conn.endpoints[0].element, c1, "c1 is connection source");
        equal(conn.endpoints[1].element, c2_1, "c2_1 is connection target");

        _jsPlumb.collapseGroup("two");

        equal(conn.endpoints[0].element, c1, "c1 is connection source");
        equal(conn.endpoints[1].element, c2, "c2 is connection target");

        _jsPlumb.expandGroup("one");

        equal(conn.endpoints[0].element, c1_1, "c1_1 is connection source");
        equal(conn.endpoints[1].element, c2, "c2 is connection target");

        _jsPlumb.expandGroup("two");

        // this is where the original code would fail: the target did not get reinstated to be c2_1, because the unproxy method
        // that ran when we expanded group one blew away the proxies, so when it came to unproxying this side it didnt know
        // it should.
        equal(conn.endpoints[0].element, c1_1, "c1_1 is connection source");
        equal(conn.endpoints[1].element, c2_1, "c2_1 is connection target");


    });

    test("nested groups, setup", function() {

        var c1 = support.addDiv("container1", null, "container", 0, 50),
            c2 = support.addDiv("container2", null, "container", 300, 50);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";

        var c1_1 = support.addDiv("c1_1", c1, "w", 30, 30),
            c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);

        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1]);
        var g2 = _addGroup(_jsPlumb, "two", c2, [c2_1]);

        g1.addGroup(g2);

        equal(1, g1.getGroups().length, "g1 has one child group");

        var g1DragArea = g1.getDragArea();
        equal(g1DragArea, g2.el.parentNode, "g2 has been set as a child of g1's drag area");

        equal(0, g2.getGroups().length, "g2 initially has one child group");

        // create a new group and add as a child of g2 (which is itself a child of g1)
        var c3 = support.addDiv("container3", null, "container", 300, 50);
        c3.style.outline = "1px solid black";
        var g3 = _addGroup(_jsPlumb, "three", c3, []);
        g2.addGroup(g3);

        equal(1, g2.getGroups().length, "g2 now has one child group");
        equal(g2.getDragArea(), g3.el.parentNode, "g3 has been set as a child of g2's drag area");

    });

    test("nested groups, access parent, collapseParent and proxyGroup properties", function() {

        var c1 = support.addDiv("container1", null, "container", 0, 50, 400, 400),
            c2 = support.addDiv("container2", null, "container", 300, 50, 400, 400),
            c3 = support.addDiv("container3", null, "container", 300, 50, 400, 400);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";
        c3.style.outline = "1px solid black";

        var c1_1 = support.addDiv("c1_1", c1, "w", 30, 30),
            c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);

        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1]);
        var g2 = _addGroup(_jsPlumb, "two", c2, [c2_1]);
        var g3 = _addGroup(_jsPlumb, "three", c3, []);

        g1.addGroup(g2);
        g2.addGroup(g3);

        equal(g2.group, g1, "group 2's parent is group one");
        equal(g3.group, g2, "group 3's parent is group two");

        equal(g2.proxyGroup, null, "g2 reports null as the group handling its proxies to start with");
        equal(g3.proxyGroup, null, "g3 reports null as the group handling its proxies to start with");

        // collapse g2.
        equal(g2.collapsed, false, "g2 is not collapsed");
        _jsPlumb.collapseGroup(g2);
        equal(g2.collapsed, true, "g2 is collapsed now");

        // g3's collapseParent should be g2
        equal(g3.collapseParent, g2, "g3's collapseParent is g2");

        // now collapse g1. g2 should report it as its collapseParent - and so should g3.
        _jsPlumb.collapseGroup(g1);
        equal(g2.collapseParent, g1, "g2's collapseParent is g1");
        equal(g3.collapseParent, g1, "g3's collapseParent is g1");

        // create a new group, g0.  collapse it. add g1 to it. g2 and g3 should report g0 as their collapse parent.
        var c0 = support.addDiv("container0", null, "container", 0, 50);
        var g0 = _addGroup(_jsPlumb, "zero", c0, []);
        _jsPlumb.collapseGroup(g0);

        g0.addGroup(g1);
        equal(g1.collapseParent.id, "zero", "g1's collapseParent is g0 after being added to g0");
        equal(g2.collapseParent.id, "zero", "g2's collapseParent is g0 after being added to g0");
        equal(g3.collapseParent.id, "zero", "g3's collapseParent is g0 after being added to g0");

        // expand g0. g1 should report no collapseParent. g2 and g3 should report g1.
        _jsPlumb.expandGroup(g0);
        equal(g1.collapseParent, null, "g1's collapseParent is null after g0 is expanded");
        equal(g2.collapseParent.id, "one", "g2's collapseParent is still g1 after g0 is expanded");
        equal(g3.collapseParent.id, "one", "g3's collapseParent is still g1 after g0 is expanded");

        // expand g1. g1 and g2 should report no collapse group. g3 should report g2.
        _jsPlumb.expandGroup(g1);
        equal(g1.collapseParent, null, "g1's collapseParent is null after g1 is expanded");
        equal(g2.collapseParent, null, "g2's collapseParent is null after g1 is expanded");
        equal(g3.collapseParent, g2, "g3's collapseParent is still g2 after g1 is expanded");

    });

    test("nested groups, add group to another group when it is already a child of a group", function() {
        // should remove from the current group and add to the new one
    });

    test("nested group collapse and expand, group added to parent group before collapse", function() {

        var g1 = _addGroupAndContainer(100,100),
            g2 = _addGroupAndContainer(400,400),
            g3 = _addGroupAndContainer(),
            n1_1 = _addNodeToGroup(g1),
            n2_1 = _addNodeToGroup(g2),
            n3_1 = _addNodeToGroup(g3),
            n4 = _addNode(500, 20, 50, 50);

        var c = _jsPlumb.connect({source:n3_1, target:n4}); // connect node in group 3 to node 4, which is standalone.
        equal(g3.connections.source.length, 1, "group 3 shows 1 source connection");

        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // collapse group 3, which is the parent of n3_1, and the source of the connection should now be g3's element, as it is proxied.
        _jsPlumb.collapseGroup(g3);
        equal(c.endpoints[0].element, g3.el, "source element is g3");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // ok now expand g3 and check its back to how it was
        _jsPlumb.expandGroup(g3);
        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // equal(g2.connections.source.length, 0, "no source connections for g2");
        // equal(g2.connections.source.length, 0, "no connections for g2");

        // add g3 as a child to g2
        g2.addGroup(g3);
        // manually resize group 2, this is just for me to look at, because g3 appears outside g2 even though its not.
        g2.el.style.width="700px";
        g2.el.style.height="700px";

        equal(g3.el._jsPlumbParentGroup.id, "101", "g2 marked as parent group on g3's element");

        // STATE 1: g3 is a child of g2. both g3 and g2 expanded. connection goes from n3 (child of g3) to n4 (not a group child)
        equal(1, g2.getGroups().length, "g2 now has one child group");
        equal(g2.getDragArea(), g3.el.parentNode, "g3 has been set as a child of g2's drag area");
        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // collapse g2, the edge source should now be g2's element
        _jsPlumb.collapseGroup(g2);
        equal(c.endpoints[0].element, g2.el, "source element is g2");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // so now we have group2 collapsed, with a connection showing to node 4. group 3 is a child of group2 and not visible. node 3, a child of group 3, is also not
        // visible.  if we collapse group 3 then nothing should happen to this arrangement:

        _jsPlumb.collapseGroup(g3);
        equal(c.endpoints[0].element, g2.el, "source element is g2");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // if we expand group 3 there should still be no change, because it's inside a collapsed group.
        _jsPlumb.expandGroup(g3);
        equal(c.endpoints[0].element, g2.el, "source element is g2");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // so now again we have group2 collapsed, with a connection showing to node 4. group 3 is a child of group2 and not visible. node 3, a child of group 3, is also not
        // visible.
        // expand group 2. should return to state 1.
        // STATE 1: g3 is a child of g2. both g3 and g2 expanded. connection goes from n3 (child of g3) to n4 (not a group child)
        _jsPlumb.expandGroup(g2);
        equal(1, g2.getGroups().length, "g2 now has one child group");
        equal(g2.getDragArea(), g3.el.parentNode, "g3 has been set as a child of g2's drag area");
        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

    });

    test("nested groups, collapse group that has a child group, each group has a node, and they are connected. On collapse, that connection should be hidden.", function() {
        // should remove from the current group and add to the new one

        var g1 = _addGroupAndContainer(100,100),
            g2 = _addGroupAndContainer(400,400),
            n1_1 = _addNodeToGroup(g1),
            n2_1 = _addNodeToGroup(g2);

        g2.addGroup(g1);
        g1.el.style.left = "100px";
        g1.el.style.top = "100px";
        _jsPlumb.revalidate(g1.el);

        var c = _jsPlumb.connect({source:n1_1, target:n2_1, connector:"StateMachine", anchor:"Continuous"}); // connect node in group 3 to node 4, which is standalone.
        equal(c.isVisible(), true, "connection initially visible");

        var c2 = _jsPlumb.connect({source:n2_1, target:n1_1, connector:"StateMachine", anchor:"Continuous"}); // connect node in group 3 to node 4, which is standalone.
        equal(c2.isVisible(), true, "connection 2 initially visible");

        _jsPlumb.collapseGroup(g2);

        equal(c.isVisible(), false, "connection is not visible after group collapse");
        equal(c2.isVisible(), false, "connection 2 is not visible after group collapse");

    });

    test("nested groups, dont try to add a group to itself.", function() {

    });

    test("nested groups, adding a group to some other group when it is already a child of a group automatically removes it from its current group", function() {

    });

    test("nested groups, one group can be dropped on another", function() {

    });

    test("nested groups, a group can be dragged out of its parent group", function() {

    });

    test("nested groups, a group that is a child of another group, when deleted, all its children become children of the group it was a child of.", function() {

    });

    test("nested groups, support allowNestedGroups flag on jsplumb constructor (defaults to true)", function() {
        var j = jsPlumb.newInstance({
            container:container,
            allowNestedGroups:false
        });

        var g1 = _addGroupAndContainer(100,100, j),
            g2 = _addGroupAndContainer(400,400, j);

        g2.addGroup(g1);

        equal(g2.getGroups().length, 0, "g2 has no child groups as nested groups are not allowed");

        j.destroy();
    });

    test("nested groups, one group can't be dropped on another if allowNestedGroups is false", function() {

    });

    test("nested groups, remove a group that has child groups, with deleteMembers true - should remove child groups too", function() {

    });

    test("nested groups, remove a group that has child groups, with deleteMembers false - should not remove child groups from the instance", function() {
        // also check that the 'parent group' flag has been removed.

    });

    test("nested groups, prune nested group", function() {
        // also check that the 'parent group' flag has been removed.

    });

};