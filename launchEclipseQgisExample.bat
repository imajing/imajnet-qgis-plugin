@echo off
call "c:\OSGeo4W64\bin\o4w_env.bat"
call c:\OSGeo4W64\bin\qt5_env.bat
call c:\OSGeo4W64\bin\py3_env.bat
@echo off
echo %OSGEO4W_ROOT%
path %OSGEO4W_ROOT%\apps\qgis\bin;%PATH%
set QGIS_PREFIX_PATH=%OSGEO4W_ROOT:\=/%/apps/qgis
set GDAL_FILENAME_IS_UTF8=YES
rem Set VSI cache to be used as buffer, see #6448
set VSI_CACHE=TRUE
set VSI_CACHE_SIZE=1000000
set QT_PLUGIN_PATH=%OSGEO4W_ROOT%\apps\qgis\qtplugins;%OSGEO4W_ROOT%\apps\qt5\plugins
REM Path for python3.6 execution in eclipse
set PATH=%PATH%;%OSGEO4W_ROOT%\apps\qgis\bin
set PATH=%PATH%;c:\OSGeo4W64\apps\qgis\bin
set PATH=%PATH%;C:\Program Files\Java\jre1.8.0_171\bin
c:\app\eclipse\eclipse-photon\eclipse\eclipse.exe