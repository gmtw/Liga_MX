# -*- coding: utf-8 -*-
import scrapy
from scrapy_selenium import SeleniumRequest
from scrapy.selector import Selector
from scrapy.loader import ItemLoader
from ..items import PartidosLigaMx
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from shutil import which


class PartidosSpider(scrapy.Spider):
    name = 'partidos'
    allowed_domains = ['www.mediotiempo.com']
    start_urls = ['http://www.mediotiempo.com/futbol/liga-mx/calendario/guard1anes-2020/regular/jornada-1']

    def __init__(self):
        self.jornada = 1
        
        self.torneo = ['apertura', 'clausura', 'guard1anes']

        self.indice_torneo = -1


        self.year = 20

    def parse(self, response):

        encuentros = response.xpath('//div[contains(@class, "body-going")]')

        for encuentro in encuentros:
            #loader = ItemLoader(item=PartidosLigaMx(), response=response)
            loader = ItemLoader(item = PartidosLigaMx(), selector = encuentro, response = response)
            
            loader.add_xpath('jornada', 'normalize-space(//div[ @class = "round"]/span/text())')
            loader.add_xpath('torneo', 'normalize-space((//button[@class = "dropbtn"]/text())[1])')

            loader.add_xpath('local', './/div[ @class = "first-team"]/div[@class = "team-name large"]/a/span/text()')

            if encuentro.xpath('.//div[@class = "date"]/span/text()') != []:
                date = encuentro.xpath('.//div[@class = "date"]/span/text()').get()
            
            loader.add_value('fecha', date)
            loader.add_xpath('resultado', './/div[@class = "result-team"]/span/text()')
            loader.add_xpath('visitante', './/div[ @class = "second-team"]/div[@class = "team-name large"]/a/span/text()')
            
            yield loader.load_item()
        
        self.jornada += 1


        if self.jornada > 3 and self.torneo[-1] == 'guard1anes':
            self.jornada = 1
            self.indice_torneo = 0
            self.torneo.pop()

        elif self.jornada >10 and self.year==20 and self.torneo[self.indice_torneo] == 'clausura':
            self.jornada = 1
        elif self.year == 19 and self.torneo[self.indice_torneo] == 'apertura' and self.jornada > 19:
            self.jornada = 1
        elif (self.year !=19 or self.torneo[self.indice_torneo] != 'apertura') and self.jornada > 17:
            self.jornada = 1



        if self.jornada == 1 and self.indice_torneo == 1:
            self.indice_torneo = 0
            self.year -= 1
        elif self.jornada == 1 and self.indice_torneo < 1:
            self.indice_torneo += 1


        url = 'http://www.mediotiempo.com/futbol/liga-mx/calendario/{}-20{}/regular/jornada-{}'.format(self.torneo[self.indice_torneo],self.year, self.jornada)

        if self.year > 17 or self.indice_torneo != 1:
            yield response.follow(url = url, callback = self.parse)
