// Task 1
// WRITE YOUR CODE HERE - Create the logDairy function and use a for...of loop to log each item in the dairy array
var dairy = ['cheese', 'sour cream', 'milk', 'yogurt', 'ice cream', 'milkshake'];
function  logDairy()
{
    for (var item of dairy)
    {
    console.log(item);
    }
    return;
}
logDairy();

// Task 2
// WRITE YOUR CODE HERE - Create the birdCan function and use a for...of loop to log bird object's own properties
const animal = {  
    canJump: true  
};  

const bird = Object.create(animal);  
bird.canFly = true;  
bird.hasFeathers = true;
function birdCan()
{
    for( const prop of Object.keys(bird))
    {
        console.log(`${prop}: ${bird[prop]}`);
    }
    return;
}
birdCan();

// Task 3
// WRITE YOUR CODE HERE - Create the animalCan function and use a for...in loop to log all bird properties, including inherited ones
function animalCan()
{
    for (let prop in bird)
    {
        console.log(`${prop}: ${bird[prop]}`);
    }
    return;
}
animalCan();