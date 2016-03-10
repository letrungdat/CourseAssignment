describe('gulp-jasmine-browser', function () {
    var scope,
        controller,
        service;
    beforeEach(function () {
        module('myApp');
    });
    describe('MyController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('MyController', {
                '$scope': scope
            });
        }));
        it('sets the name', function () {
            expect(scope.teamName).toBe('Manchester United');
            expect(scope.pageIcon).toBe('image/team/manu-logo.png');
            expect(scope.leagueLogo).toBe('image/Premier_League_logo.svg');
            expect(scope.leagueName).toBe('Barclays Preimer League');
        });
    });
    describe('MyService', function () {
        it('should contain a searchService',
            inject(function (mainService) {
                expect(mainService.convertToArray({
                    'dat': 1,
                    'da': 2
                })).toBe([1, 2]);
            }));
        beforeEach(inject(function ($service) {
            service = $service('mainService');
        }));
        it('convert', function () {
            expect(service.convertToArray({
                'dat': 1,
                'da': 2
            })).toBe([1, 2]);
        });
    });
});