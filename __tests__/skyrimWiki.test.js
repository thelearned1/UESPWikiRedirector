const fs = require('fs');
const getUespPage = require('../getUespPage');

const skyrimWiki = 'https://skyrim.fandom.com/wiki/';
const skyrimPages = JSON.parse(fs.readFileSync('./__tests__/testData/skyrim-test-entries.json'));

describe('random skyrim.fandom.com pages', () => {
	test.each(skyrimPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const urlChange = getUespPage(new URL(`${skyrimWiki}${fandomTitle.replace(/ /g, '_')}`));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})
