// Used to match what game is in the title. This will be used to redirect to the appropriate page. For example, on Wikia it might be Diseases (Skyrim) while on UESP it has to be formated to Skyrim:Diseases
const GAMES_REGEX = /\(Blades\)|\(Legends\)|\(Online\)|\(Skyrim\)|\(Dawnguard\)|\(Hearthfire\)|\(Dragonborn\)|\(Oblivion\)|\(Knights of the Nine\)|\(Morrowind\)|\(Tribunal\)|\(Bloodmoon\)|\(Daggerfall\)|\(Arena\)/

function getUespPage (url) {
  var urlChange = url.pathname.replace('/wiki/', '').replace(/_/g, '+');  // Change URL from underscores to plus symbols so that it can search the wiki. Also removes /wiki/ from the URL.
  var game = url.pathname.match(GAMES_REGEX); // Find if Skyrim
  if (game) { // Check if game exists (is not null)
    game = String(game); // Cast to a string so we can manipulate it
    urlChange = game.replace(/[()]/g,'') + ':' + urlChange.replace(game, ''); // Remove the parathensis, add : and then the game. This will format as e.g. Oblivion:Spells
  } 
  return urlChange;
}

module.exports = getUespPage;