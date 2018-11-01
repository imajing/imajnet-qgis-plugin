var methods = ['debug','trace','log','info','warn','error','assert'];
	overwriteConsoleFunction = function(index, func){
		var exFunc = console[func];
		console[func] = function(msg) {
			exFunc.apply(console, arguments);
	        PyImajnet.log(index,msg);
	    };
	}
	jQuery(function() {			
		for ( var i in methods) {		
			//overwriteConsoleFunction(i,methods[i])
		}		
	});

console.log("OpenLayers page loaded");

var map;
var loadEnd;
var oloMarker; // OpenLayer Overview Marker
var sphericalMercatorExtent = new OpenLayers.Bounds(-20037508.34,
		-20037508.34, 20037508.34, 20037508.34);

function init() {
	map = new OpenLayers.Map('map', {
		theme : null,
		controls : [],
		projection : new OpenLayers.Projection("EPSG:3857"),
		units : "m",
		maxResolution : 156543.0339,
		maxExtent : new OpenLayers.Bounds(-20037508.34, -20037508.34,
				20037508.34, 20037508.34),
		adjustZoom : function(zoom) {
			return zoom;
		}
	});

	loadEnd = false;
	function layerLoadStart(event) {
		loadEnd = false;
	}
	function layerLoadEnd(event) {
		loadEnd = true;
	}

	
	getImajnetTileUrl = function(bounds) {
		var serverUrl = settings.serverUrl;
		if (!serverUrl.indexOf('/service')==-1){
			serverUrl = serverUrl + '/service';
		}
		var res = map.resolution;// ImajnetPlugin.getMapResolution();
		x = Math.round((bounds.left - sphericalMercatorExtent.left)
				/ (res * map.tileSize.w));
		y = Math.round((sphericalMercatorExtent.top - bounds.top)
				/ (res * map.tileSize.h));
		var z = map.zoom;// ImajnetMap.map.getZoom();
		var parameter = new Object({
			tile : {
				x : x,
				y : y,
				zoom : z
			}
		// },
		// timeframe: ImajnetTimeframe.getTimeframe()
		});
		//
		var encodedParam = encodeURIComponent(JSON.stringify(parameter));
		var urlSuffix = '/api/tile/' + encodedParam;
		var url = null;
		if(ImajnetMap.cartographicServerDomains !== null) {
		  url = ImajnetMap.selectUrl(urlSuffix,
		  ImajnetMap.cartographicServerDomains) + '/service' + urlSuffix;
		} else {
			url = serverUrl + urlSuffix;
		 }
		//
		// return ImajnetProtocol.getUsernameForUrl(url);
		return url;
	};

	var settings = PyImajnet.loadSettings().imajnetLoginSettings;
	var options = {
		serverUrl : settings.serverUrl,
		username : settings.username,
		password : settings.password,
		applicationKey : 'R2iVgTsyemKPsw3KF1OOpII0tKlS3c8A0LkPiewzjBZmN1gNBF4+VXz67LF4YSHDQwzH8amIUsLRNeoZf42mcA==',
		containerId : 'imajnetContainer',
		newsContainerId : 'newsContainer',
		clipboardContainerId : 'clipboardContainer',
		searchLRSContainerId : 'searchLRSContainer',
		clipboardExportContainerId : 'clipboardExportContainer',
		autoPhotogrammetryAdd : true,
		language : PyImajnet.getLocale(),
		activateImajnet : false,
		clipboardActive : false,
		metadata : 'imajnet-qgis-plugin-MAP',
		unit : 'm',
		goToClosestPointOfInterest : false,
		sessionType : 'FULL',
		imageServerDomains : [ settings.serverUrl ],
		apiServerDomains : [ settings.serverUrl ],
		cartographicServerDomains : [ settings.serverUrl ]
	};
	
	var wellKnownDomains = ["imajnet.net", "immergis.fr", "immergis.eu"];
	Imajnet.initImajnetServerSubdomains(options, wellKnownDomains, wellKnownDomains, wellKnownDomains, true);
	ImajnetMap.cartographicServerDomains = options.cartographicServerDomains;

	var imajnetLayer = new OpenLayers.Layer.TMS("Imajnet",
			"http://imajnet.net", {
				type : 'png',
				getURL : getImajnetTileUrl,
				numZoomLevels : 25,
				isBaseLayer : true,
				displayInLayerSwitcher : false,
				displayOutsideMaxExtent : false,
				// attribution : '<a href="http://www.imajing.eu"
				// target="_blank">&#169; 2018 Imajing</a>',
				eventListeners : {
					"loadstart" : layerLoadStart,
					"loadend" : layerLoadEnd
				},
				crossOriginKeyword: 'use-credentials',
				tileOptions:{crossOriginKeyword: 'use-credentials'},
				headers:{
					"x" : 'y'
				}
			});
	map.addLayer(imajnetLayer);
	
	map.addControl(new OpenLayers.Control.Attribution());
	map.setCenter(new OpenLayers.LonLat(0, 0), 3);

}