'use strict';

var videoUrl;
var videoTitle;
var videoImageUrl;
var accessToken = getToken();
var apiUrl = "https://localmovies.hopto.org/localmovies/v2";

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

app.filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
});

function MovieRequest(path) {
    this.path = path;
    this.client = "WEBAPP";
    this.page = 0;
    this.resultsPerPage = 1000;
}

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    $scope.accessToken = accessToken;
    $scope.apiUrl = apiUrl;
    $scope.currentPath = "";

    $scope.getMovies = function (path) {
        var movieRequest = new MovieRequest(path);
        var config = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accessToken
            }
        };

        return $http.post(apiUrl + "/movies", JSON.stringify(movieRequest), config)
            .then(function(response) {
                $scope.movieCount = response.headers("count");
                $scope.currentPage = 0;
                $scope.pageSize = 18;
                $scope.numberOfPages=function(){
                    return Math.ceil($scope.movieCount/$scope.pageSize);
                };

                return response.data;
            });
    };

    $scope.playMovie = function (movie) {
        var pathLength = $scope.currentPath.split("/").length;
        if($scope.currentPath.toLowerCase().includes("movies") || pathLength === 3) {
            videoImageUrl = apiUrl + "/movie/poster?path=" + encodeURIComponent(movie.path) + "&access_token=" + accessToken;
            videoTitle = movie.movie.title;
            videoUrl = apiUrl + "/movie/stream.mp4?path=" + encodeURIComponent($scope.currentPath + "/" + movie.fileName) + "&access_token=" + accessToken;
            document.getElementById('media_title').innerHTML = videoTitle;
            castPlayer.playerHandler.load();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
            $scope.updateList(movie.fileName);
        }
    };

    $scope.textIsNotEmpty = function (text) {
        return text != null && text != "";
    };

    $scope.updateList = function (title) {
        if(title.toLowerCase() === "movies" || title.toLowerCase() === "series"){
            $scope.currentPath = title;
        } else {
            $scope.currentPath += ("/" + title);
        }

        $scope.getMovies($scope.currentPath).then(function (data) {
            $scope.movies = data;
        });
    };

    $scope.updateList("Movies");
}]);
