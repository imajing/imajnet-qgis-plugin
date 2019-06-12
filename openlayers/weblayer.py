# -*- coding: utf-8 -*-
"""
/***************************************************************************
OpenLayers Plugin
A QGIS plugin

                             -------------------
begin                : 2009-11-30
copyright            : (C) 2009 by Pirmin Kalberer, Sourcepole
email                : pka at sourcepole.ch
 ***************************************************************************/

/***************************************************************************
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 ***************************************************************************/
"""

from qgis.PyQt.QtGui import QIcon
from qgis.PyQt.QtWidgets import QAction, QMenu
from qgis.core import Qgis as QGis, QgsCoordinateReferenceSystem
import os
from ..ImajnetLog import ImajnetLog

class ImajnetWebLayer:
    """Base class for OpenLayers layers"""

    displayName = None
    """Layer type name in menu"""

    

    epsgList = []
    """Supported EPSG projections, ordered by preference"""

    fullExtent = [-180.0, -90.0, 180.0, 90.0]
    """WGS84 bounds"""

    emitsLoadEnd = True

    def __init__(self, name, html, xyzUrl=None):
        self.displayName = name
        self.layerTypeName = name
        self._html = html
        # optional GDAL TMS config to use as layer instead of an
        # OpenlayersLayer
        # the OpenlayersLayer is still used in the OpenLayers Overview
        self._xyzUrl = xyzUrl

    def setAddLayerCallback(self, addLayerCallback):
        self._addLayerCallback = addLayerCallback

    def addLayer(self):
        self._addLayerCallback(self)

    def html_url(self):
        dir = os.path.dirname(__file__)
        url = "file:///%s/../resources/%s" % (dir.replace("\\", "/"), self._html)
        ImajnetLog.debug(url)
        return url

    def hasXYZUrl(self):
        return self._xyzUrl is not None

    def xyzUrlConfig(self):
        if self._xyzUrl is not None:
            return self._xyzUrl
        else:
            return None

    def coordRefSys(self, mapCoordSys):
        epsg = self.epsgList[0]  # TODO: look for matching coord
        coordRefSys = QgsCoordinateReferenceSystem()
        createCrs = coordRefSys.createFromOgcWmsCrs("EPSG:%d" % epsg)
        if not createCrs:
            return None
        return coordRefSys


class ImajnetWebLayer3857(ImajnetWebLayer):

    epsgList = [3857]

    MAX_ZOOM_LEVEL = 25
    SCALE_ON_MAX_ZOOM = 33 # 13540  # QGIS scale for 72 dpi

    def coordRefSys(self, mapCoordSys):
        epsg = self.epsgList[0]
        coordRefSys = QgsCoordinateReferenceSystem()
        if QGis.QGIS_VERSION_INT >= 10900:
            idEpsgRSGoogle = "EPSG:%d" % epsg
            createCrs = coordRefSys.createFromOgcWmsCrs(idEpsgRSGoogle)
        else:
            idEpsgRSGoogle = epsg
            createCrs = coordRefSys.createFromEpsg(idEpsgRSGoogle)
        if not createCrs:
            google_proj_def = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +\
            lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 "
            google_proj_def += "+units=m +nadgrids=@null +wktext +no_defs"
            isOk = coordRefSys.createFromProj4(google_proj_def)
            if not isOk:
                return None
        return coordRefSys
    
    
class ImajnetWebLayer900913(ImajnetWebLayer):

    epsgList = [900913]

    MAX_ZOOM_LEVEL = 25
    SCALE_ON_MAX_ZOOM = 33 # 13540  # QGIS scale for 72 dpi

    def coordRefSys(self, mapCoordSys):
        epsg = self.epsgList[0]
        coordRefSys = QgsCoordinateReferenceSystem()
        if QGis.QGIS_VERSION_INT >= 10900:
            idEpsgRSGoogle = "EPSG:%d" % epsg
            createCrs = coordRefSys.createFromOgcWmsCrs(idEpsgRSGoogle)
        else:
            idEpsgRSGoogle = epsg
            createCrs = coordRefSys.createFromEpsg(idEpsgRSGoogle)
        if not createCrs:
            google_proj_def = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +\
            lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 "
            google_proj_def += "+units=m +nadgrids=@null +wktext +no_defs"
            isOk = coordRefSys.createFromProj4(google_proj_def)
            if not isOk:
                return None
        return coordRefSys
