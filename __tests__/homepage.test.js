const fs = require('fs');
const getUespPage = require('../getUespPage');

const elderscrollsWiki = 'https://elderscrolls.fandom.com/wiki/'
const portalPages = JSON.parse(fs.readFileSync('./__tests__/testData/homepage-test-entries.json'));
const mainPages = JSON.parse(fs.readFileSync('./__tests__/testData/main-page-test-entries.json'));
describe('elderscrolls.fandom.com portal pages', () => {
	test.each(portalPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const urlChange = getUespPage(new URL(`${elderscrollsWiki}${fandomTitle.replace(/ /g, '_')}`));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})

describe('URLs that point to the main page of either wiki', () => {
	test.each(mainPages)(
		' $fandomUrl is redirected to UESP page $uespTitle',
		({ fandomUrl, uespTitle }) => {
			const urlChange = getUespPage(new URL(fandomUrl));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})
