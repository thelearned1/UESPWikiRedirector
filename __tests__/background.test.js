const getUespPage = require('../getUespPage.js'); 
const fs = require('fs');

const elderscrollsPages = JSON.parse(fs.readFileSync('./__tests__/elderscrolls-test-entries.json'));
const skyrimPages = JSON.parse(fs.readFileSync('./__tests__/skyrim-test-entries.json'));
const portalPages = JSON.parse(fs.readFileSync('./__tests__/homepage-test-entries.json'));
const skyrimWiki = 'https://skyrim.fandom.com/wiki/';
const elderscrollsWiki = 'https://elderscrolls.fandom.com/wiki/'

describe('elderscrolls fandom page', () => {
	test.each(elderscrollsPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const urlChange = getUespPage(new URL(`${elderscrollsWiki}${fandomTitle.replace(/ /g, '_')}`));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})

describe('skyrim fandom page', () => {
	test.each(skyrimPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const urlChange = getUespPage(new URL(`${skyrimWiki}${fandomTitle.replace(/ /g, '_')}`));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})

describe('elderscrolls portal page', () => {
	test.each(portalPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const urlChange = getUespPage(new URL(`${elderscrollsWiki}${fandomTitle.replace(/ /g, '_')}`));
			const output = urlChange.replace(/\+/g, ' ');
			expect(output).toBe(uespTitle);
		}
	)
})
