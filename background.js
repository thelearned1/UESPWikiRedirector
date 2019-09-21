// Simple extension to redirect all requests to Elder Scrolls Wikia/Fandom to the Unofficial Elder Scrolls Pages
(function(){
  'use strict';
  let isPluginDisabled = false; // Variable storing whether or not the plugin is disabled.
  let storage = window.storage || chrome.storage; // Make sure we have a storage API.

  const WIKIA_REGEX = /^(elderscrolls)\.(wikia|fandom)\.com$/i; // Used to match the domain of the old wikia/fandom to make sure we are redirecting the correct domain.
  // Used to match what game is in the title. This will be used to redirect to the appropriate page. For example, on Wikia it might be Diseases (Skyrim) while on UESP it has to be formated to Skyrim:Diseases
  const GAMES_REGEX = /\(Blades\)|\(Legends\)|\(Online\)|\(Skyrim\)|\(Dawnguard\)|\(Hearthfire\)|\(Dragonborn\)|\(Oblivion\)|\(Knights of the Nine\)|\(Morrowind\)|\(Tribunal\)|\(Bloodmoon\)|\(Daggerfall\)|\(Arena\)/
  // Listen to before anytime the browser attempts to navigate to the old Wikia/Fandom sites.
  chrome.webNavigation.onBeforeNavigate.addListener(
    function(info) {
      if(isPluginDisabled) { // Ignore all navigation requests when the extension is disabled.
        console.log("Elder Scrolls Wikia intercepted, ignoring because plugin is disabled.");
        return;
      }

      // Create a native URL object to more easily determine the path of the url and the domain.
      const url = new URL(info.url);

      const isWikia = WIKIA_REGEX.test(url.host); // Check to ensure the redirect is occurring on either the fandom/wikia domain.
      // If domain isn't subdomain of wikia.com, ignore, also if it's not in the redirect filter
      if (!isWikia) return;

      var urlChange = url.pathname.replace('/wiki/', '').replace(/_/g, '+');  // Change URL from underscores to plus symbols so that it can search the wiki. Also removes /wiki/ from the URL.
      var game = url.pathname.match(GAMES_REGEX); // Find if  skyrim
      if (game) { // Check if game exists (is not null)
        game = String(game); // Cast to a string so we can manipulate it
        urlChange = game.replace(/[()]/g,'') + ':' + urlChange.replace(game, ''); // Remove the parathensis, add : and then the game. This will format as i.e. Oblivion:Spells
      }
      

      // Generate new url
      const host = 'uesp.net/?search=';
      const redirectUrl = `https://${host}${urlChange}`; // Create the redirect URL
      console.log(`Elder Scrolls Wikia intercepted:  ${info.url}\nRedirecting to ${redirectUrl}`); 
      // Redirect the old wikia request to new wiki
      chrome.tabs.update(info.tabId,{url:redirectUrl});
    });

  function updateIcon(){
    // Change the icon to match the state of the plugin.
    chrome.browserAction.setIcon({ path: isPluginDisabled?"icon32_black.png":"icon32.png"  });
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
