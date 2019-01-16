
import os
import re
import collections
import datetime

from PyQt5 import QtGui, QtWidgets, uic 
from PyQt5.QtGui import QPainter
from PyQt5.QtCore import pyqtSignal, QUrl, QObject, QVariant, QSize, QSettings,QBuffer, QRect
from PyQt5.QtSvg import QSvgGenerator
from PyQt5.Qt import QFileInfo, pyqtSlot, QStringListModel, QHBoxLayout, \
    QPushButton
from PyQt5.QtWebKitWidgets import  QWebPage, QWebInspector
from PyQt5.QtWebKit import QWebElement, QWebSettings
# from PyQt5.QtGui import QVBoxLayout, QShortcut, QKeySequence
from numpy import double
# from PySide import QtGui, QtCore, QtWebKit
from PyQt5.QtWidgets import QApplication, QSplitter, QVBoxLayout, QWidget, QFileDialog
from qgis.utils import iface
from qgis.core import  QgsVectorFileWriter, QgsFields, QgsRenderContext,QgsProject, QgsMapLayer,QgsVectorDataProvider, QgsWkbTypes, QgsRasterLayer, QgsCoordinateReferenceSystem, QgsCoordinateTransform
from .ImajnetUtils import ImajnetUtils
from .MarkerManager import MarkerManager
from PyQt5.QtNetwork import QNetworkAccessManager, QNetworkCookieJar, QNetworkRequest

import json
# from .QGisImajnetPlugin import QGisImajnetPlugin
# Such a wild import is not good for performance but usefull for debug sometime
# from qgis import *
# from qgis.core import *

# Rather prefer this :
from qgis.core import QgsVectorLayer, QgsFeature, QgsGeometry, QgsPointXY, QgsProject, QgsField, QgsWkbTypes, QgsFeatureRequest
from .TileMapScaleLevels import TileMapScaleLevels
import sys
import inspect
from .ImajnetLog import ImajnetLog

from.openlayers.imajnet import ImajnetTilesMapLayer
from.openlayers.openlayers_layer import OpenlayersLayer

class PyImajnet(QWidget):

    _page= None
    _imajnetLayer= None
    
    _imajnetTilesLayerName='Imajnet tiles'
    _tileMapScaleLevels = None
    _markerManager = None
    geometryTypes = ['point','line','polygon']
    #_plugin = None
    networkAccessManager=None
    qgsProjectedLayers = []
    qgsPointProjectedLayers = []
    
    def __init__(self, page, plugin, iface):
        super(PyImajnet, self).__init__()
        self._layers=dict()
        self._page = page
        self._tileMapScaleLevels = TileMapScaleLevels()
        self._page.mainFrame().javaScriptWindowObjectCleared.connect(self.populateJavaScriptWindowObject)
        self.iface=iface
        self.iface.mapCanvas().scaleChanged.connect(self.mapScaleChanged)
        self.iface.mapCanvas().layersChanged.connect(self.mapLayersChanged)
        QgsProject.instance().layerTreeRoot().layerOrderChanged.connect(self.mapLayersChanged)
        QgsProject.instance().cleared.connect(self.mapLayersChanged)
        QgsProject.instance().writeProject.connect(self.onProjectSaving)
        QgsProject.instance().readProject.connect(self.onProjectOpened)
        self._markerManager = MarkerManager(self.iface.mapCanvas())
        self._plugin = plugin
        self._imajnetTilesLayer=None
        self.networkAccessManager=None
        #clipboard content download
        self.fileDownloadNetworkAccessManager = QNetworkAccessManager()
        self.fileDownloadNetworkAccessManager.finished.connect(self.fileDownloadFinished)
        self.qgsProjectedLayers = []
        self.qgsPointProjectedLayers = []
        
        #symbol rendering
        #qgsRenderContext = QgsProject.instance().layoutManager().layouts()[0].renderContext()
        self.qgsRenderContext = QgsRenderContext()
        self.markerSize = QSize(20,20)
        #self.markerSize = QSize(54,54)
        self.svgViewVox = QRect( 0, 0, self.markerSize.height(), self.markerSize.height() )
        #self.generator = QSvgGenerator()
        #self.generator.setSize( self.markerSize )
        #self.generator.setViewBox( QRect( 0, 0, self.markerSize.height(), self.markerSize.height() ) )
        #self.painter = QPainter(self.generator );
        
        #TODO: remove after implementing real ROI feature
        self.roiFileDownloadNetworkAccessManager = QNetworkAccessManager()
        self.roiFileDownloadNetworkAccessManager.finished.connect(self.roiFileDownloadFinished)
        
    def populateJavaScriptWindowObject(self):
        """
        Script injection
        The connection from JS to python is made here : 
        Each time JS will call JStoPython.{AnyMethods()} python method AnyMethods of this class will be trigerred
        Obviously this later must be decorated with proper @pyqtSlot() args to be able to receive what JS sends
        This should not be touched since this is the main JS/Python. Connection is performed by naming match after this step.
        Please consider touching slot methods instead
        """  
        self._page.mainFrame().addToJavaScriptWindowObject("PyImajnet", self)
    
    @pyqtSlot(str)
    def downloadFile(self, url):
        self.fileDownloadNetworkAccessManager.setCookieJar(self.networkAccessManager.cookieJar())
        self.downloadRequest = QNetworkRequest(QUrl(url))
        self.downloadReply = self.fileDownloadNetworkAccessManager.get(self.downloadRequest)
        
    def fileDownloadFinished(self):
        path = os.path.expanduser(os.path.join('~', unicode(self.downloadReply.url().path()).split('/')[-1]))
        if path.find('position')!=-1:
            imgId = re.search('id":"(.+?)"', path)
            if imgId:
                path = "imajnet_image_" + imgId.group(1) + '.jpeg'
            else:
                path='image.jpeg'
        destination = QFileDialog.getSaveFileName(self, self.translateText("Save file"), path)
        if destination and destination[0] is not '':
            filename = destination[0]
            with open(filename, 'wb') as f:
                f.write((self.downloadReply.readAll()))
                f.close()
            if path.endswith("kml") or path.endswith("kmz") or path.endswith("KML") or path.endswith("KMZ"):
                #add to project
                downloadedLayer = QgsVectorLayer(filename,os.path.basename(filename))
                QgsProject.instance().addMapLayer(downloadedLayer)
        
    def onPluginClose(self):
        if self._layers is None:
            return
        self.deactivateImajnet()
        self.iface.mapCanvas().scaleChanged.disconnect(self.mapScaleChanged) 
        self.iface.mapCanvas().layersChanged.disconnect(self.mapLayersChanged)
        QgsProject.instance().layerTreeRoot().layerOrderChanged.disconnect(self.mapLayersChanged)
        QgsProject.instance().cleared.disconnect(self.mapLayersChanged)
        QgsProject.instance().writeProject.disconnect(self.onProjectSaving)
        QgsProject.instance().readProject.disconnect(self.onProjectOpened)
        self._markerManager.removeAllLayersFromMap()
        self._layers=None
        

         
    @pyqtSlot('QVariantMap', 'QVariant', result=str) 
    def centerMapToPosition(self, position, onlyIfNotVisible):
        ImajnetLog.debug("Centering map to : [{}, {}],onlyIfNotVisible: {}".format(position["lon"], position["lat"], onlyIfNotVisible))
        mapCanvas = self.iface.mapCanvas()
        center = QgsPointXY(ImajnetUtils.transformImajnetCoordToQgisMapCoord(mapCanvas, position))
        if (onlyIfNotVisible is False) or not(mapCanvas.extent().contains(center)):
            mapCanvas.setCenter(center)
            if (self._imajnetTilesLayer is not None):
                self._imajnetTilesLayer.triggerRepaint()
    
    @pyqtSlot(result='QVariantMap') 
    def getMapCenter(self):
        mapCanvas = self.iface.mapCanvas()
        center = ImajnetUtils.transformQgisMapCoordToImajnetCoord(mapCanvas,mapCanvas.center())
        return json.loads(center)
    
    def qgisLayerToLayerWrapper(self, layer):
        hasZ=QgsWkbTypes.hasZ(layer.dataProvider().wkbType())
        return self.createLayerWrapper(layer.name(), layer.id(), PyImajnet.geometryTypes[layer.geometryType()],hasZ)
    
    def qgisFeatureToFeatureWrapper(self, layer, feature):
        wrapper =self.createFeatureWrapper(layer.id(), layer.name(), feature.id())
        return wrapper
        
    def createLayerWrapper(self, name, id=None, geometryType=None, hasZ=False):
        layerWrapper =dict()
        layerWrapper["name"] = name
        if id is not None:
            layerWrapper["id"] = id
        if geometryType is not None:
            layerWrapper["geometryType"] = geometryType 
        if hasZ is not None:
            layerWrapper["hasZ"] = hasZ               
        return layerWrapper

    def createFeatureWrapper(self,layerId, layerName, featureId):
        wrapper=dict()
        if layerId is not None:
            wrapper["layer"] = layerId
        if layerName is not None:
            wrapper["layerName"] = layerName
        wrapper["feature"] = featureId
        #wrapper["id"] = featureId
        return wrapper

    @pyqtSlot(result='QVariantMap') 
    def addImajnetLayerToMap(self, result=str):
        ImajnetLog.info("addImajnetLayerToMap")
        
        layerType = ImajnetTilesMapLayer()

        # create OpenlayersLayer
        self._imajnetTilesLayer = OpenlayersLayer(self.iface, self)
        self._imajnetTilesLayer.setName("Imajnet")
        self._imajnetTilesLayer.setLayerType(layerType)

        
        self._imajnetTilesLayer.willBeDeleted.connect(self.imajnetLayerWillBeDeleted)
        

        #if layer.isValid():
        coordRefSys = layerType.coordRefSys(self.canvasCrs())
        self.setMapCrs(coordRefSys)
        QgsProject.instance().addMapLayer(self._imajnetTilesLayer)

        
        #uncomment this in order to debug the map
        #self._plugin.showOrHideDebugWindow()
        #ImajnetUtils.setupWebViewForDebug(self._imajnetTilesLayer.m_view)
        #self._plugin.mapDebugWidget.setPage(self._imajnetTilesLayer.olWebPage)
        #self._plugin.showOrHideDebugWindow()
        #self._plugin.showOrHideDebugWindow()
                            
        result = self.createLayerWrapper(PyImajnet._imajnetTilesLayerName)
        return self.returnPyDictToJs(result)
    
    def imajnetLayerWillBeDeleted(self):
        self._imajnetTilesLayer = None
   
    
    def canvasCrs(self):
        mapCanvas = self.iface.mapCanvas()
        crs = mapCanvas.mapSettings().destinationCrs()
        return crs

    def setMapCrs(self, coordRefSys):
        mapCanvas = self.iface.mapCanvas()
        # On the fly
        canvasCrs = self.canvasCrs()
        if canvasCrs != coordRefSys:
                #try:
                #coordTrans = QgsCoordinateTransform(canvasCrs, coordRefSys,
                #                                    QgsProject.instance())
                #extMap = mapCanvas.extent()
                #extMap = coordTrans.transform(
                #    extMap, QgsCoordinateTransform.ForwardTransform)
                mapCanvas.setDestinationCrs(coordRefSys)
                mapCanvas.freeze(False)
                #mapCanvas.setExtent(extMap)
                #except Exception:
                    #pass
            
    @pyqtSlot(str, result='QVariantMap') 
    def addVectorLayerToMap(self, name):
        ImajnetLog.debug("addVectorLayerToMap - {}".format(name))
        self._markerManager.addMarkerLayer(name)
        result = self.createLayerWrapper(name)
        return self.returnPyDictToJs(result)
        
    @pyqtSlot(str, result='QVariantMap') 
    def addMarkerLayerToMap(self, name):
        ImajnetLog.debug("addMarkerLayerToMap - {}".format(name))
        self._markerManager.addMarkerLayer(name)
        result = self.createLayerWrapper(name)
        return self.returnPyDictToJs(result)
    
    @pyqtSlot('QVariantMap') 
    def removeLayerFromMap(self, layer):
        ImajnetLog.debug("removeLayerFromMap - {}".format(layer))
        if not(PyImajnet._imajnetTilesLayerName == layer["name"]) :
            self._markerManager.removeLayerFromMap(layer["name"])
        else:
            ImajnetLog.info("remove imajnet tiles")
            if (self._imajnetTilesLayer is not None):
                QgsProject.instance().removeMapLayer(self._imajnetTilesLayer)
                self._imajnetTilesLayer =  None

            
    
    @pyqtSlot('QVariantMap', 'QVariantMap', result='QVariantMap')
    def addMarker(self, markerLayer, markerData):
        ImajnetLog.debug("addMarker - {},{}".format(markerLayer, markerData))
        layerName = markerLayer["name"]
        markerId = self._markerManager.addPointMarker(layerName, markerData)
        if markerId is not None :
            markerWrapper = self.createFeatureWrapper(layerName,layerName, markerId) 
            return self.returnPyDictToJs(markerWrapper)
        else:
            ImajnetLog.error('Unable to add marker')
            return None
    
    @pyqtSlot('QVariantMap', 'QVariantMap')
    def removeMarker(self, markerLayer, markerWrapper):
        ImajnetLog.debug("removeMarker")#- {},{}".format(markerLayer, markerWrapper))
        self._markerManager.removeMarkerByFid(markerLayer["name"],float(markerWrapper["feature"]))
    
    @pyqtSlot('QVariantMap', 'QVariantMap', 'QVariantMap', result='QVariantMap')
    def addFeature(self, vectorLayer, pointsArray, featureOptions):
        #ImajnetLog.debug("addFeature - {},{},{}".format(vectorLayer, pointsArray, featureOptions))
        ImajnetLog.debug("addFeature - {}, options:{}, coords ommited".format(vectorLayer, featureOptions))
        layerName = vectorLayer["name"]
        featureId = self._markerManager.addPolygonMarker(layerName,pointsArray,featureOptions)
        if featureId is not None :
            featureWrapper = self.createFeatureWrapper(layerName,layerName, featureId)
            return self.returnPyDictToJs(featureWrapper)
        else:
            ImajnetLog.error('Unable to add feature')
            return None
    
    @pyqtSlot('QVariantMap') 
    def removeAllMarkersFromLayer(self, layer):
        ImajnetLog.debug("removeAllMarkersFromLayer - {}".format(layer))
        self._markerManager.removeAllMarkersFromLayer(layer["name"])
        
    @pyqtSlot('QVariantMap') 
    def removeAllFeatures(self, layer):
        ImajnetLog.debug("removeAllFeatures - {}".format(layer))
        self._markerManager.removeAllMarkersFromLayer(layer['name'])
    
    @pyqtSlot(result=float) 
    def getCurrentZoomLevel(self):
        zoom = self._tileMapScaleLevels.getZoomlevel(self.iface.mapCanvas().scale())
        ImajnetLog.debug('zoom:{}'.format(zoom))
        return zoom
    
    @pyqtSlot(int)
    def setMapZoomLevel(self, zoomLevel):
        scale =  self._tileMapScaleLevels.getScale(zoomLevel);
        self.iface.mapCanvas().zoomScale(scale)
    
    
    def getFeatureFromLayer(self, layerId, featureId):
        layer = QgsProject.instance().mapLayer(layerId)
        if layer is None:
            return None
        feature = layer.getFeature(featureId)
        return feature
    
    @pyqtSlot('QVariantMap')
    def zoomMapToFeatureWrapper(self, featureWrapper):
        ImajnetLog.debug("zoomMapToFeatureWrapper - {}".format(featureWrapper))
        #does not actually zoom to feature, it pans to it
        feature = self.getFeatureFromLayer(featureWrapper["layer"], float(featureWrapper["feature"]))
        if feature is None:
            return
        #TODO: this does not work self.iface.mapCanvas().zoomToFeatureExtent(feature.geometry().boundingBox())
        self.iface.mapCanvas().zoomToSelected()

    @pyqtSlot('QVariantMap')
    def onFeatureClick(self, featureWrapper):
        ImajnetLog.debug("onFeatureClick - {}".format(featureWrapper))
        feature = self.getFeatureFromLayer(featureWrapper["layer"], float(featureWrapper["feature"]))
        if feature is None:
            return
        layer = QgsProject.instance().mapLayer(featureWrapper["layer"])
        self.iface.openFeatureForm(layer,feature,False,False)
        
    @pyqtSlot('QVariantMap')
    def highlightMarker(self, featureWrapper):
        ImajnetLog.info("highlightFeature - {}".format(featureWrapper))
        self._markerManager.highlightMarker(featureWrapper["layer"],float(featureWrapper["feature"]))
    
    @pyqtSlot('QVariantMap')
    def unHighlightMarker(self, featureWrapper):
        ImajnetLog.info("unHighlightFeature - {}".format(featureWrapper))
        self._markerManager.unHighlightMarker(featureWrapper["layer"],float(featureWrapper["feature"]))
    
    @pyqtSlot('QVariantMap')
    def highlightFeature(self, featureWrapper):
        ImajnetLog.info("highlightFeature - {}".format(featureWrapper))
        layerName = featureWrapper["layer"]
        markerLayer=self._markerManager.getLayerByName(layerName)
        if (markerLayer is not None):
            self.highlightMarker(featureWrapper)
        else:
            layer = QgsProject.instance().mapLayer(layerName)
            if layer is None:
                return
            layer.select(featureWrapper["feature"])
    
    @pyqtSlot('QVariantMap')
    def unHighlightFeature(self, featureWrapper):
        ImajnetLog.info("unHighlightFeature - {}".format(featureWrapper))
        layerName = featureWrapper["layer"]
        markerLayer=self._markerManager.getLayerByName(layerName)
        if (markerLayer is not None):
            self.unHighlightMarker(featureWrapper)
        else:
            layer = QgsProject.instance().mapLayer(layerName)
            if layer is None:
                return
            layer.deselect(featureWrapper["feature"])
        
    
    @pyqtSlot(result='QVariantMap') 
    def loadSettings(self):
        ImajnetLog.debug("loadSettings")
        s = QSettings()
        proj = QgsProject.instance()
        
        settings = dict()
        
        settings["imajnetLoginSettings"]= json.loads(proj.readEntry("imajnet", "imajnetLoginSettings", s.value("imajnet/imajnetLoginSettings","{}"))[0])
        settings["imajnetProjectSettings"]= json.loads(proj.readEntry("imajnet", "imajnetProjectSettings", "{}")[0])
        settings["imajnetGlobalSettings"]= json.loads(s.value("imajnet/imajnetGlobalSettings","{}"))
        
        return self.returnPyDictToJs(settings)
    
    @pyqtSlot('QVariantMap','QVariantMap','QVariantMap') 
    def saveSettings(self, imajnetLoginSettings,imajnetProjectSettings,imajnetGlobalSettings):
        ImajnetLog.debug("saveSettings: {},{},{}".format(imajnetLoginSettings,imajnetProjectSettings,imajnetGlobalSettings))
        s = QSettings()
        proj = QgsProject.instance()
        
        
        
        if imajnetLoginSettings is not None and len(imajnetLoginSettings) > 0:
            proj.writeEntry("imajnet", "imajnetLoginSettings", json.dumps(imajnetLoginSettings))
            s.setValue("imajnet/imajnetLoginSettings", json.dumps(imajnetLoginSettings))

        #todo: write them separately (also read)
        if imajnetProjectSettings is not None and len(imajnetProjectSettings) > 0:
            proj.writeEntry("imajnet", "imajnetProjectSettings", json.dumps(imajnetProjectSettings))
       
        #todo: write them separately (also read)
        if imajnetGlobalSettings is not None and len(imajnetGlobalSettings) > 0:
            s.setValue("imajnet/imajnetGlobalSettings", json.dumps(imajnetGlobalSettings))
    
        
    @pyqtSlot(result=str) 
    def getLocale(self):
        return QSettings().value('locale/userLocale')[0:2]
    
    
    def _isLayerEditable(self, layer):
        if layer.type() != QgsMapLayer.VectorLayer :
            ImajnetLog.info("Ignoring layer<{}>, not a vector layer".format(layer.name()))
            return False
        if layer.readOnly() :
            ImajnetLog.info("Ignoring layer<{}>, it is readonly".format(layer.name()))
            return False
        if not layer.isEditable() :
            ImajnetLog.info("Ignoring layer<{}>, it isn't editable".format(layer.name()))
            return False
        if layer.geometryType() >2 :
            ImajnetLog.info("Ignoring layer<{}>, bad geometry type".format(layer.name()))
            return False
        if not layer.isValid():
            ImajnetLog.info("Ignoring layer<{}>, not valid".format(layer.name()))
            return False
        return True
        
    @pyqtSlot(result='QVariantMap') 
    def getEditableLayers(self):
        layers = QgsProject.instance().layerTreeRoot().layerOrder()
        jsLayers = []
        for  layer in layers:
            if not self._isLayerEditable(layer) :
                continue
            jsLayer = self.qgisLayerToLayerWrapper(layer)
            jsLayers.append(jsLayer)
        result = dict()
        result["layers"] = jsLayers
        return self.returnPyDictToJs(result)
    
    def _isLayerReadable(self, layer):
        if layer.type() != QgsMapLayer.VectorLayer :
            ImajnetLog.info("Ignoring layer<{}>, not a vector layer".format(layer.name()))
            return False
        if layer.geometryType() >2 :
            ImajnetLog.info("Ignoring layer<{}>, bad geometry type".format(layer.name()))
            return False
        if not layer.isValid():
            ImajnetLog.info("Ignoring layer<{}>, not valid".format(layer.name()))
            return False
        return True
    
    @pyqtSlot(result='QVariantMap') 
    def getReadableLayers(self):
        layers = QgsProject.instance().layerTreeRoot().layerOrder()
        jsLayers = []
        for  layer in layers:
            if not self._isLayerReadable(layer) :
                continue
            jsLayer = self.qgisLayerToLayerWrapper(layer)
            jsLayers.append(jsLayer)
        
        result = dict()
        result["layers"] = jsLayers
        return self.returnPyDictToJs(result)
    
    @pyqtSlot('QVariantMap','QVariantMap', "QString", "QString",result=bool) 
    def addGeometryToLayer(self, jsLayer, jsGeom, zAttributeName, zValue):
        ImajnetLog.debug("addGeometryToLayer: {},{}".format(jsLayer,jsGeom))
        #try:
        layer = QgsProject.instance().mapLayer(jsLayer["id"])
            
        feature = QgsFeature(layer.fields())
        
        if zAttributeName:
            feature.setAttribute(zAttributeName,zValue)
            
        #todo: refactor JS!!!!!!
        geometryType = PyImajnet.geometryTypes[layer.geometryType()]
        geom = None
        if 'point' in geometryType:
            geom = QgsGeometry(ImajnetUtils.transformImajnetXYPointToQgisMapCoord(self.iface.mapCanvas(),jsGeom["0"],layer.crs()))
        else:
            if 'line' in geometryType:
                geom = QgsGeometry(ImajnetUtils.convertJsPointsArrayToPolyline(self.iface.mapCanvas(),jsGeom,layer.crs()))
            else:
                geom = QgsGeometry(ImajnetUtils.convertJsPointsArrayToPolygon(self.iface.mapCanvas(),jsGeom,False,layer.crs()))               
        if geom is not None:
            feature.setGeometry(geom)

        (res, outFeats) = layer.dataProvider().addFeatures([feature])
        if res:
                layer.updateExtents()       
                layer.triggerRepaint()
                feature = outFeats[0]
                fid = feature.id()
                ImajnetLog.debug('addGeometryToLayer fid: {}'.format(fid))
                
                self.iface.openFeatureForm(layer,feature,False,False)
                return True
        else:
            ImajnetLog.error('unable to add geometry to layer: {}, res:{}'.format(jsLayer,res));
            return False

        return True
        #except:
        #   ImajnetLog.error("Unable to add geometry to layer: {}, {}".format(jsLayer,sys.exc_info()[0]))
        #   return False
    
    @pyqtSlot('QVariantMap','QVariantMap',result=bool) 
    def addAttributeToLayer(self, jsLayer, attribute):
        layer = QgsProject.instance().mapLayer(jsLayer["id"])
        layerAttributes=[]
        if layer is None:
            return False
        pr = layer.dataProvider()
        result = pr.addAttributes([
                        QgsField(attribute["name"], QVariant.String)])
        if not result:
            return False
        layer.updateFields()
        
        return True
    
    @pyqtSlot('QVariantMap',result=bool) 
    def canAddAttributesToLayer(self, jsLayer):
        layer = QgsProject.instance().mapLayer(jsLayer["id"])
        layerAttributes=[]
        if layer is None:
            return False
        if not self._isLayerEditable(layer):
            return False
        
        capabilities = layer.dataProvider().capabilities()
        ImajnetLog.info("capabilities: {}".format(capabilities))
        return capabilities & QgsVectorDataProvider.AddAttributes
          
          
    @pyqtSlot('QVariantMap',result='QVariantMap') 
    def getLayerAttributes(self, jsLayer):
        layer = QgsProject.instance().mapLayer(jsLayer["id"])
        layerAttributes=[]
        if layer is None:
            return layerAttributes
        for field in layer.fields():
            typeName= field.typeName().lower()
            sdkTypeName= None
            if 'date' in typeName or 'bool' in typeName:
                continue
            if 'real' in typeName or 'float' in typeName or 'double' in typeName or 'decimal' in typeName:
                sdkTypeName = 'Real'
            if 'int' in typeName or 'numeric' in typeName or 'long' in typeName:
                sdkTypeName = 'Integer'
            if 'string' in typeName or 'char' in typeName or 'text' in typeName:
                sdkTypeName = 'String'
            
            if  sdkTypeName : 
                attribute = dict()
                attribute["name"]= field.name()
                attribute["type"]=sdkTypeName
                layerAttributes.append(attribute)
        result = dict()
        result["attributes"] = layerAttributes
        return self.returnPyDictToJs(result)
    
    @pyqtSlot('QVariantMap','QVariantMap','QVariant',result='QVariantMap')
    def getProjectionCandidates(self, position, constraintGeometry, projectedLayers):
        ImajnetLog.info("getProjectionCandidates: {}, geom not printed, {}".format(position,projectedLayers))
        result = dict()
        jsLayers = []
        self.qgsProjectedLayers = []
        self.qgsPointProjectedLayers = []
        for jsLayer in projectedLayers:
            layerId=jsLayer["id"]
            zField = jsLayer["zField"]
            ImajnetLog.debug("{}".format(layerId))
            
            layer = QgsProject.instance().mapLayer(layerId)
            if layer is None:
                continue
            gqsFeatureRenderer = layer.renderer()
            
            isPointLayer = 'point' in PyImajnet.geometryTypes[layer.geometryType()]

            self.qgsProjectedLayers.append(layer)
            if isPointLayer:
                self.qgsPointProjectedLayers.append(layer)
            
            #parse geometry - TODO: refactor, pase once and reproject
            layerCrs=layer.crs()
            constraintGeom = ImajnetUtils.convertJsPointsArrayToPolygon(self.iface.mapCanvas(),constraintGeometry, True, layerCrs)
    
            request = QgsFeatureRequest().setFilterRect(constraintGeom.boundingBox())# Only return selected fields
            #request.setSubsetOfAttributes([])
            request.setLimit(50)
            
            layerName=layer.name()
            if layer.type() != QgsMapLayer.VectorLayer :
                ImajnetLog.info("Ignoring layer<{}>, not a vector layer".format(layerName))
                continue
            if layer.geometryType() >2 :
                ImajnetLog.info("Ignoring layer<{}>, bad geometry type".format(layerName))
                continue
            
            jsLayer = self.qgisLayerToLayerWrapper(layer)
            jsLayer["features"]= []
            
            
            for feature in layer.getFeatures(request):
                featureGeometry = feature.geometry()
                if featureGeometry.intersects(constraintGeom):
                    featureWrapper=self.qgisFeatureToFeatureWrapper(layer,feature)
                    
                    if zField :
                        featureWrapper["zField"]=feature.attribute(zField);
                        
                    #geometry may be big, we need to clip it
                    featureGeometry = featureGeometry.clipped(constraintGeom.boundingBox())
                    
                    featureWrapper["geometry"]=ImajnetUtils.convertQgisGeometryToImajnetGeometry(featureGeometry,layerCrs, jsLayer["geometryType"])
                    
                    gqsFeatureRenderer.startRender(self.qgsRenderContext,feature.fields())
                    
                    self.symbols = gqsFeatureRenderer.symbolsForFeature(feature, self.qgsRenderContext)
                    if not self.symbols:
                        qgsSymbol = gqsFeatureRenderer.symbolForFeature(feature, self.qgsRenderContext)
                        self.symbols = [qgsSymbol]
                        
                    style = dict()
                    featureWrapper["style"]= []
                    featureWrapper["style"].append(style)
                    #feature style
                    if isPointLayer :                        
                        
                        
                        #obtain image and write it to file
                        #imagePath = '/tmp/imajnet_qgs_symbol_{}_{}.svg'.format(layerId,feature.id())
                        #qgsSymbol.exportImage(imagePath, 'svg', size)
                        #style['externalGraphic']=imagePath
                        ##image = qgsSymbol.asImage(.....)
                        ##image = qgsSymbol.bigSymbolPreviewImage()
                        ##image.save(imagePath,'SVG')
                        
                        #obtain svg and pas it directly
                        
                        self.generator = QSvgGenerator()
                        qbuffer =QBuffer()
                        qbuffer.open(QBuffer.ReadWrite)
                        self.generator.setOutputDevice(qbuffer)
                        self.generator.setSize( self.markerSize )
                        self.generator.setViewBox( self.svgViewVox )
                        self.painter = QPainter(self.generator );
                        for qgsSymbol in self.symbols:
                            qgsSymbol.drawPreviewIcon( self.painter, self.markerSize )
                        self.painter.end();
     
                        qbuffer.seek(0);
                        svgString = str(qbuffer.readAll());
                        svgString= svgString.replace("\\n"," ");
                        style['externalGraphic']=svgString                        
                    else:
                        #for qgsSymbol in symbols:
                        qgsSymbol = self.symbols[0]
                        color = qgsSymbol.color()
                        
                        style['fillColor'] = 'rgba({}, {}, {}, {})'.format(color.red(),color.green(),color.blue(),255.0/color.alpha())
                        style['strokeColor'] = style['fillColor']
                        #style['fillColor'] = 'rgba(20, 158, 206, 0.5)'
                        #style['strokeColor'] = 'rgba(255, 255, 255, 0.85)'
                        style['strokeWidth'] = 2
               
                    gqsFeatureRenderer.stopRender(self.qgsRenderContext)
                    
                    jsLayer["features"].append(featureWrapper)
                    
                
                #TODO: ahndle styles
                #renderer = layer.renderer()
                #ImajnetLog.info("renderer Type: {}".format(renderer.type()))
                
            if len(jsLayer["features"])>0 :
                jsLayers.append(jsLayer)
        result["layers"] = jsLayers
        return result
        
    #TODO: hook up to projet opening
    def onProjectOpened(self):
        self._page.currentFrame().evaluateJavaScript("onProjectOpened();")

    #TODO: hook up to projet saving, it is called just before save
    def onProjectSaving(self):
        self._page.currentFrame().evaluateJavaScript("onProjectSaving();")

    #TODO: hook up to projet changes - layer add/remove, to be determined    
    def onProjectChange(self):
        self._page.currentFrame().evaluateJavaScript("onProjectChange();")
    
    def mapLayersChanged(self):
        ImajnetLog.info("mapLayersChanged")
        self.onProjectChange()
        
    def mapScaleChanged(self):
        self._page.currentFrame().evaluateJavaScript("onZoomEnd();")
        
    def deactivateImajnet(self):
        self._page.currentFrame().evaluateJavaScript("deactivateImajnet();")
        
    @pyqtSlot()
    def onImajnetDeactivated(self):
        self._plugin.disableImajnetActions()
    
    @pyqtSlot() 
    def onImajnetActivated(self):
        self._plugin.enableImajnetActions()
    
    @pyqtSlot('QVariantMap')
    def imajnetLoginSuccess(self, user):
        if "imajnet-" in user["role"]["name"] :
            self._plugin.enableAdvancedFeatures()
        else :
            self._plugin.disableAdvancedFeatures()
        
    @pyqtSlot(str,result=str) 
    def translateText(self, text):
        return self._plugin.tr(text)
    
    @pyqtSlot(int, str) 
    def log(self,level, msg):
        # methods = ['debug','log','trace','info','warn','error']
        if 0==level  :
            ImajnetLog.debug("JS-LOG: {}".format(msg))
        else:
            if  1==level or 2 == level or 3 == level :
                ImajnetLog.info("JS-LOG: {}".format(msg))
            else:
                if 4 == level :
                    ImajnetLog.warning("JS-LOG: {}".format(msg))
                else:
                    ImajnetLog.error("JS-LOG: {}".format(msg))
         
    def returnPyDictToJs(self,obj):
        js = json.dumps(obj)
        ImajnetLog.debug("returning: {}".format(js))
        return json.loads(js)
    
    
             
    #############################################
    ###### ROI temporary ########################
    #############################################
    
    @pyqtSlot('QVariantMap','QVariantMap', "QVariantMap", "QString",result=bool) 
    def createROI(self, roi, imageDetails,photogrammetryInfo,imageUrl):
        #iterate editable layers and find one that corresponds to the ROI structure
        layers = QgsProject.instance().layerTreeRoot().layerOrder()
        self.roiLayer = None
        for  layer in layers:
            if not self._isLayerReadable(layer) :
                continue      
            #fields[0] = FID
            fields = layer.fields()
            index=-1
            #ImajnetLog.error(fields[index+1].name())
            #ImajnetLog.error(fields[index+2].name())
            #ImajnetLog.error(fields[index+3].name())
            #ImajnetLog.error(fields[index+4].name())
            #ImajnetLog.error(fields[index+5].name())
            #ImajnetLog.error(fields[index+6].name())
            
            #ImajnetLog.error("ok:{}".format('FID' in fields[0].name() and 'Sequence' in fields[1].name()) )
            valid=('label' in fields[index+1].name()) and  ('comment' in fields[index+2].name()) and  ('image' in fields[index+3].name()) and  ('width' in fields[index+4].name()) and  ('height' in fields[index+5].name()) and  ('xmin' in fields[index+6].name()) and ('ymin' in fields[index+7].name()) and  ('xmax' in fields[index+8].name()) and  ('ymax' in fields[index+9].name())

            if valid :
                self.roiLayer = layer
            break
        
        if not self.roiLayer:
            fields = QgsFields()
            fields.append(QgsField("label", QVariant.String))
            fields.append(QgsField("comment", QVariant.String))
            fields.append(QgsField("image", QVariant.String))
            fields.append(QgsField("width",  QVariant.Int))
            fields.append(QgsField("height",  QVariant.Int))
            fields.append(QgsField("xmin", QVariant.Int))
            fields.append(QgsField("ymin", QVariant.Int))
            fields.append(QgsField("xmax", QVariant.Int))
            fields.append(QgsField("ymax", QVariant.Int))
            fields.append(QgsField("aux1", QVariant.String))
            now = datetime.datetime.now()
            timestamp = now.strftime("%Y%m%d_%H%M")
            layerPath = os.path.join(QgsProject.instance().readPath("./"),"imajnet_roi_{}.shp".format(timestamp))
            writer = QgsVectorFileWriter(layerPath,
                             "utf8",
                             fields,
                             QgsWkbTypes.Point, 
                             QgsCoordinateReferenceSystem(4326), 
                             "ESRI Shapefile")
            del writer
            #self.roiLayer = QgsVectorLayer("point?crs=epsg:4326", "Imajnet ROI", "memory")
            self.roiLayer = QgsVectorLayer(layerPath, "Imajnet ROI {}".format(timestamp), "ogr")
    
            #pr = self.roiLayer.dataProvider()
            #pr.addAttributes([QgsField("label", QVariant.String),
            #               QgsField("comment", QVariant.String),
            #                QgsField("image", QVariant.String),
            #               QgsField("width",  QVariant.Int),
            #                QgsField("height",  QVariant.Int),
            #                QgsField("xmin", QVariant.Double),
            #                QgsField("ymin", QVariant.Double),
            #                QgsField("xmax", QVariant.Double),
            #                QgsField("ymax", QVariant.Double)])
            #pr.addAttributes(fields.toList())
            #self.roiLayer.updateFields() # tell the vector layer to fetch changes from the provider
            QgsProject.instance().addMapLayer(self.roiLayer)
         
        if not self._isLayerEditable(self.roiLayer) :
            self.roiLayer.startEditing()

        if not self.roiLayer.isValid():
          return False
        self.roiCoord = QgsGeometry.fromPointXY(QgsPointXY(float(imageDetails["lon"]), float(imageDetails["lat"])))
        self.roiAttributes=["", "","", float(photogrammetryInfo["width"]), float(photogrammetryInfo["height"]),
                             float(roi["xmin"]),float(roi["ymin"]),float(roi["xmax"]),float(roi["ymax"]),json.dumps(imageDetails)]
        self.downloadFileForROI(imageUrl)
        return True
        
    @pyqtSlot(str)
    def downloadFileForROI(self, url):
        self.roiFileDownloadNetworkAccessManager.setCookieJar(self.networkAccessManager.cookieJar())
        roiDownloadRequest = QNetworkRequest(QUrl(url))
        self.roiDownloadReply = self.roiFileDownloadNetworkAccessManager.get(roiDownloadRequest)
        
    def roiFileDownloadFinished(self):
        path = os.path.expanduser(os.path.join('~', unicode(self.roiDownloadReply.url().path()).split('/')[-1]))
        imgFileName = ""
        if path.find('position')!=-1:
            imgId = re.search('id":"(.+?)"', path)
            if imgId:
                imgFileName = "imajnet_image_" + imgId.group(1) + '.jpeg'
            else:
                imgFileName='image.jpeg'
        imageDir=os.path.join(QgsProject.instance().readPath("./"),"images")
        if not os.path.exists(imageDir):
            os.makedirs(imageDir)
        path = os.path.join(imageDir, imgFileName)
        with open(path, 'wb') as f:
                f.write((self.roiDownloadReply.readAll()))
                f.close()            
        
        feature = QgsFeature()
        feature.setGeometry(self.roiCoord )
        self.roiAttributes[2]=imgFileName
        feature.setAttributes(self.roiAttributes)
        #feature.setAttribute('image',imgFileName)
        
        (res, outFeats) = self.roiLayer.dataProvider().addFeatures([feature])
        if res:
                self.roiLayer.updateExtents()       
                self.roiLayer.triggerRepaint()
                feature = outFeats[0]
                fid = feature.id()
                ImajnetLog.debug('add ROI fid: {}'.format(fid))
                
                self.iface.openFeatureForm(self.roiLayer,feature,False,False)
        else:
            ImajnetLog.error('unable to add ROI to layer, res:{}'.format(res));

            