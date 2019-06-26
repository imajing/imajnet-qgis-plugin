#/***************************************************************************
# QGisImajnetPlugin
#
# 
#							 -------------------
#		begin				: 2018-06-20
#		git sha				: $Format:%H$
#		copyright			: (C) 2018 by Imajing
#		email				: support@imajnet.net
# ***************************************************************************/
#
#/***************************************************************************
# *																		 *
# *   This program is free software; you can redistribute it and/or modify  *
# *   it under the terms of the GNU General Public License as published by  *
# *   the Free Software Foundation; either version 2 of the License, or	 *
# *   (at your option) any later version.								   *
# *																		 *
# ***************************************************************************/

#################################################
# Edit the following to match your sources lists
#################################################

VERSION=1.0.2
VERSION_PATTERN='s/version=V.X/version=$(VERSION)/g'
BUILD_DATE=`date +'%y-%m-%d %H:%M'`
BUILD_DATE_FILE=`date +'%y-%m-%d_%H_%M'`

#Add iso code for any locales you want to support here (space separated)
# default is no locales
# LOCALES = af
LOCALES = fr

# If locales are enabled, set the name of the lrelease binary on your system. If
# you have trouble compiling the translations, you may have to specify the full path to
# lrelease
LRELEASE = lrelease
#LRELEASE = lrelease-qt4


# translation
SOURCES = \
	__init__.py \
	QGisImajnetPlugin.py QGisImajnetPlugin_dockwidget.py

PLUGINNAME = imajnet-qgis-plugin

PY_FILES = \
	__init__.py \
	QGisImajnetPlugin.py QGisImajnetPlugin_dockwidget.py QGisImajnetPlugin_debugwindow.py \
	TileMapScaleLevels.py PyImajnet.py ImajnetUtils.py ImajnetMapTool.py ImajnetLog.py MarkerManager.py ImajnetMarker.py ImajnetWebView.py QgisImajnetPluginVersion.py QGisImajnetPluginAboutWindow.py

OL_FILES = openlayers/imajnet.py openlayers/openlayers_layer.py openlayers/weblayer.py

UI_FILES = QGisImajnetPlugin_dockwidget_base.ui QGisImajnetPlugin_debugwindow_base.ui QGisImajnetPluginAboutWindow.ui

EXTRAS = metadata.txt

EXTRA_DIRS = resources 

COMPILED_RESOURCE_FILES = resources.py

PEP8EXCLUDE=pydev,resources.py,conf.py,third_party,ui


#################################################
# Normally you would not need to edit below here
#################################################

HELP = help/build/html

PLUGIN_UPLOAD = ./plugin_upload.py

RESOURCE_SRC=$(shell grep '^ *<file' resources.qrc | sed 's@</file>@@g;s/.*>//g' | tr '\n' ' ')

#QGISDIR=.qgis2
BUILD_DIR=bin

default: gen_srources

gen_sources:
	#rm QgisImajnetPluginVersion.py
	echo  "class QgisImajnetPluginVersion:\n\tversion = '$(VERSION)'\n\tbuildDate = '$(BUILD_DATE)'" > ./QgisImajnetPluginVersion.py
	
compile: $(COMPILED_RESOURCE_FILES) gen_sources

%.py : %.qrc $(RESOURCES_SRC)
	pyrcc5 -o $*.py  $<

%.qm : %.ts
	$(LRELEASE) $<

imajnet-sdk: compile transcompile
	mvn $(MAVEN_CLI_OPTS) -f imajnet-sdk/code/pom.xml clean install  -DbuildImajnetLibrary=true -DbuildImajnetLibraryDoc=true
	cp -R imajnet-sdk/code/ImajnetLib resources/

test: compile transcompile
	@echo
	@echo "----------------------"
	@echo "Regression Test Suite"
	@echo "----------------------"

	@# Preceding dash means that make will continue in case of errors
	@-export PYTHONPATH=`pwd`:$(PYTHONPATH); \
		export QGIS_DEBUG=0; \
		export QGIS_LOG_FILE=/dev/null; \
		nosetests -v --with-id --with-coverage --cover-package=. \
		3>&1 1>&2 2>&3 3>&- || true
	@echo "----------------------"
	@echo "If you get a 'no module named qgis.core error, try sourcing"
	@echo "the helper script we have provided first then run make test."
	@echo "e.g. source run-env-linux.sh <path to qgis install>; make test"
	@echo "----------------------"

deploy: compile doc transcompile imajnet-sdk
	@echo
	@echo "------------------------------------------"
	@echo "Deploying plugin to your .qgis2 directory."
	@echo "------------------------------------------"
	# The deploy  target only works on unix like operating system where
	# the Python plugin directory is located at:
	# $HOME/$(QGISDIR)/python/plugins
	mkdir -p $(BUILD_DIR)/$(PLUGINNAME)/openlayers
	cp -vf $(PY_FILES) $(BUILD_DIR)/$(PLUGINNAME)
	cp -vf $(OL_FILES) $(BUILD_DIR)/$(PLUGINNAME)/openlayers
	cp -vf $(UI_FILES) $(BUILD_DIR)/$(PLUGINNAME)
	cp -vf $(COMPILED_RESOURCE_FILES) $(BUILD_DIR)/$(PLUGINNAME)
	cp -vf $(EXTRAS) $(BUILD_DIR)/$(PLUGINNAME)
	cp -vfr i18n $(BUILD_DIR)/$(PLUGINNAME)
	cp -vfr $(HELP) $(BUILD_DIR)/$(PLUGINNAME)/help
	# Copy extra directories if any
	@$(foreach EXTRA_DIR,$(EXTRA_DIRS), cp -R $(EXTRA_DIR) $(BUILD_DIR)/$(PLUGINNAME)/;)
	# make sure that we are using the compiled lib
	cd $(BUILD_DIR)/$(PLUGINNAME)/resources; sed -i ':a;N;$$!ba;s/<!--DEV_BEG-->.*<!--DEV_END-->/<link rel="stylesheet" href="ImajnetLib\/css\/imajnetLibrary.css" \/>\n<script type="text\/javascript" src="ImajnetLib\/js\/imajnetLibrary.js"><\/script>\n/g' index.html
	# write plugin version in metadata.txt
	cd $(BUILD_DIR)/$(PLUGINNAME); sed -i $(VERSION_PATTERN) metadata.txt



# The dclean target removes compiled python files from plugin directory
# also deletes any .git entry
dclean:
	@echo
	@echo "-----------------------------------"
	@echo "Removing any compiled python files."
	@echo "-----------------------------------"
	find $(BUILD_DIR)/$(PLUGINNAME) -iname "*.pyc" -delete
	find $(BUILD_DIR)/$(PLUGINNAME) -iname ".git" -prune -exec rm -Rf {} \;


derase:
	@echo
	@echo "-------------------------"
	@echo "Removing deployed plugin."
	@echo "-------------------------"
	rm -Rf $(BUILD_DIR)/$(PLUGINNAME)

zip: deploy dclean
	@echo
	@echo "---------------------------"
	@echo "Creating plugin zip bundle."
	@echo "---------------------------"
	# The zip target deploys the plugin and creates a zip file with the deployed
	# content. You can then upload the zip file on http://plugins.qgis.org
	rm -f $(PLUGINNAME).zip
	cd $(BUILD_DIR); zip -9r $(PLUGINNAME)_$(VERSION)_$(BUILD_DATE_FILE).zip $(PLUGINNAME)

#package: compile
#	# Create a zip package of the plugin named $(PLUGINNAME).zip.
#	# This requires use of git (your plugin development directory must be a
#	# git repository).
#	# To use, pass a valid commit or tag as follows:
#	#   make package VERSION=Version_0.3.2
#	@echo
#	@echo "------------------------------------"
#	@echo "Exporting plugin to zip package.	"
#	@echo "------------------------------------"
#	rm -f $(PLUGINNAME).zip
#	git archive --prefix=$(PLUGINNAME)/ -o $(BUILD_DIR)/$(PLUGINNAME).zip $(VERSION)
#	echo "Created package: $(BUILD_DIR)/$(PLUGINNAME)_$(VERSION)_$(BUILD_DATE_FILE).zip"

upload: zip
	@echo
	@echo "-------------------------------------"
	@echo "Uploading plugin to QGIS Plugin repo."
	@echo "-------------------------------------"
	$(PLUGIN_UPLOAD) --username=$(OS_GEO_UID) --password=$(OS_GEO_PASSWORD) $(BUILD_DIR)/$(PLUGINNAME)_$(VERSION)_$(BUILD_DATE_FILE).zip

transup:
	@echo
	@echo "------------------------------------------------"
	@echo "Updating translation files with any new strings."
	@echo "------------------------------------------------"
	@chmod +x scripts/update-strings.sh
	@scripts/update-strings.sh $(LOCALES)

transcompile:
	@echo
	@echo "----------------------------------------"
	@echo "Compiled translation files to .qm files."
	@echo "----------------------------------------"
	@chmod +x scripts/compile-strings.sh
	@scripts/compile-strings.sh $(LRELEASE) $(LOCALES)

transclean:
	@echo
	@echo "------------------------------------"
	@echo "Removing compiled translation files."
	@echo "------------------------------------"
	rm -f i18n/*.qm

clean:
	@echo
	@echo "------------------------------------"
	@echo "Removing uic and rcc generated files"
	@echo "------------------------------------"
	rm -f $(COMPILED_UI_FILES) $(COMPILED_RESOURCE_FILES)
	rm -Rf $(BUILD_DIR)
	rm -Rf resources/ImajnetLib

doc:
	@echo
	@echo "------------------------------------"
	@echo "Building documentation using sphinx."
	@echo "------------------------------------"
#DODO: does not kowk
#cd help; make html

pylint:
	@echo
	@echo "-----------------"
	@echo "Pylint violations"
	@echo "-----------------"
	@pylint --reports=n --rcfile=pylintrc . || true
	@echo
	@echo "----------------------"
	@echo "If you get a 'no module named qgis.core' error, try sourcing"
	@echo "the helper script we have provided first then run make pylint."
	@echo "e.g. source run-env-linux.sh <path to qgis install>; make pylint"
	@echo "----------------------"


# Run pep8 style checking
#http://pypi.python.org/pypi/pep8
pep8:
	@echo
	@echo "-----------"
	@echo "PEP8 issues"
	@echo "-----------"
	@pep8 --repeat --ignore=E203,E121,E122,E123,E124,E125,E126,E127,E128 --exclude $(PEP8EXCLUDE) . || true
	@echo "-----------"
	@echo "Ignored in PEP8 check:"
	@echo $(PEP8EXCLUDE)
