var app = angular.module('MyApp', []);

app.controller('Magic', ['$http', function($http){
  var vm = this;
  vm.patroniList = [];
  vm.peopleList = [];

  vm.getPatroni = function (){
    $http.get('/patroni').then(function(response){
      vm.patroniList = response.data;
    });
  };

  vm.getPeople = function () {
    $http.get('/people').then(function(response){
      console.log(response);
      vm.peopleList = response.data;
    });
  };



vm.getPatroni();
vm.getPeople();

}]);  // :::: close controller :::: //


app.controller('PeopleInputController', ['$http', function($http){
  var vm = this;
  vm.person = {};

  vm.postPeople = function () {
    $http.post('/people', vm.person).then(function(response) {
      console.log(response);
      vm.person = {};
      vm.getPeople();
    });
  };


}]); // peopleinput control done

app.controller('PatronusInputController', ['$scope', '$http',  function($scope, $http){
  var vm = this;
  vm.patronus = {};
  vm.getPatroni = function() {$scope.$parent.getPatroni();};

  vm.postPatroni = function () {
    console.log('controller works', vm.patronus);
    $http.post('/patroni', vm.patronus).then(function(response) {
      console.log(response);
      vm.patronus = {};
      vm.getPatroni();
    });
  };
}]); // patronus input control done
