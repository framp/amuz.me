if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}
/*
var utility = {
  is: function(type, object){
    return Object.prototype.toString.call(object) == '[object ' + type + ']';
  },
  clone: function(object){
    if (!object) {
      return;
    }
    var result;
    if (utility.is('Object', object)) {
      result = {};
    }else if (utility.is('Array', object)) {
      result = [];
    }else{
      return object;
    }
    
    for(var key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      var isObjectOrArray = object[key] &&
                            (utility.is('Object', object[key]) || 
                            utility.is('Array', object[key]));
      
      if (isObjectOrArray) {
          result[key] = utility.clone(object[key]);
      }else{
          result[key] = object[key];
      }
    }
    return result;
  }
};*/

var Player = (function(){
  var _ = function(options){
    options = options || {};
    
    this.repeat = options.repeat || 'repeat all';
    this.random = options.random || false;
    this.items = options.playlist || {};
    this.nextId = 0;
    this.playlist = [];
    for (var index in this.items){
      this.playlist.push(index);
      if (index>=this.nextId){
        this.nextId = index+1;
      }
    }
    this.current = options.current || 0;

    this.history = [];
    this.historyLength = options.historyLength || 10;

    this.events = {};
    this.on('ready').call(this);
  };
  _.prototype.currentItem = function(method, args){
    if (this.playlist[this.current]===undefined) return;
    var item = this.items[this.playlist[this.current]];
    if (!method) return item;
    return item[method].apply(item, args);
  };
  var actions = ['play', 'stop', 'pause', 'position', 'duration'];
  for (var i in actions){
    _.prototype[actions[i]] = (function(action){ 
      return function(){
        return this.currentItem.call(this, action, arguments);
      }
    })(actions[i]);
  }
  _.prototype.play = function(){
    this.history.push(this.playlist[this.current]);
    if (this.history.length>this.historyLength)
      this.history.shift();
    this.currentItem.call(this, 'play');
    return this.current;
  };
  _.prototype.next = function(){
    if (this.random && this.repeat!=='repeat one'){
      var random = Math.floor(Math.random() * this.playlist.length);
      if (random===this.current){
        this.stop();
      }
      return this.play(this.current = random);
    }
    if (this.repeat==='repeat one'){
      this.stop();
      return this.play(this.current);
    }
    if (this.current===this.playlist.length-1){
      if (this.current===0){
        this.stop();
      }
      return this.play(this.current = 0);
    }
    return this.play(++this.current);
  };
  _.prototype.previous = function(){
    if (this.history.length>1){
      this.history.pop();
      var lastItemIndex = this.playlist.indexOf(this.history.pop());
      if (lastItemIndex!==-1){
        if (this.current===lastItemIndex){
          this.stop();
        }
        return this.play(this.current = lastItemIndex);
      }
    }
    if (this.current===0){
      if (this.playlist.length===1){
        this.stop();
      }
      return this.play(this.current = this.playlist.length-1);
    }
    return this.play(--this.current);
  };
  _.prototype.addItem = function(item){
    var that = this;
    item.on('end', this.next);
    this.items[this.nextId] = item;
    this.playlist.push(this.nextId);
    this.on('addedItem').call(this, item, this.nextId++, this.playlist.length-1);
  };
  _.prototype.removeItem = function(index){
    var playlistIndex = this.playlist.splice(index, 1);
    if (playlistIndex){
      delete this.items[this.playlistIndex];
    }
    this.on('removedItem').call(this, playlistIndex);
  };
  _.prototype.selectItem = function(index){
    if (index>=0 && index<this.playlist.length){
      this.current = index;
    }
  };
  _.prototype.moveItem = function(from, to){
    this.playlist.splice(to, 0, this.playlist.splice(from, 1)[0]);
    this.on('movedItem').call(this, from, to);
  };
  _.prototype.toggleRandom = function(){
    this.random = !this.random;
    this.on('toggledRandom').call(this);
    return this.random;
  };
  _.prototype.toggleRepeat = function(){
    var repeatValues = ['repeat all', 'repeat one'];
    var repeatIndex = repeatValues.indexOf(this.repeat);
    if (repeatIndex===-1){
      this.repeat = repeatValues[0];
      this.on('toggledRepeat').call(this);
      return this.repeat;
    }
    if(repeatIndex===repeatValues.length-1){
      this.repeat = repeatValues[0];
      this.on('toggledRepeat').call(this);
      return this.repeat;
    }
    this.repeat = repeatValues[++repeatIndex];
    this.on('toggledRepeat').call(this);
    return this.repeat;
  };
  _.prototype.on = function(eventName, eventCallback){
    var eventNames = {
      'ready': 1, 
      'end': 1, 
      'toggledRandom': 1, 
      'toggledRepeat': 1, 
      'addedItem': 1, 
      'removedItem': 1, 
      'movedItem':1
    };
    if (!eventName in eventNames) return;
    var event = this.events[eventName];
    if (!eventCallback) return event ? event : function(){};
    this.events[eventName] = eventCallback;
  };
  return _;
})();

var Playable = (function(){
  var _ = function(options){
    options = options || {};

    this.title = options.title || 'Unnamed';
    this.metadata = options.metadata || {};
    this.events = {};
  }
  var actions = ['play', 'stop', 'pause', 'position', 'duration'];
  for (var i in actions){
    _.prototype[actions[i]] = function(){};
  }

  _.prototype.on = function(eventName, eventCallback){
    var eventNames = {
      'end': 1, 
      'play': 1, 
      'pause': 1,
      'titleUpdated': 1,
      'metadataUpdated': 1
    };
    if (!eventName in eventNames) return;
    var event = this.events[eventName];
    if (!eventCallback) return event ? event : function(){};
    this.events[eventName] = eventCallback;
  };
  return _;
})();

var MockSong = (function(Parent){
  var _ = function(options){
    Parent.call(this, options);
    this.position = 0;
    this._duration = options.duration || 0;
    this.paused = false;
  };
  _.prototype = Object.create(Parent.prototype);
  _.prototype.constructor = _;

  _.prototype.play = function(){
    console.log('playing ' + this.title);
    this.paused = false;
    var that = this;
    var progress = function(){
      if (++that.position>=that.duration){
        if (!that.events.end) return;
        return that.events.end.call(that);
      }
      if (!that.paused){
        setTimeout(progress, 1000);
      }
    };
    setTimeout(progress, 1000);
  };
  _.prototype.stop = function(){
    this.pause();
    this.position(0);
  };
  _.prototype.pause = function(){
    console.log('pausing ' + this.title);
    this.paused = true;
  };
  _.prototype.position = function(position){
    console.log('seeking to ' + position + ' on ' + this.title);
    return this.position = seconds;
  };
  _.prototype.duration = function(){
    return this._duration;  
  }

  return _;
})(Playable);

//var a = new Player();
//a.addItem(new MockSong({title: 'cacca', length: 100}));

var YoutubeVideo = (function(Parent){
  var _ = function(options){
    Parent.call(this, options);
    this.player = options.player || {};
    this.id = options.id;
    var that = this;
    $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + 
          this.id + '?v=2&alt=jsonc&callback=?', 
    function(data){
      that.title = data.data.title;
      that.on('titleUpdated').call(this, that.title);
    });
  };
  _.prototype = Object.create(Parent.prototype);
  _.prototype.constructor = _;

  _.prototype.play = function(){
    var id = this.player.getVideoUrl().match(/v=([^&]+)/);
    if (!id || id[1]!==this.id){
      this.player.loadVideoById(this.id);
    }
    this.player.playVideo();
  };
  _.prototype.stop = function(){
    this.pause();
    this.position(0);
  };
  _.prototype.pause = function(){
    this.player.pauseVideo();
  };
  _.prototype.position = function(position){
    if (position!==undefined){
      this.player.seekTo(position);
    }
    return this.player.getCurrentTime();
  };
  _.prototype.duration = function(){
    return this.player.getDuration();
  };

  return _;
})(Playable);

//var a = new YoutubeVideo({title:"whatever", length:100, player: player, id: 'mwF1mUa8c5E'})


var AmuzPlayer = (function(Parent){
  var _ = function(options){
    Parent.call(this, options);
    this.container = options.container;
    createUI.call(this, options.container);
  };  
  _.prototype = Object.create(Parent.prototype);
  _.prototype.constructor = _;
  var createUI = function(container){
    var YTPlayer = $('<div style="float:left;"></div>')[0];
    container.appendChild(YTPlayer);
    createYTPlayer.call(this, YTPlayer, [64,64]);

    var randomStatus = $('<span></span>');
    var repeatStatus = $('<span></span>');
    this.on('toggledRandom', function(){
      randomStatus.text(this.random);
    });
    this.on('toggledRepeat', function(){
      repeatStatus.text(this.repeat);
    });
    this.on('toggledRandom').call(this);
    this.on('toggledRepeat').call(this);
    var that = this;
    var buttons = [
      $('<a href="#">prev</a>').click(function(){
        that.previous();
      }),
      $('<a href="#">play</a>').click(function(){
        that.play();
      }),
      $('<a href="#">pause</a>').click(function(){
        that.pause();
      }),
      $('<a href="#">stop</a>').click(function(){
        that.stop();
      }),
      $('<a href="#">next</a>').click(function(){
        that.next();
      }),
      $('<a href="#">toggle Repeat</a>').click(function(){
        that.toggleRepeat();
      }),
      $('<a href="#">toggle Random</a>').click(function(){
        that.toggleRandom();
      })
    ];
    var buttons_container = $('<div style="float:left;"></div>');
    for (var i in buttons)
      buttons_container.append(buttons[i]).append('<br />');
    buttons_container.append('<span>Repeat: </span>').append(repeatStatus).append('<br />');
    buttons_container.append('<span>Random: </span>').append(randomStatus).append('<br />');
    var playlist = $('<ul style="float:left;"></ul>');
    this.on('addedItem', function(item, id, position){
      var that = this;
      item.on('titleUpdated', function(data){
        var a = $('<a href="#">' + item.title + '</a>').click(function(){
          if (id===that.current){
            that.stop();
          }
          that.selectItem(id);
          that.play();
          return false;
        });
        var li = $('<li class="i' + position + '"></li>').append(a);
        var children = playlist.find('li');
        var done = false;
        if (children.length>0){
          for (var i=0; i<children.length-1; i++){
            var current = $(children[i]);
            if ((current.attr('class').substr(1)-0)>position){
              current.before(li);
              done = true;
            }
          }
        }
        if (!done) playlist.append(li);
        
      });
    });
    for (var i in this.playlist){
      this.on('addedItem').call(this, this.playlist[i]);
    }
    $(container).append(buttons_container).append(playlist);
  };
  var createYTPlayer = function(container, size){
    var that = this;
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var onReady = function(){ 
      that.on('ready').apply(that, arguments);
    };
    var onStateChange = function(event){ 
      var handler;
      switch(event.data){
        case YT.PlayerState.ENDED:
          that.currentItem().on('end').apply(that, arguments);
        break;
        case YT.PlayerState.PLAYING:
          that.currentItem().on('play').apply(that, arguments);
        break;
        case YT.PlayerState.PAUSED:
          that.currentItem().on('pause').apply(that, arguments);
        break;
        case YT.PlayerState.BUFFERING:

        break;
        case YT.PlayerState.CUED:

        break;
        default:

        break;
      }
    };

    window.onYouTubeIframeAPIReady = function(){
      that.player = new YT.Player(container, {
        width: size[0],
        height: size[1],
        playerVars: {
          enablejsapi: 1,
          controls: 1, 
          //controls 0 on desktop to skip "video is too small" problems
          //controls 1 (and bigger size) on mobile to make it work
          origin: window.location.protocol +  '//' + window.location.host
        },
        events: {
          onReady: onReady,
          onStateChange: onStateChange
        }
      });
    };
  };
  _.prototype.addItem = function(item){
    if (!this.player) return;
    item.player = this.player
    Parent.prototype.addItem.call(this, item);
  };
  _.prototype.volume = function(volume){
    if (volume!==undefined){
      this.player.unMute();  
      this.player.setVolume(volume);
    }
    if (this.player.isMuted())
      return 0;
    return this.player.getVolume();
  };
  return _;
})(Player);

$('body').html('<div id="player"></div>');
var a = new AmuzPlayer({container: $('#player')[0]});
a.on('ready', function(){
  a.toggleRepeat();
  a.addItem(new YoutubeVideo({title:"POMPO NELLE CASSE", length:100, id: 'mmvL4X8lnec'}));
  a.addItem(new YoutubeVideo({title:"Hanuman", length:100, id: 'ENBX_v1Po1Y'}));
  a.addItem(new YoutubeVideo({title:"Floreio Art", length:100, id: 'mwF1mUa8c5E'}));
  a.addItem(new YoutubeVideo({title:"H-arlem Shake", length:100, id: 'rU1OpD2r0Is'}));
  a.addItem(new YoutubeVideo({title:"Anal Beat", length:100, id: '97WlVRRHk_I'}));
  a.addItem(new YoutubeVideo({title:"La bruja", length:100, id: 'tUHTx-9xC8c'}));
  a.addItem(new YoutubeVideo({title:"The most amazing pitch ever", length:100, id: 'caAz3FJs44w'}));
  a.play();
});
