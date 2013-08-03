var Playable = (function(){
  var _ = function(options){
    options = options || {};

    this.title = options.title || 'Unnamed';
    this.metadata = options.metadata || {};
    
    this.eventNames = {
      'end': 1, 
      'play': 1, 
      'pause': 1
    };
    this.events = {};
  }
  var actions = ['play', 'stop', 'pause', 'position', 'duration'];
  for (var i in actions){
    _.prototype[actions[i]] = function(){};
  }

  _.prototype.on = function(eventName, eventCallback){
    
    if (!eventName in this.eventNames) return;
    var event = this.events[eventName];
    if (!eventCallback) 
      return event ? event : function(){};
    this.events[eventName] = eventCallback;
  };
  return _;
})();