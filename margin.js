var marginApp = angular.module('MarginApp', []);
var VNDS_PP_URL = 'http://54.148.105.53:8081/vnds_pp'

/*
    In case of re-paying debt, the loan can be distributed differently >> Đảo nợ.
    Also, blocking stock should be released, if the corresponding debt is already paid.
 */

marginApp.filter('numeral', function(){
    return function(amount) {
        return numeral(amount).format('0,0');
    }
});


marginApp.controller('MarginAppController', ['$scope', '$http', function ($scope, $http) {
    function alert(message){
        $('#alert-message').html('<div class="alert alert-warning" role="alert" data-dismiss="alert">' + message + '</div>');
    }

    $scope.symbol = ''; // target symbol to calculate
    $scope.account = {};

    $scope.account.info = {
        'cash': 100,
        'limit': 10000,
    };

    $scope.account.stock = [
        {'symbol': 'VND', 'amount': 10000},
        {'symbol': 'SSI', 'amount': 20000},
    ];

    $scope.loan_catalog = [
        {
            'name': 'MR',
            'rates': [
                {'symbol': 'VND', 'rate': 0.5},
                {'symbol': 'SSI', 'rate': 0.6},
            ],
            'info': {
                'balance': 0,
                'limit': 10000
            }
        },
        {
            'name': 'DF1',
            'rates': [
                {'symbol': 'VND', 'rate': 0.6},
                {'symbol': 'SSI', 'rate': 0.7},
            ],
            'info': {
                'balance': 0,
                'limit': 10000
            }
        },
        {
            'name': 'DF2',
            'rates': [
                {'symbol': 'ACB', 'rate': 0.8},
                {'symbol': 'SSI', 'rate': 0.8},
            ],
            'info': {
                'balance': 0,
                'limit': 10000
            }
        },
    ];


    $scope.new_stock = "";
    $scope.add_stock = function(stock_book, str){
        var input = str.split(' ');
        var amount = parseInt(input[1]);
        var symbol = input[0].toUpperCase();
        for (var idx in stock_book){
            if (stock_book[idx].symbol == symbol){
                stock_book[idx].amount = amount;
                return;
            }
        }
        stock_book.push({'symbol': symbol, 'amount': amount});
    };

    $scope.removeStock = function(stock_book, stock){
        var index = stock_book.indexOf(stock);
        if (index != -1){
            stock_book.splice(index, 1);
        }
    };


    $scope.new_rate_str = "";
    $scope.add_rate = function(rates, str){
        function validate(rate_number){
            if (!rate_number){
                alert('Rate is empty');
                return false;
            }
            if (0 > rate_number || rate_number > 1){
                alert('Rate must be between 0 and 1');
                return false;
            }
            return true;
        }

        var rate = str.split(' ');
        var rate_number = parseFloat(rate[1]);
        if (!validate(rate_number)){
            return;
        }
        var updated_symbol = rate[0].toUpperCase();
        for (var idx in rates){
            if (rates[idx].symbol == updated_symbol){
                rates[idx].rate = rate_number;
                return;
            }
        }
        rates.push({'symbol': updated_symbol, 'rate': rate_number});
    }

    $scope.remove_rate = function(rates, rate){
        var index = rates.indexOf(rate);
        if (index != -1){
            rates.splice(index, 1);
        }
    }

    function get_loan_names(){
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
            {'name': 'MR', 'amount': ['--', '--', '--']},
            {'name': 'DF', 'amount': ['--', '--', '--']},
            {'name': 'GOD', 'amount': ['--', '--', '--']},
        ],
        'totals': ['--', '--', '--'],
    }

    function symbol_is_entered(symbol){
        return symbol != '';
    }

    function update_pp_result(data){
        var loan_names = get_loan_names();
        // usin $apply to force refresh, other-wise list will not be fresh immediately
        $scope.$apply(function(){
            $scope.result.headers = result_header(data['allocation'], loan_names);
            $scope.result.allocations = result_allocation(data['allocation'], loan_names);
            $scope.result.pp = data['pp'];
            $scope.result.totals = result_total($scope.result.allocations);
        });
    }

    $scope.undefined = function(){
        alert('This function is not implemented yet');
    }

    $scope.vnds_cal_max_pp = function(){
        if(!symbol_is_entered($scope.symbol)){
            alert('Symbol can not be empty!');
            return;
        }

        $scope.symbol = $scope.symbol.toUpperCase();

        // adapting loan_catalog
        var loan_catalog = {}
        var loan_info = {}
        var account_stock = {}
        angular.forEach($scope.loan_catalog, function(loan){
            var item = {}
            angular.forEach(loan.rates, function(rate){
                item[rate.symbol] = rate.rate;
            })
            loan_catalog[loan.name] = item;
            loan_info[loan.name] = loan.info;
        });
        angular.forEach($scope.account.stock, function(stock){
            account_stock[stock.symbol] = stock.amount;
        });

        var data = {
            'account_info': JSON.stringify($scope.account.info),
            'account_stock': JSON.stringify(account_stock),
            'loan_catalog': JSON.stringify(loan_catalog),
            'loan_info': JSON.stringify(loan_info),
            'symbol': $scope.symbol,
        };
        console.log('requesting max vnds purchasing power with', data);
        return $.ajax({
            type: 'get',
            url: VNDS_PP_URL,
            data: data,
            dataType: 'json',
        })
        .done(update_pp_result)
    }

// enable tooltip for angularjs rendered elements
    $(function () { $("[data-toggle='tooltip']").tooltip(); });
}]);

