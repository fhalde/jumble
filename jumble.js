'use strict';

chrome.browserAction.onClicked.addListener(function($) {
    Promise.all([getWindows(), getTabs()]).then(jumble);
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

function jumble([windows, tabs]) {
    let windowTabCount = initializeWindowTabCount(windows);
    let tabGroup = groupBy(domain, tabs);

    let windowsToTabs = {};
    for (let domain in tabGroup) {
        let w = leastCount(windowTabCount);
        w['tabcount'] += tabGroup[domain].length;
        chrome.tabs.move([...tabGroup[domain].map(t => t.id)], toWindow(w));
    }
}

function toWindow(w) {
		return { "windowId": parseInt(w['id'], 10), index: -1 };
}

function initializeWindowTabCount(windows) {
    return windows.reduce((a, w) => {
        a[w.id] = {
            'tabcount': 0,
            'id': w.id
        }
        return a;
    }, {});
}

function domain(t) {
    return t.url.split('/')[2];
}

function groupBy(f, arr) {
    return arr.reduce((a, t) => {
        let key = f(t);
        (a[key] = a[key] || []).push(t);
        return a;
    }, {});
}

function leastCount(windowTabCount) {
    let min = 99999999999;
    let win = undefined;
    for (let w in windowTabCount) {
        if (windowTabCount[w]['tabcount'] < min) {
            min = windowTabCount[w]['tabcount'];
            win = windowTabCount[w];
        }
    }
    return win;
}
