/** Given an array of integers, return a new array such that each element at index i of the new array is the product of all the numbers in the original array except the one at i.
For example, if our input was [1, 2, 3, 4, 5], the expected output would be [120, 60, 40, 30, 24]. If our input was [3, 2, 1], the expected output would be [2, 3, 6] **/

// 1,2,3,4,5 ->  [120, 60, 40, 30, 24]
// [3, 2, 1] -> [2, 3, 6]

function productExceptI (_arr) {
	let n = _arr.length, i, j;
	if (n <= 1) {
		return false;
	}

	let left = new Array(n);
	let right = new Array(n);
	let prod = new Array(n);
	left[0] = 1;
	right[n-1] = 1;
	for (i = 1; i < n; i++) {
		left[i] = _arr[i - 1] * left[i - 1];
	}

	for (j = n - 2; j >= 0; j--) {
		right[j] = _arr[j+1] * right[j + 1];
	}

	for (i = 0; i < n; i++) {
		prod[i] = left[i] * right[i];
	}
	
	return prod;
}

// solution 2

function productArray (_arr) {
	let n = _arr.length;
	if (n <= 1) {
		return false;
	}

	let temp = 1;
	let prod = new Array(n).fill(1);
	for (let i = 0; i < n; i++) {
		prod[i] = temp;
		temp *= _arr[i];
	}
	
	temp = 1;
	for (let i = n - 1; i >= 0; i--) {
		prod[i] *= temp;
		temp *= _arr[i]; 
	}

	return prod;
}

module.exports={productExceptI: productArray};
