var app = angular.module('MyApp', []);

app.controller('Main', ['$scope', '$http',  function($scope, $http) {
  $scope.patroniList = [];
  $scope.peopleList = [];
  $scope.select = {};
  $scope.selectedPatronus = {};
  $scope.selectedPerson = {};
  $scope.matchedPeople = [];

  // array.sort(function(a, b){
  //   if(a.patronus_name < b.patronus_name) return -1;
  //   if(a.patronus_name > b.patronus_name) return 1;
  //   return 0;
  // }

  $scope.getPatroni = function (){
    $http.get('/patroni').then(function(response){
      $scope.patroniList = response.data;
      $scope.patroniList.sort(function(a, b){
          if(a.patronus_name < b.patronus_name) return -1;
          if(a.patronus_name > b.patronus_name) return 1;
          return 0;
        });
    });
    };


  $scope.getPeople = function () {
    $http.get('/people').then(function(response){
      console.log(response);
      $scope.peopleList = response.data[0];
      $scope.matchedPeople = $scope.chunk(response.data[1], 4);
    });
  };

  $scope.match = function() {
    console.log('sending', $scope.selectedPerson, $scope.selectedPatronus);
    $http.put('/people/' + $scope.selectedPerson, $scope.selectedPatronus).then(function(response){
      console.log(response);
      $scope.getPeople();
    });
  };

  $scope.chunk = function(arr, size) {
   var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
          newArr.push(arr.slice(i, i+size));
      }
   return newArr;
};

$scope.getPatroni();
$scope.getPeople();

}]);  // :::: close controller :::: //







app.controller('PeopleInputController',['$scope', '$http',  function($scope, $http) {
  $scope.person = '';
  //wrap parent function in new function to ensure it doesn't assign before controller loads
  $scope.getPeople = function() {$scope.$parent.getPeople();};

/* this function allows for the entry of single name entities, like Dobby. If there is no second name
 separated by whitespace, last_name will be an empty string */
    parseName = function(str) {
      console.log(str);
      var parse = str.match(/^(\S+)\s*(\S+)?$/i);
      return {first_name: parse[1], last_name: parse[2] ? parse[2] : ''};
    };

  $scope.postPeople = function () {
    $http.post('/people', parseName($scope.person)).then(function(response) {
      $scope.person = '';
      $scope.getPeople();
    });
  };
}]); // peopleinput control done



app.controller('PatronusInputController', ['$scope', '$http',  function($scope, $http){
  $scope.patronus = {};
  //wrap parent function in new function to ensure it doesn't assign before controller loads
  $scope.getPatroni = function() {$scope.$parent.getPatroni();};



  $scope.postPatroni = function () {
    console.log('controller works', $scope.patronus);
    $http.post('/patroni', $scope.patronus).then(function(response) {
      console.log(response);
      $scope.patronus = {};
      $scope.getPatroni();
    });
  };
}]); // patronus input control done
