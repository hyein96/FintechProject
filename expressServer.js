const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var mysql = require("mysql");
const jwt = require("jsonwebtoken");
const auth = require("./lib/auth");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jhi8524561",
  database: "fintech",
});

connection.connect(); //mysql연동

//views 디렉토리로 접근 후, view engine은 ejs로 
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//외부파일 허용(public폴더에 다운받은 디자인 파일 추가)
app.use(express.static(path.join(__dirname, "public")));

// /signup url 요청 들어오면 signup.ejs 띄워주는 라우터(밑에도 마찬가지)
app.get("/signup", function (req, res) {
  res.render("signup"); //signup.ejs 라고 써도 됨
});

app.get("/login", function (req, res) {
  res.render("login");
});

//미들웨어 auth.js 테스트코드(토큰 같이 보내줘야 함
app.get("/authTest", auth, function (req, res) {
  console.log(req.decoded);
  res.json("환영합니다 우리 고객님");
});

app.get("/main", function (req, res) {
  res.render("main");

  
});

app.get("/balance", function (req, res) {
  res.render("balance");
});

app.get("/qrcode", function (req, res) {
  res.render("qrcode");
})

app.get("/qrreader", function (req, res) {
  res.render("qrreader");
});


//------------------view / login-----------------

//사용자 인증받으면 인증코드가 /authResult 에 queryString으로 옴(GET방식으로)
//그 인증코드 받아서 accessToken 요청하는 코드(토큰발급 API)
app.get("/authResult", function (req, res) {
  var authCode = req.query.code;
  console.log("사용자 인증코드 : ", authCode);
  //option 형태 기억(API사용 할 때, 요청(request)메시지 표현하는 형태)
  var option = {
    method: "POST", //요청보낼 때, 인증코드는 보이지 않는게 좋으므로
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
    form: { //POST방식이므로
      code: authCode,
      client_id: "taUxGwaorwJvNZbQzg2OaDiEbTlUgJfp7lViLejG",
      client_secret: "1NP8DDVHJg4M1q5h3394Nl7AvIav45RWHvANn74s",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code",
    },
  };
  //request 모듈 이용해서 토큰발급요청
  request(option, function (error, response, body) {
    if (error) {
      console.error(error);
      throw error;
    } else {
      var accessRequestResult = JSON.parse(body);
      console.log(accessRequestResult);
      //accessRequestResult를 data에 넣어서 resultChild로 던져줌 
      res.render("resultChild", { data: accessRequestResult });
    }
  });
});

//signup(회원가입) 라우터(signup.ejs에서 POST방식으로 ajax 요청 옴)
app.post("/signup", function (req, res) {
  console.log(req.body);
  var userName = req.body.userName;
  var userPassword = req.body.userPassword;
  var userEmail = req.body.userEmail;
  var userAccessToken = req.body.userAccessToken;
  var userRefreshToken = req.body.userRefreshToken;
  var userSeqNo = req.body.userSeqNo;

  var sql =
    //userId는 자동증가이므로 INSERT 안해도 됨
    "INSERT INTO user (`name`, `email`, `password`, `accesstoken`, `refreshtoken`, `userseqno`) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      userName,
      userEmail,
      userPassword,
      userAccessToken,
      userRefreshToken,
      userSeqNo,
    ],
    function (error, results) {
      if (error) throw error;
      else {
        res.json(1);
      }
    }
  );
});

//login(로그인) 라우터
app.post("/login", function (req, res) {
  console.log(req.body);
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  var sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [userEmail], function (error, results) {
    if (error) throw error;
    else {
      //results배열 길이가 0이면 DB에 해당 userEmail을 가진 정보가 없음(즉, 회원가입 안된 email)
      if (results.length == 0) {
        res.json("등록되지 않은 회원입니다.");
      } else {
        var dbPassword = results[0].password;
        console.log("db 에서 가져온 패스워드", dbPassword);
        if (userPassword == dbPassword) {
          //로그인 성공 시, ourtoken 보냄
          //tokenKey는 token을 구분해주는 역할 
          var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
          jwt.sign(
            {
              userId: results[0].id,
              userEmail: results[0].email,
            },
            tokenKey,
            {
              expiresIn: "10d",
              issuer: "fintech.admin",
              subject: "user.login.info",
            },
            function (err, token) {
              console.log("로그인 성공", token);
              //res.json 값을 login.ejs의 data 로 날림 
              //success: function(data) 함수에 ourtoken 값으로 보낸것
              res.json(token);
            }
          );
        } else {
          res.json("비밀번호가 다릅니다");
        }
      }
    }
  });
});

//계좌 목록 조회 요청만들어서 main으로 보냄(request 모듈 활용)
//사용자 정보 조회 API
app.post("/list", auth, function (req, res) {
  var userId = req.decoded.userId;
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userId], function (error, result) {
    if (error) {
      console.error(error);
      throw error;
    } else {
      //id값에 해당하는 사용자정보 콘솔에 띄움
      console.log(result[0]);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + result[0].accesstoken,
        },
        //form이 아닌 queryString(GET 방식이므로)
        qs: {
          user_seq_no: result[0].userseqno,
        },
      };
      request(option, function (error, response, body) {
        if (error) {
          console.error(error);
          throw error;
        } else {
          var resultJson = JSON.parse(body);
          console.log(resultJson);
          res.json(resultJson);
        }
      });
    }
  });
});

//잔액 조회 API
app.post("/balance", auth, function (req, res) {
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  console.log("받아온 데이터", userId, fin_use_num);
  var sql = "SELECT * FROM user WHERE id = ?";

  // 중복되는 거래 고유번호 오류 없애기 위해 bank_tran_id 랜덤값 생성 
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991642010U" + countnum;

  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log("밸런스 받아온 데이터베이스 값 : ", result);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + result[0].accesstoken,
        },
        qs: {
          bank_tran_id: transId,
          fintech_use_num: fin_use_num,
          tran_dtime: "20200714171331", //date함수 이용해서 변수로 만들어 줄 수있음
        },
      };
      request(option, function (error, response, body) {
        //body에 응답메시지 들어가서 출력됨 
        console.log(body);
        var balanceResult = JSON.parse(body);
        res.json(balanceResult);
      });
    }
  });
});

//거래내역 조회 API 
app.post("/transactionList", auth, function (req, res) {
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;

  var sql = "SELECT * FROM user WHERE id = ?";

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991642010U" + countnum;

  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + result[0].accesstoken,
        },
        //form이 아닌 queryString !
        qs: {
          bank_tran_id: transId,
          fintech_use_num: fin_use_num,
          inquiry_type: "A",
          inquiry_base: "D",
          from_date: "20190101",
          to_date: "20190101",
          sort_order: "D",
          tran_dtime: "20200714171331",
        },
      };
      request(option, function (error, response, body) {
        console.log(body);
        var transactionResult = JSON.parse(body);
        res.json(transactionResult);
      });
    }
  });
});

//출금이체 API, 입금이체 API
app.post("/withdraw", auth, function (req, res) {
  //출금이체 코드 (fin_use_num 즉, 결제하기 버튼 누른 계좌에서 돈을 출금)
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  var amount = req.body.amount;
  var to_fin_use_num = req.body.to_fin_use_num;

  var sql = "SELECT * FROM user WHERE id = ?";

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991642010U" + countnum;

  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      var option = {
        method: "POST",
        url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result[0].accesstoken,
        },
        json: {
          bank_tran_id: transId,
          cntr_account_type: "N",
          cntr_account_num: "3088594385",
          dps_print_content: "쇼핑몰환불",
          fintech_use_num: fin_use_num,
          wd_print_content: "오픈뱅킹출금",
          tran_amt: amount,
          tran_dtime: "20200720114100",
          req_client_name: "홍길동",
          req_client_num: "HONGGILDONG1234",
          transfer_purpose: "ST",
          req_client_fintech_use_num: fin_use_num,
          recv_client_name: "조혜인",
          recv_client_bank_code: "097",
          recv_client_account_num: "3088594385",
        },
      };
      request(option, function (error, response, body) {
        console.log(body);
        //json으로 날라왔으므로 parse 할 필요없음
        //res.json(body);

        var countnum2 = Math.floor(Math.random() * 1000000000) + 1;
        var transId2 = "T991642010U" + countnum2;

        //입금이체 코드(to_fin_use_num 즉, qr코드 리더기로 읽은 계좌로 입금)
        var option = {
          method: "POST",
          url: "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNjQyMDEwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjAyOTk5OTkwLCJqdGkiOiIwZTMyZmEwZi0wNjlhLTQwOWEtODI2Yi0xZGY2Nzc5OGQ1N2QifQ.hgHW9SxPqf8gwNNpYvvzPWuHWOA6UEl-EBkq7ovJops",
          },
          json: {
            cntr_account_type: "N",
            cntr_account_num: "3492286515",
            wd_pass_phrase: "NONE",
            wd_print_content: "환불금액",

            name_check_option: "on",
            tran_dtime: "20200720145510",
            req_cnt: "1",
            req_list: [
              {
                tran_no: "1",
                bank_tran_id: transId2,
                fintech_use_num: to_fin_use_num,
                print_content: "쇼핑몰환불",
                tran_amt: "500",
                req_client_name: "홍길동",
                req_client_fintech_use_num: to_fin_use_num,
                req_client_num: "HONGGILDONG1234",
                transfer_purpose: "ST"
              },
            ],
          },
        };
        request(option, function (err, response, body) {
          console.log(body);
          res.json(body);
        });
      });
    }
  });
});

app.listen(3000);