var http = require("http");
console.log("server is starting");

http.createServer(function (req, res) { //서버가 요청을 받았을 때, 어떤 행동을 할지 밑에 작성(즉, response 정의)
    //console.log(req);
    var body = "hello Server";
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end("<html><h1>안녕하세요</h1></html>");
})
.listen(3000);

//서버 실행시킨거 취소시키려면 ctrl + c