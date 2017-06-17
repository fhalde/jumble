'use strict';

chrome.browserAction.onClicked.addListener(function($) {
 		Promise.all([getWindows(), getTabs()]).then(juggle);
});

function getWindows() {
		return new Promise(function(resolve, reject) {
				chrome.windows.getAll(resolve);
		});
}

function getTabs() {
		return new Promise(function(resolve, reject) {
				chrome.tabs.query({}, resolve);
		});
}

function juggle(res) {
	let [windows, tabs] = res;
}
