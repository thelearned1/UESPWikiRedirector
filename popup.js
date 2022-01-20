(function () {
	'use strict';
	let storage = (typeof chrome === "undefined") ? browser.storage : chrome.storage;
	let stateImage = document.getElementById("addonStateImage");

	if (stateImage === null) {
		console.error("Something went wrong!");
		return;
	}
	function toggle() {
		storage.local.set({ isDisabled: !currentState });
		update();
	}
	stateImage.addEventListener("click", toggle)
	let stateDesc = document.getElementById("addonStateDescriptor");
	if (stateDesc === null) {
		console.error("Something went wrong!");
		return;
	}

	window.update = function () {

		storage.local.get(['isDisabled'], function (result) {
			if (result === undefined) {
				result = { isDisabled: false};
			}
			window.currentState = result.isDisabled === true;
			stateImage.className = result.isDisabled ? "disabled" : "enabled";
			stateDesc.innerHTML = result.isDisabled ? "disabled" : "enabled";
			stateDesc.className = result.isDisabled ? "disabled" : "enabled";
		});
	}
	update();
})();