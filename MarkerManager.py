
import os
import collections

from PyQt5 import QtGui, QtWidgets, uic 
from PyQt5.QtCore import pyqtSignal, QUrl, QObject, QVariant, QSize, QSettings, Qt, QEvent
from PyQt5.Qt import QFileInfo, pyqtSlot, QStringListModel, QHBoxLayout, \
    QPushButton, QColor, QCursor
from PyQt5.QtWebKit import QWebElement, QWebSettings
# from PyQt5.QtGui import QVBoxLayout, QShortcut, QKeySequence
from numpy import double
# from PySide import QtGui, QtCore, QtWebKit
from PyQt5.QtWidgets import QApplication, QSplitter, QVBoxLayout, QWidget,QGraphicsSceneHoverEvent
from qgis.utils import iface
from .ImajnetUtils import ImajnetUtils
from .ImajnetMarker import ImajnetMarker, ImajnetPointMarker
import json
# from .QGisImajnetPlugin import QGisImajnetPlugin
# Such a wild import is not good for performance but usefull for debug sometime
# from qgis import *
# from qgis.core import *

# Rather prefer this :
from qgis.core import QgsVectorLayer, QgsFeature, QgsGeometry, QgsPoint, QgsPointXY, QgsProject, QgsField, QgsWkbTypes
from qgis.gui import QgsVertexMarker, QgsRubberBand
from .TileMapScaleLevels import TileMapScaleLevels
import sys
import inspect
from .ImajnetLog import ImajnetLog


class MarkerManager(QObject):
    IMAJNET_LAYER_KEY= 995 #"imajnetLayer"
    IMAJNET_MARKER_ID_KEY= 21233 #"imajnetMarkerId"
    DEFAULT_ICON_SIZE = 2
    DEFAULT_MARKER_COLOR = QColor(255,0,0)
    DEFAULT_MARKER_ICON = QgsVertexMarker.ICON_BOX
    
    IMAJBOX_COLOR = QColor(0,255,0)
    IMAJBOX_MARKER_ICON = QgsVertexMarker.ICON_CIRCLE
    
    PINPOINT_COLOR = QColor(255,0,0)
    PINPOINT_MARKER_ICON = QgsVertexMarker.ICON_DOUBLE_TRIANGLE
    
    CLICK_MODE_TARGET_COLOR = QColor(214,4,72)
    CLICK_MODE_TARGET_ICON = QgsVertexMarker.ICON_CROSS
    
    PHOTOGRAMMETRY_POINT_COLOR= QColor(255,165,0)
    PHOTOGRAMMETRY_POINT_MARKER_ICON = QgsVertexMarker.ICON_CIRCLE
    
    HIGHLIGHT_COLOR = QColor(0,0,255,255)
    
    #polygon blue - #2683ef
    
    _canvas= None
    _layers=None
    
    _markerIdSequence = 0
    
    
    def __init__(self, canvas):
        super(MarkerManager, self).__init__()
        self._canvas = canvas
        self._layers=dict()
        
    def addMarkerLayer(self, name):
        ImajnetLog.debug("MarkerManager.addMarkerLayer");
        layer = None
        if name in self._layers:
            ImajnetLog.warning('Layer exists: {}'.format(name))
            layer = self._layers[name]
        else:  
            layer = dict()
            self._layers[name] = layer
        return layer
    
    def addPointMarker(self, layerName, jsLonLatObject):
        ImajnetLog.debug("MarkerManager.addPointMarker");
        layer=self.getLayerByName(layerName)
        
        if (layer is None):
            ImajnetLog.error("addPointMarker called for inexistent layer: {}".format(layerName))
            return None
        
        ImajnetLog.debug("Adding Coords Lat = {}, Long ={}".format(float(jsLonLatObject["lat"]), float(jsLonLatObject["lon"])))
        point = ImajnetUtils.transformImajnetCoordToQgisMapCoord(self._canvas,jsLonLatObject)
            
            
        marker = QgsVertexMarker(self._canvas)
        marker.setCenter(QgsPointXY(point))
        size = ImajnetUtils.getPropertyFromJsObject(jsLonLatObject,"size")
        if size != None:
            ImajnetLog.debug("size: {}".format(size))
            marker.setIconSize(ImajnetUtils.getFloatPropertyFromJsObject(size,"width")/2)
        else:
            marker.setIconSize(MarkerManager.DEFAULT_ICON_SIZE)
                
        markerType = ImajnetUtils.getPropertyFromJsObject(jsLonLatObject, "type")
        markerImage = ImajnetUtils.getPropertyFromJsObject(jsLonLatObject, "imagePath")
        
        color = MarkerManager.DEFAULT_MARKER_COLOR
        iconType = (MarkerManager.DEFAULT_MARKER_ICON)
        if markerType != None:
            if 'imajbox' == markerType:
                color =(MarkerManager.IMAJBOX_COLOR)
                iconType = (MarkerManager.IMAJBOX_MARKER_ICON)
            else:
                if 'clickPositionOnMap' == markerType:
                    color =(MarkerManager.CLICK_MODE_TARGET_COLOR)
                    iconType = (MarkerManager.CLICK_MODE_TARGET_ICON)
                    marker.setIconSize(20)
                else:
                    if 'photogrammetryPoint' == markerType:
                        color = (MarkerManager.PHOTOGRAMMETRY_POINT_COLOR)
                        iconType = (MarkerManager.PHOTOGRAMMETRY_POINT_MARKER_ICON)
                        marker.setIconSize(7)
        else:
            if markerImage != None:
                if 'pinpoint' in markerImage:
                    color = (MarkerManager.PINPOINT_COLOR)
                    iconType = (MarkerManager.PINPOINT_MARKER_ICON)
        
        
        marker.setFillColor(color)                          
        marker.setColor(color)
        marker.setIconType(iconType)    
        #marker.setCursor(QCursor(Qt.BusyCursor))
        
        marker.setAcceptHoverEvents(True)
        marker.setAcceptTouchEvents(True)
        marker.setAcceptedMouseButtons(Qt.LeftButton)
        
       

        marker.setPenWidth(1)
        return self.storeMarker(layer,layerName,marker)
       
    def convertJsColor(self, jsColor, defaultColor):
        ImajnetLog.debug("jsColor: {}".format(jsColor))
        color = defaultColor
        if jsColor != None :
            if '#' in jsColor:
                color = QColor()
                color.setNamedColor(jsColor)
            else:
                #rgba(0, 255, 0, 0.67)
                jsColor = jsColor.replace('rgba(','')
                jsColor = jsColor.replace(')','')
                rgba = jsColor.split(', ')
                ImajnetLog.debug("rgba: {}".format(rgba))
                color = QColor(float(rgba[0]),float(rgba[1]),float(rgba[2]),(1-float(rgba[3]))*255)
            ImajnetLog.debug(color.name())
        return color
        
    def addPolygonMarker(self,layerName,pointsArray,featureOptions):
        ImajnetLog.debug("MarkerManager.addPolygonMarker. {}".format(featureOptions));
        layer=self.getLayerByName(layerName)
        
        if (layer is None):
            ImajnetLog.error("addPointMarker called for inexistent layer: {}".format(layerName))
            return None
        markerType = ImajnetUtils.getPropertyFromJsObject(featureOptions, "type")
        jsFillColor = ImajnetUtils.getPropertyFromJsObject(featureOptions, "fillColor")
        jsStrokeColor = ImajnetUtils.getPropertyFromJsObject(featureOptions, "strokeColor")
        jsFillOpacity = ImajnetUtils.getFloatPropertyFromJsObject(featureOptions, "fillOpacity")
        jsStrokeWidth = ImajnetUtils.getFloatPropertyFromJsObject(featureOptions, "strokeWidth")
        
        isPolygon = ('Polygon' == markerType or 'MultiPolygon' == markerType)
        
        marker = QgsRubberBand(self._canvas, isPolygon)
        
        if isPolygon:
            geom = ImajnetUtils.convertJsPointsArrayToPolygon(self._canvas,pointsArray,True, None)
            marker.setToGeometry(geom, None)
            marker.closePoints()
        else:
            geom = ImajnetUtils.convertJsPointsArrayToPolyline(self._canvas,pointsArray)
            marker.setToGeometry(geom, None)
            
     
        fillColor = self.convertJsColor(jsFillColor, MarkerManager.DEFAULT_MARKER_COLOR)
        strokeColor = self.convertJsColor(jsStrokeColor, fillColor)
        
        if jsFillColor is None:
            fillColor=strokeColor
        
             
        #fillOpacity =255
        ImajnetLog.debug("jsFillOpacity: {}".format(jsFillOpacity))
        if jsFillOpacity != None:
           fillOpacity = float(jsFillOpacity) * 255
           fillColor.setAlphaF(fillOpacity)
        
        strokeWidth =2
        ImajnetLog.debug("jsStrokeWidth: {}".format(jsStrokeWidth))
        if jsStrokeWidth != None and jsStrokeWidth> strokeWidth:
            strokeWidth = jsStrokeWidth
        marker.setColor(fillColor)   
        marker.setFillColor(fillColor)                          
        marker.setStrokeColor(strokeColor)
  
        marker.setWidth(strokeWidth)
        
        return self.storeMarker(layer,layerName,marker)
        
        
    
    def storeMarker(self, layer,layerName, marker):
        MarkerManager._markerIdSequence = MarkerManager._markerIdSequence+1
        fid = MarkerManager._markerIdSequence
        
        marker.setData(MarkerManager.IMAJNET_LAYER_KEY,layerName)
        marker.setData(MarkerManager.IMAJNET_MARKER_ID_KEY,fid);
    
        if fid in layer:
            ImajnetLog.error("overwriting marker, id generation is wrong!!! id:{}".format(fid))            
        layer[fid] = marker
        return fid
    
    def removeMarkerByFid(self, layerName, fid):
        layer=self.getLayerByName(layerName)
        if (layer is None):
            return
        marker = layer.pop(fid)
        if marker is None:
            ImajnetLog.error("marker remove for inexistent fid. layer:{}, fid:{}".format(layerName,fid))
            return
        self._canvas.scene().removeItem(marker)
        
    def getMarkerByFid(self, layerName, fid):
        layer=self.getLayerByName(layerName)
        if (layer is None):
            return None
        marker = layer[fid]
        return marker
        
    def getLayerByName(self,layerName):
        ImajnetLog.debug("MarkerManager.getLayerByName");
        layer = None
        if layerName in self._layers:
            layer = self._layers[layerName]
        #if layer is None:
        #    ImajnetLog.error("layer not found: {}".format(layerName))
        return layer
    
    def removeAllMarkersFromLayer(self, layerName):        
        layer=self.getLayerByName(layerName)
        self.removeAllMarkersFromLayerDict(layer)
        
    def removeAllMarkersFromLayerDict(self, layer):        
        if (layer is None):
            return
        for fid,marker in layer.items():
            self._canvas.scene().removeItem(marker)
        layer.clear()
        
    def removeLayerFromMap(self, layerName):
        layer = self._layers.pop(layerName)
        if (layer is None):
            return
        self.removeAllMarkersFromLayerDict(layer)
        
    def removeAllLayersFromMap(self):        
        for layerName,layer in self._layers.items():
            self.removeAllMarkersFromLayerDict(layer)
        self._layers.clear()
    
    def highlightMarker(self,  layerName, fid):
        ImajnetLog.debug("highlightMarker - {}.{}".format(layerName, fid))
        marker = self.getMarkerByFid(layerName,fid)
        if marker is None:
            return
        
        
        
        if isinstance(marker,QgsVertexMarker):
            if marker.color() == MarkerManager.HIGHLIGHT_COLOR:
                return
            marker.setColor(MarkerManager.HIGHLIGHT_COLOR)
        else:
            if marker.strokeColor() == MarkerManager.HIGHLIGHT_COLOR:
                return
        
            marker.setSecondaryStrokeColor(marker.fillColor())
            #for lines
            if marker.strokeColor() == marker.fillColor():
                marker.setStrokeColor(MarkerManager.HIGHLIGHT_COLOR)
            
            marker.setFillColor(MarkerManager.HIGHLIGHT_COLOR)
            marker.updatePosition()
            #marker.setFillColor(MarkerManager.HIGHLIGHT_COLOR)

    def unHighlightMarker(self,  layerName, fid):
        ImajnetLog.debug("unHighlightMarker - {}.{}".format(layerName, fid))
        marker = self.getMarkerByFid(layerName,fid)
        if marker is None:
            return
        
        if isinstance(marker,QgsVertexMarker):
            if marker.color() != MarkerManager.HIGHLIGHT_COLOR:
                return
            marker.setColor(marker.fillColor())
        else:
            if marker.fillColor() != MarkerManager.HIGHLIGHT_COLOR:
                return
            
            marker.setFillColor(marker.secondaryStrokeColor())
            
            #for lines
            if marker.strokeColor() == MarkerManager.HIGHLIGHT_COLOR:
                marker.setStrokeColor(marker.fillColor())
            
            marker.setSecondaryStrokeColor(marker.strokeColor())
            marker.updatePosition()
