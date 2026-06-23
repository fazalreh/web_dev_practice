// Arrow functions are a shorter way to write functions

function addNormal(a, b) {
  return a + b;
}

const addArrow = (a, b) => a + b;

console.log(addNormal(2, 3)); // 5
console.log(addArrow(2, 3)); // 5

const numbers = [1, 2, 3];
const doubled = numbers.map((number) => number * 2);

console.log(doubled); // aisa ana chahia [2, 4, 6]
//let's see

