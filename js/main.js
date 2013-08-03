/*! amuz.me 04-08-2013 01:08:02 */
"use strict";

function PlayerController(a, b, c, d, e) {
    amuzPlayer.on("ready", function() {
        amuzPlayer.load(d, function(a, b) {
            a || (amuzPlayer.properties.name = b.name, b.playlist.map(function(a) {
                amuzPlayer.addItem(new YoutubeVideo(a));
            }));
        }), this.volume(100);
    }), a.playlistProperties = amuzPlayer.properties;
    var f = function() {
        a.playlist = amuzPlayer.playlist, a.items = amuzPlayer.items, e(a);
    };
    amuzPlayer.on("addedItem", f), amuzPlayer.on("removedItem", f), amuzPlayer.on("movedItem", f);
    var g = {};
    a.currentEditing = function(a) {
        return a in g;
    }, a.showEditForm = function(a) {
        g[a] = 1;
    }, a.hideEditForm = function(a) {
        delete g[a];
    }, a.delete = function(a) {
        amuzPlayer.removeItem(amuzPlayer.playlistIndex(a));
    };
    var h;
    amuzPlayer.on("play", function() {
        a.currentPlaying = amuzPlayer.playlist[amuzPlayer.current], a.playing = !0, h = setInterval(function() {
            e(a);
        }, 1e3);
    }), amuzPlayer.on("pause", function() {
        a.playing = !1, clearInterval(h);
    }), amuzPlayer.on("stop", function() {
        a.playing = !1, clearInterval(h);
    }), a.control = function() {
        a.playing ? amuzPlayer.pause() : amuzPlayer.play();
    }, a.play = function(b) {
        b === a.currentPlaying && amuzPlayer.stop(), amuzPlayer.selectItem(amuzPlayer.playlistIndex(b)), 
        amuzPlayer.play();
    }, a.next = function() {
        amuzPlayer.next();
    }, a.prev = function() {
        amuzPlayer.previous();
    };
    var i = !1;
    a.enablePositionSlider = function(b) {
        i = !0, c(function() {
            i === !1 && a.setPosition(b, !0);
        }, 100);
    }, a.disablePositionSlider = function() {
        i = !1;
    }, a.setPosition = function(b, c) {
        if (i || c) {
            var d = b.offsetX || b.originalEvent.layerX, e = 256, f = amuzPlayer.items[a.currentPlaying].duration * d / e;
            amuzPlayer.position(f);
        }
    }, a.repeat = "repeat", amuzPlayer.on("toggledRepeat", function(b) {
        var c = {
            "repeat all": "repeat",
            "repeat random": "random",
            "repeat one": "repeat-one"
        };
        a.repeat = c[b];
    }), a.toggleRepeat = function() {
        amuzPlayer.toggleRepeat();
    }, amuzPlayer.on("changedVolume", function(b) {
        var c = b * Math.PI / 200;
        a.volumeThumb = {
            top: Math.sin(c),
            right: Math.cos(c)
        }, a.volume = b, e(a);
    });
    var j = !1;
    a.enableVolumeSlider = function(b) {
        j = !0, c(function() {
            j === !1 && a.setVolume(b, !0);
        }, 100);
    }, a.disableVolumeSlider = function() {
        j = !1;
    }, a.setVolume = function(a, b) {
        if (j || b) {
            var c = a.offsetX || a.originalEvent.layerX, d = a.offsetY || a.originalEvent.layerY, e = 80, f = 80, g = (e - c) / e, h = d / f, i = g / Math.sqrt(g * g + h * h), k = Math.acos(i), l = 200 * k / Math.PI;
            l > 85 && (l = 100), 15 > l && (l = 0), amuzPlayer.volume(l);
        }
    }, a.i18n = function(a) {
        return a;
    }, a.columnWidth = function() {
        var a = (window.innerWidth - 288 - 64 - 24) / 2;
        return 262 >= a ? "auto" : a + "px";
    }, a.uiWidth = function() {
        var a = window.innerWidth - 24;
        return a + "px";
    }, angular.element(window).bind("resize", function() {
        e(a);
    }), a.mobileDetected = /iPhone|iPod|iPad|Android|BlackBerry/.test(navigator.userAgent), 
    a.mobileRoutineCompleted = !1, amuzPlayer.on("firstTime", function() {
        a.mobileRoutineCompleted = !0, e(a);
    });
    var k = {
        usd: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8LCFDRSMH3URJ",
        eur: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ETMN6W6DYQU4L"
    };
    a.paypal = /en-US/.test(navigator.language || navigator.userLanguage) ? k.usd : k.eur, 
    a.escape = encodeURIComponent, a.save = function() {
        amuzPlayer.save(d, function(a, b) {
            console.log(a, b);
        });
    };
}

function SearchController(a, b) {
    var c = function(c) {
        var d = function() {
            a.message = "No " + (c ? "more " : "") + "items found", a.moreVisibility = !1, a.results = [];
        };
        b.jsonp("http://gdata.youtube.com/feeds/api/videos?q=" + escape(a.query || "") + "&v=2&alt=json" + (a.category ? "&category=" + a.category : "") + "&max-results=" + a.maxResults + "&start-index=" + ((a.currentPage - 1) * a.maxResults + 1) + "&callback=JSON_CALLBACK").success(function(b) {
            return b && b.feed && b.feed.entry ? (a.message = "", a.moreVisibility = !0, c || (a.results = []), 
            a.results = a.results.concat(b.feed.entry.map(function(a) {
                return {
                    id: a.media$group.yt$videoid.$t,
                    title: $.trim(a.title.$t.replace(/^\s+|\s+$/g, "")),
                    duration: a.media$group.yt$duration.seconds
                };
            })), void 0) : d();
        }).error(d);
    };
    a.moreVisibility = !1, a.maxResults = 50, a.submit = function() {
        a.currentPage = 1, c();
    }, a.more = function() {
        a.currentPage++, c(!0);
    }, a.add = function(b, c) {
        amuzPlayer.addItem(new YoutubeVideo(c)), a.results.splice(b, 1);
    }, a.mobileDetected = /iPhone|iPod|iPad|Android|BlackBerry/.test(navigator.userAgent), 
    a.mobileDetected || (a.youtubeAutoComplete = {
        options: {
            focusOpen: !0,
            outHeight: 100,
            appendTo: "#autocomplete",
            source: function(a, c) {
                a.term.length < 3 || b.jsonp("http://suggestqueries.google.com/complete/search?q=" + escape(a.term) + "&client=youtube" + "&limit=10" + "&hl=en" + "&ds=yt" + "&callback=JSON_CALLBACK").success(function(a) {
                    var b = [];
                    for (var d in a[1]) b.push(a[1][d][0]);
                    c(b);
                });
            }
        }
    });
}

Array.prototype.map || (Array.prototype.map = function(a, b) {
    var c, d, e;
    if (null == this) throw new TypeError(" this is null or not defined");
    var f = Object(this), g = f.length >>> 0;
    if ("function" != typeof a) throw new TypeError(a + " is not a function");
    for (b && (c = b), d = new Array(g), e = 0; g > e; ) {
        var h, i;
        e in f && (h = f[e], i = a.call(c, h, e, f), d[e] = i), e++;
    }
    return d;
}), "object" != typeof JSON && (JSON = {}), function() {
    function f(a) {
        return 10 > a ? "0" + a : a;
    }
    function quote(a) {
        return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
            var b = meta[a];
            return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + a + '"';
    }
    function str(a, b) {
        var c, d, e, f, g, h = gap, i = b[a];
        switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), 
        "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
          case "string":
            return quote(i);

          case "number":
            return isFinite(i) ? String(i) : "null";

          case "boolean":
          case "null":
            return String(i);

          case "object":
            if (!i) return "null";
            if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
                return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", 
                gap = h, e;
            }
            if (rep && "object" == typeof rep) for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], 
            e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e)); else for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), 
            e && g.push(quote(d) + (gap ? ": " : ":") + e));
            return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", 
            gap = h, e;
        }
    }
    "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf();
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, rep;
    "function" != typeof JSON.stringify && (JSON.stringify = function(a, b, c) {
        var d;
        if (gap = "", indent = "", "number" == typeof c) for (d = 0; c > d; d += 1) indent += " "; else "string" == typeof c && (indent = c);
        if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
        return str("", {
            "": a
        });
    }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
        function walk(a, b) {
            var c, d, e = a[b];
            if (e && "object" == typeof e) for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), 
            void 0 !== d ? e[c] = d : delete e[c]);
            return reviver.call(a, b, e);
        }
        var j;
        if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), 
        "function" == typeof reviver ? walk({
            "": j
        }, "") : j;
        throw new SyntaxError("JSON.parse");
    });
}(), "function" != typeof Object.create && (Object.create = function(a) {
    function b() {}
    return b.prototype = a, new b();
}), angular.module("ui.autocomplete", []).directive("uiAutocomplete", [ "$timeout", "$exceptionHandler", function(a, b) {
    function c(a, b) {
        var c = new RegExp($.ui.autocomplete.escapeRegex(b), "i");
        return $.grep(a, function(a) {
            return c.test($("<div>").html(a.label || a.value || a).text());
        });
    }
    var d = $.ui.autocomplete.prototype, e = d._initSource;
    return $.extend(d, {
        _initSource: function() {
            this.options.html && $.isArray(this.options.source) ? this.source = function(a, b) {
                b(c(this.options.source, a.term));
            } : e.call(this);
        },
        _normalize: function(a) {
            return $.map(a, function(a) {
                return a && "object" == typeof a ? $.extend({
                    label: a.label || a.value,
                    value: a.value || a.label
                }, a) : {
                    label: a + "",
                    value: a
                };
            });
        },
        _renderItem: function(a, b) {
            var c = b.groupLabel || b.label;
            return b.groupLabel ? c = $("<div>").append(c).addClass("ui-menu-group") : this.options.html ? ("object" == typeof c && (c = $(c)), 
            ("object" != typeof c || c.length > 1 || !c.is("a")) && (c = $("<a>").append(c))) : c = $("<a>").text(c), 
            $("<li>").append(c).appendTo(a);
        },
        _resizeMenu: function() {
            var a = this;
            setTimeout(function() {
                var b = a.menu.element, c = b.css("max-height") || 0, d = Math.max(b.width("").outerWidth() + 1, a.element.outerWidth()), e = (a.element.height(), 
                $(window).height() - a.options.outHeight - b.offset().top);
                e = c && e > c ? c : e, b.css({
                    width: d,
                    maxHeight: e
                });
            }, 10);
        }
    }), {
        require: "ngModel",
        link: function(d, e, f, g) {
            function h(a) {
                r(p) && (g.$viewValue || 0 === g.$viewValue ? a && a.item && (a.item.label = r(a.item.label) ? $("<div>").append(a.item.label).html() : a.item.label, 
                s(p, a.item)) : l(p), q(g.$viewChangeListeners, function(a) {
                    try {
                        a();
                    } catch (c) {
                        b(c);
                    }
                }));
            }
            function i() {
                g.$setViewValue(""), g.$render(), h();
            }
            function j() {
                t.options.focusOpen && !m && e.autocomplete("search", "");
            }
            function k(a) {
                return a = r(a) ? a : {}, a.disabled = a.source ? a.disabled : !0, a.appendTo = a.appendTo || e.parents(".ng-view")[0] || e.parents("[ng-view]")[0] || null, 
                a.minLength = a.focusOpen ? 0 : a.minLength, a.outHeight = a.outHeight || 0, a.position = a.position || {
                    my: "left top",
                    at: "left bottom",
                    collision: "flipfit"
                }, a;
            }
            function l(a) {
                if (r(a)) {
                    var b = /^\$/;
                    q(a, function(c, d) {
                        var e = typeof c;
                        b.test(d) || ("number" === e ? a[d] = 0 : "string" === e ? a[d] = "" : "boolean" === e ? a[d] = !1 : r(c) && l(c));
                    });
                }
            }
            var m = !1, n = null, o = {}, p = null, q = angular.forEach, r = angular.isObject, s = angular.extend, t = d.$eval(f.uiAutocomplete), u = e.val.bind(e), v = [ "close", "destroy", "disable", "enable", "option", "search", "widget" ], w = [ "change", "close", "create", "focus", "open", "response", "search", "select" ], x = d.$watch(f.ngModel, function(a) {
                p = a, r(p) && (g.$formatters.push(function(a) {
                    return a.value;
                }), g.$parsers.push(function(a) {
                    return p.value = a, p;
                }), d.$watch(f.ngModel, function(a) {
                    u() !== a.value && (g.$viewValue = a.value, g.$render());
                }, !0), g.$setViewValue(p.value)), a && x();
            }), y = {
                open: function() {
                    m = !0, n = null;
                },
                close: function() {
                    m = !1;
                },
                select: function(b, c) {
                    n = c, a(function() {
                        e.blur();
                    }, 0);
                },
                change: function() {
                    var a = u();
                    a = n && n.item ? n.item.value : t.options.onlySelect ? "" : a, null === a ? g.$render() : "" === g.$viewValue ? d.$apply(function() {
                        h();
                    }) : g.$viewValue !== a && d.$apply(function() {
                        g.$setViewValue(a), g.$render(), h(n);
                    });
                }
            };
            r(t) && (t.methods = {}, t.options = k(t.options), q(w, function(a) {
                var b = t.options[a];
                b = "function" == typeof b ? b : angular.noop, o[a] = function(c, d) {
                    y[a] && y[a](c, d), b(c, d), t.events && "function" == typeof t.events[a] && t.events[a](c, d);
                };
            }), q(v, function(a) {
                t.methods[a] = function() {
                    var b = [ a ];
                    return q(arguments, function(a) {
                        b.push(a);
                    }), e.autocomplete.apply(e, b);
                };
            }), t.methods.filter = c, t.methods.clean = i, e.on("focus", j), e.autocomplete(s({}, t.options, o)), 
            t.widget = e.autocomplete("widget"));
        }
    };
} ]), angular.module("ui.sortable", []).value("uiSortableConfig", {}).directive("uiSortable", [ "uiSortableConfig", function(a) {
    return {
        require: "?ngModel",
        link: function(b, c, d, e) {
            function f(a, b) {
                return b && "function" == typeof b ? function(c, d) {
                    a(c, d), b(c, d);
                } : a;
            }
            var g = {}, h = {
                receive: null,
                remove: null,
                start: null,
                stop: null,
                update: null
            };
            angular.extend(g, a), e && (e.$render = function() {
                c.sortable("refresh");
            }, h.start = function(a, b) {
                b.item.sortable = {
                    index: b.item.index()
                };
            }, h.update = function(a, b) {
                b.item.sortable.resort = e;
            }, h.receive = function(a, b) {
                b.item.sortable.relocate = !0, e.$modelValue.splice(b.item.index(), 0, b.item.sortable.moved);
            }, h.remove = function(a, b) {
                b.item.sortable.moved = 1 === e.$modelValue.length ? e.$modelValue.splice(0, 1)[0] : e.$modelValue.splice(b.item.sortable.index, 1)[0];
            }, h.stop = function(a, c) {
                if (c.item.sortable.resort && !c.item.sortable.relocate) {
                    var d, e;
                    e = c.item.sortable.index, d = c.item.index(), c.item.sortable.resort.$modelValue.splice(d, 0, c.item.sortable.resort.$modelValue.splice(e, 1)[0]);
                }
                (c.item.sortable.resort || c.item.sortable.relocate) && b.$apply();
            }), b.$watch(d.uiSortable, function(a) {
                angular.forEach(a, function(a, b) {
                    h[b] && (a = f(h[b], a)), c.sortable("option", b, a);
                });
            }, !0), angular.forEach(h, function(a, b) {
                g[b] = f(a, g[b]);
            }), c.sortable(g);
        }
    };
} ]);

var Utility = {
    is: function(a, b) {
        return Object.prototype.toString.call(b) == "[object " + a + "]";
    }
}, Player = function() {
    var a = function(a) {
        a = a || {}, this.repeat = a.repeat || "repeat all", this.items = a.playlist || {}, 
        this.nextId = 0, this.playlist = [];
        for (var b in this.items) this.playlist.push(b), b >= this.nextId && (this.nextId = b + 1);
        this.current = a.current || 0, this.history = [], this.historyLength = a.historyLength || 10, 
        this.eventNames = {
            ready: 1,
            toggledRepeat: 1,
            addedItem: 1,
            removedItem: 1,
            movedItem: 1,
            play: 1,
            pause: 1,
            stop: 1
        }, this.events = {}, this.on("ready").call(this);
    };
    return a.prototype.currentItem = function(a, b) {
        if (void 0 !== this.playlist[this.current]) {
            var c = this.items[this.playlist[this.current]];
            return a ? c[a].apply(c, b) : c;
        }
    }, a.prototype.play = function() {
        return this.history.push(this.playlist[this.current]), this.history.length > this.historyLength && this.history.shift(), 
        this.currentItem.call(this, "play"), this.on("play").call(this), this.current;
    }, a.prototype.pause = function() {
        this.on("pause").call(this), this.currentItem.call(this, "pause", arguments);
    }, a.prototype.stop = function() {
        this.on("stop").call(this), this.currentItem.call(this, "stop", arguments);
    }, a.prototype.position = function() {
        this.currentItem.call(this, "position", arguments);
    }, a.prototype.duration = function() {
        this.currentItem.call(this, "duration", arguments);
    }, a.prototype.next = function() {
        if ("repeat random" === this.repeat) {
            var a = Math.floor(Math.random() * this.playlist.length);
            return a = (this.current + a) % this.playlist.length, a === this.current && this.position(0), 
            this.play(this.current = a);
        }
        return "repeat one" === this.repeat ? (this.position(0), this.play(this.current)) : this.current === this.playlist.length - 1 ? (0 === this.current && this.stop(), 
        this.play(this.current = 0)) : this.play(++this.current);
    }, a.prototype.previous = function() {
        if (this.history.length > 1) {
            this.history.pop();
            var a = this.playlist.indexOf(this.history.pop());
            if (-1 !== a) return this.current === a && this.stop(), this.play(this.current = a);
        }
        return 0 === this.current ? (1 === this.playlist.length && this.stop(), this.play(this.current = this.playlist.length - 1)) : this.play(--this.current);
    }, a.prototype.playlistIndex = function(a) {
        for (var b in this.playlist) if (this.playlist[b] === a) return b;
        return !1;
    }, a.prototype.addItem = function(a) {
        a.on("end", this.next), this.items[this.nextId] = a, this.playlist.push(this.nextId), 
        this.on("addedItem").call(this, a, this.nextId++, this.playlist.length - 1);
    }, a.prototype.removeItem = function(a) {
        var b = this.playlist.splice(a, 1);
        b && delete this.items[this.playlistIndex], this.on("removedItem").call(this, b);
    }, a.prototype.selectItem = function(a) {
        a >= 0 && a < this.playlist.length && (this.current = a);
    }, a.prototype.moveItem = function(a, b) {
        this.playlist.splice(b, 0, this.playlist.splice(a, 1)[0]), this.on("movedItem").call(this, a, b);
    }, a.prototype.toggleRepeat = function() {
        var a = [ "repeat all", "repeat one", "repeat random" ], b = a.indexOf(this.repeat);
        return -1 === b ? (this.repeat = a[0], this.on("toggledRepeat").call(this, this.repeat), 
        this.repeat) : b === a.length - 1 ? (this.repeat = a[0], this.on("toggledRepeat").call(this, this.repeat), 
        this.repeat) : (this.repeat = a[++b], this.on("toggledRepeat").call(this, this.repeat), 
        this.repeat);
    }, a.prototype.on = function(a, b) {
        if (!(!a in this.eventNames)) {
            var c = this.events[a];
            return b ? (this.events[a] = b, void 0) : c ? c : function() {};
        }
    }, a;
}(), AmuzPlayer = function(a) {
    var b = function(b) {
        c.call(this, b.container, [ 200, 200 ]), a.call(this, b), this.events.changedVolume = 1, 
        this.events.firstTime = 1, this.properties = {
            name: "New Playlist",
            id: !1,
            readOnly: !1
        };
    };
    b.prototype = Object.create(a.prototype), b.prototype.constructor = b;
    var c = function(a, b) {
        var c = this, d = document.createElement("script");
        d.src = "https://www.youtube.com/iframe_api";
        var e = document.getElementsByTagName("script")[0];
        e.parentNode.insertBefore(d, e);
        var f = function() {
            c.on("ready").apply(c, arguments);
        };
        this.firstTime = !0;
        var g = 0, h = function(a) {
            switch (a.data) {
              case YT.PlayerState.ENDED:
                if (c.firstTime) return c.firstTime = !1;
                c.currentItem().on("end").apply(c, arguments);
                break;

              case YT.PlayerState.PLAYING:
                c.firstTime && (c.on("firstTime").call(c), g++, g > 1 && (c.firstTime = !1)), c.currentItem().on("play").apply(c, arguments);
                break;

              case YT.PlayerState.PAUSED:
                c.currentItem().on("pause").apply(c, arguments);
                break;

              case YT.PlayerState.BUFFERING:
                break;

              case YT.PlayerState.CUED:            }
        };
        window.onYouTubeIframeAPIReady = function() {
            var d = 0;
            c.player = new YT.Player(a, {
                width: b[0],
                height: b[1],
                videoId: "jhFDyDgMVUI",
                playerVars: {
                    enablejsapi: 1,
                    controls: d,
                    showinfo: 0,
                    autohide: 1,
                    rel: 0,
                    iv_load_policy: 3,
                    origin: window.location.protocol + "//" + window.location.host
                },
                events: {
                    onReady: f,
                    onStateChange: h
                }
            });
        };
    };
    return b.prototype.play = function() {
        this.firstTime = !1, a.prototype.play.call(this);
    }, b.prototype.addItem = function(b) {
        this.player && (b.player = this.player, a.prototype.addItem.call(this, b));
    }, b.prototype.volume = function(a) {
        return void 0 !== a && (this.player.unMute(), this.player.setVolume(a), this.on("changedVolume").call(this, a)), 
        this.player.isMuted() ? 0 : this.player.getVolume();
    }, b.prototype.playlistJSON = function() {
        var a = this;
        return this.playlist.map(function(b) {
            var c = a.items[b];
            return {
                id: c.id,
                startSeconds: c.startSeconds,
                endSeconds: c.endSeconds,
                title: c.title
            };
        });
    }, b.prototype.save = function(a, b) {
        var c, d = this, e = {
            name: this.properties.name,
            playlist: this.playlistJSON()
        };
        if (this.properties.id && !this.properties.readOnly) c = this.properties.id; else {
            var f = this.properties.name.replace(/[^a-z0-9]/gi, "");
            c = f + "_" + +new Date() + Math.random().toString(36).substr(2, 9);
        }
        var g = {
            params: {}
        };
        g.params[c] = e, a.jsonp("http://api.openkeyval.org/store/?callback=JSON_CALLBACK", g).success(function(a) {
            d.properties.id = c;
            var e = {
                edit: "#/" + encodeURIComponent(d.properties.name) + "/" + c,
                readOnly: "#/" + encodeURIComponent(d.properties.name) + "/" + a.keys[c]
            };
            location.hash = e.edit, b(null, e);
        }).error(function() {
            b(!0);
        });
    }, b.prototype.load = function(a, b) {
        var c = this, d = location.hash.split("/");
        if (3 === d.length) {
            decodeURIComponent(d[1]);
            var e = d[2];
            a.jsonp("http://api.openkeyval.org/" + encodeURIComponent(e) + "&callback=JSON_CALLBACK").success(function(a) {
                return a ? (c.properties.name = a.name, c.properties.id = e, location.hash = "#/" + encodeURIComponent(c.properties.name) + "/" + e, 
                /^rok-/.test(e) && (c.properties.readOnly = !0), b(null, a), void 0) : b(!0);
            }).error(function() {
                b(!0);
            });
        }
    }, b;
}(Player), Playable = function() {
    var a = function(a) {
        a = a || {}, this.title = a.title || "Unnamed", this.metadata = a.metadata || {}, 
        this.eventNames = {
            end: 1,
            play: 1,
            pause: 1
        }, this.events = {};
    }, b = [ "play", "stop", "pause", "position", "duration" ];
    for (var c in b) a.prototype[b[c]] = function() {};
    return a.prototype.on = function(a, b) {
        if (!(!a in this.eventNames)) {
            var c = this.events[a];
            return b ? (this.events[a] = b, void 0) : c ? c : function() {};
        }
    }, a;
}(), YoutubeVideo = function(a) {
    var b = function(b) {
        a.call(this, b), this.player = b.player || {}, this.id = b.id, this.title = b.title || "Song #" + this.id, 
        this.startSeconds = b.startSeconds || 0, this.endSeconds = b.endSeconds || b.duration || 0, 
        this.duration = b.duration || this.endSeconds - this.startSeconds || 0;
    };
    return b.prototype = Object.create(a.prototype), b.prototype.constructor = b, b.prototype.isPlaying = function() {
        var a = this.player.getVideoUrl() || "", b = a.match(/v=([^&]+)/);
        return !(!b || b[1] !== this.id);
    }, b.prototype.play = function() {
        this.isPlaying() || this.player.loadVideoById({
            videoId: this.id,
            startSeconds: this.startSeconds,
            endSeconds: this.endSeconds
        }), this.player.playVideo();
    }, b.prototype.stop = function() {
        this.pause(), this.position(0);
    }, b.prototype.pause = function() {
        this.player.pauseVideo();
    }, b.prototype.position = function(a) {
        return void 0 !== a && this.player.seekTo(a), this.player.getCurrentTime();
    }, b;
}(Playable), amuzPlayer = new AmuzPlayer({
    container: document.getElementById("youtubePlayer")
});

amuzPlayer.on("ready", function() {
    this.addItem(new YoutubeVideo({
        title: "Hanuman",
        duration: 243,
        id: "ENBX_v1Po1Y"
    })), this.addItem(new YoutubeVideo({
        title: "Floreio Art",
        duration: 155,
        id: "mwF1mUa8c5E"
    })), this.addItem(new YoutubeVideo({
        title: "H-arlem Shake",
        duration: 29,
        id: "rU1OpD2r0Is"
    })), this.addItem(new YoutubeVideo({
        title: "La bruja",
        duration: 117,
        id: "tUHTx-9xC8c"
    })), this.addItem(new YoutubeVideo({
        title: "The most amazing pitch ever",
        duration: 243,
        id: "caAz3FJs44w"
    })), this.addItem(new YoutubeVideo({
        title: "Hanuman",
        duration: 243,
        id: "ENBX_v1Po1Y"
    })), this.addItem(new YoutubeVideo({
        title: "Floreio Art",
        duration: 155,
        id: "mwF1mUa8c5E"
    })), this.addItem(new YoutubeVideo({
        title: "H-arlem Shake",
        duration: 29,
        id: "rU1OpD2r0Is"
    })), this.addItem(new YoutubeVideo({
        title: "La bruja",
        duration: 117,
        id: "tUHTx-9xC8c"
    })), this.addItem(new YoutubeVideo({
        title: "The most amazing pitch ever",
        duration: 243,
        id: "caAz3FJs44w"
    })), this.addItem(new YoutubeVideo({
        title: "Hanuman",
        duration: 243,
        id: "ENBX_v1Po1Y"
    })), this.addItem(new YoutubeVideo({
        title: "Floreio Art",
        duration: 155,
        id: "mwF1mUa8c5E"
    })), this.addItem(new YoutubeVideo({
        title: "H-arlem Shake",
        duration: 29,
        id: "rU1OpD2r0Is"
    })), this.addItem(new YoutubeVideo({
        title: "La bruja",
        duration: 117,
        id: "tUHTx-9xC8c"
    })), this.addItem(new YoutubeVideo({
        title: "The most amazing pitch ever",
        duration: 243,
        id: "caAz3FJs44w"
    })), this.addItem(new YoutubeVideo({
        title: "Hanuman",
        duration: 243,
        id: "ENBX_v1Po1Y"
    })), this.addItem(new YoutubeVideo({
        title: "Floreio Art",
        duration: 155,
        id: "mwF1mUa8c5E"
    })), this.addItem(new YoutubeVideo({
        title: "H-arlem Shake",
        duration: 29,
        id: "rU1OpD2r0Is"
    })), this.addItem(new YoutubeVideo({
        title: "La bruja",
        duration: 117,
        id: "tUHTx-9xC8c"
    })), this.addItem(new YoutubeVideo({
        title: "The most amazing pitch ever",
        duration: 243,
        id: "caAz3FJs44w"
    })), this.addItem(new YoutubeVideo({
        title: "Hanuman",
        duration: 243,
        id: "ENBX_v1Po1Y"
    })), this.addItem(new YoutubeVideo({
        title: "Floreio Art",
        duration: 155,
        id: "mwF1mUa8c5E"
    })), this.addItem(new YoutubeVideo({
        title: "H-arlem Shake",
        duration: 29,
        id: "rU1OpD2r0Is"
    })), this.addItem(new YoutubeVideo({
        title: "La bruja",
        duration: 117,
        id: "tUHTx-9xC8c"
    })), this.addItem(new YoutubeVideo({
        title: "The most amazing pitch ever",
        duration: 243,
        id: "caAz3FJs44w"
    }));
    for (var a = 0; 20 > a; a++) this.removeItem(0);
    this.volume(100);
}), angular.module("amuz", [ "youtubeTimeFormatter", "ui.sortable", "ui.autocomplete" ]).factory("safeApply", [ function() {
    return function(a, b) {
        var c = a.$root.$$phase;
        "$apply" == c || "$digest" == c ? b && a.$eval(b) : b ? a.$apply(b) : a.$apply();
    };
} ]), angular.module("youtubeTimeFormatter", []).filter("youtubeTime", function() {
    return function(a) {
        return [ (a >> 0) / 60 >> 0, (a >> 0) % 60 ].map(function(a) {
            return (10 > a ? "0" : "") + a;
        }).join(":");
    };
}), PlayerController.$inject = [ "$scope", "$window", "$timeout", "$http", "safeApply" ], 
SearchController.$inject = [ "$scope", "$http" ];