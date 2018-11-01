import os

from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5 import uic
from PyQt5 import QtWidgets
from PyQt5.Qt import QLabel
from .QgisImajnetPluginVersion import QgisImajnetPluginVersion


FORM_CLASS, _ = uic.loadUiType(os.path.join(
    os.path.dirname(__file__), 'QGisImajnetPluginAboutWindow.ui'))


class QGisImajnetPluginAboutWindow(QtWidgets.QDialog, FORM_CLASS):
    def __init__(self,plugin, parent=None):
        """Constructor."""
        super(QGisImajnetPluginAboutWindow, self).__init__()
        # Set up the user interface from Designer.
        # After setupUI you can access any designer object by doing
        # self.<objectname>, and you can use autoconnect slots - see
        # http://qt-project.org/doc/qt-4.8/designer-using-a-ui-file.html
        # #widgets-and-dialogs-with-auto-connect
        self.setupUi(self)
        
        self.dev_mode_clicks =0
        self.plugin=plugin
        self.setWindowTitle(plugin.tr("About Imajnet"))
        
        boldFont=QFont()
        boldFont.setBold(True)

        lblDescription = QLabel()
        lblDescription.setText(plugin.tr("Imajnet is an interactive web service delivering geospatial data and ground level imagery. Imajnet is available via a web browser, but also in GIS through plugins for solutions like QGis or ArcGis. Imajnet can also be integrated in existing vertical web or desktop applications."));
        lblDescription.setWordWrap(True);
        
        lblMadeBy = QLabel()
        lblMadeBy.setText(plugin.tr("Imajnet® is designed and published by imajing s.a.s, France"));
        lblMadeBy.setFont(boldFont)
        lblMadeBy.setAlignment(Qt.AlignCenter);
        
        lblImajingLink = QLabel()
        urlLink='<a href="http://{}">{}</a>'.format(plugin.tr("www.imajing.eu"),plugin.tr("www.imajing.eu")) 
        lblImajingLink.setText(urlLink);
        lblImajingLink.setOpenExternalLinks(True)
        lblImajingLink.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        lblImajingLink.setAlignment(Qt.AlignCenter);
        
        
        lblBuildDate = QLabel()
        lblBuildDate.setText(plugin.tr("Build date:"))
        
        lblBuildDateValue = QLabel()
        lblBuildDateValue.setText("{}".format(QgisImajnetPluginVersion.buildDate))
        lblBuildDateValue.setFont(boldFont)
        
        lblVersion = QLabel()
        lblVersion.setText(plugin.tr("Version:"))
        
        lblVersionValue = QLabel()
        lblVersionValue.setText("{}".format(QgisImajnetPluginVersion.version))
        lblVersionValue.setFont(boldFont)
        
        hboxVersion =  QGridLayout()
        hboxVersion.addWidget(lblVersion,0,0)
        #hboxVersion.addStretch()
        hboxVersion.addWidget(lblVersionValue,0,1)
        #hboxVersion.addStretch()
        hboxVersion.addWidget(lblBuildDate,1,0)
        #hboxVersion.addStretch()
        hboxVersion.addWidget(lblBuildDateValue,1,1)
        #hboxVersion.addStretch()
        
        lblImajnetLogo = QLabel()
        lblImajnetLogo.setPixmap(QPixmap(':/plugins/imajnet-qgis-plugin/resources/img/imajnetLogoMediumBlue.png'))
        lblImajnetLogo.setAlignment(Qt.AlignCenter);
        lblImajnetLogo.mousePressEvent = self.imajnetLogoClick
        lblImajingLogo = QLabel()
        lblImajingLogo.setPixmap(QPixmap(':/plugins/imajnet-qgis-plugin/resources/img/imajingLogo.png'))
        lblImajingLogo.setAlignment(Qt.AlignCenter);
        
        vbox = QVBoxLayout()
        vbox.addWidget(lblImajnetLogo)
        vbox.addStretch()
        vbox.addWidget(lblDescription)
        vbox.addStretch()
        vbox.addWidget(lblMadeBy)
        vbox.addStretch()
        vbox.addWidget(lblImajingLogo)
        vbox.addStretch()
        vbox.addWidget(lblImajingLink)
        vbox.addStretch()
        vbox.addLayout(hboxVersion)
        vbox.addStretch()
        
        buttonbox = QDialogButtonBox(QDialogButtonBox.Ok,self)
        buttonbox.accepted.connect(self.accept)
        vbox.addWidget(buttonbox)
   
        #l4.linkActivated.connect(clicked)
        #l2.linkHovered.connect(hovered)
        #l1.setTextInteractionFlags(Qt.TextSelectableByMouse)
        self.setLayout(vbox)
   
    def accept(self):
        self.close()
        
    def imajnetLogoClick(self, ev):
        self.dev_mode_clicks+= 1
        if self.dev_mode_clicks >=10:
            self.dev_mode_clicks=0
            self.plugin.toggleDevMode()
        