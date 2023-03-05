//SED:TEST START
const SKYRIM_REGEX = /^skyrim\./i // used to determine whether on the Skyrim wiki

/*
 NAMESPACE_REGEX determines which game is in the page title. This will 
 be used to  redirect to the appropriate UESP page. For example, on 
 Wikia it might be  Diseases (Skyrim) while on UESP it has to be 
 formated to  Skyrim:Diseases.  This version of the expression has 
 been modified to take advantage of capture groups. 
 */
const NAMESPACE_REGEX = /(.+?)\((Blades|Legends|Online|Skyrim|Dawnguard|Hearthfire|Dragonborn|Oblivion|Knights of the Nine|Morrowind|Tribunal|Bloodmoon|Daggerfall|Arena)\)(.*?)$/
// Used to account for edge case where user is navigating to the Wikia/Fandom homepage for a given game
const HOMEPAGE_REGEX = /^Portal:(The\+Elder\+Scrolls\+[IV]+:\+)?/;

function getUespPage (url) {
  let wikiaPageName = url.pathname.replace('/wiki/', '').replace(/_/g, '+');  // Change URL from underscores to plus symbols so that it can search the wiki. Also removes /wiki/ from the URL.

  // # Determine title of the UESP page
  let namespace = '', uespPageName = '';

  // ## Determine `namespace`
  let titleInfo = wikiaPageName.match(NAMESPACE_REGEX);

  if (titleInfo) { 
    namespace = titleInfo[2];
  } else if (url.host.match(SKYRIM_REGEX)) { // skyrim wiki should be in 'Skyrim:' namespace
    namespace = 'Skyrim'
  } else { // if ES wiki and titled "Portal:[X]", UESP page is probably titled "[X]:[X]"
    const homepageMatch = wikiaPageName.match(HOMEPAGE_REGEX);
    if (homepageMatch) {
      namespace = wikiaPageName.replace(HOMEPAGE_REGEX, '');
      uespPageName = namespace;
    }
  }
  
  // ## Determine `uespPageName` if not already found
  if (!uespPageName) {
    if (titleInfo) {
      uespPageName = 
        titleInfo[1].replace(/(^\+*)|(\+*$)/g, '') +
        titleInfo[3].replace(/(\+*$)/g, '');
    } else {
      uespPageName = wikiaPageName;
    }
  }

  return [namespace+(namespace ? ':' : ''), uespPageName];
}
//SED:TEST END

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


      const [namespace, uespPageName] = getUespPage(url);

      // Generate new url
      const host = 'en.uesp.net/?search=';
      const redirectUrl = `https://${host}${namespace}${uespPageName}`; // Create the redirect URL
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