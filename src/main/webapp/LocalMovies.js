'use strict';

var videoUrl;
var videoTitle;
var videoImageUrl;
var accessToken = getToken();
var apiUrl = "/movie-api";

var castPlayer = new CastPlayer();
window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        castPlayer.initializeCastPlayer();
    }
};

function getToken(){
    var request = new XMLHttpRequest();
    request.open("POST", "/open/accessToken", false);
    request.send();
    return request.responseText;
}

var app = angular.module('LocalMovies', [
    'ngRoute'
]);

function MovieRequest(path) {
    this.path = path;
    this.client = "WEBAPP";
    this.page = 0;
    this.resultsPerPage = 700;
}

app.service('movieService', ['$http', function($http) {
    this.getMovies = function (path) {
        var movieRequest = new MovieRequest(path);
        var config = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accessToken
            }
        };

        return $http.post(apiUrl + "/titlerequest", JSON.stringify(movieRequest), config)
            .success(function(data) {
                return data;
            });
    };
}]);

app.controller('MainController', ['$scope', 'movieService', function ($scope, movieService) {
    $scope.accessToken = accessToken;
    $scope.apiUrl = apiUrl;
    $scope.currentPath = "";

    $scope.playMovie = function (movie) {
        var pathLength = $scope.currentPath.split("/").length;
        if($scope.currentPath.toLowerCase().includes("movies") || pathLength == 3) {
            videoImageUrl = apiUrl + "/poster?path=" + encodeURIComponent(movie.path) + "&access_token=" + accessToken;
            videoTitle = movie.movieInfo.title;
            videoUrl = apiUrl + "/video.mp4?path=" + encodeURIComponent($scope.currentPath + "/" + movie.fileName) + "&access_token=" + accessToken;
            document.getElementById('media_title').innerHTML = videoTitle;
            castPlayer.playerHandler.load();
        } else {
            $scope.updateList(movie.fileName);
        }

    };

    $scope.updateList = function (title) {
        if(title.toLowerCase() == "movies" || title.toLowerCase() == "series"){
            $scope.currentPath = title;
        } else {
            $scope.currentPath += ("/" + title);
        }

        movieService.getMovies($scope.currentPath).success(function (data) {
            $scope.movies = data;
        });
    };

    $scope.updateList("Movies");
}]);
