(function() {
  const storage = window.storage || chrome.storage;

  // Check if hiding wikia results is enabled.
  storage.local.get(['hideWikia'], (result) => {
    if (result && result.hideWikia) {
      // If hiding wikia results is enabled, grab all the links going to the old fandom and wikia sites
      const wikiaLinks = document.querySelectorAll('[href*="elderscrolls.fandom"], [href*="elderscrolls.wikia"], [href*="skyrim.fandom"], [href*="skyrim.wikia"]');

      // recursively go up through tree until getting relevant div to remove
      function getParent(element, maxDepth = 10) {
        if (element.parentElement) {
          if (element.className === 'g') {
            // Add an element in place of the removed search result signifying a result was removed.
            var removedElement = document.createElement("span");
            removedElement.classList.add("st");
            removedElement.innerHTML="Elder Scrolls Wikia search result removed by UESP Wiki Redirector."
            removedElement.style.paddingBottom="1em";
            removedElement.style.display="inline-block";
            element.parentElement.appendChild(removedElement);
            //remove the element.
            element.remove();
          } else {
            // Keep going up the elements until the necessary element is found.
            getParent(element.parentElement, maxDepth - 1);
          }
        }
      }

      // Go through and process each wikia link, removing their result from the search results
      wikiaLinks.forEach((e) => getParent(e));
    }
  });
})();
