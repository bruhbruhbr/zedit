let newTabViewController = function($scope, viewFactory) {
    let views = viewFactory.getAccessibleViews();
    $scope.viewNames = Object.keys(views);
    $scope.selectView = (viewName) => $scope.$emit('changeView', views[viewName]);
};

ngapp.run(function(controllerRegistry) {
    controllerRegistry.register('newTabViewController', newTabViewController);
});