
import os
import collections

from PyQt5 import QtGui, QtWidgets, uic 
from PyQt5.QtCore import pyqtSignal, QUrl, QObject, QVariant, QSize, QSettings, Qt
from PyQt5.Qt import QFileInfo, pyqtSlot, QStringListModel, QHBoxLayout, \
    QPushButton, QColor
from PyQt5.QtWebKit import QWebElement, QWebSettings
# from PyQt5.QtGui import QVBoxLayout, QShortcut, QKeySequence
from numpy import double
# from PySide import QtGui, QtCore, QtWebKit
from PyQt5.QtWidgets import QApplication, QSplitter, QVBoxLayout, QWidget,QGraphicsSceneHoverEvent
from qgis.utils import iface
from .ImajnetUtils import ImajnetUtils
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


class ImajnetMarker(QgsVertexMarker):
    
    def __init__(self, canvas):
        super(ImajnetMarker, self).__init__(canvas)

        
class ImajnetPointMarker(QgsVertexMarker):
    
    def __init__(self,canvas):
        super(ImajnetPointMarker, self).__init__(canvas)
        self.setAcceptHoverEvents(True)
  
