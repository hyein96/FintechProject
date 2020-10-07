const request = require('request');
var parseString = require("xml2js").parseString;
var url =
 "http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json";
request(url, function (error, response, body) {
    // xml2js 이용해서 필요한 데이터 parsing 하는 법
   parseString(body, function(err, result) {
       console.dir(result.rss.channel[0].item[0].description[0].header[0].wf[0]);
   });
});










/* JSON 활용
 request(url, function (error, response, body) {
    // console.log("body", body);
    console.log("detail data : ", body.count);
    var parseData = JSON.parse(body);
    console.log("parsed data : " , parseData.count);
});


/* 마스크 정보 얻어오는 코드(url 안에 정보 들어있음) 
const request = require('request');
request('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json', function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
*/

/*  url 변수 따로 선언해서 코드 짜기 가능(apikey 활용)
const request = require('request');
var url = 'http://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=78bc6ddd8cdb48ceac76f5f9b9dfc4c5';
request(url, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
*/