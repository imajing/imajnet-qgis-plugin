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

		var oldSettings = ImajnetPlugin.loadSettings().imajnetLoginSettings;
		/*if (isFromIdle && settings.username === oldSettings.username && settings.password === oldSettings.password && settings.serverUrl === oldSettings.serverUrl) {
			window.location.reload();
		}*/

		ImajnetPlugin.saveSettings(settings, {}, {});
		ImajnetPlugin.activateImajnet();
	});

	var imajnetLoginSettings = ImajnetPlugin.loadSettings().imajnetLoginSettings;
	if (imajnetLoginSettings.username && imajnetLoginSettings.password) {
		jQuery('#username').val(imajnetLoginSettings.username);
		jQuery('#password').val(imajnetLoginSettings.password);
	}
	if (imajnetLoginSettings.serverUrl) {
		jQuery('#serverUrl').val(imajnetLoginSettings.serverUrl);
	}
}

function removeDiacritics (str) {

	var defaultDiacriticsRemovalMap = [
	  {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
	  {'base':'AA','letters':/[\uA732]/g},
	  {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
	  {'base':'AO','letters':/[\uA734]/g},
	  {'base':'AU','letters':/[\uA736]/g},
	  {'base':'AV','letters':/[\uA738\uA73A]/g},
	  {'base':'AY','letters':/[\uA73C]/g},
	  {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
	  {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
	  {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
	  {'base':'DZ','letters':/[\u01F1\u01C4]/g},
	  {'base':'Dz','letters':/[\u01F2\u01C5]/g},
	  {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
	  {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
	  {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
	  {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
	  {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
	  {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
	  {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
	  {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
	  {'base':'LJ','letters':/[\u01C7]/g},
	  {'base':'Lj','letters':/[\u01C8]/g},
	  {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
	  {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
	  {'base':'NJ','letters':/[\u01CA]/g},
	  {'base':'Nj','letters':/[\u01CB]/g},
	  {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
	  {'base':'OI','letters':/[\u01A2]/g},
	  {'base':'OO','letters':/[\uA74E]/g},
	  {'base':'OU','letters':/[\u0222]/g},
	  {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
	  {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
	  {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
	  {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
	  {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
	  {'base':'TZ','letters':/[\uA728]/g},
	  {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
	  {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
	  {'base':'VY','letters':/[\uA760]/g},
	  {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
	  {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
	  {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
	  {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
	  {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
	  {'base':'aa','letters':/[\uA733]/g},
	  {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
	  {'base':'ao','letters':/[\uA735]/g},
	  {'base':'au','letters':/[\uA737]/g},
	  {'base':'av','letters':/[\uA739\uA73B]/g},
	  {'base':'ay','letters':/[\uA73D]/g},
	  {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
	  {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
	  {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
	  {'base':'dz','letters':/[\u01F3\u01C6]/g},
	  {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
	  {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
	  {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
	  {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
	  {'base':'hv','letters':/[\u0195]/g},
	  {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
	  {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
	  {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
	  {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
	  {'base':'lj','letters':/[\u01C9]/g},
	  {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
	  {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
	  {'base':'nj','letters':/[\u01CC]/g},
	  {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
	  {'base':'oi','letters':/[\u01A3]/g},
	  {'base':'ou','letters':/[\u0223]/g},
	  {'base':'oo','letters':/[\uA74F]/g},
	  {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
	  {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
	  {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
	  {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
	  {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
	  {'base':'tz','letters':/[\uA729]/g},
	  {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
	  {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
	  {'base':'vy','letters':/[\uA761]/g},
	  {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
	  {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
	  {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
	  {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
	];
  
	for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
	  str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
	}
  
	return str;
  
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

		var settings = ImajnetPlugin.loadSettings();
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

		ImajnetPlugin.saveSettings(imajnetLoginSettings, {}, {});
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
			metadata: 'imajnet-qgis-plugin ' + removeDiacritics(PyImajnet.version()),
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


function cleanupForLogout(keepSettings){
	window.localStorage.clear(); //we keep localstorage in qgis
	if (!keepSettings) {
		var imajnetLoginSettings = ImajnetPlugin.loadSettings().imajnetLoginSettings;
		delete imajnetLoginSettings.username;
		delete imajnetLoginSettings.password;
		ImajnetPlugin.saveSettings(imajnetLoginSettings, {}, {});
	}
	//ImajnetUrl.deleteUrlParams();
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
		cleanupForLogout(keepSettings);
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
	return Imajnet.deactivateImajnet(true, false, true, false);
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
			//jQuery('#imajnetClipboardComment_' + id).hide();
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
			textarea.show().focus();
		}
		isFirstLoad = false;
	} else {
		ImajnetPlugin.showImajnetItem('imajnetContainer');
		Nigsys.hideLoading(jQuery('body'));
		ImajnetUI.hideContextMenu();
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
	//ImajnetUI.onImageResize();
	var containerWidth = ImajnetUI.imageContainer.parent().width();
	var containerHeight = ImajnetUI.imageContainer.parent().height();
	ImajnetUI.resizeImageElements(containerWidth, containerHeight, true);

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
	ImajnetMap.mapClickHandler(mapCenter);

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
		if(key.indexOf('IMAJNET')==-1 && key.indexOf('cookieWarning')==-1){
			continue;
		}
		var obj = new Object();
		obj.name = key;
		obj.value = localStorage.getItem(key).replace('""', '"');
		if (key.indexOf('IMAJNET_PROJECTED_LAYERS') !== -1 || key.indexOf('IMAJNET_CLIPBOARD') !== -1) {
			keys.project.push(obj);
		} else {
			keys.global.push(obj)
		}
	}
	return keys;
}

ImajnetPlugin.resetSettings = function () {
	ImajnetPlugin.saveSettings([0], [0], [0]);
}

ImajnetPlugin.saveSettings = function (imajnetLoginSettings, imajnetProjectSettings, imajnetGlobalSettings) {
	return PyImajnet.saveSettings(JSON.stringify(imajnetLoginSettings), JSON.stringify(imajnetProjectSettings), JSON.stringify(imajnetGlobalSettings));
}

ImajnetPlugin.loadSettings = function () {
	var result = {
		imajnetLoginSettings: {},
		imajnetProjectSettings: {},
		imajnetGlobalSettings: {}
	}
	try {
		var settings = PyImajnet.loadSettings();
		for (var prop in settings) {
			var parsed = JSON.parse(settings[prop]);
			if (Object.keys(parsed).length === 0) {
				continue;
			}
			settings[prop] = parsed;
		}
		result = settings;
	} catch (e) {}
	return result;
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
	ImajnetPlugin.saveSettings({}, keys.project, keys.global);
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


/////////////////////////////////////////////////
//// ROI temporary /////////////////////////////
/////////////////////////////////////////////////
pyImajnetCreateROI = function (roi, image, photogrammetryInfo) {
	var imageUrl = (ImajnetAPI.buildImageURLWithResolution(image, ImajnetSettings.imajnetImageResolutions[3]));

	return PyImajnet.createROI(roi, image, photogrammetryInfo, imageUrl);
}

onTabChange = function (event, ui) {
	if (!ui.newPanel[0]) {
		return;
	}
	var tabId = ui.newPanel[0].id;
	if (tabId == 'lrsSeatchTab') {
		ImajnetPlugin.onImajnetControlPressed(null, 'searchLRS');
	} else if (tabId == 'clipboardTab') {
		ImajnetPlugin.onImajnetControlPressed(null, 'showClipboard');;
	} else if (tabId == 'newsTab') {
		ImajnetPlugin.onImajnetControlPressed(null, 'showNews');
	} else if (tabId == 'clayerProjectionTab') {

	}
	ImajnetUI.stopSwipeNavigation(true, true);
	jQuery('ul.ui-autocomplete').hide();
	jQuery('.textAreaEditClipboardComment').hide();
}