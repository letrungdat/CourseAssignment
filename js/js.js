var app = angular.module('myApp', []);
app.service('myService', function () {
    var data = [{
        id: 1,
        name: 'Asus',
        year: '2012',
        price: '10$',
        producer: 'dLe',
        available: true
            }, {
        id: 2,
        name: 'Dell',
        year: '2011',
        price: '11$',
        producer: 'fLe',
        available: false
            }, {
        id: 3,
        name: 'Lenovo',
        year: '2011',
        price: '13$',
        producer: 'dge',
        available: true
            }, {
        id: 4,
        name: 'Vaio',
        year: '2012',
        price: '10$',
        producer: 'dLg',
        available: false
            }, {
        id: 5,
        name: 'Samsung',
        year: '2010',
        price: '11$',
        producer: 'dasd',
        available: true
            }];
    this.pList = data;
    this.addNew = function (pname, pyear, pprice, pproducer) {
        var newId = 1;
        if (data.length > 0) {
            newId = data[data.length - 1].id + 1;
        }
        data.push({
            id: newId,
            name: pname,
            year: pyear,
            price: pprice,
            producer: pproducer,
            available: true
        });
    };
    this.removeProduct = function (pid) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === pid) {
                data.splice(i, 1);
            }
        }
    }
});

app.controller('myController', ['$scope', 'myService', function (scope, mService) {
    scope.productList = mService.pList;
    scope.menuClick = function () {
        $('#container').toggleClass('open');
    };

       }]);