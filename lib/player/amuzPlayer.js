var AmuzPlayer = (function(Parent){
  var _ = function(options){
    createYTPlayer.call(this, options.container, [200,200]);
    Parent.call(this, options);
    this.events['changedVolume'] = 1;
    this.events['firstTime'] = 1;
    this.properties = {
      name: 'New Playlist'
    , id: false 
    , readOnly: false
    }
  };  
  _.prototype = Object.create(Parent.prototype);
  _.prototype.constructor = _;
  var createYTPlayer = function(container, size){
    var that = this;
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var onReady = function(){ 
      that.on('ready').apply(that, arguments);
    };
    this.firstTime = true;
    var playingCounter = 0;
    var onStateChange = function(event){ 
      var handler;
      switch(event.data){
        case YT.PlayerState.ENDED:
          if (that.firstTime){
            return that.firstTime = false;
          }
          that.currentItem().on('end').apply(that, arguments);
        break;
        case YT.PlayerState.PLAYING:
          if (that.firstTime){
            that.on('firstTime').call(that);
            playingCounter++;
            if (playingCounter>1)
              that.firstTime = false;
          }
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
      var controls = 0
      //controls 0 on desktop to skip "video is too small" problems
      //controls 1 (and bigger size) on mobile to make it work (need more testing)
      
      that.player = new YT.Player(container, {
        width: size[0],
        height: size[1],
        videoId: 'jhFDyDgMVUI',
        playerVars: {
          enablejsapi: 1,
          controls: controls, 
          showinfo: 0,
          autohide: 1,
          rel: 0,
          iv_load_policy: 3, 
          origin: window.location.protocol +  '//' + window.location.host
        },
        events: {
          onReady: onReady,
          onStateChange: onStateChange
        }
      });
    };
  };
  _.prototype.play = function(){
    this.firstTime = false;
    Parent.prototype.play.call(this);
  }
  _.prototype.addItem = function(item){
    if (!this.player) 
      return;
    item.player = this.player
    Parent.prototype.addItem.call(this, item);
  };
  _.prototype.volume = function(volume){
    if (volume!==undefined){
      this.player.unMute();  
      this.player.setVolume(volume);
      this.on('changedVolume').call(this, volume);
    }
    if (this.player.isMuted())
      return 0;
    return this.player.getVolume();
  };
  
  _.prototype.playlistJSON = function(){
    var that = this;
    return this.playlist.map(function(i){
      var item = that.items[i];
      return {
        "id": item.id
      , "startSeconds": item.startSeconds
      , "endSeconds": item.endSeconds
      , "title": item.title
      };
    });
  };
  _.prototype.save = function($http, callback){
    var that = this;
    var data = {
      name: this.properties.name
    , playlist: this.playlistJSON()
    };
    var id;
    if (this.properties.id && !this.properties.readOnly){
      id = this.properties.id;
    }else{
      var nameClean = this.properties.name.replace(/[^a-z0-9]/ig,'');
      id = nameClean + '_' + (+new Date) + Math.random().toString(36).substr(2,9);
    }
    var config = { params: {} };
    config.params[id] = data;
    $http.jsonp('http://api.openkeyval.org/store/?callback=JSON_CALLBACK', config)
    .success(function(data){
      that.properties.id = id;
      var result = {
        edit: '#/' + encodeURIComponent(that.properties.name) + '/' + id
      , readOnly: '#/' + encodeURIComponent(that.properties.name) + '/' + data.keys[id]
      };
      location.hash = result.edit;
      callback(null, result);
    })
    .error(function(){
      callback(true);
    });
  };
  _.prototype.load = function($http, callback){
    var that = this;
    var parts = location.hash.split('/');
    if (parts.length!==3)
      return;
    var name = decodeURIComponent(parts[1]);
    var id = parts[2];
    $http.jsonp('http://api.openkeyval.org/' + encodeURIComponent(id) + '&callback=JSON_CALLBACK')
    .success(function(data){
      if (!data)
        return callback(true);
      that.properties.name = data.name;
      that.properties.id = id;
      location.hash = '#/' + encodeURIComponent(that.properties.name) + '/' + id;
      if ((/^rok-/).test(id))
        that.properties.readOnly = true;
      callback(null, data);
    })
    .error(function(){
      callback(true);
    });
  };
  return _;
})(Player);