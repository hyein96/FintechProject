# 뉴스 사이트에서 제목,본문내용 받아오기

# selenium 이용해서 사이트 접근(webdriver import)
from selenium import webdriver
# webdriver 객체 생성(chromedriver 위치 지정)
driver = webdriver.Chrome('./chromedriver')
# 모든 자원이 로드될 때가지 기다리게 하는 시간설정(초)
driver.implicitly_wait(3)
# 특정 url 접근
driver.get(
    'https://newstapa.org/article/ncdGM')
# 페이지의 요소에 접근하는 메소드(xpath로 접근)
title = driver.find_element_by_xpath('/html/body/section[1]/div/div[1]/h3')
body = driver.find_element_by_xpath('//*[@id="journal_article_wrap"]')
print(title.text)
print(body.text)

