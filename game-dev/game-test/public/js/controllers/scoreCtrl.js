angular.module('game')

.controller('scoreCtrl', ['$scope', '$http', 'Scores', function($scope, $http, Scores) {
  
  $scope.title = 'High Scores';
  $scope.scores = Scores.get();

}]);