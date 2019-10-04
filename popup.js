(function () {
	let storage = window.storage || chrome.storage;
	let stateImage = document.getElementById("addonStateImage");

	if (stateImage === null) {
		console.error("Something went wrong!");
		return;
	}
	function toggle() {
		let prom = storage.local.set({ isDisabled: !currentState });
		if (prom instanceof Promise) {
			prom.reject();
		}
		update();
	}
	stateImage.addEventListener("click", toggle)
	let stateDesc = document.getElementById("addonStateDescriptor");
	if (stateDesc === null) {
		console.error("Something went wrong!");
		return;
	}
/* Disabling for now as it would require access permission for Google pages and goes a bit beyond the scope of this extension
	const hideWikiaCheck = document.querySelector("#hideWikiaCheck")
	hideWikiaCheck.addEventListener("click", (e) => {
		storage.local.set({ hideWikia: e.target.checked });
	});
*/

	window.update = function () {

		/*****************************
		* Commented lines below are to disable hiding Wikia links. At least until I decide to permanently remove it or enable it.
		*****************************/
		//storage.local.get(['isDisabled', 'hideWikia'], function (result) {
		storage.local.get(['isDisabled'], function (result) {
			if (result === undefined) {
				//result = { isDisabled: false, hideWikia: true };
				result = { isDisabled: false};
			}
			window.currentState = result.isDisabled === true;
			stateImage.style.backgroundImage = "url('powerbutton_" + (result.isDisabled ? "off" : "on") + ".png')";
			stateDesc.innerHTML = result.isDisabled ? "disabled" : "enabled";
			stateDesc.style.color = result.isDisabled ? "#7C1D1D" : "#217A3D";
			//hideWikiaCheck.checked = result.hideWikia;
		});
	}
	update();
})();