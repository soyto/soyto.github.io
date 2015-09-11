(function(ng){
	'use strict';

	ng.module('mainApp').service('consoleService',[
		'$window', '$q', 'helperService', 'storedDataService', consoleService
	]);


	function consoleService($window, $q, helperService, storedDataService) {

		var $this = this;
		$window.soyto = $this;


		//Expose $q
		$this.$q = $q;

		//Expose getLastFromServerFn
		$this.getLastFromServer = storedDataService.getLastFromServer;

		//Expose getCharacterInfo Fn
		$this.getCharacterInfo = storedDataService.getCharacterInfo;

	}
})(angular);