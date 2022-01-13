const {productExceptI} = require('../day-2');

describe("Product of Array expect at index i", () => {
	test("Should return false if array is empty", () => {
		expect(productExceptI([])).toBeFalsy();
	});

	test("Should return multiplied number", () => {
		expect(productExceptI([1, 2, 3])).toEqual(expect.arrayContaining([6, 3, 2]));
	});

	test("Should return multiplied number", () => {
		expect(productExceptI([10, 3, 5, 6, 2])).toEqual(expect.arrayContaining([180, 600, 360, 300, 900]));
	});
});
