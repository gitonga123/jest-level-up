/**Given a list of numbers and a number k, return whether any two numbers from the list add up to k.

For example, given [10, 15, 3, 7] and k of 17, return true since 10 + 7 is 17.**/

function addTwoNumbers( _arr, k) {
	if (_arr.length == 0) {
		return false;
	}

	let n_set = new Set();
	let found = false;

	_arr.map(item => {
		let diff = k - item
		if (n_set.has(diff)) {
			found = true;
		}

		n_set.add(diff);
	});
	console.log(n_set);
	return found;
}

console.log(addTwoNumbers([11,15,3,7], 17));

// module.exports = {addTwoNumbers}