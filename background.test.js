import getUespPage from "./background";
import * as fs from 'fs';

const elderscrollsPages = JSON.parse(fs.readFileSync('./tests/elderscrolls-test-entries.json'));
const skyrimPages = JSON.parse(fs.readFileSync('./tests/skyrim-test-entries.json'));
const portalPages = JSON.parse(fs.readFileSync('./tests/homepage-test-entries.json'));
const skyrimWiki = 'https://skyrim.fandom.com/wiki/';
const elderscrollsWiki = 'https://elderscrolls.fandom.com/wiki/'

describe('elderscrolls fandom page', () => {
	test.each(elderscrollsPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const [namespace, pageName] = getUespPage(URL(`${elderscrollsWiki}${fandomTitle.replace(' ', '_')}`));
			const output = `${namespace}${pageName}`.replace('+', ' ');
			expect(output).toBe(uespTitle);
		}
	)
})

describe('skyrim fandom page', () => {
	test.each(skyrimPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const [namespace, pageName] = getUespPage(URL(`${skyrimWiki}${fandomTitle.replace(' ', '_')}`));
			const output = `${namespace}${pageName}`.replace('+', ' ');
			expect(output).toBe(uespTitle);
		}
	)
})

describe('elderscrolls portal page', () => {
	test.each(portalPages)(
		' $fandomTitle is redirected to $uespTitle', 
		({id, fandomTitle, uespTitle}) => {
			const [namespace, pageName] = getUespPage(URL(`${skyrimWiki}${fandomTitle.replace(' ', '_')}`));
			const output = `${namespace}${pageName}`.replace('+', ' ');
			expect(output).toBe(uespTitle);
		}
	)
})
