FeatureWrapper.prototype.getFeatureId = function () {
	return feature;
};


ImajnetPlugin.LAYOUT_DEFAULT = 'default';
ImajnetPlugin.LAYOUT_VERTICAL = 'vertical';
ImajnetPlugin.LAYOUT_ORIZONTAL = 'orizontal';
ImajnetPlugin.currentLayout = ImajnetPlugin.DEFAULT_LAYOUT;


var singleClickTimer;
var isFirstLoad = true;
var wktReader = new jsts.io.WKTReader();

/**
 * Sets the zIndex for a given map layer
 * 
 * @method setLayerZIndex
 * @param {Layer}
 *            layer The layer for which to set the zIndex
 * @param {zIndex}
 *            zIndex The zIndex of the layer
 */
function setLayerZIndex(layer, zIndex) {
	layer.setZIndex(zIndex);
}

function setMarkerOpacity(feature, opacity) {
	feature.getStyle().getImage().setOpacity(opacity);
	feature.changed();
}


/**
 * 
 * 
 * @method onDragEnd
 */
function onDragEnd(event) {}

/**
 * 
 * 
 * @method onZoomEnd
 */
function onZoomEnd() {
	ImajnetMap.mapZoomEndHandler();
}

function onPointerMove(evt) {
	/*
	 * map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
	 * highlightFeature(feature); });
	 */
}

ImajnetPlugin.getLoginHtml = function () {
	return '<div id="notificationLoginInnerContainer">' +
		'<div class="imajnetLoginTitle">' + '<h1>' +
		jQuery.imajnet.login.title + '</h1>' + '</div>' + '<div>' +
		Nigsys.getLoginContent() +
		'<div class="imajnetLoginItem">' + '<div class="left imajnetLoginLeft">' + '<label for="serverUrl">' + jQuery.imajnet.login.serverUrl + ':</label>' + '</div>' + '<div class="left">' +
		'<input type="text" name="serverUrl" id="serverUrl" class="loginInput" autocapitalize="none" placeholder="https://service.imajnet.net" />' + '</div>' + '</div>' + '<div class="clearLeft"></div>' +
		// '<div style="margin-top: 10px;">' + '<input type="button"
		// id="imajnetLoginButton"' + (typeof CommonCore !== 'undefined' &&
		// CommonCore.isMobile ? '' : '
		// onclick="ImajnetProtocol.doLogin();"') + 'value="' +
		'<div style="margin-top: 10px;">' +
		'<input type="button" id="imajnetLoginButton" value="' +
		jQuery.imajnet.login.button + '" />' +
		'<div class="clear"></div>' +
		// '<input type="button" id="imajnetLoginRequestAccess"
		// onclick="ImajnetProtocol.requestAccess();" value="' +
		// jQuery.imajnet.login.requestAccess.title + '" />' +
		// '<input type="button" id="imajnetLoginForgotPassword"
		// onclick="ImajnetProtocol.forgotPassword();" value="' +
		// jQuery.imajnet.login.forgotPassword.title + '" />'+
		'</div>' + '</div>' + '</div>';
}

/**
 * Optional hook callback provided for implementing actions to execute after
 * imajnet logout is performed/plugin is deactivated.
 * 
 * @method onImajnetDeactivated
 */
ImajnetPlugin.onImajnetDeactivated = function () {
	jQuery('#greenHandler').hide();
	jQuery('#imajnetActiveButtons').hide();
	PyImajnet.onImajnetDeactivated();
}

/* Application functions */
/**
 * 
 * 
 * @method onImajnetControlPressed
 */
ImajnetPlugin.onImajnetControlPressed = function (buttonElement, controlName) {
	/*
	 * if(buttonElement.hasClass('opacity60')) {
	 * Imajnet.deactivateImajnetControl(buttonElement, controlName); } else {
	 * //map.removeInteraction(draw); draw = null; jQuery('.customControls
	 * .draw.active').removeClass('active');
	 * Imajnet.activateImajnetControl(buttonElement, controlName); }
	 */
	Imajnet.activateImajnetControl(buttonElement, controlName);
}

ImajnetPlugin.showLogin = function (isFromIdle) {
	Nigsys.hideLoading(jQuery('body'));
	jQuery(document).bind('keydown', ImajnetUI.clickLogin);
	jQuery('body').remove('#modalOverlay').append(Nigsys.modalOverlayDiv);
	Nigsys.modalOverlay = jQuery('#modalOverlay').show();
	Nigsys.initNotification();
	jQuery('#imajnetTabs').css('visibility', 'hidden');
	jQuery('#notificationLoginContainer').show().html('<div class="ui-notify-message ui-notify-message-style ui-notify-click" style="">' + ImajnetPlugin.getLoginHtml() + '</div>');
	jQuery('#imajnetLoginButton').on('click', function () {
		var settings = {
			username: jQuery('#username').val(),
			password: jQuery('#password').val(),
			serverUrl: jQuery('#serverUrl').val() || 'https://service.imajnet.net'
		}
		if (!Nigsys.isValidImajnetAddress(settings.serverUrl)) {
			ImajnetUI.showNotificationInfo('', jQuery.imajnet.login.error.invalidServerUrl, 'rightBottom');
			return;
		}

		var oldSettings = PyImajnet.loadSettings().imajnetLoginSettings;
		if (isFromIdle && settings.username === oldSettings.username && settings.password === oldSettings.password && settings.serverUrl === oldSettings.serverUrl) {
			window.location.reload();
		}

		PyImajnet.saveSettings(settings, {}, {});
		ImajnetPlugin.activateImajnet();
	});

	var imajnetLoginSettings = PyImajnet.loadSettings().imajnetLoginSettings;
	if (imajnetLoginSettings.username && imajnetLoginSettings.password) {
		jQuery('#username').val(imajnetLoginSettings.username);
		jQuery('#password').val(imajnetLoginSettings.password);
	}
	if (imajnetLoginSettings.serverUrl) {
		jQuery('#serverUrl').val(imajnetLoginSettings.serverUrl);
	}
}

/**
 * Activates the imajnet plugin
 * 
 * @method activateImajnet
 */
ImajnetPlugin.activateImajnet = function () {
	jQuery('.modalOverlay').remove();
	Nigsys.showLoading(jQuery('body'));
	toggleControls();
	Imajnet.imajnetPath = 'ImajnetLib/';
	ImajnetUI.imajnetImageContainerSize = {
		width: 600,
		height: 500
	};
	Imajnet.setLanguage(PyImajnet.getLocale()).always(function () {

		var settings = PyImajnet.loadSettings();
		var imajnetLoginSettings = settings.imajnetLoginSettings;
		var imajnetProjectSettings = settings.imajnetProjectSettings;
		var imajnetGlobalSettings = settings.imajnetGlobalSettings;
		console.log('settings: ', settings);

		if (!imajnetLoginSettings) {
			imajnetLoginSettings = {}
		}

		if (imajnetGlobalSettings) {
			for (var i in imajnetGlobalSettings) {
				try {
					window.localStorage.setItem(imajnetGlobalSettings[i].name, imajnetGlobalSettings[i].value);
				} catch (e) {
					console.error("LocalStorage - Unable to serialize json: - " + e);
				}
			}
		}

		if (imajnetProjectSettings) {
			for (var i in imajnetProjectSettings) {
				try {
					window.localStorage.setItem(imajnetProjectSettings[i].name, imajnetProjectSettings[i].value);
				} catch (e) {
					console.error("LocalStorage - Unable to serialize json: - " + e);
				}
			}
		}

		// set the default server
		if (!imajnetLoginSettings.serverUrl) {
			imajnetLoginSettings.serverUrl = 'https://service.imajnet.net';
		}

		PyImajnet.saveSettings(imajnetLoginSettings, {}, {});
		if (!imajnetLoginSettings || !imajnetLoginSettings.username || !imajnetLoginSettings.password) {
			ImajnetPlugin.showLogin();
			return;
		}


		var options = {
			serverUrl: imajnetLoginSettings.serverUrl,
			username: imajnetLoginSettings.username,
			password: imajnetLoginSettings.password,
			applicationKey: 'R2iVgTsyemKPsw3KF1OOpII0tKlS3c8A0LkPiewzjBZmN1gNBF4+VXz67LF4YSHDQwzH8amIUsLRNeoZf42mcA==',
			containerId: 'imajnetContainer',
			newsContainerId: 'newsContainer',
			clipboardContainerId: 'clipboardContainer',
			searchLRSContainerId: 'searchLRSContainer',
			clipboardExportContainerId: 'clipboardExportContainer',
			projectedLayersContainerId: 'projectedLayersContainer',
			autoPhotogrammetryAdd: true,
			language: PyImajnet.getLocale(),
			activateImajnet: true,
			clipboardActive: true,
			metadata: 'imajnet-qgis-plugin',
			unit: 'm',
			goToClosestPointOfInterest: false,
			sessionType: 'FULL'
			//imageServerDomains : ["https://image1.imajnet.net", "https://image2.imajnet.net", "https://image3.imajnet.net", "https://image4.imajnet.net", "https://image5.imajnet.net"],
			//apiServerDomains : ["https://api1.imajnet.net", "https://api2.imajnet.net", "https://api3.imajnet.net", "https://api4.imajnet.net", "https://api5.imajnet.net"],
			//cartographicServerDomains:["https://carto1.imajnet.net", "https://carto2.imajnet.net", "https://carto3.imajnet.net", "https://carto4.imajnet.net", "https://carto5.imajnet.net"]
		};

		var wellKnownDomains = ["imajnet.net", "immergis.fr", "immergis.eu"];
		Imajnet.initImajnetServerSubdomains(options, wellKnownDomains, wellKnownDomains, wellKnownDomains, false);

		Imajnet.init(options).done(function () {
			Nigsys.hideLoading(jQuery('body'));
			jQuery('#notification').hide();
			jQuery('#notificationLoginContainer').hide();
			Imajnet.activateImajnetControl(jQuery('#closestImageButton'), 'closestImage');
			jQuery('#imajnetActiveButtons').show();
			jQuery('#modalOverlay').hide();
			jQuery('#imajnetTabs').css('visibility', 'visible');
			jQuery('.searchLRSType').on('click', function () {
				jQuery('ul.ui-autocomplete').hide();
			})
		}).fail(function () {
			ImajnetPlugin.showLogin();
		});
	});
}

ImajnetPlugin.imajnetLoginError = function (jqxhr) {
	ImajnetUI.showNotificationInfo('', jQuery.imajnet.imajnetNotAvailable + '<br/>' + ImajnetProtocol.getErrorMessage(jqxhr), 'rightBottom');
}

ImajnetPlugin.imajnetLoginSuccess = function () {
	PyImajnet.imajnetLoginSuccess(ImajnetUser.data);
}

/**
 * Deactivates the imajnet plugin
 * 
 * @method deactivateImajnet
 */
function doLogout(keepSettings, isFromIdle) {
	//todo: this is a dummy implementation
	if (isFromIdle) {
		onProjectSaving();
	}
	deactivateImajnet().done(function () {
		window.localStorage.clear(); //we keep localstorage in qgis
		if (!keepSettings) {
			var imajnetLoginSettings = PyImajnet.loadSettings().imajnetLoginSettings;
			delete imajnetLoginSettings.username;
			delete imajnetLoginSettings.password;
			PyImajnet.saveSettings(imajnetLoginSettings, {}, {});
		}
		ImajnetUrl.deleteUrlParams();
		if (isFromIdle) {
			ImajnetPlugin.showLogin(isFromIdle);
		} else {
			window.location.reload();
		}
	});
}

/**
 * Deactivates the imajnet plugin
 * 
 * @method deactivateImajnet
 */
function deactivateImajnet() {
	//this line is needed only because the plugin is crashing when deactivated after projecting point layers
	jQuery("div").remove("#popupImajnetControlsLayer");

	jQuery('#clipboardExportContainer').dialog('close');
	return Imajnet.deactivateImajnet(true, false, true, true);
}

// Toggle OL controls style
function toggleControls() {
	jQuery('.customControls button.draw').click(function () {
		jQuery(this).toggleClass('active').siblings().removeClass('active');
	})
}

/**
 * Centers the map on the given imajnet position
 * 
 * @param position
 *            the imajnet position
 * @param onlyIfNotVisible
 *            if true then the operation needs to be performed only if the
 *            object is not visible on the map(is outside of the visible
 *            extent), otherwise the operation is performed all the time
 * 
 * @method centerMapToPosition
 */
ImajnetPlugin.centerMapToPosition = function (position, onlyIfNotVisible) {
	PyImajnet.centerMapToPosition(position, onlyIfNotVisible);
};

ImajnetPlugin.getMapExtent = function () {
	/*
	 * var resolution = map.getView().getResolution(); if(!resolution) { return; }
	 * return map.getView().calculateExtent(map.getSize());
	 */
	return;
}

/**
 * 
 * @returns mapscale
 */

ImajnetPlugin.getMapScale = function () {

	var scales = [559082565, 279541282, 139770641, 69885320, 34942660,
		17471330, 8735665, 4367832, 2183916, 1091958, 545979, 272989,
		136494, 68247, 34123, 17061, 8530, 4265, 2132, 1066, 533, 266, 133,
		66, 33
	];
	return scales[ImajnetPlugin.getCurrentZoomLevel()];
};

/**
 * 
 * @returns current zoom level of the map
 */
ImajnetPlugin.getCurrentZoomLevel = function () {
	return PyImajnet.getCurrentZoomLevel()
};

/**
 * Zooms the underying map to the given zoom level
 * 
 * @param zoom the desired zoom level
 * @method zoomMapTo
 */
ImajnetPlugin.zoomMapTo = function (zoom) {
	if (!zoom) {
		return;
	}
	PyImajnet.setMapZoomLevel(parseInt(zoom));
};

ImajnetPlugin.zoomMapToFeatureWrapper = function (featureWrapper) {
	var feature = featureWrapper.getFeature();
	if (!feature) {
		return;
	}

	var zoom = 17;
	if (ImajnetPlugin.getCurrentZoomLevel() > zoom) {
		zoom = null;
	}
	PyImajnet.zoomMapToFeatureWrapper(featureWrapper);
};

/**
 * Adds the imajnet tile layer to the map.
 * 
 * @returns the added layer object
 */

ImajnetPlugin.addImajnetLayerToMap = function () {
	var imajnetLayer = PyImajnet.addImajnetLayerToMap();
	return imajnetLayer;
}

/**
 * Adds a vector layer to the map.
 * 
 * @param name
 *            the name of the vector layer to be created and added to the map
 * @param opacity
 *            the opacity of the layer
 * @param options
 *            initialization ofptions for the layer
 * @method addVectorLayerToMap
 */
ImajnetPlugin.addVectorLayerToMap = function (name) {
	var layer = PyImajnet.addVectorLayerToMap(name);
	return layer;
};

/**
 * Adds a marker layer to the map.
 * 
 * @param name
 *            the name of the layer
 * @method addMarkerLayerToMap
 */
ImajnetPlugin.addMarkerLayerToMap = function (name) {
	var layer = PyImajnet.addMarkerLayerToMap(name);
	return layer;
};

/**
 * Removes a layer from the map
 * 
 * @method removeLayerFromMap
 */
ImajnetPlugin.removeLayerFromMap = function (layer) {
	PyImajnet.removeLayerFromMap(layer);
};

merge_options = function (obj1, obj2) {
	var obj3 = {};
	for (var attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
}

/**
 * Adds a marker to the markerLayer,
 * 
 * @param markerData
 *            object with properties: lon(wgs84 longitude), lat: wgs84 latitude,
 *            imagePath: path to the marker image, size: {width, height},
 *            objectId: unique identifier for the marker(add this property to
 *            marker object), onMouseOver handler function for mouse over,
 *            onMouseOut: handler function for mouseout, onClick handler
 *            function for click event.
 * 
 * This function will add to map imajbox marker at the specified lon, lat
 * coordinates. Example: function addMarker(markerLayer, markerData) { var
 * marker = L.marker([markerData.lat, markerData.lon], {icon: L.icon({iconUrl:
 * markerData.imagePath, iconSize: [markerData.size.width,
 * markerData.size.height]})}).addTo(map); marker.objectId =
 * markerData.objectId; marker.on('mouseover', function(event) {
 * markerData.onMouseOver(event, marker.objectId); }); marker.on('mouseout',
 * function(event) { markerData.onMouseOut(event, marker.objectId); });
 * marker.on('click', function(event) { markerData.onClick(event,
 * marker.objectId); });
 * 
 * return marker; }
 * 
 * @method addMarker
 */
ImajnetPlugin.addMarker = function (markerLayer, markerData) {
	var imajnetFeature = new FeatureWrapper();
	var featureWrapper = PyImajnet.addMarker(markerLayer, markerData);
	var merged = merge_options(imajnetFeature, featureWrapper)
	return merged;
};

/**
 * 
 * 
 * @method removeMarker
 */
ImajnetPlugin.removeMarker = function (markerLayer, markerWrapper) {
	if (!markerWrapper) {
		return;
	}
	PyImajnet.removeMarker(markerLayer, markerWrapper);
};

/**
 * Removes a list of features(markers) from the given layer.
 * 
 * @param vectorLayer
 *            the layer from which the features need to be removed
 * @param markersWrapper
 *            the list of markers
 * 
 * @method removeMarkerFeatures
 */
ImajnetPlugin.removeMarkerFeatures = function (vectorLayer, markersWrapper) {
	for (var i = 0, length = markersWrapper.length; i < length; ++i) {
		this.removeMarker(vectorLayer, markersWrapper[i]);
	}
};

/**
 * Adds a feature to the given vector layer
 * 
 * If featureOptions.type is LineString or Polygon pointsArray will be an array
 * of objects({x, y}) If featureOptions.type is MultiPolygon pointsArray will be
 * an array of arrays(objects({x, y}).
 * 
 * @param pointsArray
 *            the points that compose the feature geometry
 * @param featureOptions
 *            the parameter options for creating the feature
 * @returns FeatureWrapper object that contains added feature object ex:
 *          featureOptions(type: 'Point, LineString, Polygon', 'Multipolygon',
 *          zIndex, fillColor: color, fillOpacity: 0.5).
 * @method addFeature
 */
ImajnetPlugin.addFeature = function (vectorLayer, pointsArray, featureOptions) {
	var imajnetFeature = new FeatureWrapper();
	if (featureOptions.type == "MultiPolygon") {
		pointsArray = pointsArray[0];
	}
	var featureWrapper = PyImajnet.addFeature(vectorLayer, pointsArray,
		featureOptions);
	var merged = merge_options(imajnetFeature, featureWrapper)
	return merged;

};

/**
 * Remove features from the map
 * 
 * @param vectorLayer -
 *            layer from which the feature will be removed
 * @param featureWrappers -
 *            an array of featureWrappers
 */
ImajnetPlugin.removeFeatures = function (vectorLayer, featureWrappers) {
	if (!vectorLayer || featureWrappers.length < 1) {
		return;
	}
	for (var j = 0, length = featureWrappers.length; j < length; ++j) {
		ImajnetPlugin.removeMarker(vectorLayer, featureWrappers[j])
	}
};

/**
 * @method removeAllMarkersFromLayer
 */
ImajnetPlugin.removeAllMarkerFeatures = function (markerLayer) {
	PyImajnet.removeAllMarkersFromLayer(markerLayer);
};

ImajnetPlugin.removeAllMarkersFromLayer = function (layer) {
	if (!layer) {
		return;
	}
	PyImajnet.removeAllMarkersFromLayer(layer);
};

/**
 * Removes all features from a layer
 * 
 * @param layer
 */
ImajnetPlugin.removeAllFeatures = function (layer) {
	PyImajnet.removeAllFeatures(layer);
};

ImajnetPlugin.selectFeature = function (vectorLayer, markerWrapper) {
	if (!markerWrapper) {
		return;
	}
	if (markerWrapper.length) {
		for (var i = 0; i < markerWrapper.length; i++) {
			PyImajnet.highlightFeature(markerWrapper[i]);
		}
	} else {
		PyImajnet.highlightFeature(markerWrapper);
	}
};

ImajnetPlugin.unselectFeature = function (vectorLayer, markerWrapper, color) {
	if (!markerWrapper) {
		return;
	}
	if (markerWrapper.length) {
		for (var i = 0; i < markerWrapper.length; i++) {
			PyImajnet.unHighlightFeature(markerWrapper[i]);
		}
	} else {
		PyImajnet.unHighlightFeature(markerWrapper);
	}
};

ImajnetPlugin.selectMarker = function (markerLayer, markerWrapper) {
	if (!markerWrapper) {
		return;
	}
	PyImajnet.highlightMarker(markerWrapper);
};

ImajnetPlugin.unselectMarker = function (markerLayer, markerWrapper) {
	if (!markerWrapper) {
		return;
	}
	PyImajnet.unHighlightMarker(markerWrapper);
};


ImajnetPlugin.onFeatureMouseOver = function (featureWrapper) {
	//we don't handle the event here, we use the highlighting events
};

ImajnetPlugin.onFeatureMouseOut = function (featureWrapper) {
	//we don't handle the event here, we use the highlighting events
};

ImajnetPlugin.onFeatureClick = function (featureWrapper) {
	if (featureWrapper.layer != featureWrapper.layerName) //it is a qgis map feature, not a marker
		PyImajnet.onFeatureClick(featureWrapper);
};

ImajnetPlugin.onFeatureMouseDown = function (featureWrapper) {
	//don't care
};

ImajnetPlugin.afterImajnetLayersAddedToMap = function () {
	//nothing to do
};

/**
 * Returns the features to pe projected wrapped inside a custom object
 * 
 * @param position
 */
ImajnetPlugin.onImageChange = function (position) {

	if (isFirstLoad) {

		if (!position) { //when no position in map center
			//			Nigsys.showLoading(jQuery('body'));
			//			Nigsys.getUserPositionAjaxRequest().done(function(){
			//				Nigsys.hideLoading(jQuery('body'));
			//			});

			ImajnetMap.loadPOI();
			Nigsys.showLoading(jQuery('body'));
			//			ImajnetMap.imajnetPOIRequest.always(function() {
			//
			//			})
		}

		ImageControler.currentPhotogrammetry.showCommentInClipboard = function (event, id) {
			clearTimeout(singleClickTimer);
			ImajnetUI.clipboardOpenCommentId = id;
			jQuery('.imajnetClipboardTextareaComment').hide();
			jQuery('.imajnetClipboardCommentContainer').show();
			jQuery('#imajnetClipboardComment_' + id).hide();
			var commentContainer = jQuery('#LRSDoubleClickComment_' + id);
			var textareaContent = commentContainer.length != 0 ? commentContainer.html() : '';
			var textarea = jQuery('textarea#textAreaEditClipboardComment_' + id);
			textarea.val(textareaContent);
			var parentPosition = textarea.parent().parent().offset();
			//		    textarea.offset({
			//		    	top: parentPosition.top,
			//		    	left: parentPosition.left
			//		    });
			textarea.css('top', parentPosition.top).css('left', parentPosition.left);
			jQuery('#imajnetClipboardTextareaComment_' + id).show();
			textarea.focus();
		}
		isFirstLoad = false;
	} else {
		ImajnetPlugin.showImajnetItem('imajnetContainer');
		Nigsys.hideLoading(jQuery('body'));
	}

	if (ImajnetPlugin.currentLayout == ImajnetPlugin.LAYOUT_DEFAULT && !ImageControler.currentImageControl.isFastNavigation) {
		ImageControler.currentImageControl.resetFastNavigation();
		jQuery("#imajnetTabs").tabs({
			active: 0
		})
	}
};

ImajnetPlugin.positionImageOnFeature = function (id, event) {
	//ImageControler.currentPhotogrammetry.imajnetClipboardItemClick(featureWrapper.getId());
	if (event && event.detail == 1) { //ensure this is the first click
		singleClickTimer = setTimeout(function () { //create a timer
			ImageControler.currentPhotogrammetry.openImageWithPhotogrammetryObject(id);
		}, 250); //250 or 1/4th second is about right
	} else {
		clearTimeout(singleClickTimer);
		singleClickTimer = setTimeout(function () { //create a timer
			ImageControler.currentPhotogrammetry.openImageWithPhotogrammetryObject(id);
		}, 150);
	}
}



//overwrite get geometry for imajne format
FeatureWrapper.prototype.getGeometry = function () {
	var coordinates = new Array();
	var geometry = this.geometry;
	for (var i = 0; i < geometry.length; i++) {
		coordinates.push({
			lon: geometry[i].x,
			lat: geometry[i].y,
			height: geometry[i].z
		})
	}
	return coordinates;
};

ImajnetPlugin.getProjectionCandidates = function (position, constraintGeometry) {
	//use ImajnetProjection.getProjectedLayers() to see wich layers to query
	var layers = PyImajnet.getProjectionCandidates(position, constraintGeometry, ImajnetProjection.getProjectedLayers()).layers;
	try {
		var layerWrapperTemplate = new LayerWrapper();
		var featureWrapperTemplate = new FeatureWrapper();
		for (var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			var layerWrapper = merge_options(layerWrapperTemplate, layer)
			for (var j = 0; j < layerWrapper.features.length; j++) {
				featureWrapper = merge_options(featureWrapperTemplate, layerWrapper.features[j]);
				featureWrapper.setGeometry(wktReader.read(layer.features[j].geometry).getCoordinates());

				//here we set the height if layer does not have Z
				if (featureWrapper.zField) {
					var zValues = null;
					if (isNaN(featureWrapper.zField)) {
						zValues = featureWrapper.zField.split(',');
					}
					for (var k = 0; k < featureWrapper.geometry.length; k++) {
						if (zValues) {
							featureWrapper.geometry[k].z = zValues[k];
						} else {
							featureWrapper.geometry[k].z = featureWrapper.zField;
						}
					}
				}
				if (layerWrapper.getGeometryType() == 'point' && featureWrapper.style[0].externalGraphic) {
					var egString = featureWrapper.style[0].externalGraphic;
					var svg = egString.substring(egString.indexOf('<svg'), egString.indexOf('/svg>') + 5);
					featureWrapper.style[0].externalGraphic = 'data:image/svg+xml;utf8,' + svg;
				}
				if (layerWrapper.getGeometryType() == 'line') {
					delete featureWrapper.style[0].fillColor;
				}
				layerWrapper.features[j] = featureWrapper;
			}
			layers[i] = layerWrapper;
		}
	} catch (e) {
		console.error(e)
	};

	return jQuery.Deferred().resolve(layers).promise();
};

ImajnetPlugin.onMeasurementCreated = function (customData) {
	console.log(customData);
};

ImajnetPlugin.onPinPointCreated = function (customData) {
	console.log(customData);
};

ImajnetPlugin.getFeatureIdFromWrapper = function (featureWrapper) {
	return featureWrapper;
};

function onMoveEnd() {
	/*
	 * if(currentZoomLevel != map.getView().getZoom()) { currentZoomLevel =
	 * map.getView().getZoom(); onZoomEnd(); } else { onDragEnd(); }
	 */
}

/**
 * Registers the imajnet map events to the underlying map component.
 * 
 * @method registerMapEvents
 */
ImajnetPlugin.registerMapEvents = function () {
		// currentZoomLevel = map.getView().getZoom();
		// map.on('click', onMapClick);
		// map.on('moveend', onMoveEnd);
	},

	ImajnetPlugin.setLayerZIndex = function (layer, zIndex) {
		// not needed
	},

	ImajnetPlugin.imajnetLogoutComplete = function (layer, zIndex) {
		Nigsys.hideLoading(jQuery(Imajnet.containerId));
		// not needed
	},

	/**
	 * Unregisters the imajnet map event handlers
	 * 
	 * @method unregisterMapEvents
	 */
	ImajnetPlugin.unregisterMapEvents = function () {
		// map.un('click', onMapClick);
		// map.un('moveend', onMoveEnd);
	}

/**
 * Makes visible the imajnet image component container
 * 
 * @param id
 *            the id of the html element that will contain the imajnet container
 * @param width
 *            the desired width of the imajnet container
 * @param height
 *            the desired height of the imajnet container
 * @method showImajnetItem
 */
ImajnetPlugin.showImajnetItem = function (id) {
	jQuery('#' + id).show();
	if (id == ImajnetUI.clipboardExportContainerId) {
		jQuery('#clipboardExportContainer').dialog('open');
		//bug fix for radio buttons not working
		jQuery('#clipboardExportContainer :radio').on('mousedown', function (event) {
			event.preventDefault();
			var checked = jQuery(this).prop('checked');
			jQuery(this).prop('checked', !checked);
		})
	}
}

/**
 * Hides the imajnet image container given by it's id
 * 
 * @param id
 *            the id of the html element that contains the imajnet container
 * @method hideImajnetItem
 */
ImajnetPlugin.hideImajnetItem = function (id) {
	jQuery('#' + id).hide();
	try {
		if (id == ImajnetUI.clipboardExportContainerId) {
			jQuery('#clipboardExportContainer').dialog('close');
		}
	} catch (e) {}
}

/**
 * Sets the active state for a map tool. Customizable according to the
 * application needs, usually this is similar to a button press.
 * 
 * @param container
 *            the html container of the map tool
 * 
 * @method addActiveState
 */
ImajnetPlugin.addActiveState = function (container) {
	container.addClass('opacity60');
}

/**
 * Sets the active state for a map tool. Customizable according to the
 * application needs, usually this is similar to a button un-press.
 * 
 * @param container
 *            the html container of the map tool
 * 
 * @method removeActiveState
 */
ImajnetPlugin.removeActiveState = function (container) {
	container.removeClass('opacity60');
}

ImajnetPlugin.onWindowResize = function (event) {
	var windowWidth = jQuery(this).width();
	var windowHeight = jQuery(this).height();
	var marginSize = 10; // for margin, border, padding;
	var width, height;
	var minWidth = 410;
	var tabsNavHeight = jQuery('#imajnetTabs > ul').outerHeight();
	var previousLayout = ImajnetPlugin.currentLayout;

	if (windowWidth <= 650 && windowHeight >= 780) {
		ImajnetPlugin.currentLayout = ImajnetPlugin.LAYOUT_VERTICAL;
		width = windowWidth - marginSize;
		height = width / ImajnetUI.getImageAspectRatio();
		jQuery('.mainTabContent').css('height', windowHeight - height - tabsNavHeight - marginSize);
	} else if (windowWidth > windowHeight * ImajnetUI.getImageAspectRatio() + minWidth) {
		ImajnetPlugin.currentLayout = ImajnetPlugin.LAYOUT_ORIZONTAL;
		height = windowHeight - marginSize;
		width = height * ImajnetUI.getImageAspectRatio();
		jQuery('.mainTabContent').css('height', windowHeight - tabsNavHeight - marginSize);
	} else {
		ImajnetPlugin.currentLayout = ImajnetPlugin.LAYOUT_DEFAULT;
		width = windowWidth - marginSize;
		height = width / ImajnetUI.getImageAspectRatio();
		var maxHeight = windowHeight - tabsNavHeight - marginSize;
		if (height > maxHeight) {
			width = maxHeight * ImajnetUI.getImageAspectRatio();
		}
		height = width / ImajnetUI.getImageAspectRatio();
		jQuery('.mainTabContent').css('height', height);
	}
	ImajnetPlugin.imajnetContainer.css({
		width: width + 'px',
		height: height + 'px'
	});

	if (ImajnetPlugin.currentLayout == ImajnetPlugin.LAYOUT_ORIZONTAL) {
		if (previousLayout !== ImajnetPlugin.currentLayout) {
			ImajnetPlugin.tabsContainer.tabs({
				active: 1
			});
		}
		jQuery('#imajnetTabs ul li:first-child').hide();
		ImajnetPlugin.imajnetContainer.prependTo('body');
	} else if (ImajnetPlugin.currentLayout == ImajnetPlugin.LAYOUT_VERTICAL) {
		if (previousLayout !== ImajnetPlugin.currentLayout) {
			ImajnetPlugin.tabsContainer.tabs({
				active: 1
			});
		}
		jQuery('#imajnetTabs ul li:first-child').hide();
		ImajnetPlugin.imajnetContainer.prependTo('body');
		ImajnetPlugin.showImajnetItem(ImajnetUI.searchLRSContainerId);
	} else {
		if (previousLayout !== ImajnetPlugin.currentLayout) {
			ImajnetPlugin.tabsContainer.tabs({
				active: 0
			});
		}
		ImajnetPlugin.imajnetContainer.prependTo('#imageTab');
		jQuery('#imajnetTabs ul li:first-child').show();
	}

	if (!jQuery('body').hasClass(ImajnetPlugin.currentLayout)) {
		jQuery('body').removeAttr('class').addClass(ImajnetPlugin.currentLayout);
	}
	ImajnetUI.onImageResize();

	//	var width = jQuery(this).width() - 10;//50 is padding and margins
	//	var height = width / ImajnetUI.getImageAspectRatio();
	//	var maxHeight = jQuery(this).height() - jQuery('#imajnetTabs > ul').outerHeight() - 10;
	//	if(ImajnetPlugin.currentLayout == ImajnetPlugin.LAYOUT_ORIZONTAL) {
	//		height = jQuery(this).height() - 10;
	//		width = height * ImajnetUI.getImageAspectRatio();
	//	} else {
	//		if(height > maxHeight) {
	//			width = maxHeight * ImajnetUI.getImageAspectRatio();
	//		}
	//		height = width / ImajnetUI.getImageAspectRatio()
	//	}
	//	ImajnetPlugin.imajnetContainer.css({
	//		width: width + 'px',
	//		height: height + 'px'
	//	});
	//	
	//	var minWidth = 420;
	//	if(jQuery(window).width() - width > minWidth) {
	//		ImajnetPlugin.currentLayout = ImajnetPlugin.LAYOUT_ORIZONTAL;
	//		ImajnetPlugin.tabsContainer.tabs({
	//			active: 1
	//		});
	//		jQuery('#imajnetTabs ul li:first-child').hide();
	//		ImajnetPlugin.imajnetContainer.prependTo('body');
	//	} else {
	//		var minHeight = 300;
	//		if(jQuery(window).height() - height > minHeight) {
	//			ImajnetPlugin.currentLayout = ImajnetPlugin.LAYOUT_VERTICAL;
	//			ImajnetPlugin.tabsContainer.tabs({
	//				active: 1
	//			});
	//			jQuery('#imajnetTabs ul li:first-child').hide();
	//			ImajnetPlugin.imajnetContainer.prependTo('body');
	//		} else {
	//			ImajnetPlugin.currentLayout = ImajnetPlugin.LAYOUT_DEFAULT;
	//			ImajnetPlugin.tabsContainer.tabs({
	//				active: 0
	//			});
	//			ImajnetPlugin.imajnetContainer.prependTo('#imageTab');
	//			jQuery('#imajnetTabs ul li:first-child').show();
	//		}
	//	}
	//	
	//	if(!jQuery('body').hasClass(ImajnetPlugin.currentLayout)) {
	//		jQuery('body').removeAttr('class').addClass(ImajnetPlugin.currentLayout);
	//	}
	//	ImajnetUI.onImageResize();
}

ImajnetPlugin.onImajnetActivated = function () {
	ImajnetPlugin.imajnetContainer = jQuery('#' + Imajnet.containerId);
	ImajnetPlugin.tabsContainer = jQuery('#imajnetTabs');

	jQuery(window).on('resize', ImajnetPlugin.onWindowResize);
	jQuery(window).trigger('resize');

	PyImajnet.onImajnetActivated();

	//go to the map center
	var mapCenter = PyImajnet.getMapCenter();
	Imajnet.activateImajnetControl(null, 'closestImage');

	var lastPosition = Nigsys.getCookie('IMAJNET', 'LAST_POSITION');

	//Pass the coordinates to the imajnet library
	if (lastPosition) {
		ImajnetAPI.setImajnetImage({
			position: lastPosition
		});
	} else {
		//ImajnetPlugin.hideImajnetItem('imajnetContainer');
		ImajnetMap.mapClickHandler(mapCenter);
	}

	if (ImajnetPlugin.currentLayout !== ImajnetPlugin.LAYOUT_DEFAULT) {
		jQuery("#imajnetTabs").tabs({
			active: 1
		})
	}

	jQuery('#clipboardExportContainer').dialog({
		autoOpen: false,
		width: 500
	});

	Nigsys.initModalOverlay('body');

}

ImajnetPlugin.getEditableLayers = function () {
	var layerWrapperTemplate = new LayerWrapper();
	var layers = PyImajnet.getEditableLayers().layers;
	for (var i = 0; i < layers.length; i++) {
		layers[i] = merge_options(layerWrapperTemplate, layers[i]);
	}
	return layers;
}

ImajnetPlugin.getReadableLayers = function () {
	var layerWrapperTemplate = new LayerWrapper();
	var layers = PyImajnet.getReadableLayers().layers;
	for (var i = 0; i < layers.length; i++) {
		layers[i] = merge_options(layerWrapperTemplate, layers[i]);
	}
	return layers;
}

ImajnetPlugin.getLayerAttributes = function (layerWrapper) {
	return PyImajnet.getLayerAttributes(layerWrapper).attributes;
}

ImajnetPlugin.canAddAttributesToLayer = function (layerWrapper) {
	return PyImajnet.canAddAttributesToLayer(layerWrapper);
}

ImajnetPlugin.addAttributeToLayer = function (layerWrapper, attribute) {
	return PyImajnet.addAttributeToLayer(layerWrapper, attribute);
}

ImajnetPlugin.addGeometryToLayer = function (layerWrapper, geometry) {
	var projectedLayer = ImajnetProjection.getProjectedLayerById(layerWrapper.getId());
	var zField = null;
	var height = null;
	if (projectedLayer && projectedLayer.zField) {
		height = '';
		zField = projectedLayer.zField;
		zFieldType = projectedLayer.zFieldType
		if (zFieldType == 'String') {
			for (var i = 0; i < geometry.length; i++) {
				height += geometry[i].z + ',';
			}
			height = height.substring(0, height.length - 1);
		} else if (zFieldType == 'Integer') {
			height = parseInt(geometry[0].z)
		} else {
			height = geometry[0].z;
		}
	}
	return PyImajnet.addGeometryToLayer(layerWrapper, geometry, zField, height);
}

ImajnetPlugin.getLocalStorageKeys = function () {
	var keys = {
		project: new Array(),
		global: new Array()
	}

	for (var key in localStorage) {
		var obj = new Object();
		obj.name = key;
		obj.value = localStorage.getItem(key);
		if (key.indexOf('IMAJNET_LAST_POSITION') !== -1 || key.indexOf(ImajnetUser.getUsername() + '_') == -1) {
			continue;
		}
		if (key.indexOf('IMAJNET_PROJECTED_LAYERS') !== -1 || key.indexOf('IMAJNET_CLIPBOARD') !== -1) {
			keys.project.push(obj);
		} else {
			keys.global.push(obj)
		}
	}
	keys.project.push({
		name: ImajnetUser.getUsername() + '_IMAJNET_LAST_POSITION',
		value: JSON.stringify(ImajnetMap.currentPosition)
	});
	return keys;
}

ImajnetPlugin.resetSettings = function () {
	PyImajnet.saveSettings([0], [0], [0]);
}

onProjectChange = function () {
	if (!isFirstLoad) {
		ImajnetPlugin.initProjectedLayers();
	}
	console.log('onProjectChange');
}

onProjectSaving = function () {
	console.log('onProjectSaving');
	var keys = ImajnetPlugin.getLocalStorageKeys();
	PyImajnet.saveSettings({}, keys.project, keys.global);
}

onProjectOpened = function () {
	console.log('onProjectOpened');
	if (Imajnet.imajnetIsActiveBoolean) {
		doLogout(true);
	} else {
		ImajnetUrl.deleteUrlParams();
		window.location.reload();
	}
}

ImajnetPlugin.drawUserProjections = function () {
	//not needed
	return jQuery.Deferred().resolve(null).promise();
}


//handle the clipboard download
onExportSuccess = function (response) {
	response = JSON.parse(response);
	var messageForUserHtml = jQuery.imajnet.map.clipboard.popupExport.exportComplete;
	jQuery('#imajnetExportStatus').html(messageForUserHtml);
	if (response && response.exportResult && response.exportResult.link && response.exportResult.link.toString().toLowerCase() != 'ok') {
		var link = Imajnet.serverUrl + response.exportResult.link;
		PyImajnet.downloadFile(link);
	}
}
Photogrammetry.onExportSuccess = onExportSuccess;
FlatPhotogrammetry.onExportSuccess = onExportSuccess;
CubePhotogrammetry.onExportSuccess = onExportSuccess;

//image download
ImajnetUI.donwloadImajnetImage = function () {
	if (!ImajnetMap.currentPosition) {
		return;
	}
	PyImajnet.downloadFile(ImajnetAPI.buildImageURLWithResolution(ImajnetMap.currentPosition, ImajnetSettings.imajnetImageResolutions[3]));
}

onMarkerHoverInOnMap = function (layerName, pythonFeatureId) {
	console.log("onMarkerHoverInOnMap");
	featureWrapper = findFeatureWrapper(layerName, pythonFeatureId);
	//currrent image should not be hovered
	if (isCurrentImageFeatureWrapper(featureWrapper)) {
		return;
	}
	if (featureWrapper) {
		ImageControler.currentPhotogrammetry.onFeatureMouseOver(featureWrapper);
		ImajnetPlugin.highlightFeatureOnImage(featureWrapper);
	}
}

onMarkerHoverOutOnMap = function (layerName, pythonFeatureId) {
	console.log("onMarkerHoverOutOnMap");
	featureWrapper = findFeatureWrapper(layerName, pythonFeatureId);
	//currrent image should not be hovered
	if (isCurrentImageFeatureWrapper(featureWrapper)) {
		return;
	}
	if (featureWrapper) {
		ImageControler.currentPhotogrammetry.onFeatureMouseOut(featureWrapper);
		ImajnetPlugin.unHighlightFeatureOnImage(featureWrapper);
	}
}

onMarkerClickOnMap = function (layerName, pythonFeatureId) {
	console.log("onMarkerClickOnMap");
	featureWrapper = findFeatureWrapper(layerName, pythonFeatureId);
	if (!featureWrapper) {
		return false;
	}
	//currrent image is not clickable
	if (isCurrentImageFeatureWrapper(featureWrapper)) {
		return false;
	}
	if (featureWrapper.getType() == ImajnetMap.FEATURE_TYPE_ORIENTED_IMAGES) {
		if (!Imajnet.imajnetOrientedImagesIsActive()) {
			return true;
		}
		if (featureWrapper.getId() > -1) {
			ImajnetClickMode.moveImageToPosition(featureWrapper.getId());
		}
		return true;
	} else {
		ImajnetPlugin.positionImageOnFeature(featureWrapper.getId());
	}
	return true;
}

onFeatureClickOnMap = function (featureCenter) {
	//needs to return true only if click mode was successful, otherwise, it needs to return false and the python part will perform the necessary action: click mode or closest image
	featureCenter = wktReader.read(featureCenter).getCoordinates()[0];
	var position = {
		lon: featureCenter.x,
		lat: featureCenter.y
	}
	ImajnetClickMode.showOrientedImages(position, ImajnetClickMode.orientedImagesReceived, function () {
		ImajnetMap.onMapClick(position, imajboxDragged);
	}, {
		isPositionOnly: true
	});
	return true;
}

isCurrentImageFeatureWrapper = function (featureWrapper) {
	return featureWrapper && featureWrapper.type && (((featureWrapper.type == "imageOrientationFeature" || featureWrapper.type == "largeImageOrientationFeature") && featureWrapper.id == "") || (featureWrapper.type == "imajboxMarker"));
}

findFeatureWrapper = function (layerName, pythonFeatureId) {
	featureWrapper = null;
	var count = ImajnetMap.featureWrappers.length;
	for (var i = 0; i < count; i++) {
		wrapper = ImajnetMap.featureWrappers[i];
		if (wrapper.layer == layerName && wrapper.feature == pythonFeatureId) {
			featureWrapper = wrapper;
			break;
		}
	}
	return featureWrapper;
}


//Disable 3d
Imajnet3dPosition.showPosition = function () {
	Imajnet3dPosition.isActive = false;
}

ImajnetROI.onROICreated = function (roi, image, photogrammetryInfo) {
	pyImajnetCreateROI(roi, image, photogrammetryInfo);
}


/////////////////////////////////////////////////
//// ROI temporary /////////////////////////////
/////////////////////////////////////////////////
pyImajnetCreateROI = function (roi, image, photogrammetryInfo) {
	var imageUrl = (ImajnetAPI.buildImageURLWithResolution(image, ImajnetSettings.imajnetImageResolutions[3]));

	return PyImajnet.createROI(roi, image, photogrammetryInfo, imageUrl);
}