(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // getUespPage.js
  var require_getUespPage = __commonJS({
    "getUespPage.js"(exports, module) {
      var SKYRIM_REGEX = /^skyrim\./i;
      var NAMESPACE_REGEX = /(.+?)\((Blades|Legends|Online|Skyrim|Dawnguard|Hearthfire|Dragonborn|Oblivion|Knights of the Nine|Morrowind|Tribunal|Bloodmoon|Daggerfall|Arena)\)(.*?)$/;
      var HOMEPAGE_REGEX = /^Portal:(The\+Elder\+Scrolls\+[IV]+:\+)?/;
      function getUespPage2(url) {
        let wikiaPageName = url.pathname.replace("/wiki/", "").replace(/_/g, "+");
        let namespace = "", uespPageName = "";
        let titleInfo = wikiaPageName.match(NAMESPACE_REGEX);
        if (titleInfo) {
          namespace = titleInfo[2];
        } else if (url.host.match(SKYRIM_REGEX)) {
          namespace = "Skyrim";
        } else {
          const homepageMatch = wikiaPageName.match(HOMEPAGE_REGEX);
          if (homepageMatch) {
            namespace = wikiaPageName.replace(HOMEPAGE_REGEX, "");
            uespPageName = namespace;
          }
        }
        namespace = namespace ? namespace + ":" : "";
        if (!uespPageName) {
          if (titleInfo) {
            uespPageName = titleInfo[1].replace(/(^\+*)|(\+*$)/g, "") + titleInfo[3].replace(/(\+*$)/g, "");
          } else {
            uespPageName = wikiaPageName;
          }
        }
        return namespace + uespPageName;
      }
      module.exports = getUespPage2;
    }
  });

  // background-module.js
  var getUespPage = require_getUespPage();
  (function() {
    "use strict";
    let isPluginDisabled = false;
    let storage = typeof chrome.storage === "undefined" ? browser.storage : chrome.storage;
    const WIKIA_REGEX = /^(elderscrolls|skyrim)\.(wikia|fandom)\.com$/i;
    chrome.webNavigation.onBeforeNavigate.addListener(
      function(info) {
        if (isPluginDisabled) {
          console.log("Elder Scrolls Wikia intercepted, ignoring because plugin is disabled.");
          return;
        }
        const url = new URL(info.url);
        const isWikia = WIKIA_REGEX.test(url.host);
        if (!isWikia)
          return;
        const urlChange = getUespPage(url);
        const host = "en.uesp.net/?search=";
        const redirectUrl = `https://${host}${urlChange}`;
        console.log(`Elder Scrolls Wikia intercepted:  ${info.url}
Redirecting to ${redirectUrl}`);
        chrome.tabs.update(info.tabId, { url: redirectUrl });
      }
    );
    function updateIcon() {
      if (typeof chrome.action === "undefined") {
        chrome.browserAction.setIcon({ path: isPluginDisabled ? "icon32_black.png" : "icon32.png" });
      } else {
        chrome.action.setIcon({ path: isPluginDisabled ? "icon32_black.png" : "icon32.png" });
      }
    }
    storage.local.get(["isDisabled"], (result) => {
      isPluginDisabled = result ? result.isDisabled : false;
      updateIcon();
    });
    storage.onChanged.addListener(
      function(changes, areaName) {
        if (changes["isDisabled"] !== void 0 && changes["isDisabled"].newValue != changes["isDisabled"].oldValue) {
          console.log(`UESP Redirector is now ${changes["isDisabled"].newValue ? "disabled" : "enabled"}`);
          isPluginDisabled = changes["isDisabled"].newValue;
          updateIcon();
        }
      }
    );
  })();
})();
