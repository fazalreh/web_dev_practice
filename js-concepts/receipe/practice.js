// The expected outcome is that all the dishes' names and prices will be shown in the console output.

// The text below shows the output that your code should produce:

// Prices with 20% tax:
// Dish: Italian pasta Price: $ 11.46
// Dish: Rice with veggies Price: $ 10.38
// Dish: Chicken with potatoes Price: $ 18.66
// Dish: Vegetarian Pizza Price: $ 7.74

// Prices without tax:
// Dish: Italian pasta Price (excl.tax): $ 9.55
// Dish: Rice with veggies Price (excl.tax): $ 8.65
// Dish: Chicken with potatoes Price (excl.tax): $ 15.55
// Dish: Vegetarian Pizza Price (excl.tax): $ 6.45

// The following data is provided for you to work with:


const dishData = [
    { name: 'Italian pasta', price: 9.55 },
    { name: 'Rice with veggies', price: 8.65 },
    { name: 'Chicken with potatoes', price: 15.55 },
    { name: 'Vegetarian Pizza', price: 6.45 }
]

function calculatePriceWithTax(dish, condition=true) 
{
 if(condition)
 {
    console.log('Prices with 20% tax:');
 }
 if(!condition)
 {
    console.log('Prices without tax:')
 }
 let size=dish.length;
 for(let i=0; i<size;i++)
 {
    let price=dish[i].price;
    if(condition)
    {
        price=1.20*price;
    }
    console.log(` Dish: ${dish[i].name} Price: $ ${price}`);
 }
}
calculatePriceWithTax(dishData,true);