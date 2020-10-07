# 농어촌 사이트에서 표(table) 받아오기

from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://www.alimi.or.kr/api/a/vacant/selectApiVacant.do')
table = driver.find_element_by_class_name('search_list')
tableBody = table.find_element_by_tag_name('tbody')
rows = tableBody.find_elements_by_tag_name('tr')
for index, value in enumerate(rows):
    if index != 0:
        rowNo = value.find_elements_by_tag_name('td')[1]
        address = value.find_elements_by_tag_name('td')[2]
        homeType = value.find_elements_by_tag_name('td')[3]

# 위에서 element와 elements 의 차이 

# 다음페이지로 넘어가는 실습
nextBtn = driver.find_element_by_xpath(
    '//*[@id="list"]/tbody/tr[4]/td/ul/a[1]')
nextBtn.click()