angular.module('youtubeTimeFormatter', []).
  filter('youtubeTime', function() {
    return function(seconds) {
      return [(seconds>>0)/60>>0, (seconds>>0)%60].map(function(i){
        return (i<10 ? '0' : '') + i;
      }).join(':');
    }
  }); 
