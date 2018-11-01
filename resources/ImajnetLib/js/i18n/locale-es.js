(function(jQuery) {
jQuery.imajnet = {
    "LRSSettings": "Configuración LRS", 
    "aboutImajnet": "Imajnet es un servicio web entregando datos geo-espaciales y imágenes del terreno.<br/>Imajnet esta disponible vía un web browser, pero también en GIS a través de plugins para ArcGis. Imajnet puede también ser integrado en cualquier aplicación web vertical o desktop existente.", 
    "addToLayer": {
        "add": "Añadir a una capa", 
        "close": "Cerrar", 
        "selectLayer": "Seleccionar una capa"
    }, 
    "address": {
        "label": "Dirección"
    }, 
    "buildDate": "Fecha de construcción ", 
    "button": {
        "cancel": "Cancelar", 
        "clickMode": "Visualización de un punto seleccionado en el mapa", 
        "close": "Cerrar", 
        "closestImage": "Imagen mas cerca", 
        "enableImajnet": "Imajnet plugin", 
        "nextImage": "Imagen siguiente", 
        "no": "No", 
        "ok": "Ok", 
        "previousImage": "Imagen anterior", 
        "search": "Buscar", 
        "yes": "Sí"
    }, 
    "dateTime": {
        "closeText": "Ok", 
        "currentText": "Ahora", 
        "day1Min": "Dom", 
        "day2Min": "Lu", 
        "day3Min": "Ma", 
        "day4Min": "Mi", 
        "day5Min": "Ju", 
        "day6Min": "Vi", 
        "day7Min": "Sa", 
        "hourText": "Hora", 
        "minuteText": "Minuto", 
        "month1": "Enero", 
        "month10": "Octubre", 
        "month11": "Noviembre", 
        "month12": "Diciembre", 
        "month2": "Febrero", 
        "month3": "Marzo", 
        "month4": "Abril", 
        "month5": "Mayo", 
        "month6": "Junio", 
        "month7": "Julio", 
        "month8": "Agosto", 
        "month9": "Septiembre", 
        "timeText": "Tiempo"
    }, 
    "downloadDocument": "Descargar el manual de usuario", 
    "errors": {
        "genericError": "Por favor contacte al administrador! Código:"
    }, 
    "help": "<h3>Navegación</h3> <b>Mapa</b> - La posición en el mapa puede ser cambiada haciendo clic en diferentes puntos. Haciendo zoom y el panning del mapa, uno puede navegar hacia el punto deseado.<br/><b>Image</b> - usando la rueda de desplazamiento del ratón o los botones integrados, uno puede desplazarse a la siguiente/previa imagen.<br/><img id=\"helpImajnetTraceImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Traza del levantamiento</b> - ir a la imagen deseada.<br/><h3>Posicionamiento de la camera</h3> <img id=\"helpImajnetClosestModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Posición mas cerca</b> - en este modo la camera esta posicionada en la imagen mas cerca de las coordinadas selecionadas.<br/><img id=\"helpImajnetClickModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Visualización de un punto seleccionado en el mapa</b> - en este modo, la camera esta posicionada en la mejor imagen mirando hacia el objeto seleccionado.<br/>\t\t\t<h3>Search</h3> <b>Address</b> - Buscar por dirección.<br/><b>Sistema de referencial</b> - Búsqueda por LRS.<br/><h3>Cronograma</h3> Los datos imajnet están indexados por tiempo. Significa que los datos de imágenes y cartográficos pueden ser filtrados por periodos de tiempo.<br/>", 
    "helpDownload": "Hacer clic aquí para descargar el PDF", 
    "helpWarning": "Parece que no tiene soporte para PDF en este navegador web.", 
    "image": {
        "save": "Guardar la imagen", 
        "switcher": {
            "centerButtonTitle": "Haga un clic para maximizar"
        }, 
        "zoomButton": "Zoom"
    }, 
    "imajnetNotAvailable": "imajnet no está disponible", 
    "link": "www.imajing.eu", 
    "loading": "Cargando...", 
    "locale": {
        "en": "English", 
        "es": "Español", 
        "fr": "Français", 
        "ja": "日本語", 
        "zh": "中文"
    }, 
    "login": {
        "button": "Iniciar sesión", 
        "error": {
            "forbidden": "No tiene acceso suficiente para ver esta página", 
            "header": {
                "accountDisabled": "Acceso no autorizado! Cuenta desactivada.", 
                "accountExpierd": "Acceso no autorizado! Cuenta expirada.", 
                "accountLocked": "Acceso no autorizado! Cuenta bloqueada.", 
                "credentialsExpired": "Acceso no autorizado! Credencial expirado.", 
                "invalidApplicationKey": "Acceso denegado! La plataforma no esta autorizada a conectarse a Imajnet.", 
                "invalidSessionType": "Acceso denegado! Un tipo de sesión invalido estuvo requerido por imajnet.", 
                "unauthenticated": "El nombre de usuario o la contraseña no son válidos", 
                "unauthorized": "Acceso no autorizado! Su nombre de usuario / contraseña se encuentran actualmente en uso y han alcanzado el número máximo de conexiones simultáneas.", 
                "unauthorizedSessionType": "Acceso denegado! No esta autorizado a abrir el tipo de sesión que solicito. "
            }, 
            "invalidServerUrl": "La URL del servidor no es válida.", 
            "movedTemporarily": "Se trasladó temporalmente", 
            "noInternetConnection": "No hay una conexión internet", 
            "serviceUnavailable": "La aplicación esta fuera de servicio por mantenimiento. Lamentamos las molestias, por favor vuelva a intentarlo más tarde.", 
            "sessionExpired": "Sesión expirada", 
            "unableToConnect": "No se puede conectar al servidor", 
            "unknown": "Error"
        }, 
        "forgotPassword": {
            "title": "Contraseña olvidada"
        }, 
        "password": "Contraseña", 
        "rememberMe": "No volver a pedir la contraseña durante 2 semanas.", 
        "requestAccess": {
            "text": "Por favor, póngase en contacto con nosotros en info&#64;imajing.eu", 
            "title": "Solicitar acceso"
        }, 
        "serverUrl": "Servidor URL", 
        "title": "Iniciar sesión", 
        "username": "Nombre de usuario"
    }, 
    "management": {
        "archiveSequence": {
            "confirmMessage": "¿Esta seguro que quiere desarchivar la secuencia?", 
            "title": "Archivar secuencia"
        }, 
        "createPOI": "Crear Puntos de interés", 
        "deleteSequence": {
            "confirmMessage": "¿Esta seguro que quiere borrar la secuencia?", 
            "title": "Eliminar secuencia"
        }, 
        "groundPlaneDetails": "Detalles del plano del suelo", 
        "reimportSequence": {
            "confirmMessage": "¿Está seguro que desea importar de nuevo la secuencia?", 
            "title": "Re-importación secuencia"
        }, 
        "sequenceDetails": "Detalles de la secuencia", 
        "title": "Manejo", 
        "unarchiveSequence": {
            "confirmMessage": "¿Esta seguro que quiere desarchivar la secuencia?", 
            "error": "La des-archivación de la secuencia no ha sido exitoso, por favor intentelo de nuevo", 
            "success": "La secuencia ha sido desarchivada exitosamente", 
            "title": "Desarchivar la secuencia"
        }
    }, 
    "map": {
        "LRSEnd": "Final", 
        "LRSLoading": "Cargando LRS...", 
        "LRSStart": "Empezar", 
        "OCM": "Abrir Cycle Map", 
        "OSM": "Abrir Street Map", 
        "OSMMapnik": "OSM Mapnik", 
        "OTM": "Abrir el Mapa Transportación", 
        "bingAerial": "Bing satellite", 
        "bingAerialWithLabels": "Bing hybrid", 
        "bingRoad": "Bing carreteras", 
        "clipboard": {
            "clearButton": "Borrar", 
            "comment": "Comentario", 
            "deleteItem": "Borrar objecto", 
            "doubleClick": "Haga doble clic para editar el comentario", 
            "enableClipboard": "Mostrar el portapapeles", 
            "exportButton": "Exportar", 
            "imageTag": "Etiqueta Imagen", 
            "meters": "Metros", 
            "noItems": "Ningún objecto que mostrar", 
            "notify": {
                "text": "Objeto añadido al portapapeles", 
                "title": "Notificación del portapapeles "
            }, 
            "popupExport": {
                "donwloadFile": "Descargar el archivo", 
                "download": "Descargar", 
                "email": "E-mail", 
                "exportComplete": "Exportación terminada", 
                "exportError": "Error al exportar", 
                "exportProgress": "Exportación en curso...", 
                "exportStatus": "Estado de exportación", 
                "fileType": "Tipo de archivo", 
                "from": "De", 
                "message": "Mensaje", 
                "send": "Enviar", 
                "title": "Exportar", 
                "to": "Para"
            }, 
            "position3D": "Posición 3D", 
            "precisionRating": "Evaluación de la precisión de posición", 
            "precisionUnknown": "Precisión de posición desconocida", 
            "title": "Portapapeles", 
            "titleItem": {
                "polygon": "Polígono", 
                "polyligne": "Polilinea"
            }
        }, 
        "contextMenu": {
            "closeTool": "Cerrar la herramienta", 
            "deleteLastPoint": "Borrar el ultimo punto", 
            "finishGeometry": "Acabar la geometría", 
            "resetGeometry": "Reinicio de geometría"
        }, 
        "customBaseLayers": {
            "NAV_HYBRID": "Naver hybrid", 
            "NAV_SATELLITE": "Naver satellite", 
            "NAV_STREET": "Naver street", 
            "VWORLD_HYBRID": "Vworld hybrid", 
            "VWORLD_SATELLITE": "Vworld satellite", 
            "VWORLD_STREET": "Vworld street"
        }, 
        "errors": {
            "noImajnetImageAtPosition": "No hay imágenes en la zona seleccionada", 
            "noLRS": "No LRS", 
            "unableToNavigate": "Imposible navegar"
        }, 
        "hidePreviewPanel": "Dejar de mostrar eso!", 
        "measurement": {
            "errorMeasurement": "Imposible medir!", 
            "step": "Etapa", 
            "step1Content": "Haga clic en las dos extremidades del objecto", 
            "step2Content": "Haga un nuevo clic en las dos extremidades del objecto", 
            "step3Content": "Medición completada", 
            "title": "Medición", 
            "titleConstraint": "Medida forzada"
        }, 
        "poi": {
            "label": "Punto de interés", 
            "optionDefault": "Elegir"
        }, 
        "polygon": {
            "errorPosition": "Imposible posicionar el objecto!", 
            "step": "Etapa", 
            "step1Content": "Haga clic en el objecto", 
            "step2Content": "Haga un nuevo clic en el objecto", 
            "step3Content": "Haga clic aquí cuando este terminado", 
            "title": "Dibujar un polígono"
        }, 
        "polyligne": {
            "errorPosition": "Imposible posicionar el objecto!", 
            "step": "Etapa", 
            "step1Content": "Haga clic en el objecto", 
            "step2Content": "Haga un nuevo clic en el objecto", 
            "step3Content": "Haga clic aquí cuando este terminado", 
            "title": "Dibujar una polilinea"
        }, 
        "popupSearchAddress": {
            "buttonSearchName": "Buscar", 
            "error": "Error al buscar la dirección", 
            "latitude": "Latitud", 
            "longitude": "Longitud", 
            "noResultsFound": "No hay resultados", 
            "spectrumCity": "Ciudad", 
            "spectrumCountry": "País", 
            "spectrumStreet": "Calle", 
            "title": "Buscar dirección"
        }, 
        "popupSearchLRS": {
            "moreResults": "Algunos resultados no se visualizan", 
            "roadInputPlaceholder": "Escribir el nombre de la via", 
            "search": "Buscar", 
            "title": "Buscar LRS", 
            "type": "Tipo de Sistema Referencia Lineal", 
            "typeAny": "Cualquier", 
            "typeBoat": "Barco", 
            "typeRoad": "Carretera", 
            "typeTrain": "Tren"
        }, 
        "position": {
            "errorPosition": "Imposible posicionar el objecto!", 
            "step": "Etapa", 
            "step1Content": "Haga clic en el objecto", 
            "step2Content": "Haga un nuevo clic en el mismo objecto", 
            "step3Content": "Posicionamiento 3D completado", 
            "title": "Posición objectos"
        }, 
        "position3d": {
            "title": "Posición de los objectos en 3D"
        }, 
        "surveyTrace": {
            "date": "Fecha", 
            "distance": "Distancia", 
            "meters": "metros"
        }
    }, 
    "menuAboutImajnet": "Acerca de", 
    "menuBugReport": "Reportar un problema", 
    "menuHelp": "Ayuda", 
    "menuNews": "Noticias", 
    "menuSettings": "Configuración", 
    "noFullAccessMessage": "Su tipo de suscripción imajnet no le permite tener acceso a la pagina. Se requiere una suscripción completa. ", 
    "noNews": "Sin noticia", 
    "oldSiteMessage": "Debido a la decisión de Google de parar los servicios Google Maps V2, no estamos en condiciones de darle el acceso a app.imajnet.net website.\nLe recomendamos migrar a la ultima versión del web servicio en web.imajnet.net.\nEsta nueva pagina web ha sido aprobada por la mayoría de los browsers principales. Sin embargo, si experimenta algún problema, por favor informanos de ello en support@imajnet.net con una breve descripción del problema y la versión exacta del browser usado.\n\nLe deseamos una agradable navegación,\n\nEl equipo imajing", 
    "poi": {
        "label": "Puntos de interés"
    }, 
    "popupSequenceDetails": {
        "location": "Localización", 
        "name": "Nombre", 
        "operator": "Operador", 
        "project": "Proyecto", 
        "repository": "Repositorio", 
        "title": "Detalles de la secuencia"
    }, 
    "productOf": "Imajnet&#174; está diseñado y publicado por imajing s.a.s, Francia", 
    "projectedLayers": {
        "groundProjection": "Proyección sobre el suelo", 
        "heightOffset": "Compensación de altura"
    }, 
    "security": {
        "logout": "Logout", 
        "sessionExpired": "Su sesión ha expirado"
    }, 
    "settings": {
        "LRS": {
            "cumulatedAbscisa": {
                "1": "Dist. acumulada", 
                "2": "Dist. acumulada", 
                "label": "Etiqueta de punto en abscisa acumulada"
            }, 
            "referential": "LRS", 
            "relativeAbscisa": {
                "1": "Distancia relativa ", 
                "2": "Distancia relativa ", 
                "label": "Etiqueta de punto en abscisa relativa"
            }, 
            "relativePoint": {
                "1": "PR", 
                "2": "Punto kilométrico ", 
                "label": "Etiqueta de punto relativo"
            }, 
            "road": "Carretera", 
            "search": "Buscar", 
            "title": "Referencial", 
            "train": "Ferrocariles"
        }, 
        "LRSSettings": "Ajustes LRS", 
        "display": {
            "LRSShowCumulated": "Mostrar la distancia acumulada ", 
            "addressDisplayType": {
                "city": "Ciudad", 
                "full": "Completo", 
                "title": "Nivel de detalle de dirección "
            }, 
            "addressInLRS": "Combinar LRS y dirección ", 
            "carto": "Mapa", 
            "image": "Imagen", 
            "showLabels": "Mostrar etiquetas", 
            "showPR": "Mostrar puntos kilométricos ", 
            "showRoads": "Mostrar Carreteras", 
            "title": "Visualizar"
        }, 
        "imageOptions": {
            "BEST": "Mejor", 
            "CLOSEST": "Más cercano", 
            "NEWEST": "Más reciente", 
            "title": "Opciones de recuperación Prioridad/imagen"
        }, 
        "imageQuality": "Calidad de Imagen", 
        "imageQualityHigh": "Altura", 
        "imageQualityLow": "Bajo", 
        "imageQualityMedium": "Medio", 
        "imageSectionTitle": "Imagen", 
        "imageSwitcher": "Radio de búsqueda de imágenes ", 
        "imageSwitcherHight": "20m", 
        "imageSwitcherLow": "0m", 
        "mapSectionTitle": "Mapa", 
        "orientedImages": "Imágenes orientadas", 
        "orientedImagesHight": "150m", 
        "orientedImagesLow": "10m", 
        "projection": "Objectos visibles", 
        "projectionHigh": "100m", 
        "projectionLow": "10m", 
        "projectionSectionTitle": "Proyección", 
        "resetDefaultButton": "Restablecer los ajustes predeterminados", 
        "saveSettingsButton": "Guardar", 
        "settings": "Ajustes", 
        "surveyTrace": "Proyección de la ruta levantada", 
        "surveyTraceHight": "100m", 
        "surveyTraceLow": "10m", 
        "tools": {
            "remainActive": "Permanecer activo", 
            "title": "Herramientas"
        }, 
        "units": {
            "feet": "Pies", 
            "m": "metros", 
            "title": "Unidades", 
            "unit": "Unidad"
        }
    }, 
    "timeframe": {
        "active": "Activo", 
        "from": "De", 
        "reset": "Reiniciar", 
        "title": "Cronograma", 
        "to": "Para"
    }, 
    "units": {
        "feet": "pies", 
        "feet_short": "ft", 
        "m": "m", 
        "m_short": "m"
    }, 
    "version": "Versión"
};
})(jQuery);
