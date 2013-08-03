function PlayerController($scope, $window, $timeout, $http, safeApply) {
  amuzPlayer.on('ready', function(){
    amuzPlayer.load($http, function(err, data){
      if (err)
        return;
      amuzPlayer.properties.name = data.name;
      data.playlist.map(function(item){
        amuzPlayer.addItem(new YoutubeVideo(item));
      });
    });
    this.volume(100);
  });
  
  $scope.playlistProperties = amuzPlayer.properties;
  
  var updatePlaylist = function(){
    $scope.playlist = amuzPlayer.playlist;
    $scope.items = amuzPlayer.items;
    safeApply($scope);
  };
  
  amuzPlayer.on('addedItem', updatePlaylist);
  amuzPlayer.on('removedItem', updatePlaylist);
  amuzPlayer.on('movedItem', updatePlaylist);
  
  var currentEditing = {}
  $scope.currentEditing = function(index){
    return (index in currentEditing);
  }
  $scope.showEditForm = function(index){
    currentEditing[index] = 1;
  }
  $scope.hideEditForm = function(index){
    delete currentEditing[index];
  }
  $scope.delete = function(index){
    amuzPlayer.removeItem(amuzPlayer.playlistIndex(index));
  }
  
  var interval;
  amuzPlayer.on('play', function(){
    $scope.currentPlaying = amuzPlayer.playlist[amuzPlayer.current];
    $scope.playing = true;
    interval = setInterval(function(){
      safeApply($scope);
    },1000);
  });
  amuzPlayer.on('pause', function(){
    $scope.playing = false;
    clearInterval(interval);
  });
  amuzPlayer.on('stop', function(){
    $scope.playing = false;
    clearInterval(interval);
  });
  $scope.control = function(){
    if ($scope.playing){
      amuzPlayer.pause();
    }else{
      amuzPlayer.play();
    }
  };
  $scope.play = function(id){
    if (id===$scope.currentPlaying)
      amuzPlayer.stop();
    amuzPlayer.selectItem(amuzPlayer.playlistIndex(id));
    amuzPlayer.play();
  }
  $scope.next = function(){
    amuzPlayer.next();
  };
  $scope.prev = function(){
    amuzPlayer.previous();
  };
  
  var positionSlider = false;
  $scope.enablePositionSlider = function(event){
    positionSlider = true;
    $timeout(function(){
      if (positionSlider===false)
        $scope.setPosition(event, true);
    },100);
  };
  $scope.disablePositionSlider = function(){
    positionSlider = false;
  };
  $scope.setPosition = function(event, click){
    if (!positionSlider && !click)
      return;
    var x = event.offsetX || event.originalEvent.layerX
      , width = 256
      , seconds = amuzPlayer.items[$scope.currentPlaying].duration*x/width
    amuzPlayer.position(seconds);    
  };
  
  $scope.repeat = 'repeat';
  amuzPlayer.on('toggledRepeat', function(repeat){
    var repeatStatus = {
      'repeat all': 'repeat'
    , 'repeat random': 'random'
    , 'repeat one': 'repeat-one'
    }
    $scope.repeat = repeatStatus[repeat];
  });
  $scope.toggleRepeat = function(){
    amuzPlayer.toggleRepeat();
  };
  
  amuzPlayer.on('changedVolume', function(volume){
    var angle = volume*Math.PI/200;
    $scope.volumeThumb = {
      top: Math.sin(angle),
      right: Math.cos(angle)
    };
    $scope.volume = volume;
    safeApply($scope);
  });
  var volumeSlider = false;
  $scope.enableVolumeSlider = function(event){
    volumeSlider = true;
    $timeout(function(){
      if (volumeSlider===false)
        $scope.setVolume(event, true);
    },100);
  };
  $scope.disableVolumeSlider = function(){
    volumeSlider = false;
  };
  $scope.setVolume = function(event, click){
    if (!volumeSlider && !click)
      return;
    var x = event.offsetX || event.originalEvent.layerX
      , y = event.offsetY || event.originalEvent.layerY
      , width = 80
      , height = 80
      , pX = (width-x)/width
      , pY = y/height
      , aX = pX/Math.sqrt(pX*pX+pY*pY)
      , angle = Math.acos(aX)
      , volume = angle*200/Math.PI
    if (volume>85)
      volume = 100;
    if (volume<15)
      volume = 0;
    amuzPlayer.volume(volume);
  };
  
  $scope.i18n = function(string){
    return string;
  };
  
  $scope.columnWidth = function() {
    var width = (window.innerWidth-288-64-24)/2;
    if (width<=262)
      return 'auto';
    return width+'px';
  };
  $scope.uiWidth = function() {
    var width = (window.innerWidth-24);
    return width+'px';
  };
  angular.element(window).bind('resize', function() {
    safeApply($scope);
  });
  
  $scope.mobileDetected = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
  $scope.mobileRoutineCompleted = false;
  amuzPlayer.on('firstTime', function(){
    $scope.mobileRoutineCompleted = true;
    safeApply($scope);
  });
  
  var paypalLinks = {
    usd: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8LCFDRSMH3URJ'
  , eur: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ETMN6W6DYQU4L'
  };
  if ((/en-US/).test(navigator.language || navigator.userLanguage)){
    $scope.paypal = paypalLinks['usd'];
  }else{
    $scope.paypal = paypalLinks['eur'];
  }
  
  $scope.escape = encodeURIComponent;
  
  $scope.save = function(){
    amuzPlayer.save($http, function(err, data){
      console.log(err, data);
    });
  };
  
};
PlayerController.$inject = ['$scope', '$window', '$timeout', '$http', 'safeApply'];