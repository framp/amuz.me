function SearchController($scope, $http) {
  var search = function(more){
    var error = function() {
      $scope.message = 'No ' + (more? 'more ' : '') + 'items found';
      $scope.moreVisibility = false;
      $scope.results = [];
    };
    $scope.category = 'Music';
    $http.jsonp('http://gdata.youtube.com/feeds/api/videos?q=' + escape($scope.query || "") + 
                '&v=2&alt=json' + 
                ($scope.category ? '&category=' + $scope.category : '') + 
                '&max-results=' + $scope.maxResults + 
                '&start-index=' + (($scope.currentPage - 1) * $scope.maxResults + 1) + 
                '&callback=JSON_CALLBACK')
    .success(function(data) {
      if (!data || !data.feed || !data.feed.entry)
        return error();
      $scope.message = '';
      $scope.moreVisibility = true;
      if (!more)
        $scope.results = [];
      $scope.results = $scope.results.concat(data.feed.entry.map(function(item){
        return {
          "id": item['media$group']['yt$videoid']['$t'],
          "title": $.trim(item['title']['$t'].replace(/^\s+|\s+$/g, '')),
          "duration": item['media$group']['yt$duration']['seconds']
        };
      }));
    })
    .error(error);
  }
  $scope.moreVisibility = false;
  $scope.maxResults = 50;
  
  $scope.submit = function(){
    $scope.currentPage = 1;
    search();
  };
  $scope.more = function(){
    $scope.currentPage++;
    search(true);
  }
  
  $scope.add = function(index, options){
    amuzPlayer.addItem(new YoutubeVideo(options));
    $scope.results.splice(index,1);
  }
  $scope.mobileDetected = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
  if (!$scope.mobileDetected){
    $scope.youtubeAutoComplete = {
      options: {
        focusOpen: true,
        outHeight: 100,
        appendTo: '#autocomplete',
        source: function (request, response) {
          if (request.term.length<3)
            return;
          $http.jsonp('http://suggestqueries.google.com/complete/search?q=' + escape(request.term) + 
                      '&client=youtube' +
                      '&limit=10' +
                      '&hl=en' +
                      '&ds=yt' +
                      '&callback=JSON_CALLBACK')
          .success(function(data){
            var result = [];
            for (var i in data[1])
              result.push(data[1][i][0]);
            response(result);
          });
        }
      }
    };
  };
}
SearchController.$inject = ['$scope', '$http']; 
