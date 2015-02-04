var marginApp = angular.module('MarginApp', []);

marginApp.controller('MarginAppController', ['$scope', '$http', function ($scope, $http) {
    function alert(message){
        $('#alert-message').html('<div class="alert alert-warning" role="alert" data-dismiss="alert">' + message + '</div>');
    }

    $scope.symbol = ''; // target symbol to calculate
    $scope.account = {};
    $scope.account.stock_book = [
        {'symbol': 'VND', 'amount': 10000},
        {'symbol': 'SSI', 'amount': 20000},
    ];

    $scope.loan_catalog = [
        {
            'name': 'MR',
            'rates': [
                {'symbol': 'VND', 'rate': 0.5},
                {'symbol': 'SSI', 'rate': 0.6},
            ]
        },
        {
            'name': 'DF',
            'rates': [
                {'symbol': 'ACB', 'rate': 0.3},
                {'symbol': 'SSI', 'rate': 0.5},
            ]
        },
        {
            'name': 'GOD',
            'rates': [
                {'symbol': 'ACB', 'rate': 0.8},
                {'symbol': 'SSI', 'rate': 0.8},
            ]
        },
    ];


    $scope.new_stock = "";
    $scope.add_stock = function(stock_book, str){
        var stock = str.split(' ');
        var amount = parseInt(stock[1]);
        for (var idx in stock_book){
            if (stock_book[idx].symbol == stock[0]){
                stock_book[idx].amount = amount;
                return;
            }
        }
        stock_book.push({'symbol': stock[0], 'amount': amount});
    };

    $scope.removeStock = function(stock_book, stock){
        var index = stock_book.indexOf(stock);
        if (index != -1){
            stock_book.splice(index, 1);
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

    function loan_names(){
        return $.map($scope.loan_catalog, function(product){return product.name});
    }

    function result_header(allocation, loan_names){
        return $.map(allocation[loan_names[0]], function(value, symbol){return symbol;});
    }

    function result_allocation(allocation, loan_names){
        return $.map(loan_names, function(name){
            return {
                'name': name,
                'amount': $.map(allocation[name], function(k, v){ return k;}),
            }
        });
    }

    function result_total(result_allocations){
        var length  = result_allocations[0]['amount'].length;
        var result = [];
        for(var i = 0; i < length; i++){
            result[i] = 0
        }
        $.each(result_allocations, function(idx, allocation){
            for(var i = 0; i < length; i++){
                result[i] += allocation.amount[i];
            }
        });
        return result;
    }

    $scope.result = {
        'headers': ['VND', 'SSI', 'PP'],
        'allocations': [
            {'name': 'MR', 'amount': [2000, 1500, 2500]},
            {'name': 'DF', 'amount': [4000, 1500, 2500]},
            {'name': 'GOD', 'amount': [8000, 1504, 2504]},
        ],
        'totals': [2000, 3000, 1234],
    }

    function validate(symbol){
        if (symbol == ''){
            alert('')
        }
    }

    $scope.send_data = function(){
        alert('Hello')
        // console.log("Calculating purchasing power",
        //             $scope.account.stock_book,
        //             $scope.loan_catalog
        //             );
        // $.ajax({
        //     type: 'get',
        //     url: 'http://localhost:8080/pp',
        //     data: {
        //         'stock_book': JSON.stringify($scope.account.stock_book),
        //         'loan_catalog': JSON.stringify($scope.loan_catalog),
        //         'symbol': $scope.symbol,
        //     },
        //     dataType: 'json',
        // })
        // .done(function(data){
        //     console.log('result', data);
        //     var names = loan_names();
        //     // force re-fresh, other-wise list will not be fresh immediately
        //     $scope.$apply(function(){
        //         $scope.result.headers = result_header(data['allocation'], names);
        //         $scope.result.allocations = result_allocation(data['allocation'], names);
        //         $scope.result.pp = data['pp'];
        //         $scope.result.totals = result_total($scope.result.allocations);
        //     });
        // });
    }
}]);