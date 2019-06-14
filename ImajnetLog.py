

from qgis.core import QgsMessageLog, Qgis,QgsApplication 

from qgis import *
import os
import tempfile
import codecs
        
class ImajnetLog(object):
    logger=None
    logfile = None
    filename = 'imajnet_qgis_plugin.log'
    imajnettag = 'imajnet'
    level = 1 # 0 (none) - 4 (all)
  
    @staticmethod
    def writelogmessage(message, tag, level):
        if message is None:
            return
        if ImajnetLog.logfile is None:
            logFileName = os.path.join(tempfile.gettempdir(),ImajnetLog.filename)
            ImajnetLog.logfile = codecs.open(logFileName, 'a+',encoding='utf8')
        ImajnetLog.logfile.write('{}({}): {}\n'.format(tag, level, message))#.encode('utf_8')
        #ImajnetLog.logfile.write('{}({}): {}\n'.format(tag, level, message)).encode('utf_8')
    
    @staticmethod
    def init():
        ImajnetLog.logger = QgsApplication.messageLog()        
        ImajnetLog.logger.messageReceived.connect(ImajnetLog.writelogmessage)
    
    @staticmethod
    def close():
        if ImajnetLog.logfile !=None:
            ImajnetLog.logfile.close()
            ImajnetLog.logfile= None
         
    @staticmethod
    def debug(message):
        if ImajnetLog.level >=4 :  
            ImajnetLog.logger.logMessage(message,ImajnetLog.imajnettag,Qgis.Info, False)     
    @staticmethod
    def info(message):
        if ImajnetLog.level >=3: 
            ImajnetLog.logger.logMessage(message,ImajnetLog.imajnettag,Qgis.Info, False)     
    @staticmethod
    def warning(message):
        if ImajnetLog.level >=2: 
            ImajnetLog.logger.logMessage(message,ImajnetLog.imajnettag,Qgis.Warning, False)     
    @staticmethod
    def error(message):
        if ImajnetLog.level >=1: 
            ImajnetLog.logger.logMessage(message,ImajnetLog.imajnettag,Qgis.Critical, False)

