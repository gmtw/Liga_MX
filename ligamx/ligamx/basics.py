from selenium import webdriver
from shutil import which

# chrome_path = which("chromedriver")

driver = webdriver.Chrome(
    executable_path="/home/julio/Programas/Python/Proyectos/Liga_MX/ligamx/chromedriver")
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



# search_btn = driver.find_element_by_xpath('(//input[@class = "gNO89b"])[2]')
# search_btn.click()
#driver.close()
