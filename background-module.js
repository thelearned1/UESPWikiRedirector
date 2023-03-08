const getUespPage = require ('./getUespPage.js');

// Simple extension to redirect all requests to Elder Scrolls Wikia/Fandom to the Unofficial Elder Scrolls Pages
(function(){
  'use strict';
  let isPluginDisabled = false; // Variable storing whether or not the plugin is disabled.
  let storage = (typeof chrome.storage === "undefined") ? browser.storage : chrome.storage; // Check to see if using Chrome or Firefox

  const WIKIA_REGEX = /^(elderscrolls|skyrim)\.(wikia|fandom)\.com$/i; // Used to match the domain of the old wikia/fandom to make sure we are redirecting the correct domain.

  // Listen to before anytime the browser attempts to navigate to the old Wikia/Fandom sites.
  chrome.webNavigation.onBeforeNavigate.addListener(
    function(info) {

      if(isPluginDisabled) { // Ignore all navigation requests when the extension is disabled.
        console.log("Elder Scrolls Wikia intercepted, ignoring because plugin is disabled.");
        return;
      }
      // Create a native URL object to more easily determine the path of the url and the domain.
      const url = new URL(info.url);

      const isWikia = WIKIA_REGEX.test(url.host); // Check whether the request is occuring on either the fandom/wikia domain.
      // If domain isn't a subdomain of wikia.com, ignore, also if it's not in the redirect filter
      if (!isWikia) return;      


      const urlChange = getUespPage(url);

      // Generate new url
      const host = 'en.uesp.net/?search=';
      const redirectUrl = `https://${host}${urlChange}`; // Create the redirect URL
      console.log(`Elder Scrolls Wikia intercepted:  ${info.url}\nRedirecting to ${redirectUrl}`); 
      // Redirect the old wikia request to the UESP wiki
      chrome.tabs.update(info.tabId,{url:redirectUrl});
    });

  function updateIcon(){
    // Change the icon to match the state of the plugin.
    if(typeof chrome.action === "undefined")
    {
      chrome.browserAction.setIcon({ path: isPluginDisabled?"icon32_black.png":"icon32.png"  }); // This is what manifest v2 (Firefox, Safari) uses
    }
    else
    {
      chrome.action.setIcon({ path: isPluginDisabled?"icon32_black.png":"icon32.png"  }); // This is what manifest v3 (Chrome, Edge, Opera) uses
    }

  }

  storage.local.get(['isDisabled'],(result)=>{
      // Get the initial condition of whether or not the extension is disabled
      isPluginDisabled= result ? result.isDisabled : false;
      updateIcon(); // Update icon to match new state
  });

  // Anytime the state of the plugin changes, update the internal state of the background script.
  storage.onChanged.addListener(
      function(changes, areaName) {
        // If isDisabled changed, update isPluginDisabled
        if(changes["isDisabled"]!==undefined && changes["isDisabled"].newValue!=changes["isDisabled"].oldValue) {
          console.log(`UESP Redirector is now ${changes["isDisabled"].newValue?'disabled':'enabled'}`);
          isPluginDisabled=changes["isDisabled"].newValue;
          updateIcon();
        }
      }
    );
})();


// try {
//   module.exports = getUespPage;
// } catch (e) {
//   console.warn(
//     `Tried to export function getUespPage, but got an error. `+
//     `Don't worry --- this is just to support testing and is `+
//     `expected behavior.`
//   );
// }