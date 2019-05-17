(function (jQuery) {
	jQuery.imajnet = {
		"oldSiteMessage": "Due to Google decision to stop Google Maps v2 services, we are not able to give you access to the app.imajnet.net website.\nWe suggest that you migrate to the most recent website on web.imajnet.net.\nThis new website has been validated on many browsers. However, if you experience any problem, please report it at support@imajnet.net with your problem description and the exact browser version you are using.\n\nWe wish you a good navigation,\n\nThe Imajing team",
		"noFullAccessMessage": " Your imajnet subscription type does not allow you to access the website. A full subscription is required.",
		"imajnetNotAvailable": "Imajnet is not available",
		"roiInfoBox": {
			"labelsPlaceholder": "Add labels",
			"validate": "Validate",
			"invalidate": "Invalidate",
			"validationCommentPlaceholder": "Validation comment",
			"errors": {
				"save": "Error saving ROI",
				"delete": "Error deleting ROI",
				"label": "Error adding label"
			}
		},
		"map": {
			"OSM": "Open Street Map",
			"OSMMapnik": "OSM Mapnik",
			"OCM": "Open Cycle Map",
			"OTM": "Open Transportation Map",
			"bingRoad": "Bing Road",
			"bingAerial": "Bing Satellite",
			"bingAerialWithLabels": "Bing Hybrid",
			"LRSStart": "Start",
			"LRSEnd": "End",
			"LRSLoading": "Loading LRS...",
			"hidePreviewPanel": "Stop showing this!",
			"popupSearchAddress": {
				"title": "Search address",
				"longitude": "Longitude",
				"latitude": "Latitude",
				"buttonSearchName": "Search",
				"noResultsFound": "No results found",
				"error": "Error searching address",
				"spectrumStreet": "Street",
				"spectrumCity": "City",
				"spectrumCountry": "Country"
			},
			"popupSearchLRS": {
				"title": "Search referential",
				"type": "LRS Type",
				"typeAny": "Any",
				"typeRoad": "Road",
				"typeTrain": "Train",
				"typeBoat": "Boat",
				"search": "Search ",
				"roadInputPlaceholder": "Type road name",
				"moreResults": "Some results are not displayed"
			},
			"surveyTrace": {
				"distance": "Distance",
				"meters": "meters",
				"date": "Date"
			},
			"position3d": {
				"title": "3D position objects"
			},
			"position": {
				"title": "Position objects",
				"step": "Step",
				"step1Content": "Click on the object",
				"step2Content": "Click again on the same object",
				"step3Content": "3D positioning done",
				"errorPosition": "Unable to position object!"
			},
			"measurement": {
				"title": "Measurement",
				"titleConstraint": "Constraint measurement",
				"step": "Step",
				"step1Content": "Click at both ends on the object",
				"step2Content": "Click again at both ends on the same object",
				"step3Content": "Measurement done",
				"errorMeasurement": "Unable to measure!"
			},
			"polyligne": {
				"title": "Draw polyline",
				"step": "Step",
				"step1Content": "Click on the object",
				"step2Content": "Click again on the same object",
				"step3Content": "Click me when done",
				"errorPosition": "Unable to position object!"
			},
			"polygon": {
				"title": "Draw polygon",
				"step": "Step",
				"step1Content": "Click on the object",
				"step2Content": "Click again on the same object",
				"step3Content": "Click me when done",
				"errorPosition": "Unable to position object!"
			},
			"contextMenu": {
				"resetGeometry": "Reset geometry",
				"deleteLastPoint": "Delete last point",
				"finishGeometry": "Finish geometry",
				"closeTool": "Close tool"
			},
			"clipboard": {
				"title": "Clipboard",
				"titleItem": {
					"polyligne": "Polyline",
					"polygon": "Polygon"
				},
				"notify": {
					"title": "Clipboard notification",
					"text": "Object added to clipboard"
				},
				"enableClipboard": "Show clipboard",
				"position3D": "3D Position",
				"meters": "Meters",
				"comment": "Comment",
				"deleteItem": "Delete item",
				"precisionRating": "Position precision rating",
				"precisionUnknown": "Position precision unknown",
				"doubleClick": "Double click to edit comment",
				"imageTag": "Image Tag",
				"clearButton": "Clear",
				"exportButton": "Export",
				"noItems": "No items to show",
				"popupExport": {
					"title": "Export",
					"email": "E-mail",
					"from": "From",
					"to": "To",
					"message": "Message",
					"fileType": "File type",
					"exportStatus": "Export status",
					"exportProgress": "Export in progress...",
					"exportComplete": "Export complete",
					"exportError": "Export error",
					"donwloadFile": "Donwload file",
					"send": "Send",
					"download": "Download"
				}
			},
			"poi": {
				"label": "POI",
				"optionDefault": "Choose"
			},
			"errors": {
				"unableToNavigate": "Unable to navigate",
				"noImajnetImageAtPosition": "There are no images in the selected area",
				"noLRS": "No LRS"
			},
			"customBaseLayers": {
				"NAV_STREET": "Naver street",
				"NAV_SATELLITE": "Naver satellite",
				"NAV_HYBRID": "Naver hybrid",
				"VWORLD_STREET": "Vworld street",
				"VWORLD_SATELLITE": "Vworld satellite",
				"VWORLD_HYBRID": "Vworld hybrid"
			}
		},
		"timeframe": {
			"title": "Timeline",
			"active": "Active",
			"from": "From",
			"to": "To",
			"reset": "Reset"
		},
		"image": {
			"zoomButton": "Zoom",
			"switcher": {
				"centerButtonTitle": "Click to maximize"
			},
			"save": "Save image"
		},
		"settings": {
			"settings": "Settings",
			"LRSSettings": "LRS settings",
			"display": {
				"title": "Display",
				"image": "Image",
				"carto": "Map",
				"showRoads": "Show roads",
				"showPR": "Show milestones",
				"showLabels": "Show labels",
				"LRSShowCumulated": "Show cumulated distance",
				"addressDisplayType": {
					"title": "Address detail level",
					"full": "Full",
					"city": "City"
				},
				"addressInLRS": "Combine LRS and address"
			},
			"imageSectionTitle": "Image",
			"imageQuality": "Image quality",
			"imageQualityLow": "Low",
			"imageQualityMedium": "Medium",
			"imageQualityHigh": "High",
			"surveyTrace": "Survey track projection",
			"surveyTraceLow": "10m",
			"surveyTraceHight": "100m",
			"imageSwitcher": "Image searching radius",
			"imageSwitcherLow": "0m",
			"imageSwitcherHight": "20m",
			"imageOptions": {
				"title": "Priority/image retrieval options",
				"CLOSEST": "Closest",
				"NEWEST": "Newest",
				"BEST": "Best"
			},
			"mapSectionTitle": "Map",
			"orientedImages": "Oriented images",
			"orientedImagesLow": "10m",
			"orientedImagesHight": "150m",
			"projectionSectionTitle": "Projection",
			"projection": "Visible objects",
			"projectionLow": "10m",
			"projectionHigh": "100m",
			"units": {
				"title": "Units",
				"unit": "Unit",
				"m": "meters",
				"feet": "Feet"
			},
			"tools": {
				"title": "Tools",
				"remainActive": "Remain active"
			},
			"resetDefaultButton": "Reset to default settings",
			"saveSettingsButton": "Save",
			"LRS": {
				"title": "Referential",
				"search": "Search",
				"referential": "Referential",
				"road": "Road",
				"train": "Railway",
				"relativePoint": {
					"1": "Milestone",
					"2": "KP",
					"label": "Relative point label"
				},
				"relativeAbscisa": {
					"1": "Relative Dist.",
					"2": "Relative Dist.",
					"label": "Relative abscissa label"
				},
				"cumulatedAbscisa": {
					"1": "Cumulated Dist.",
					"2": "Cumulated Dist.",
					"label": "Cumulated abscissa label"
				}
			}
		},
		"button": {
			"search": "Search",
			"ok": "Ok",
			"close": "Close",
			"cancel": "Cancel",
			"yes": "Yes",
			"no": "No",
			"nextImage": "Next image",
			"previousImage": "Previous image",
			"closestImage": "Closest image",
			"clickMode": "Click mode",
			"enableImajnet": "Imajnet plugin"
		},
		"login": {
			"title": "Login",
			"username": "Username",
			"password": "Password",
			"serverUrl": "Server URL",
			"rememberMe": "Don't ask for my password for 2 weeks",
			"error": {
				"unknown": "Error",
				"forbidden": "Not enough permission to see this page",
				"movedTemporarily": "Moved temporarily",
				"serviceUnavailable": "Application is down for maintenance. Sorry for the inconvenience, please check again later.",
				"noInternetConnection": "No internet connection",
				"unableToConnect": "Unable to connect to server",
				"sessionExpired": "Session expired",
				"invalidServerUrl": "The server URL is not valid.",
				"header": {
					"unauthenticated": "Invalid username or password",
					"unauthorized": "Unauthorized access! Your username/password are currently in use and have reached the maximum number of simultaneous connections.",
					"accountLocked": "Unauthorized access! Account locked.",
					"accountDisabled": "Unauthorized access! Account disabled.",
					"accountExpierd": "Unauthorized access! Account expired.",
					"credentialsExpired": "Unauthorized access! Credentials expired.",
					"invalidApplicationKey": "Unauthorized access! This application is not authorized to connect to Imajnet.",
					"invalidSessionType": "Unauthorized access! An invalid session type was requested to Imajnet.",
					"unauthorizedSessionType": "Unauthorized access! You are not authorized to open a session of the requested type.",
					"oauthInternalServerError": "Authentication server error",
					"oauthInvalidTokenError": "Authentication token validation error",
					"oauthAccessDeniedToResourceServerError": "Authentication server does not allow access to this resource"
				}
			},
			"button": "Login",
			"requestAccess": {
				"title": "Request access",
				"text": "Please contact us at info&#64;imajing.eu"
			},
			"forgotPassword": {
				"title": "Forgot password"
			}
		},
		"projectedLayers": {
			"title": "Projected layers",
			"groundProjection": "Ground projection",
			"heightOffset": "Height offset",
			"zFromAttribute": "Get Z from attribute",
			"addAttribute": "Add new attribute",
			"addButton": "Add"
		},
		"addToLayer": {
			"selectLayer": "Select layer",
			"add": "Add to layer",
			"close": "Close"

		},
		"help": "<h3>Navigation</h3> <b>Map</b> - The position on the map can be changed by clicking on different locations. By zooming and panning the map, one can navigate to the desired location.<br/><b>Image</b> - by using the mouse scroll wheel or the integrated buttons, one can move to the next/previous image.<br/><img id=\"helpImajnetTraceImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Survey trace</b> - jump to the desired image.<br/><h3>Click mode</h3> <img id=\"helpImajnetClosestModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Click to position</b> - in this mode the camera is positioned on the closest image to the clicked coordinates.<br/><img id=\"helpImajnetClickModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Click to view</b> - in this mode, the camera is positioned on the best image that is looking towards the clicked object.<br/>\t\t\t<h3>Search</h3> <b>Address</b> - Search by address.<br/><b>Referential system</b> - LRS Search.<br/><h3>Timeline</h3> Imajnet data is indexed by time. This means that the images and cartographic data can be filtered by time periods.<br/>",
		"helpWarning": "It appears you don't have PDF support in this web browser. ",
		"helpDownload": "Click here to download the PDF",
		"downloadDocument": "Download user guide",
		"aboutImajnet": "Imajnet is an interactive web service delivering geospatial data and ground level imagery.<br/>Imajnet is available via a web browser, but also in GIS through plugins for ArcGIS solutions. Imajnet can also be integrated in existing vertical web or desktop applications.",
		"link": "www.imajing.eu",
		"version": "Version",
		"buildDate": "Build date",
		"productOf": "Imajnet&#174; is designed and published by imajing s.a.s, France",
		"loading": "Loading...",
		"menuHelp": "Help",
		"menuAboutImajnet": "About",
		"menuNews": "News",
		"menuBugReport": "Report a problem",
		"noNews": "No news",
		"menuSettings": "Settings",
		"LRSSettings": "LRS Settings",
		"management": {
			"title": "Management",
			"sequenceDetails": "Sequence details",
			"reimportSequence": {
				"title": "Re-import sequence",
				"confirmMessage": "Do you really want to re-import the sequence?"
			},
			"deleteSequence": {
				"title": "Delete sequence",
				"confirmMessage": "Do you really want to delete the sequence?"
			},
			"archiveSequence": {
				"title": "Archive sequence",
				"confirmMessage": "Do you really want to archive the sequence?"
			},
			"unarchiveSequence": {
				"title": "Un-archive sequence",
				"confirmMessage": "Do you really want to un-archive the sequence?",
				"error": "The un-arhiving of the sequence did not succeed, please try again later",
				"success": "The sequence was successfully un-archived"
			},
			"createPOI": "Create POI",
			"groundPlaneDetails": "Ground plane details"
		},
		"popupSequenceDetails": {
			"title": "Sequence details",
			"name": "Name",
			"project": "Project",
			"operator": "Operator",
			"repository": "Repository",
			"location": "Location"
		},
		"poi": {
			"label": "Points of interest"
		},
		"address": {
			"label": "Address"
		},
		"security": {
			"logout": "Logout",
			"sessionExpired": "Your session has expired."
		},
		"dateTime": {
			"month1": "January",
			"month2": "February",
			"month3": "March",
			"month4": "April",
			"month5": "May",
			"month6": "June",
			"month7": "July",
			"month8": "August",
			"month9": "September",
			"month10": "October",
			"month11": "November",
			"month12": "December",
			"day1Min": "Su",
			"day2Min": "Mo",
			"day3Min": "Tu",
			"day4Min": "We",
			"day5Min": "Th",
			"day6Min": "Fr",
			"day7Min": "Sa",
			"timeText": "Time",
			"hourText": "Hour",
			"minuteText": "Minute",
			"currentText": "Now",
			"closeText": "Ok"
		},
		"units": {
			"m": "m",
			"m_short": "m",
			"feet": "feet",
			"feet_short": "ft"
		},
		"locale": {
			"en": "English",
			"fr": "Français",
			"es": "Español",
			"zh": "中文",
			"ja": "日本語"
		},
		"errors": {
			"genericError": "Please contact administrator! Code:",
			"unknownError": "An unknown error has occurred"
		}
	};
})(jQuery);