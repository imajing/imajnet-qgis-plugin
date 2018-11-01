#https://github.com/datalyze-solutions/TileMapScaleLevels/blob/master/tilemapscalelevels.py
#  -*- coding: utf-8 -*-
## @package TileMapScaleLevels123
#       Sets the scale to levels according to the Tile Map Specification used by Google, Osm, etc.
#  @file
#       Sets the scale to levels according to the Tile Map Specification used by Google, Osm, etc.

# get correct dpi by using self.iface.mainWindow().physicalDpiX()

import math
class TileMapScaleLevels(object):
    def __init__(self, maxZoomlevel=21, minZoomlevel=0, dpi=96, tileSize=256, earthRadius=6378137):
        self.__dpi = dpi
        self.inchesPerMeter = 39.37
        self.maxScalePerPixel = 156543.04
        self.earthRadius = earthRadius
        self.tileSize = tileSize
        self.__maxZoomlevel = maxZoomlevel
        self.__minZoomlevel = minZoomlevel

        self.zoomlevels = {}
        self.calculateScaleStorage()

    def minZoomlevel(self):
        return self.__minZoomlevel
    def setMinZoomlevel(self, zoomlevel):
        self.__minZoomlevel = zoomlevel

    def maxZoomlevel(self):
        return self.__maxZoomlevel
    def setMaxZoomlevel(self, zoomlevel):
        self.__maxZoomlevel = zoomlevel

    def dpi(self):
        return self.__dpi
    def setDpi(self, dpi):
        self.__dpi = dpi

    def getScale(self, zoomlevel):
        try:
            zoomlevel = int(zoomlevel)
            scale = (self.dpi() * self.inchesPerMeter * self.maxScalePerPixel) / (math.pow(2, zoomlevel))
            scale = int(scale)
            return scale
        except TypeError:
            raise
            #pass
        except Exception as e:
            raise e

    def getZoomlevel(self, scale):
        if scale != 0:
            zoomlevel = int(round(math.log( ((self.dpi() * self.inchesPerMeter * self.maxScalePerPixel) / scale), 2 ), 0))
            if zoomlevel > self.maxZoomlevel():
                return self.maxZoomlevel()
            elif zoomlevel <= self.minZoomlevel():
                return self.minZoomlevel()
            else:
                return zoomlevel

    def mapWidth(self, zoomlevel):
        return self.tileSize * math.pow(2, zoomlevel)

    def pixelSize(self, zoomlevel):
        return 2.0 * math.pi * self.earthRadius / self.mapWidth(zoomlevel)

    def calculateScaleStorage(self):
        for zoomlevel in range(self.minZoomlevel(), self.maxZoomlevel()):
            self.zoomlevels[zoomlevel] = self.getScale(zoomlevel)