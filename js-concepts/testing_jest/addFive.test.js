const addFive= require('./addFive');
test('adds 5 to the input number',()=>{
    expect(addFive(5)).toBe(10);
})