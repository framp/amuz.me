var Utility = {
  is: function(type, object){
    return Object.prototype.toString.call(object) == '[object ' + type + ']';
  }
}