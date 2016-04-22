var app = angular.module('MyApp', []);

app.controller('Main', ['$scope', '$http',  function($scope, $http) {
  $scope.patroniList = [];
  $scope.peopleList = [];
  $scope.select = {};
  $scope.selectedPatronus = {};
  $scope.selectedPerson = {};
  $scope.matchedPeople = [];


// fx to alphabetize array by passing key as string
   $scope.alphabetizeByKey = function(array, key) {
    return array.sort(function(a, b){
      if(a[key] < b[key]) return -1;
      if(a[key] > b[key]) return 1;
      return 0;
    });
  };

// get all patronus
  $scope.getPatroni = function (){
    $http.get('/patroni').then(function(response){
      $scope.patroniList = response.data;
      $scope.alphabetizeByKey($scope.patroniList, "patronus_name");
        });
    };


 // get all people -- servers will send us two arrays, one without a patronus_id and one with a match
  $scope.getPeople = function () {
    $http.get('/people').then(function(response){
      // alphabetize both arrays in response
      response.data.forEach(function(s) {
        $scope.alphabetizeByKey(s, "first_name");
      });
      // assign to correct arrays
      $scope.peopleList = response.data[0];
      $scope.matchedPeople = $scope.chunk(response.data[1], 4);
    });
  };


// assign a person to a patronus
  $scope.match = function() {
    $http.put('/people/' + $scope.selectedPerson, $scope.selectedPatronus).then(function(response){
      $scope.getPeople();
    });
  };


// chunking function to space out wells and columns
  $scope.chunk = function(arr, size) {
   var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
          newArr.push(arr.slice(i, i+size));
      }
   return newArr;
};

//call on page load
$scope.getPatroni();
$scope.getPeople();

}]);  // :::: close main :::: //







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


// post new ppl to db
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


 // post a new patronus to db
  $scope.postPatroni = function () {
    console.log('controller works', $scope.patronus);
    $http.post('/patroni', $scope.patronus).then(function(response) {
      $scope.patronus = {};
      $scope.getPatroni();
    });
  };
}]); // patronus input control done
