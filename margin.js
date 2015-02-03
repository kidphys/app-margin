var marginApp = angular.module('MarginApp', []);

marginApp.controller('MarginAppController', ['$scope', '$http', function ($scope, $http) {
    $scope.account = {};
    $scope.account.stockBook = [
        {'symbol': 'VND', 'amount': 1000000},
        {'symbol': 'SSI', 'amount': 2000000},
    ];

    $scope.loanCatalog = [
        {
            'name': 'mr',
            'rates': [
                {'symbol': 'VND', 'rate': 0.5},
                {'symbol': 'SSI', 'rate': 0.6},
            ]
        },
        {
            'name': 'df',
            'rates': [
                {'symbol': 'ACB', 'rate': 0.3},
                {'symbol': 'SSI', 'rate': 0.5},
            ]
        },
    ];


    $scope.new_stock = "";
    $scope.add_stock = function(stockBook, str){
        var stock = str.split(' ');
        var amount = parseInt(stock[1]);
        for (var idx in stockBook){
            if (stockBook[idx].symbol == stock[0]){
                stockBook[idx].amount = amount;
                return;
            }
        }
        stockBook.push({'symbol': stock[0], 'amount': amount});
    };

    $scope.removeStock = function(stockBook, stock){
        var index = stockBook.indexOf(stock);
        if (index != -1){
            stockBook.splice(index, 1);
        }
    };

    $scope.new_rate_str = "";
    $scope.add_rate = function(rates, str){
        var rate = str.split(' ');
        var rate_number = parseFloat(rate[1]);
        for (var idx in rates){
            if (rates[idx].symbol == rate[0]){
                rates[idx].rate = rate_number;
                return;
            }
        }
        rates.push({'symbol': rate[0], 'rate': rate_number});
    }

    $scope.remove_rate = function(rates, rate){
        var index = rates.indexOf(rate);
        if (index != -1){
            rates.splice(index, 1);
        }
    }

    $scope.send_data = function(){
        console.log("Calculating purchasing power");
        $.ajax({
            type: 'get',
            url: 'http://localhost:5000/pp',
            data: {'stockBook': JSON.stringify($scope.account.stockBook)},
            dataType: 'json',
        });
    }
}]);