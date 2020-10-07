var cars = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
var text = "";
var i;
for (i = 0; i < cars.length; i++) {	
    text += cars[i];
    console.log(cars[i]);
}

/* for문 대신 es6 map 문법 이용해서 구현(똑같은 결과나오나 좀 더 간편)
cars.map((car) => {
    console.log(car);
});
*/

console.log(text);
