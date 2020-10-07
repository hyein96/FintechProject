var car = {
	name : "sonata",
	ph : "500ph",
	start : function () {
		console.log("engine is starting");
	},
	stop : function () {
		console.log("engine is stoped");
	}
};

// prototype, class, extends, super, constructor, javascript OOP 개념에 대한 강의 참조

var car2 = {
	name : "bmw",
	ph : "500ph",
	start : function () {
		console.log("engine is starting");
	},
	stop : function () {
		console.log("engine is stoped");
	}
};

var car3 = {
	name : "volvo",
	ph : "500ph",
	start : function () {
		console.log("engine is starting");
	},
	stop : function () {
		console.log("engine is stoped");
	}
};

var cars = [car,car2,car3];
//console.log(cars);
//console.log(cars[2].name);

/* cars.map((car) => { // es6 map 문법이용해서 for문 효과 
    console.log(car);
}); */

// #work : for,if 구문 활용하여 array 자동차 이름이 bmw 가 포함되어 있으면 find! 로그 출력
for(var i = 0 ; i < cars.length ; i++){
	if(cars[i].name == "bmw") {
		console.log("find!");
	}
	else { 
		console.log("can not found");
	}
}