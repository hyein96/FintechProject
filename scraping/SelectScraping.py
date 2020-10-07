# select요소와 input요소 받아와서 원하는 값 지정 후, 버튼 클릭

from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')
# 수행시간
driver.implicitly_wait(3)
driver.get(
    'http://luris.molit.go.kr/web/index.jsp')

# 입력요소 뽑아오기
# select 요소들은 Select class로 묶기 
element = Select(driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[1]/select'))
element2 = Select(driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[2]/select'))
element3 = Select(driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[3]/select'))
element4 = Select(driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[4]/select'))
element5 = driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[2]/ul/li[2]/input')
element6 = driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[2]/ul/li[4]/input')
button = driver.find_element_by_xpath(
    '//*[@id="gnb_tab11"]/div/div[2]/div/div[3]/button')

# 요소 지정, 열람버튼 클릭
element.select_by_visible_text('전라남도')
driver.implicitly_wait(1)
element2.select_by_visible_text('고흥군')
driver.implicitly_wait(1)
element3.select_by_visible_text('고흥읍')
driver.implicitly_wait(1)
element4.select_by_visible_text('남계리')
element5.send_keys('45')
element6.send_keys('1')
button.click()

data = driver.find_element_by_xpath('//*[@id="printData3"]/tbody/tr[2]/td')
print(data.text)
