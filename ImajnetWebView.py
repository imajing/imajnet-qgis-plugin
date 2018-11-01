from PyQt5.QtWebKitWidgets import QWebView
from PyQt5.QtWidgets import QWidget
from .ImajnetLog import ImajnetLog

class ImajnetWebView(QWebView):
    
    def __init__(self, parent: QWidget=None):
        super(ImajnetWebView, self).__init__(parent)
    
    def contextMenuEvent(self, ev):
        """we don't want context menus"""
        #ImajnetLog.info("web view contextMenuEvent")
        