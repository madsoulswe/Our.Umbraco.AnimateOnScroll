(function () {
    "use strict";
	function AnimateOnScrollEditorController($q, $scope, assetsService, $timeout) {

        
		var vm = this;

		vm.edit = false;

		vm.animations = [
			"",
			"fade",
			"fade-up",
			"fade-down",
			"fade-left",
			"fade-right",
			"fade-up-right",
			"fade-up-left",
			"fade-down-right",
			"fade-down-left",
			"flip-up",
			"flip-down",
			"flip-left",
			"flip-right",
			"slide-up",
			"slide-down",
			"slide-left",
			"slide-right",
			"zoom-in",
			"zoom-in-up",
			"zoom-in-down",
			"zoom-in-left",
			"zoom-in-right",
			"zoom-out",
			"zoom-out-up",
			"zoom-out-down",
			"zoom-out-left",
			"zoom-out-right"
		];

		vm.easings = [
			"",
			"linear",
			"ease",
			"ease-in",
			"ease-out",
			"ease-in-out",
			"ease-in-back",
			"ease-out-back",
			"ease-in-out-back",
			"ease-in-sine",
			"ease-out-sine",
			"ease-in-out-sine",
			"ease-in-quad",
			"ease-out-quad",
			"ease-in-out-quad",
			"ease-in-cubic",
			"ease-out-cubic",
			"ease-in-out-cubic",
			"ease-in-quart",
			"ease-out-quart",
			"ease-in-out-quart"
		];

		vm.anchors = [
			"",
			"top-bottom",
			"top-center",
			"top-top",
			"center-bottom",
			"center-center",
			"center-top",
			"bottom-bottom",
			"bottom-center",
			"bottom-top"
		];

		var unsubscribe;
		function subscribe() {
			unsubscribe = $scope.$on('formSubmitting', function (ev, args) {
				vm.edit = false;
			});
		}


		vm.add = function () {
			$scope.model.value = {
				"animation": "fade",
				"duration": 100
			}

			vm.edit = true;
		}

		vm.remove = function () {
			delete $scope.model.value;

			vm.edit = false;
		}

		vm.init = function () {
			vm.loadAssets().then(function () {
				$scope.$on('$destroy', function () {
					if (unsubscribe) {
						unsubscribe();
					}
				});
			});
		}

		vm.animate = false;
		vm.animating = false;

		var testTimeout;
		vm.testAnimation = function () {

			if (vm.canAnimate() && !vm.animating) {
				vm.animate = true;

				$timeout(function () {
					vm.animating = true;

					$timeout(function () {
						vm.animating = false;
						vm.animate = false;
					}, parseInt($scope.model.value.duration, 10));

				}, parseInt($scope.model.value.duration, 10));

			}

		}

		vm.canAnimate = function () {
			return $scope.model.value.animation && $scope.model.value.animation != '' && $scope.model.value.duration && $scope.model.value.duration != '' && parseInt($scope.model.value.duration, 10) > 0;
		}

		vm.loadAssets = function () {
			var deferred = $q.defer();

			if (!window["AOS"]) {

				assetsService.load([
					Umbraco.Sys.ServerVariables["umbracoSettings"]["appPluginsPath"] + '/Our.Umbraco.AnimateOnScroll/Vendor/aos/aos-2.3.4.css'], $scope)
					.then(function () {
						deferred.resolve();
					});

			} else {
				deferred.resolve();
			}

			return deferred.promise;
		}

		vm.init();
    }

    angular.module("umbraco").controller("AnimateOnScroll.EditorController", AnimateOnScrollEditorController);
})();