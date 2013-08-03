var YoutubeVideo = (function(Parent){
  var _ = function(options){
    Parent.call(this, options);
    this.player = options.player || {};
    this.id = options.id;
    this.title = options.title || 'Song #' + this.id;
    this.startSeconds = options.startSeconds || 0
    this.endSeconds = options.endSeconds || options.duration || 0
    this.duration = options.duration || this.endSeconds-this.startSeconds || 0;
  };
  _.prototype = Object.create(Parent.prototype);
  _.prototype.constructor = _;
  
  _.prototype.isPlaying = function(){
    var video = this.player.getVideoUrl() || ''
      , id = video.match(/v=([^&]+)/)
    return !!(id && id[1]===this.id);
  };
  _.prototype.play = function(){
    if (!this.isPlaying())
      this.player.loadVideoById({videoId: this.id, startSeconds:this.startSeconds, endSeconds:this.endSeconds});
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

  return _;
})(Playable);