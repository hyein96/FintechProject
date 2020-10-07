const request = require("request");
const cheerio = require("cheerio");
const log = console.log;

function getData() {
    // 네이버 금융위에 있는 환율정보 스크래핑 하는 코드
    request("https://finance.naver.com/marketindex/exchangeDailyQuote.nhn?marketindexCd=FX_CHFKRW&page=1", 
    function (err, res, body) {
        //console.log(body); //우리가 요청한 페이지의 데이터 
        const $ = cheerio.load(body);
        const bodyList = $(".tbl_exchange tbody tr").map(function (i, element) {
            // 1번쨰요소(날짜)와 4번째요소(현찰>살때)를 뽑아온 것 
            // 코드 바꾸며 원하는 데이터 얻어 올 수 있음 
            console.log($(element).find('td:nth-of-type(1)').text());
            console.log($(element).find('td:nth-of-type(4)').text());
        });
    });
}
getData();