var Player = (function(){
  var _ = function(options){
    options = options || {};
    
    this.repeat = options.repeat || 'repeat all';
    this.items = options.playlist || {};
    this.nextId = 0;
    this.playlist = [];
    for (var index in this.items){
      this.playlist.push(index);
      if (index>=this.nextId)
        this.nextId = index+1;
    }
    this.current = options.current || 0;

    this.history = [];
    this.historyLength = options.historyLength || 10;
    
    this.eventNames = {
      'ready': 1
    , 'toggledRepeat': 1
    , 'addedItem': 1
    , 'removedItem': 1
    , 'movedItem':1
    , 'play':1
    , 'pause':1
    , 'stop':1
    };
    this.events = {};
    this.on('ready').call(this);
  };
  _.prototype.currentItem = function(method, args){
    if (this.playlist[this.current]===undefined) 
      return;
    var item = this.items[this.playlist[this.current]];
    if (!method) 
      return item;
    return item[method].apply(item, args);
  };
  _.prototype.play = function(){
    this.history.push(this.playlist[this.current]);
    if (this.history.length>this.historyLength)
      this.history.shift();
    this.currentItem.call(this, 'play');
    this.on('play').call(this);
    return this.current;
  };
  _.prototype.pause = function(){
    this.on('pause').call(this);
    this.currentItem.call(this, 'pause', arguments);
  };
  _.prototype.stop = function(){
    this.on('stop').call(this);
    this.currentItem.call(this, 'stop', arguments);
  };
  _.prototype.position = function(){
    this.currentItem.call(this, 'position', arguments);
  };
  _.prototype.duration = function(){
    this.currentItem.call(this, 'duration', arguments);
  };
  _.prototype.next = function(){
    if (this.repeat==='repeat random'){
      var random = Math.floor(Math.random() * this.playlist.length);
      random = (this.current + random) % this.playlist.length;
      if (random===this.current)
        this.position(0);
      return this.play(this.current = random);
    }
    if (this.repeat==='repeat one'){
      this.position(0);
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
        if (this.current===lastItemIndex)
          this.stop();
        return this.play(this.current = lastItemIndex);
      }
    }
    if (this.current===0){
      if (this.playlist.length===1)
        this.stop();
      return this.play(this.current = this.playlist.length-1);
    }
    return this.play(--this.current);
  };
  _.prototype.playlistIndex = function(index){
    for (var i in this.playlist)
      if (this.playlist[i]===index)
        return i;
    return false
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
    if (playlistIndex)
      delete this.items[this.playlistIndex];
    this.on('removedItem').call(this, playlistIndex);
  };
  _.prototype.selectItem = function(index){
    if (index>=0 && index<this.playlist.length)
      this.current = index;
  };
  _.prototype.moveItem = function(from, to){
    this.playlist.splice(to, 0, this.playlist.splice(from, 1)[0]);
    this.on('movedItem').call(this, from, to);
  };
  _.prototype.toggleRepeat = function(){
    var repeatValues = ['repeat all', 'repeat one', 'repeat random'];
    var repeatIndex = repeatValues.indexOf(this.repeat);
    if (repeatIndex===-1){
      this.repeat = repeatValues[0];
      this.on('toggledRepeat').call(this, this.repeat);
      return this.repeat;
    }
    if(repeatIndex===repeatValues.length-1){
      this.repeat = repeatValues[0];
      this.on('toggledRepeat').call(this, this.repeat);
      return this.repeat;
    }
    this.repeat = repeatValues[++repeatIndex];
    this.on('toggledRepeat').call(this, this.repeat);
    return this.repeat;
  };
  _.prototype.on = function(eventName, eventCallback){
    if (!eventName in this.eventNames) 
      return;
    var event = this.events[eventName];
    if (!eventCallback) 
      return event ? event : function(){};
    this.events[eventName] = eventCallback;
  };
  return _;
})();
