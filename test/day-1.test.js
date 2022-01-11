const addTwoNumbers = require('../day-1');

describe("Find Two Numbers", () => {
	test("Should return false if array is empty", () => {
		expect(addTwoNumbers.addTwoNumbers([])).toBeFalsy();
	});

	test("Should return true if two numbers are found", () => {
		expect(addTwoNumbers.addTwoNumbers([10,15,3,7], 17)).toBeTruthy();
	});

	test("Should return false if two numbers are not found", () => {
		expect(addTwoNumbers.addTwoNumbers([11,15,3,7], 17)).toBeFalsy();
	});


});
