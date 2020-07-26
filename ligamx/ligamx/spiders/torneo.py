# -*- coding: utf-8 -*-
import scrapy
from scrapy.selector import Selector
from scrapy.loader import ItemLoader
from ..items import LigamxItem
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from shutil import which



class TorneoSpider(scrapy.Spider):
    name = 'torneo'
    allowed_domains = ['ligamx.net/']
    start_urls = ['http://ligamx.net/cancha/estadisticahistorica']

    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        #chrome_path = which("chromedriver")
        chrome_path = "/home/julio/Programas/Python/Proyectos/Liga_MX/ligamx/chromedriver"

        driver = webdriver.Chrome(executable_path = chrome_path, chrome_options = chrome_options)

        driver.get("http://ligamx.net/cancha/estadisticahistorica")

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

        self.html = driver.page_source
        driver.close()



    def parse(self, response):
        resp = Selector(text = self.html)
        equipos = resp.xpath('//table[@class = "default tbl_grals"]/tbody/tr')

        for equipo in equipos:

            loader = ItemLoader(item = LigamxItem(), selector = equipo, response = response)

            loader.add_xpath('posicion', 'normalize-space(.//td[1]/text())')
            loader.add_xpath(
                'club', 'normalize-space(.//td[2]/a[@class = "tpts loadershow"]/text())')
            
            loader.add_xpath('jj', './/td[3]/text()')
            loader.add_xpath('jg', './/td[4]/text()')
            loader.add_xpath('je', './/td[5]/text()')
            loader.add_xpath('jp', './/td[6]/text()')
            loader.add_xpath('gf', './/td[7]/text()')
            loader.add_xpath('gc', './/td[8]/text()')
            loader.add_xpath('dif', './/td[9]/text()')
            loader.add_xpath('pts', './/td[10]/text()')

            loader.add_xpath('jjl', './/td[11]/text()')
            loader.add_xpath('jgl', './/td[12]/text()')
            loader.add_xpath('jel', './/td[13]/text()')
            loader.add_xpath('jpl', './/td[14]/text()')
            loader.add_xpath('gfl', './/td[15]/text()')
            loader.add_xpath('gcl', './/td[16]/text()')
            loader.add_xpath('difl', './/td[17]/text()')
            loader.add_xpath('ptsl', './/td[18]/text()')

            loader.add_xpath('jjv', './/td[19]/text()')
            loader.add_xpath('jgv', './/td[20]/text()')
            loader.add_xpath('jev', './/td[21]/text()')
            loader.add_xpath('jpv', './/td[22]/text()')
            loader.add_xpath('gfv', './/td[23]/text()')
            loader.add_xpath('gcv', './/td[24]/text()')
            loader.add_xpath('difv', './/td[25]/text()')
            loader.add_xpath('ptsv', './/td[26]/text()')


            yield loader.load_item()
            

