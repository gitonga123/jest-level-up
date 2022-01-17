/**Given an array of integers, find the first missing positive integer in linear time and constant space. In other words, find the lowest positive integer that does not exist in the array. The array can contain duplicates and negative numbers as well.

For example, the input [3, 4, -1, 1] should give 2. The input [1, 2, 0] should give 3.

You can modify the input array in-place.**/


/**
 * In this problem, we have create a list full of 0’s with size of the max() value of our given array. Now, whenever we encounter any positive value in our original array, we change the index value of our list to 1. So, after we are done, we simply iterate through our modified list, the first 0 we encounter, its (index value + 1) should be our answer
 * 
 */

function missingPositiveInteger(A) {
	let n = A.length;
        // To mark the occurrence of elements
        let present = new Array(n+1);
        
        
        for(let i=0;i<n+1;i++)
        {
            present[i]=false;
        }
        // Mark the occurrences
        for (let i = 0; i < n; i++)
        {
            // Only mark the required elements
            // All non-positive elements and
            // the elements greater n + 1 will never
            // be the answer
            // For example, the array will be {1, 2, 3}
            // in the worst case and the result
            // will be 4 which is n + 1
            if (A[i] > 0 && A[i] <= n)
            {
                present[A[i]] = true;
            }
        }
        // Find the first element which didn't
        // appear in the original array

        for (let i = 1; i <= n; i++)
        {
            if (!present[i])
            {
                return i;
            }
        }
        // If the original array was of the
        // type {1, 2, 3} in its sorted form
        return n + 1;

}

console.log(missingPositiveInteger([0, 10, 2, -10, -20]));