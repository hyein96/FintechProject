/* designSample.ejs와 test.ejs 등 이전 실습의 expressServer의 라우터틀 */

app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
  app.get('/ejsTest', function(req,res) {
      //test 파일이 어디있는지 위에 view engine 쪽에서 해줬으므로 따로 코드 필요없음
      //render 사용만 해주기
      res.render("test");
  });
  
  //디자인 ejs 
  app.get('/designTest', function(req,res) {
      res.render("designSample.ejs");
  });
  
  //ajax 요청 받아오는 부분(post방식)
  app.post("/ajaxTest", function(req,res) {
      console.log("요청 바디 :", req.body);
      console.log("사용자 아이디는 :", req.body.sendUserId);
      console.log("사용자 password :", req.body.sendUserPassword);
      console.log("사용자 번호 :", req.body.sendUserNumber);
      res.json("로그인에 성공하셨습니다.");
  });
  
  //라우터 추가 기능 
  app.get('/addRouter', function(req,res) {
      console.log("router working");
      //res.send 에 웹에 보내는 값(메세지) 입력하면 됨 
      res.send('<html>안녕하세요 html코드 입니다</html') ;
  });
  