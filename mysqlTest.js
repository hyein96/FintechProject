// Node.js 와 mysql 연동 
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Jhi8524561',
  database : 'fintech'
  // 포트 다르면 port : '' 도 지정해주면 됨
});
 
connection.connect();
 
connection.query('SELECT * FROM fintech.user;', function (error, results, fields) {
  if (error) throw error;
  console.log('우리 회원들은 :  ', results);
});
 
connection.end();