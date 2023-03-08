const fs = require('fs');
const getUespPage = require('../getUespPage');

const elderscrollsWiki = 'https://elderscrolls.fandom.com/wiki/'
const elderscrollsPages = JSON.parse(fs.readFileSync('./__tests__/testData/elderscrolls-test-entries.json'));

describe('random elderscrolls.fandom.com pages', () => {
	test.each(elderscrollsPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const urlChange = getUespPage(new URL(`${elderscrollsWiki}${fandomTitle.replace(/ /g, '_')}`));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})
