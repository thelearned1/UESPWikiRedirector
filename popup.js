(function () {
	let storage = window.storage || chrome.storage;
	let stateImage = document.getElementById("enableExtension");

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
	let stateDesc = document.getElementById("enableExtension");
	if (stateDesc === null) {
		console.error("Something went wrong!");
		return;
	}

	window.update = function () {
		storage.local.get(['isDisabled' ], function (result) {
			if (result === undefined) {
				result = { isDisabled: false };
			}
			window.currentState = result.isDisabled === true;
			stateDesc.innerHTML = result.isDisabled ? "disabled" : "enabled";
			stateDesc.style.color = result.isDisabled ? "#7C1D1D" : "#217A3D";
			enableExtension.checked = result.isDisabled;
		});
	}
	update();
})();