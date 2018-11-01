"""

/***************************************************************************
 *                                                                         *
 *   Map tool used to send events to the imajnet sdk                       *
 *                                                                         *
 ***************************************************************************/
"""

import os

from PyQt5 import QtGui, QtWidgets, uic 
from PyQt5.QtCore import pyqtSignal, QUrl, QObject, QVariant, QSize, Qt, QPoint,QPointF
from PyQt5.Qt import QFileInfo, pyqtSlot, QStringListModel, QHBoxLayout,\
    QPushButton, QCursor
from PyQt5.QtWebKit import QWebElement, QWebSettings
# from PyQt5.QtGui import QVBoxLayout, QShortcut, QKeySequence
from numpy import double
# from PySide import QtGui, QtCore, QtWebKit
from PyQt5.QtWidgets import QApplication, QSplitter, QVBoxLayout, QWidget
from qgis import *
from qgis.core import *
from qgis.gui import *
from qgis.utils import iface
from .ImajnetUtils import ImajnetUtils
from .ImajnetLog import ImajnetLog
from qgis.gui import QgsVertexMarker, QgsRubberBand
from .MarkerManager import MarkerManager
from .PyImajnet import PyImajnet

class ImajnetMapTool(QgsMapToolIdentify,QgsMapTool):   
    _imajnetPluginWindow= None
    _clickMode = False
    dragging=False
    
    def __init__(self, imajnetPlugin):
        QgsMapTool.__init__(self, imajnetPlugin.iface.mapCanvas())  
        self._imajnetPluginWindow = imajnetPlugin.dockwidget;
        self.setCursor((Qt.CrossCursor))
        self._imajnetPlugin=imajnetPlugin
        self.dragging=False
        self.currentMarkerLayer=None
        self.currentMarkerId=None
    
    def setClickMode(self, clickMode):
        self._clickMode=clickMode
        if self._clickMode:
            self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("ImajnetPlugin.onImajnetControlPressed(jQuery(this), 'clickMode');")
        else:
            self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("ImajnetPlugin.onImajnetControlPressed(jQuery(this), 'closestImage');")
        
 
    def canvasPressEvent(self, event):
        if (event.button() == Qt.LeftButton) :
            self.canvas().setCursor( (Qt.ClosedHandCursor))

    def getMarkerByCanvasCoordinates(self, point, mapPoint):
        for layerName,layer in self._imajnetPluginWindow._PyImajnet._markerManager._layers.items():
            for fid,marker in layer.items():
                if (marker.sceneBoundingRect().contains(point)): 
                    if isinstance(marker,QgsRubberBand):
                        geom = marker.asGeometry()
                        if geom.type() == 1 : # for line markers
                            if geom.buffer(1,1).contains(mapPoint):
                                return marker
                        else:
                            if geom.contains(mapPoint):
                                return marker
                    else:                  
                        return marker
        return None
    
    def canvasMoveEvent(self, event):
        if (event.buttons() == Qt.LeftButton) :
            self.dragging=True
            self.canvas().panAction(event)
        else:
            x= event.pos().x()
            y= event.pos().y()
            p = QPointF(x,y)
            mapPoint = self.canvas().getCoordinateTransform().toMapCoordinates(x, y)
            #itemAt crashes on windows
            #marker = self._imajnetPlugin.iface.mapCanvas().itemAt(p);
            #if marker is not None and (isinstance(marker,QgsVertexMarker) or isinstance(marker,QgsRubberBand) ):
            #    layerName = marker.data(MarkerManager.IMAJNET_LAYER_KEY)
            #    markerId = marker.data(MarkerManager.IMAJNET_MARKER_ID_KEY)
            #    if layerName :
            #        ImajnetLog.debug("hover layer item {}.{}".format(layerName,markerId))
            #        if self.currentMarkerLayer != layerName and self.currentMarkerId!=markerId:
            #            self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverInOnMap('{}',{});".format(layerName,markerId));
            #    
            #    if self.currentMarkerLayer is not None and self.currentMarkerLayer != layerName and self.currentMarkerId!=markerId:
            #        self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverOutOnMap('{}',{});".format(self.currentMarkerLayer,self.currentMarkerId))
            #    self.currentMarkerLayer=layerName
            #    self.currentMarkerId=markerId
            #    
            #else:
            #    if self.currentMarkerLayer is not None:
            #        self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverOutOnMap('{}',{});".format(self.currentMarkerLayer,self.currentMarkerId))
            #        self.currentMarkerLayer=None
            #        self.currentMarkerId=None
            marker = self.getMarkerByCanvasCoordinates(p,mapPoint)
            if marker is not None:
                layerName = marker.data(MarkerManager.IMAJNET_LAYER_KEY)
                markerId = marker.data(MarkerManager.IMAJNET_MARKER_ID_KEY)
                ImajnetLog.debug("hover layer item {}.{}".format(layerName,markerId))
                if self.currentMarkerLayer != layerName or self.currentMarkerId!=markerId:
                    self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverInOnMap('{}',{});".format(layerName,markerId));
                
                if self.currentMarkerLayer and (self.currentMarkerLayer != layerName or self.currentMarkerId!=markerId):
                    self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverOutOnMap('{}',{});".format(self.currentMarkerLayer,self.currentMarkerId))
                self.currentMarkerLayer=layerName
                self.currentMarkerId=markerId
            else:
                if self.currentMarkerLayer is not None:
                    self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverOutOnMap('{}',{});".format(self.currentMarkerLayer,self.currentMarkerId))
                    self.currentMarkerLayer=None
                    self.currentMarkerId=None
            
            

    def canvasReleaseEvent(self, event):        
        if (event.button() == Qt.LeftButton) :
            if self.dragging ==  True :
                self.dragging=False
                self.canvas().panActionEnd(event.pos())
            else:
                #handle marker/feature clicks
                x= event.pos().x()
                y= event.pos().y()
                p = QPointF(x,y)
                mapPoint = self.canvas().getCoordinateTransform().toMapCoordinates(x, y)
                #itemAt crashes on windows
                #p = QPoint( event.pos() )
                #marker = self._imajnetPlugin.iface.mapCanvas().itemAt(p);
                #makrerClick=False;
                #if marker is not None :
                #    if (isinstance(marker,QgsVertexMarker) or isinstance(marker,QgsRubberBand) ):
                #        layerName = marker.data(MarkerManager.IMAJNET_LAYER_KEY)
                #        markerId = marker.data(MarkerManager.IMAJNET_MARKER_ID_KEY)
                #        if layerName :
                #            ImajnetLog.debug("click layer item {}.{}".format(layerName,markerId))
                #            if self.currentMarkerLayer is not None:
                #                self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverOutOnMap('{}',{});".format(self.currentMarkerLayer,self.currentMarkerId))
                #                self.currentMarkerLayer=None
                #                self.currentMarkerId=None
                #            makrerClick = self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerClickOnMap('{}',{});".format(layerName,markerId));                    
                #    else: #possible map features
                #        #ImajnetLog.error("clicked type: {}".format(type(marker).__name__))
                #        #ImajnetLog.error("is QgsMapCanvasItem: {}".format(isinstance(marker,QgsMapCanvasItem)))
                #        identifyResult = self.identify(event.pos().x(),event.pos().y(),self._imajnetPluginWindow._PyImajnet.qgsPointProjectedLayers,QgsMapToolIdentify.TopDownAll)
                #        if len(identifyResult) > 0:
                #            result = identifyResult[0]
                #           layer=result.mLayer
                #            featureGeom = result.mFeature.geometry()
                #            #no need to get the center, we only query point layers
                #            jsGeom = ImajnetUtils.convertQgisGeometryToImajnetGeometry(featureGeom,layer.crs(), PyImajnet.geometryTypes[layer.geometryType()])
                #            makrerClick = self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onFeatureClickOnMap('{}');".format(jsGeom));
                marker = self.getMarkerByCanvasCoordinates(p,mapPoint)
                makrerClick=False;
                if marker is not None:
                        layerName = marker.data(MarkerManager.IMAJNET_LAYER_KEY)
                        markerId = marker.data(MarkerManager.IMAJNET_MARKER_ID_KEY)
                        ImajnetLog.debug("click layer item {}.{}".format(layerName,markerId))
                        if self.currentMarkerLayer is not None:
                            self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerHoverOutOnMap('{}',{});".format(self.currentMarkerLayer,self.currentMarkerId))
                            self.currentMarkerLayer=None
                            self.currentMarkerId=None
                        makrerClick = self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onMarkerClickOnMap('{}',{});".format(layerName,markerId));                    
                else: #possible map features
                    #ImajnetLog.error("clicked type: {}".format(type(marker).__name__))
                    #ImajnetLog.error("is QgsMapCanvasItem: {}".format(isinstance(marker,QgsMapCanvasItem)))
                    if self._imajnetPluginWindow._PyImajnet.qgsPointProjectedLayers:
                        identifyResult = self.identify(event.pos().x(),event.pos().y(),self._imajnetPluginWindow._PyImajnet.qgsPointProjectedLayers,QgsMapToolIdentify.TopDownStopAtFirst)
                        if len(identifyResult) > 0:
                            result = identifyResult[0]
                            layer=result.mLayer
                            featureGeom = result.mFeature.geometry()
                            #no need to get the center, we only query point layers
                            geomType = layer.geometryType()
                            jsGeom = ImajnetUtils.convertQgisGeometryToImajnetGeometry(featureGeom,layer.crs(), PyImajnet.geometryTypes[geomType])
                            makrerClick = self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("onFeatureClickOnMap('{}');".format(jsGeom));
                                   
                if not makrerClick:
                    point = self.canvas().getCoordinateTransform().toMapCoordinates(x, y)
                    imajnetCoord= ImajnetUtils.transformQgisMapCoordToImajnetCoord(self.canvas(),(point))
                    self._imajnetPluginWindow.m_view.page().currentFrame().evaluateJavaScript("ImajnetMap.mapClickHandler({})".format(imajnetCoord))
                        
                            
        self.canvas().setCursor((Qt.OpenHandCursor))          
        
    #def activate(self):
    #    super(QgsMapTool, self).activate()
               
    def deactivate(self):
        self._imajnetPlugin.uncheckImajnetActions()
        #super(QgsMapTool, self).deactivate()
        #self.emit(SIGNAL("deactivated()"))

   
    
    