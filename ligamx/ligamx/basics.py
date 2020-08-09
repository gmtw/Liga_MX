from selenium import webdriver
from shutil import which
from selenium.webdriver.chrome.options import Options

# chrome_path = which("chromedriver")

chrome_options = Options()

#chrome_options.add_argument("--headless")


driver = webdriver.Chrome(
    executable_path="/home/julio/Programas/Python/Proyectos/Liga_MX/ligamx/chromedriver", chrome_options=chrome_options)
driver.get("https://ligamx.net/cancha/estadisticahistorica")

temporada = driver.find_element_by_xpath(
    '//select[@id = "temporadasSelect"]')
temporada.click()

temporada_select = driver.find_element_by_xpath('//option[@value = "65"]')
temporada_select.click()

torneo = driver.find_element_by_xpath('//select[@id = "torneosSelect"]')
torneo.click()

torneo_select = driver.find_element_by_xpath('(//option[@value = "2"])[4]')
torneo_select.click()

btn_buscar = driver.find_element_by_xpath('//button[@id = "btnBuscar"]')
btn_buscar.click()
url = driver.current_url

html = driver.page_source

print(html)


# search_btn = driver.find_element_by_xpath('(//input[@class = "gNO89b"])[2]')
# search_btn.click()
#driver.close()
