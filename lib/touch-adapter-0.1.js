/*
	Wraps touch events and presents them as mouse events: you register for standard mouse events such as 
	click, mousedown, mouseup and mousemove, and the touch adapter will automatically register corresponding
	touch events for each of these.  'click' and 'dblclick' are achieved through setting a timer on touchstart and
	firing an event on touchend if the timer has not yet expired. The delay for this timer can be set on 
	the touchadapter's constructor (clickThreshold); the default is 150ms.

	TouchAdapter has no dependencies, but can integrate with supporting libraries such as jQuery. See docs.
*/
;(function() {

	var isTouchDevice = "ontouchstart" in document.documentElement,
		click = "click", dblclick = "dblclick", mousedown = "mousedown", mouseup = "mouseup", mousemove = "mousemove",
		touchstart = "touchstart", touchend = "touchend", touchmove = "touchmove", contextmenu = "contextmenu",
		downEvent = isTouchDevice ? touchstart : mousedown,
		upEvent = isTouchDevice ? touchend : mouseup,
		moveEvent = isTouchDevice ? touchmove : mousemove,
		touchMap = { "mousedown":touchstart, "mouseup":touchend, "mousemove":touchmove },
		ta_is_down = "__touchAdaptorIsDown", ta_click_timeout = "__touchAdaptorClickTimeout",
		ta_context_menu_timeout = "__touchAdaptorContextMenuTimeout",
		ta_down = "__touchAdapterDown", ta_up = "__touchAdapterUp", 
		ta_context_down = "__touchAdapterContextDown", ta_context_up = "__touchAdapterContextUp",
		_pageLocation = function(e) {
			if (e.pageX && e.pageY)
				return [e.pageX, e.pageY];
			else {
				var ts = _touches(e),
					t = _getTouch(ts, 0);
				// this is for iPad. may not fly for Android.
				// NOTE this is a browser event here. you
				// must first have passed the library event through the current event unwrap function.
				return [t.pageX, t.pageY];
			}        	
		},
		// 
		// extracts the touch with the given index from the list of touches
		//
		_getTouch = function(touches, idx) {
			return touches.item ? touches.item(idx) : touches[idx];
		},
		//
		// gets the touches from the given event, if they exist. NOTE this is a browser event here. you
		// must first have passed the library event through the current event unwrap function.
		//
		_touches = function(e) {	
			return e.touches || [];
		},
		_touchCount = function(e) {
			return _touches(e).length || 1;
		},
		//http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
		addEvent = function( obj, type, fn ) {
			if (obj.addEventListener)
				obj.addEventListener( type, fn, false );
			else if (obj.attachEvent)
			{
				obj["e"+type+fn] = fn;
				obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
				obj.attachEvent( "on"+type, obj[type+fn] );
			}
		},
		removeEvent = function( obj, type, fn ) {
			if (obj.removeEventListener)
				obj.removeEventListener( type, fn, false );
			else if (obj.detachEvent)
			{
				obj.detachEvent( "on"+type, obj[type+fn] );
				obj[type+fn] = null;
				obj["e"+type+fn] = null;
			}
		};	

	window.TouchAdapter = function(params) {
		params = params || {};
		var self = this, 
			guid = 1,
			_bind = params.bind || addEvent,		
			_unbind = params.unbind || removeEvent,
			_unwrap = params.unwrap || function(e) { return e; },
			wrapClick = params.wrapClick !== false,
			clickThreshold = params.clickThreshold || 150,
			wrapDblClick = params.wrapDblClick !== false,
			doubleClickThreshold = params.doubleClickThreshold || 250,
			wrapContextMenu = params.wrapContextMenu !== false,
			//wrapDown = params.wrapDown !== false,
			//wrapUp = params.wrapUp !== false,
			//wrapMove = params.wrapMove !== false,
			_smartClicks = params.smartClicks,			
			_smartClickDown = function(e, obj) {
				console.log("smart click down");				
				obj.__tad = _pageLocation(_unwrap(e));
				return true;
			},
			_smartClickUp = function(e, obj) {
				console.log("smart click up");
				obj.__tau = _pageLocation(_unwrap(e));
				return true;
			},
			_smartClickClick = function(e, obj) {
				if (obj.__tad && obj.__tau) {
					return obj.__tad[0] == obj.__tau[0] && obj.__tad[1] == obj.__tau[1];
				}
				return true;
			},
			_smartClickHandlers = {
				"mousedown":_smartClickDown,
				"mouseup":_smartClickUp,
				"touchstart":_smartClickDown,
				"touchend":_smartClickUp,
				"click":_smartClickClick
			},
			_store = function(obj, event, fn) {
				var g = guid++;
				obj.__ta = obj.__ta || {};
				obj.__ta[event] = obj.__ta[event] || {};
				// store each handler with a unique guid.
				obj.__ta[event][g] = fn;
				// set the guid on the handler.
				fn.__tauid = g;
				return g;
			},
			_unstore = function(obj, event, fn) {
				delete obj.__ta[event][fn.__tauid];
			},
			// wrap bind function to provide "smart" click functionality, which prevents click events if
			// the mouse has moved between up and down.
			__bind = function(obj, evt, fn) {
				var _fn = fn;
				if (_smartClicks) {					
					fn = function(e) {																
						var cont = true;
						if (_smartClickHandlers[evt])
							cont = _smartClickHandlers[evt](e, obj);

						if (cont) _fn.apply(this, arguments);
					};
				}
				
				
				_store(obj, evt, fn);
				_bind(obj, evt, fn);
				_fn.__tauid = fn.__tauid;				
			},
			_addClickWrapper = function(obj, fn, touchCount, downId, upId, supportDoubleClick) {
				var handler = {
					down:false,
					touches:0,
					originalEvent:null,
					lastClick:null,
					timeout:null
				};
				var down = function(e) {						
					var ee = _unwrap(e), self = this, tc = _touchCount(ee);					
					if (tc == touchCount) {				
						handler.originalEvent = ee;	
						handler.touches = tc;										
						handler.down = true;							
						handler.timeout = window.setTimeout(function() {														
							handler.down = null;
						}, clickThreshold);
					}
				};
				fn[downId] = down;
				__bind(obj, touchstart, down);	
				fn.__tauid = down.__tauid;
				var up = function(e) {										
					var ee =  _unwrap(e);					
					if (handler.down) {
						// if supporting double click, check if their is a timestamp for a recent click
						if (supportDoubleClick) {
							var t = new Date().getTime();
							if (handler.lastClick) {							
								if (t - handler.lastClick < doubleClickThreshold)
									fn(handler.originalEvent);
							}

							handler.lastClick = t;
						}					
						else 	
							fn(handler.originalEvent);						
					}
					handler.down = null;
					window.clearTimeout(handler.timeout);						
				};				
				fn[upId] = up;	
				fn.__tauid = up.__tauid;
				__bind(obj, touchend, up);
			};

		
		/**
		* @name TouchAdapter#bind
		* @function
		* @desc Bind an event listener.
		* @param {Element} obj Element to bind event listener to.
		* @param {String} evt Event id. Will be automatically converted from mousedown etc to their touch equivalents if this is a touch device.
		* @param {Function} fn Function to bind.
		* @returns {TouchAdapter} The touch adapter; you can chain this method.
		*/
		this.bind = function(obj, evt, fn) {
			if (isTouchDevice) {			
				if (evt === click && wrapClick) {
					_addClickWrapper(obj, fn, 1, ta_down, ta_up);
				}
				else if (evt === dblclick && wrapDblClick) {
					_addClickWrapper(obj, fn, 1, ta_down, ta_up, true);
				}
				else if (evt === contextmenu && wrapContextMenu) {
					_addClickWrapper(obj, fn, 2, ta_context_down, ta_context_up);
				}
				else {
					__bind(obj, touchMap[evt], fn);
				}
			}
			else 
				__bind(obj, evt, fn);

			return self;
		};

		/**
		* @name TouchAdapter#unbind
		* @function
		* @desc Unbind an event listener.
		* @param {Element} obj Element to unbind event listener from.
		* @param {String} evt Event id. Will be automatically converted from mousedown etc to their touch equivalents if this is a touch device.
		* @param {Function} fn Function to unbind.
		* @returns {TouchAdapter} The touch adapter; you can chain this method.
		*/
		this.unbind = function(obj, evt, fn) {
			if (isTouchDevice) {
				if (evt === click && wrapClick) {					
					_unbind(obj, touchstart, fn[ta_down]);
					fn[ta_down] = null;
					_unbind(obj, touchend, fn[ta_up]);
					fn[ta_up] = null;
				}
				else if (evt === contextmenu && wrapContextMenu) {
					_unbind(obj, touchstart, fn[ta_context_down]);
					fn[ta_context_down] = null;
					_unbind(obj, touchend, fn[ta_context_up]);
					fn[ta_context_up] = null;
				}
				else
					_unbind(obj, touchMap[evt], fn);
			}
			
			_unstore(obj, evt, fn);
			_unbind(obj, evt, fn);

			return self;
		};

		/**
		* @name TouchAdapter#remove
		* @function
		* @desc Removes an element from the DOM, and unregisters all event handlers for it. You should use this
		* to ensure you don't leak memory.
		* @param {String|Element} el Element, or id of the element, to remove.
		*/
		this.remove = function(el) {			
			el = typeof el == "string" ? document.getElementById(el) : el;
			if (el.__ta) {
				for (var evt in el.__ta) {
					for (var h in el.__ta[evt]) {
						_unbind(el, evt, el.__ta[evt][h]);
					}
				}
			}			
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		};

		this.unbindAll = function() {
			alert("unbind alL!");
		};
	};

})();
