var marginApp = angular.module('MarginApp', []);

marginApp.controller('MarginAppController', function ($scope) {
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


    $scope.new_stock = "VND 100000";
    $scope.add_stock = function(stockBook, str){
        var stock = str.split(' ');
        stockBook.push({'symbol': stock[0], 'amount': parseInt(stock[1])});
    };

    $scope.removeStock = function(stockBook, stock){
        var index = stockBook.indexOf(stock);
        if (index != -1){
            stockBook.splice(index, 1);
        }
    };

    $scope.new_rate_str = "SHS 0.5";
    $scope.add_rate = function(rates, str){
        var rate = str.split(' ');
        rates.push({'symbol': rate[0], 'rate': parseFloat(rate[1])});
    }

    $scope.remove_rate = function(rates, rate){
        var index = rates.indexOf(rate);
        if (index != -1){
            rates.splice(index, 1);
        }
    }
});