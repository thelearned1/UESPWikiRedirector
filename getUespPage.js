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
const MAIN_PAGE_REGEX = /^(https?)?:\/\/(elderscrolls|skyrim)\.(wikia|fandom)\.com(\/wiki\/(Skyrim_Wiki|The_Elder_Scrolls_Wiki|Main_Page))?/i;

function getUespPage (url) {

  // account for when the user navigates to elderscrolls.fandom.com directly
  const mainPage = url.href.match(MAIN_PAGE_REGEX);
  if (mainPage) {
    if (
        mainPage[2].toLowerCase() === "elderscrolls" && 
        mainPage[5]?.toLowerCase() !== "skyrim_wiki"
      ) 
    {
      return "Main+Page"
    } else {
      return "Skyrim:Skyrim"
    }
  }


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
  namespace = (namespace ? namespace + ':' : '');
  
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

  return namespace+uespPageName;
}

module.exports = getUespPage; 
