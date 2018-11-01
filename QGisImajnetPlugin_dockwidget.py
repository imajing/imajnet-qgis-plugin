# -*- coding: utf-8 -*-
"""
/***************************************************************************
 QGisImajnetPluginDockWidget
                                 Imajnet QGIS plugin
 Generated by Plugin Builder: http://g-sherman.github.io/Qgis-Plugin-Builder/
                             -------------------
        begin                : 2018-06-20
        git sha              : $Format:%H$
        copyright            : (C) 2018 by JC
        email                : jchesnel@imajing.org
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

import os

from PyQt5 import QtGui, QtWidgets, uic 
from PyQt5.QtCore import pyqtSignal, QUrl, QObject, QVariant, QSize
from PyQt5.Qt import QFileInfo, pyqtSlot, QStringListModel, QHBoxLayout,\
    QPushButton
from PyQt5.QtWebKitWidgets import QWebPage, QWebInspector
from PyQt5.QtWebKit import QWebElement, QWebSettings
# from PyQt5.QtGui import QVBoxLayout, QShortcut, QKeySequence
from numpy import double
# from PySide import QtGui, QtCore, QtWebKit
from PyQt5.QtWidgets import QApplication, QSplitter, QVBoxLayout, QWidget
from PyQt5.QtNetwork import QNetworkAccessManager, QNetworkCookieJar

from qgis.utils import iface
from .ImajnetUtils import ImajnetUtils
from .PyImajnet import PyImajnet
from .ImajnetWebView import ImajnetWebView

#from .QGisImajnetPlugin import QGisImajnetPlugin
# Such a wild import is not good for performance but usefull for debug sometime
# from qgis import *
# from qgis.core import *

# Rather prefer this :
from qgis.core import QgsVectorLayer, QgsFeature, QgsGeometry, QgsPointXY, QgsProject, QgsField, QgsWkbTypes

from .ImajnetLog import ImajnetLog
import sys
import inspect

FORM_CLASS, _ = uic.loadUiType(os.path.join(
    os.path.dirname(__file__), 'QGisImajnetPlugin_dockwidget_base.ui'))


class QGisImajnetPluginDockWidget(QtWidgets.QDockWidget, FORM_CLASS):

    closingPlugin = pyqtSignal()
  
    m_view = None
    inspector = None
    splitter = None
    imajnetPlugin =None
    _PyImajnet=None
    def __init__(self, iface, plugin, parent=None):
        """Constructor."""
        # !!!--------------- BEGIN : NEVER TOUCH THE FOLLOWING !!!
        super(QGisImajnetPluginDockWidget, self).__init__(parent)
        # Set up the user interface from Designer.
        # After setupUI you can access any designer object by doing
        # self.<objectname>, and you can use autoconnect slots - see
        # http://qt-project.org/doc/qt-4.8/designer-using-a-ui-file.html
        # #widgets-and-dialogs-with-auto-connect
        #self.setupUi(self)
        # !!!--------------- END : NEVER TOUCH THE FOLLOWING !!!
        
        #----------------------- User part ---------------------------        
        self.iface = iface
        self.imajnetPlugin = plugin
        self.setWindowTitle("Imajnet")
        # Get the plugin dir and the HTML entry point to show
        # This can be done using Qt Resource but this is more dynamical like this 
        self.plugindir = os.path.dirname(__file__) + "/" 
        # HTMLentryPoint = QFileInfo(self.plugindir+"resources/EntryPoint.html").absoluteFilePath()
        HTMLentryPoint = QFileInfo(self.plugindir + "resources/index.html").absoluteFilePath()
        
        # -- instanciate the webview        
        # self.setWebSetting() # General web settings
        self.m_view = ImajnetWebView(self)  # instanciation 
        
        # make js verbose
        page = QWebPage()
        manager = QNetworkAccessManager()
        cookieJar = QNetworkCookieJar()
        
        manager.setCookieJar(cookieJar)
        page.setNetworkAccessManager(manager)
       
        self.m_view.setPage(page)
        
        QWidget.__init__(self, parent=parent)
        
        ImajnetUtils.setupWebView(self.m_view)
        
        # Adding the widget to the GUI                                   
        self.setWidget(self.m_view)   
        
        
        # -- load the local htm page
        # connect the script injection at page reload        
        self._PyImajnet = PyImajnet(self.m_view.page(),self.imajnetPlugin, self.iface)
        self._PyImajnet.networkAccessManager = manager

        # Effective load of the html entry point
          # Mandatory for clean dynamic reload of the htmlpage 
        self.m_view.load(QUrl.fromLocalFile(HTMLentryPoint)) 
        
        
        self.setMinimumSize(QSize(600, 600))
        #----------------------- End user part ---------------------------

   
 
        
    def closeEvent(self, event):
        """
        Method call when closing the plugin
        """
        
        self.cleanup()
        
        # Mandatory for proper close    
        self.closingPlugin.emit()
        event.accept()
    
    def cleanup(self):
        if self._PyImajnet != None:
            self._PyImajnet.onPluginClose()
            self._PyImajnet = None       

    def askquestion(self):
        """
        Example on how to trigger yes/No qtdialog*
        """
        msgBox = QtWidgets.QMessageBox(self)
        msgBox.setText("This is a question using qdialogbox");
        msgBox.setStandardButtons(QtWidgets.QMessageBox.Yes | QtWidgets.QMessageBox.No);
        msgBox.setDefaultButton(QtWidgets.QMessageBox.No);
        msgBox.exec()


