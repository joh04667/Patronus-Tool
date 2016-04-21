var app = angular.module('MyApp', []);

app.controller('Magic', ['$http', function($http){
  var vm = this;
  vm.patroniList = [];
  vm.peopleList = [];
  vm.patronus = {};
  vm.person = {};

  vm.getPatroni = function (){
    $http.get('/patroni').then(function(response){
      vm.patroniList = response.data;
    });
  };

  vm.getPeople = function () {
    $http.get('/people').then(function(response){
      console.log('response');
      vm.peopleList = response.data;
    });
  };

  vm.postPeople = function (person) {
    $http.post('/people', vm.person).then(function(response) {
      console.log(response);
      vm.person = {};
      vm.getPeople();
    });
  };

  vm.postPatroni = function (patroni) {
    $http.post('/patroni', vm.patronus).then(function(response) {
      console.log(response);
      vm.patronus = {};
      vm.getPatroni();
    });
  };

vm.getPatroni();
vm.getPeople();

}]);  // :::: close controller :::: //
