# -*- coding: utf-8 -*-
import scrapy
from scrapy_selenium import SeleniumRequest
from scrapy.selector import Selector
from scrapy.loader import ItemLoader
from ..items import LigamxItem
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from shutil import which



class TorneoSpider(scrapy.Spider):
    name = 'torneos'
    allowed_domains = "ligamx.net"
    start_urls = ['https://ligamx.net/cancha/estadisticahistorica']
    
    

    def __init__(self):
        self.continuar = True
        self.value_temporada = 71
        self.value_torneo = 1
        self.contador = 1


    def parse(self, response):
        # url = driver.current_url
        # driver.close()
        # response = Selector(text = self.html)

        equipos = response.xpath('//table[@class = "default tbl_grals"]/tbody/tr')

        for equipo in equipos:

            loader = ItemLoader(item = LigamxItem(), selector = equipo, response = response)

            loader.add_xpath('posicion', 'normalize-space(.//td[1]/text())')
            loader.add_xpath(
                'club', 'normalize-space(.//td[2]/a[@class = "tpts loadershow"]/text())')

            if len(equipo.xpath('.//td[4]').get()) > 10:
                loader.add_xpath('jj', './/td[3]/a/text()')
            else:
                loader.add_xpath('jj', './/td[3]/text()')

            if len(equipo.xpath('.//td[4]').get()) > 10 :
                loader.add_xpath('jg', './/td[4]/a/text()')
            else:
                loader.add_xpath('jg', './/td[4]/text()')

            if len(equipo.xpath('.//td[5]').get()) > 10:
                loader.add_xpath('je', './/td[5]/a/text()')
            else:
                loader.add_xpath('je', './/td[5]/text()')

            if len(equipo.xpath('.//td[6]').get()) > 10:
                loader.add_xpath('jp', './/td[6]/a/text()')
            else:
                loader.add_xpath('jp', './/td[6]/text()')

            if len(equipo.xpath('.//td[7]').get()) > 10:
                loader.add_xpath('gf', './/td[7]/a/text()')
            else:
                loader.add_xpath('gf', './/td[7]/text()')

            if len(equipo.xpath('.//td[8]').get()) > 10:
                loader.add_xpath('gc', './/td[8]/a/text()')
            else:
                loader.add_xpath('gc', './/td[8]/text()')

            loader.add_xpath('dif', './/td[9]/text()')
            loader.add_xpath('pts', './/td[10]/text()')

            if len(equipo.xpath('.//td[11]').get()) > 10:
                loader.add_xpath('jjl', './/td[11]/a/text()')
            else:
                loader.add_xpath('jjl', './/td[11]/text()')

            if len(equipo.xpath('.//td[12]').get()) > 10:
                loader.add_xpath('jgl', './/td[12]/a/text()')
            else:
                loader.add_xpath('jgl', './/td[12]/text()')

            if len(equipo.xpath('.//td[13]').get()) > 10:
                loader.add_xpath('jel', './/td[13]/a/text()')
            else:
                loader.add_xpath('jel', './/td[13]/text()')

            if len(equipo.xpath('.//td[14]').get()) > 10:
                loader.add_xpath('jpl', './/td[14]/a/text()')
            else:
                loader.add_xpath('jpl', './/td[14]/text()')

            if len(equipo.xpath('.//td[15]').get()) > 10:
                loader.add_xpath('gfl', './/td[15]/a/text()')
            else:
                loader.add_xpath('gfl', './/td[15]/text()')

            if len(equipo.xpath('.//td[16]').get()) > 10:
                loader.add_xpath('gcl', './/td[16]/a/text()')
            else:
                loader.add_xpath('gcl', './/td[16]/text()')

            loader.add_xpath('difl', './/td[17]/text()')
            loader.add_xpath('ptsl', './/td[18]/text()')

            if len(equipo.xpath('.//td[19]').get()) > 10:
                loader.add_xpath('jjv', './/td[19]/a/text()')
            else:
                loader.add_xpath('jjv', './/td[19]/text()')

            if len(equipo.xpath('.//td[20]').get()) > 10:
                loader.add_xpath('jgv', './/td[20]/a/text()')
            else:
                loader.add_xpath('jgv', './/td[20]/text()')

            if len(equipo.xpath('.//td[21]').get()) > 10:
                loader.add_xpath('jev', './/td[21]/a/text()')
            else:
                loader.add_xpath('jev', './/td[21]/text()')

            if len(equipo.xpath('.//td[22]').get()) > 10:
                loader.add_xpath('jpv', './/td[22]/a/text()')
            else:
                loader.add_xpath('jpv', './/td[22]/text()')

            if len(equipo.xpath('.//td[23]').get()) > 10:
                loader.add_xpath('gfv', './/td[23]/a/text()')
            else:
                loader.add_xpath('gfv', './/td[23]/text()')

            if len(equipo.xpath('.//td[24]').get()) > 10:
                loader.add_xpath('gcv', './/td[24]/a/text()')
            else:
                loader.add_xpath('gcv', './/td[24]/text()')

            loader.add_xpath('difv', './/td[25]/text()')
            loader.add_xpath('ptsv', './/td[26]/text()')

            
            yield loader.load_item()
        
        
        # seleccion = next(self.seleccion())
        # print(seleccion)

        self.contador += 1

        if self.contador%2 == 0:
            self.value_temporada -= 1
            self.value_torneo = 2
        else:
            self.value_torneo = 1



        

        if self.value_temporada >= 69:
        # if self.continuar:
            self.continuar = False
            yield scrapy.Request(url= self.page(),
            callback=self.parse, dont_filter=True)




    def page(self):
        chrome_options = Options()

        chrome_options.add_argument("--headless")
        # chrome_path = which("chromedriver")
        chrome_path = "/home/julio/Programas/Python/Proyectos/Liga_MX/ligamx/chromedriver"

        driver = webdriver.Chrome(
            executable_path=chrome_path, chrome_options=chrome_options)

        driver.get("http://ligamx.net/cancha/estadisticahistorica")
        # driver = response.meta['chromedriver']

        temporada = driver.find_element_by_xpath(
            '//select[@id = "temporadasSelect"]')

        temporada.click()

        temporada_select = driver.find_element_by_xpath(
            '//option[@value = "{}"]'.format(self.value_temporada))
        temporada_select.click()

        torneo = driver.find_element_by_xpath(
            '//select[@id = "torneosSelect"]')
        torneo.click()

        torneo_select = driver.find_element_by_xpath(
            '(//option[@value = "{}"])[4]'.format(self.value_torneo))
        torneo_select.click()

        btn_buscar = driver.find_element_by_xpath(
            '//button[@id = "btnBuscar"]')
        btn_buscar.click()
        # driver.close()
        url = driver.current_url

        #html = Selector(text = driver.page_source)

        return url


