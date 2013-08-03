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

f (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = MockSong;