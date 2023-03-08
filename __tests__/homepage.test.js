const portalPages = JSON.parse(fs.readFileSync('./__tests__/testData/homepage-test-entries.json'));
const homePages = JSON.parse(fs.readFileSync('./__tests__/testData/homepage-test-entries.json'));
describe('URLs that point to the main page of either wiki', () => {
	test.each(homePages)(
		' $fandomUrl is redirected to UESP page $uespTitle',
		({ fandomUrl, uespTitle }) => {
			const url = getUespPage(new URL(fandomUrl));
			const output = urlChange.replace(/\+/g, ' ').trim();
			expect(output).toBe(uespTitle);
		}
	)
})
