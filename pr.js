//  const a = 10;
// console.log(a)
// const b = a;
// console.log(b)
// a= 30
// console.log(a)

// const nums = [1, 2, 3, 4, 5];
// const [first, second, ...rest] = nums;
// console.log(first);  // 1
// console.log(second); // 2
// console.log(rest);   // [3, 4, 5]

// const person = {
//   name: 'John',
//   age: 30,
//   city: 'New York'
// };
// const { name, age, ...otherDetails } = person;
// console.log(name);         // John
// console.log(age);          // 30
// console.log(otherDetails); // { city: 'New York' }

// const nums = [1, 2, 3, 4, 5];
// const ddouble = nums.map(num => num *2)
// console.log(ddouble); // [2, 4, 6, 8, 10]

//  [2, 4, 6, 8, 10].forEach(num => {
//   console.log(num);
// });
// console.log([2,4, 6, 8, 9, 10].filter(num => num % 3 === 0))

const sum = [1, 2, 3, 4, 5].reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);
console.log(sum); // 15

// Function to find the maximum value in an array
function getMax(arr) {
  return Math.max(...arr);
}
console.log(getMax([1, 5, 3, 9, 2])); // 9

// Function to reverse an array
function reverseArray(arr) {
  return arr.slice().reverse();
}
console.log(reverseArray([1, 2, 3])); // [3, 2, 1]

// Function to remove duplicates from an array
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
console.log(removeDuplicates([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]

// Function to sum all even numbers in an array
function sumEven(arr) {
  return arr.filter((num) => num % 2 === 0).reduce((a, b) => a + b, 0);
}
console.log(sumEven([1, 2, 3, 4, 5, 6])); // 12



// ditto policybazar

// hpa 1c 6.5



// accdident insurance policy drinking and driving



