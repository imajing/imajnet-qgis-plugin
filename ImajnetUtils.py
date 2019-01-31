import os

from PyQt5 import QtGui, QtWidgets, uic 
from PyQt5.QtCore import pyqtSignal, QUrl, QObject, QVariant, QSize
from PyQt5.Qt import QFileInfo, pyqtSlot, QStringListModel, QHBoxLayout, \
    QPushButton
from PyQt5.QtWebKitWidgets import QWebView, QWebPage, QWebInspector
from PyQt5.QtWebKit import QWebElement, QWebSettings
# from PyQt5.QtGui import QVBoxLayout, QShortcut, QKeySequence
from numpy import double
# from PySide import QtGui, QtCore, QtWebKit
from PyQt5.QtWidgets import QApplication, QSplitter, QVBoxLayout, QWidget
from qgis.utils import iface
from qgis import qgis
from qgis.core import QgsCoordinateReferenceSystem, QgsCoordinateTransform, QgsGeometry, QgsProject, QgsPoint, QgsVectorLayer, QgsFeature, QgsGeometry, QgsPointXY, QgsProject, QgsField, QgsWkbTypes

from .ImajnetLog import ImajnetLog
# Such a wild import is not good for performance but usefull for debug sometime
# from qgis import *
# from qgis.core import *

import sys
import inspect


class ImajnetUtils:
    
    imajnetProj = QgsCoordinateReferenceSystem(4326)
    
    #@staticmethod
    #def transformImajnetCoordToQgisMapCoord(position):
    #    return ImajnetUtils.transformImajnetCoordToQgisMapCoord(iface.mapCanvas(), position)
    
    @staticmethod
    def transformImajnetXYPointToQgisMapCoord(mapCanvas, position, destinatonCrs=None, ignoreZ = False):
        return ImajnetUtils.transformImajnetXYToQgisMapCoord(mapCanvas,ImajnetUtils.getFloatPropertyFromJsObject(position,"x"), ImajnetUtils.getFloatPropertyFromJsObject(position,"y"), ImajnetUtils.getFloatPropertyFromJsObject(position,"z"), destinatonCrs, ignoreZ)
    
    @staticmethod
    def transformImajnetCoordToQgisMapCoord(mapCanvas, position):
        return ImajnetUtils.transformImajnetXYToQgisMapCoord(mapCanvas,ImajnetUtils.getFloatPropertyFromJsObject(position,"lon"), ImajnetUtils.getFloatPropertyFromJsObject(position,"lat"))
    
    @staticmethod
    def transformImajnetXYToQgisMapCoord(mapCanvas, imajnetX, imajnetY, imajnetZ=None, destinatonCrs=None, ignoreZ = False):
        if(destinatonCrs is None):
            #qgisProj = QgsProject.instance().crs()
            destinatonCrs = mapCanvas.mapSettings().destinationCrs()
            #ImajnetLog.debug('qgis proj:{}'.format( qgisProj.srsid()) )
        
        mapPoint = None
        if destinatonCrs.srsid() != ImajnetUtils.imajnetProj.srsid():
            transform = QgsCoordinateTransform(ImajnetUtils.imajnetProj, destinatonCrs, QgsProject.instance())
            if imajnetZ is not None and not ignoreZ:
                mapPoint=QgsPoint(imajnetX,imajnetY,imajnetZ)
                mapPoint.transform(transform)                
            else:
                mapPoint = transform.transform(imajnetX, imajnetY)
                mapPoint = QgsPoint(mapPoint)
                #mapPoint.dropZValue();
                
        else:
            if ignoreZ:
           		mapPoint = QgsPoint(imajnetX, imajnetY)
           		mapPoint.dropZValue();
            else:
            	mapPoint = QgsPoint(imajnetX, imajnetY, imajnetZ)
            
        #ImajnetLog.debug("qgis coord : {}".format(mapPoint))
        return mapPoint
    
    @staticmethod
    def transformQgisMapCoordToImajnetCoord(mapCanvas, point):
        # TODO: get projection from map canvas
        #qgisProj = QgsProject.instance().crs()
        qgisProj = mapCanvas.mapSettings().destinationCrs()
        #ImajnetLog.debug('qgis proj:{}'.format( qgisProj.srsid()) )
        imajnetPoint = None
        if qgisProj.srsid() != ImajnetUtils.imajnetProj.srsid():
            #ImajnetLog.debug('transforming')
            transform = QgsCoordinateTransform(qgisProj, ImajnetUtils.imajnetProj, QgsProject.instance())
            imajnetPoint = transform.transform(point)
        else:
            imajnetPoint = point
        jsPosition = '{{"lon":{},"lat":{}}}'.format(imajnetPoint.x(), imajnetPoint.y())
        #ImajnetLog.debug(jsPosition)
        return jsPosition
    
    @staticmethod
    def transformQgisGeomToImajnetCrs( geom, geomCrs):
        #ImajnetLog.debug('geomCrs:{}'.format( geomCrs.srsid()) )
        imajnetGeom = None
        if geomCrs.srsid() != ImajnetUtils.imajnetProj.srsid():
            #ImajnetLog.debug('transforming')
            transform = QgsCoordinateTransform(geomCrs, ImajnetUtils.imajnetProj, QgsProject.instance())
            imajnetGeom = transform.transform(geom)
        else:
            imajnetGeom = geom
        return imajnetGeom
    
    @staticmethod
    def convertJsPointsArrayToPolygon(mapCanvas,pointsArray, ignoreZ = False, destinatonCrs=None):
        points = []
        for index in range(len(pointsArray)):
        #for key,jsPoint in pointsArray.items():
            jsPoint = pointsArray["{}".format(index)]
            if jsPoint != None:
                point = ImajnetUtils.transformImajnetXYToQgisMapCoord(mapCanvas,ImajnetUtils.getFloatPropertyFromJsObject(jsPoint,"x"), ImajnetUtils.getFloatPropertyFromJsObject(jsPoint,"y"), ImajnetUtils.getFloatPropertyFromJsObject(jsPoint,"z"),destinatonCrs)
                if ignoreZ:
                    points.append(QgsPointXY(point))
                else:
                    #points.append(point)
                    points.append(QgsPoint(point))
        if(len(points) > 0):
            points.append(points[0])
        if ignoreZ:
            ppoints = []
            ppoints.append(points)
            geom = QgsGeometry.fromPolygonXY(ppoints)
        else:
            #geom = QgsGeometry.fromPolygon(ppoints)
            geom =QgsGeometry.fromPolyline(points)
        return geom
    
    @staticmethod
    def convertJsPointsArrayToPolyline(mapCanvas, pointsArray, ignoreZ = False, destinatonCrs=None):
        points = []
        for index in range(len(pointsArray)):
        #for key,jsPoint in pointsArray.items():
            jsPoint = pointsArray["{}".format(index)]
            if jsPoint != None:
                point = ImajnetUtils.transformImajnetXYToQgisMapCoord(mapCanvas,ImajnetUtils.getFloatPropertyFromJsObject(jsPoint,"x"), ImajnetUtils.getFloatPropertyFromJsObject(jsPoint,"y"), ImajnetUtils.getFloatPropertyFromJsObject(jsPoint,"z"),destinatonCrs)
                if ignoreZ:
                	points.append(QgsPointXY(point))
                else:
                	points.append(QgsPoint(point))
        if ignoreZ:
        	geom =QgsGeometry.fromPolylineXY(points)
        else:
        	geom =QgsGeometry.fromPolyline(points)
        return geom
    
    @staticmethod
    def getPropertyFromJsObject( jsObject, propertyName):
        if propertyName in jsObject:
            return jsObject[propertyName]
        else:
            return None
        
    @staticmethod   
    def getFloatPropertyFromJsObject( jsObject, propertyName):
        if propertyName in jsObject:
            return float(jsObject[propertyName])
        else:
            return None
    
    @staticmethod 
    def convertQgisGeometryToImajnetGeometry(geometry,layerCrs, geometryType):
        #imajnetGeom = ImajnetUtils.transformQgisGeomToImajnetCrs(geometry, layerCrs)
        imajnetGeom = geometry
        if layerCrs.srsid() != ImajnetUtils.imajnetProj.srsid():
            transform = QgsCoordinateTransform(layerCrs, ImajnetUtils.imajnetProj, QgsProject.instance())
            imajnetGeom.transform(transform)
        
        #if 'point' in geometryType:
        #    geometry.asPoint() #QgsPointXY
        #else:
        #    if 'line' in geometryType:
        #
        #   else:
        return imajnetGeom.asWkt()
    
    @staticmethod 
    def setupWebView(view):
        view.settings().setThirdPartyCookiePolicy(QWebSettings.AllowThirdPartyWithExistingCookies)
        view.settings().setAttribute(QWebSettings.XSSAuditingEnabled, False)
        view.settings().setAttribute(QWebSettings.JavascriptEnabled, True)
        view.settings().setAttribute(QWebSettings.LocalStorageEnabled, True)     
        view.settings().setAttribute(QWebSettings.LocalStorageDatabaseEnabled, True)       
        view.settings().setAttribute(QWebSettings.LocalContentCanAccessRemoteUrls, True)    
        view.settings().setAttribute(QWebSettings.LocalContentCanAccessFileUrls, True)   
        view.settings().setAttribute(QWebSettings.JavascriptCanOpenWindows, True)   
        view.settings().setAttribute(QWebSettings.JavascriptCanCloseWindows, True)   
        view.settings().setAttribute(QWebSettings.PluginsEnabled, True)   
        view.settings().setAttribute(QWebSettings.JavascriptCanAccessClipboard, True) 
        view.settings().setAttribute(QWebSettings.OfflineStorageDatabaseEnabled, True) 
        view.settings().setAttribute(QWebSettings.OfflineWebApplicationCacheEnabled, True)
        view.settings().setAttribute(QWebSettings.AcceleratedCompositingEnabled, True)
        view.settings().setAttribute(QWebSettings.FrameFlatteningEnabled, True)
        view.settings().setAttribute(QWebSettings.Accelerated2dCanvasEnabled, True)
        view.page().settings().clearMemoryCaches()
        
    @staticmethod 
    def setupWebViewForDebug(view):
        view.settings().setAttribute(QWebSettings.DeveloperExtrasEnabled, True)

        
        