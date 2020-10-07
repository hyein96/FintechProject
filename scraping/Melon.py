# 멜론사이트에서 차트 받아오기

from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://www.melon.com/chart/index.htm')

tableBody = driver.find_element_by_xpath('//*[@id="frm"]/div/table/tbody')
tableRow = tableBody.find_elements_by_tag_name('tr')
for index, value in enumerate(tableRow):
        # no = value.find_elements_by_tag_name('td')[0]
        # rowNo = value.find_elements_by_tag_name('td')[1]
        # address = value.find_elements_by_tag_name('td')[2]
        # homeType = value.find_elements_by_tag_name('td')[3]
        # print(no.text + rowNo.text + address.text + homeType.text)

        # td[3]에 곡이랑 가수 정보 들어있음 
        music = value.find_elements_by_tag_name('td')[3]

        # 곡이름이랑 가수이름 따로 분류 할 방법 없나?
        # musicName = driver.find_element_by_xpath('//*[@id="frm"]/div/table/tbody/tr{}/td[4]/div/div/div[1]'.format(index))
        print(music.text)


