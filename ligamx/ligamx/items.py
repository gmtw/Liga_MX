# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.loader.processors import TakeFirst, MapCompose, Join
from scrapy.selector import Selector
from w3lib.html import remove_tags


class LigamxItem(scrapy.Item):
    posicion = scrapy.Field(
        output_processor=TakeFirst()

    )
    club = scrapy.Field(
        output_processor=TakeFirst()
    )

    jj = scrapy.Field(output_processor=TakeFirst())
    jg = scrapy.Field(output_processor=TakeFirst())
    je = scrapy.Field(output_processor=TakeFirst())
    jp = scrapy.Field(output_processor=TakeFirst())
    gf = scrapy.Field(output_processor=TakeFirst())
    gc = scrapy.Field(output_processor=TakeFirst())
    dif = scrapy.Field(output_processor=TakeFirst())
    pts = scrapy.Field(output_processor=TakeFirst())

    jjl = scrapy.Field(output_processor=TakeFirst())
    jgl = scrapy.Field(output_processor=TakeFirst())
    jel = scrapy.Field(output_processor=TakeFirst())
    jpl = scrapy.Field(output_processor=TakeFirst())
    gfl = scrapy.Field(output_processor=TakeFirst())
    gcl = scrapy.Field(output_processor=TakeFirst())
    difl = scrapy.Field(output_processor=TakeFirst())
    ptsl = scrapy.Field(output_processor=TakeFirst())

    jjv = scrapy.Field(output_processor=TakeFirst())
    jgv = scrapy.Field(output_processor=TakeFirst())
    jev = scrapy.Field(output_processor=TakeFirst())
    jpv = scrapy.Field(output_processor=TakeFirst())
    gfv = scrapy.Field(output_processor=TakeFirst())
    gcv = scrapy.Field(output_processor=TakeFirst())
    difv = scrapy.Field(output_processor=TakeFirst())
    ptsv = scrapy.Field(output_processor=TakeFirst())
