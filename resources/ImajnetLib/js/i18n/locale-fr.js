(function(jQuery) {
jQuery.imajnet = {
    "LRSSettings": "Paramètres référentiel", 
    "aboutImajnet": "Imajnet est un service web interactif qui fournit des données géospatiales et de l'imagerie au sol.<br/>Imajnet est disponible via un navigateur web mais aussi dans les logiciels SIG grâce aux plugins pour les solutions ArcGIS. Imajnet peut également être intégré dans des applications web verticales ou de bureau existantes.", 
    "addToLayer": {
        "add": "Ajouter à la couche", 
        "close": "Fermer", 
        "selectLayer": "Sélectionner la couche"
    }, 
    "address": {
        "label": "Adresse"
    }, 
    "buildDate": "Date de build", 
    "button": {
        "cancel": "Annuler", 
        "clickMode": "Visualisation d'un point cliqué dans la carte", 
        "close": "Fermer", 
        "closestImage": "Image la plus proche", 
        "enableImajnet": "Plugin imajnet", 
        "nextImage": "Image suivante", 
        "no": "Non", 
        "ok": "Ok", 
        "previousImage": "Image précédente", 
        "search": "Recherche", 
        "yes": "Oui"
    }, 
    "dateTime": {
        "closeText": "Ok", 
        "currentText": "Aujourd'hui", 
        "day1Min": "Di", 
        "day2Min": "Lu", 
        "day3Min": "Ma", 
        "day4Min": "Me", 
        "day5Min": "Je", 
        "day6Min": "Ve", 
        "day7Min": "Sa", 
        "hourText": "Heure", 
        "minuteText": "Minute", 
        "month1": "Janvier", 
        "month10": "Octobre", 
        "month11": "Novembre", 
        "month12": "Décembre", 
        "month2": "Février", 
        "month3": "Mars", 
        "month4": "Avril", 
        "month5": "Mai", 
        "month6": "Juin", 
        "month7": "Juillet", 
        "month8": "Août", 
        "month9": "Septembre", 
        "timeText": "Temps"
    }, 
    "downloadDocument": "Télécharger le manuel utilisateur", 
    "errors": {
        "genericError": "Veuillez contacter le support! Code: "
    }, 
    "help": "<h3>Navigation</h3> <b>Carte</b> - Il est possible de se déplacer dans la carte en cliquant sur différents endroits. En zoomant ou en agrandissant la carte, il est possible de se déplacer à l'endroit voulu.<br/><b>Image</b> - En utilisant la molette de la souris ou les boutons intégrés, il est possible de passer à l'image précédente ou suivante.<br/><img id=\"helpImajnetTraceImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Trace du relevé</b> - Aller à l'image désirée.<br/><h3>Positionnement de la caméra</h3> <img id=\"helpImajnetClosestModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Position la plus proche</b> - Dans ce mode, la caméra se positionne sur l'image la plus proche du point cliqué.<br/><img id=\"helpImajnetClickModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>Visualisation d'un point cliqué dans la carte</b> - Dans ce mode, la caméra se positionne dans l'image permettant de voir au mieux l'objet cliqué suivant sa position et son orientation.<br/>\t\t\t<h3>Recherche</h3> <b>Adresse</b> - Rechercher par adresse.<br/><b>Référentiel</b> - Rechercher dans le référentiel.<br/><h3>Timeline</h3> Les données imajnet dont indexées par date. Cela signifie que les images et les données cartographiques peuvent être filtrées en fonction de la date.<br/>", 
    "helpDownload": "Cliquez ici pour télécharger le PDF", 
    "helpWarning": "Il semble que l'ouverture de fichiers PDF n'est pas supporté par votre navigateur.", 
    "image": {
        "save": "Enregistrer l'image", 
        "switcher": {
            "centerButtonTitle": "Cliquez pour agrandir"
        }, 
        "zoomButton": "Zoom"
    }, 
    "imajnetNotAvailable": "Imajnet n'est pas disponible", 
    "link": "www.imajing.fr", 
    "loading": "Chargement...", 
    "locale": {
        "en": "English", 
        "es": "Español", 
        "fr": "Français", 
        "ja": "日本語", 
        "zh": "中文"
    }, 
    "login": {
        "button": "Connexion", 
        "error": {
            "forbidden": "Accès non autorisé ! Vérifiez que votre souscription vous autorise l'accès à toutes les applications imajing.", 
            "header": {
                "accountDisabled": "Accès non autorisé ! Compte désactivé.", 
                "accountExpierd": "Accès non autorisé ! Compte expiré.", 
                "accountLocked": "Accès non autorisé ! Compte verrouillé.", 
                "credentialsExpired": "Accès non autorisé ! Identifiants expirés.", 
                "invalidApplicationKey": "Accès non autorisé ! Cette application n'est pas autorisée à se connecter à Imajnet.", 
                "invalidSessionType": "Accès non autorisé ! Un type de session invalide a été détecté par Imajnet.", 
                "oauthAccessDeniedToResourceServerError": "Le serveur d'authentification n'autorise pas l'accès à cette ressource", 
                "oauthInternalServerError": "Erreur du serveur d'authentification", 
                "oauthInvalidTokenError": "Erreur de validation du token d'authentification", 
                "unauthenticated": "Nom d'utilisateur ou mot de passe invalide", 
                "unauthorized": "Accès non autorisé ! Vos identifiants sont actuellement en cours d'utilisation et ont atteint le nombre maximum d'accès simultanés.", 
                "unauthorizedSessionType": "Accès non autorisé ! Vérifiez que votre souscription vous autorise l'accès à toutes les applications imajing."
            }, 
            "invalidServerUrl": "L'URL du serveur n'est pas valide.", 
            "movedTemporarily": "Déplacé temporairement", 
            "noInternetConnection": "Pas de connexion internet", 
            "serviceUnavailable": "Le site internet est en cours de maintenance. Nous nous excusons pour le dérangement occasionné. Veuillez essayer plus tard.", 
            "sessionExpired": "Session expirée", 
            "unableToConnect": "Impossible de se connecter au serveur", 
            "unknown": "Erreur"
        }, 
        "forgotPassword": {
            "title": "Mot de passe oublié"
        }, 
        "password": "Mot de passe", 
        "rememberMe": "Se souvenir de moi pendant 2 semaines", 
        "requestAccess": {
            "text": "Contactez-nous à l'adresse info&#64;imajing.eu", 
            "title": "Demande d'accès"
        }, 
        "serverUrl": "URL du serveur", 
        "title": "Connexion", 
        "username": "Nom d'utilisateur"
    }, 
    "management": {
        "archiveSequence": {
            "confirmMessage": "Etes-vous sûr de vouloir archiver la séquence ?", 
            "title": "Archiver la séquence"
        }, 
        "createPOI": "Créer POI", 
        "deleteSequence": {
            "confirmMessage": "Etes-vous sûr de vouloir supprimer la séquence ?", 
            "title": "Supprimer la séquence"
        }, 
        "groundPlaneDetails": "Plan au sol", 
        "reimportSequence": {
            "confirmMessage": "Etes-vous sûr de vouloir réimporter la séquence?", 
            "title": "Réimportation de la séquence"
        }, 
        "sequenceDetails": "Les détails de la séquence", 
        "title": "Gestion", 
        "unarchiveSequence": {
            "confirmMessage": "Etes-vous sûr de vouloir désarchiver la séquence ?", 
            "error": "Le désarchivage de la séquence a rencontré un problème. Veuillez réessayer plus tard.", 
            "success": "La séquence a été désarchivée avec succès", 
            "title": "Désarchiver la séquence"
        }
    }, 
    "map": {
        "LRSEnd": "Fin", 
        "LRSLoading": "Chargement Référentiel...", 
        "LRSStart": "Début", 
        "OCM": "Open Cycle Map", 
        "OSM": "Open Street Map", 
        "OSMMapnik": "OSM Mapnik", 
        "OTM": "Open Transportation Map", 
        "bingAerial": "Bing Satellite", 
        "bingAerialWithLabels": "Bing Route/Satellite", 
        "bingRoad": "Bing Route", 
        "clipboard": {
            "clearButton": "Effacer", 
            "comment": "Commentaire", 
            "deleteItem": "Effacer l'objet", 
            "doubleClick": "Double-clic pour éditer", 
            "enableClipboard": "Afficher le presse-papier", 
            "exportButton": "Exporter", 
            "imageTag": "Vignette image", 
            "meters": "Mètres", 
            "noItems": "Aucune donnée à afficher", 
            "notify": {
                "text": "Objet ajouté au presse-papiers", 
                "title": "Notification presse-papiers"
            }, 
            "popupExport": {
                "donwloadFile": "Télécharger", 
                "download": "Télécharger", 
                "email": "E-mail", 
                "exportComplete": "Export terminé", 
                "exportError": "Erreur lors de l'export", 
                "exportProgress": "Export en cours...", 
                "exportStatus": "Statut de l'export", 
                "fileType": "Type de fichier", 
                "from": "De", 
                "message": "Message", 
                "send": "Envoyer", 
                "title": "Exporter", 
                "to": "A"
            }, 
            "position3D": "Position 3D", 
            "precisionRating": "Précision", 
            "precisionUnknown": "Précision inconnue", 
            "title": "Presse-papier", 
            "titleItem": {
                "polygon": "Polygone", 
                "polyligne": "Polyligne"
            }
        }, 
        "contextMenu": {
            "closeTool": "Terminer l'outil", 
            "deleteLastPoint": "Supprimer le dernier point", 
            "finishGeometry": "Terminer la géométrie", 
            "resetGeometry": "Recommencer la géométrie"
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
            "noImajnetImageAtPosition": "Il n'y a pas d'image dans la zone sélectionnée", 
            "noLRS": "Pas de LRS", 
            "unableToNavigate": "Impossible de naviguer"
        }, 
        "hidePreviewPanel": "Ne plus montrer !", 
        "measurement": {
            "errorMeasurement": "Impossible de mesurer!", 
            "step": "Etape", 
            "step1Content": "Cliquer aux deux extrémités de l'objet", 
            "step2Content": "Cliquer à nouveau aux deux extrémités du même objet", 
            "step3Content": "Mesure effectuée", 
            "title": "Mesure", 
            "titleConstraint": "Mesure contrainte"
        }, 
        "poi": {
            "label": "POI", 
            "optionDefault": "Choisir"
        }, 
        "polygon": {
            "errorPosition": "Impossible de positionner l'objet!", 
            "step": "Etape", 
            "step1Content": "Cliquer sur l'objet", 
            "step2Content": "Cliquer à nouveau sur le même objet", 
            "step3Content": "Cliquer ici une fois terminé", 
            "title": "Créer un polygone"
        }, 
        "polyligne": {
            "errorPosition": "Objet impossible à positionner !", 
            "step": "Etape", 
            "step1Content": "Cliquer sur l'objet", 
            "step2Content": "Cliquer à nouveau sur le même objet", 
            "step3Content": "Cliquer ici une fois terminé", 
            "title": "Créer une polyligne"
        }, 
        "popupSearchAddress": {
            "buttonSearchName": "Recherche", 
            "error": "Adresse introuvable", 
            "latitude": "Latitude", 
            "longitude": "Longitude", 
            "noResultsFound": "Aucun résultat trouvé", 
            "spectrumCity": "Ville", 
            "spectrumCountry": "Pays", 
            "spectrumStreet": "Rue", 
            "title": "Rechercher par l'adresse"
        }, 
        "popupSearchLRS": {
            "moreResults": "Certains résultats ne sont pas affichés", 
            "roadInputPlaceholder": "Entrez un nom de route", 
            "search": "Recherche", 
            "title": "Recherche dans le référentiel", 
            "type": "Type de référentiel", 
            "typeAny": "Tous", 
            "typeBoat": "Bateau", 
            "typeRoad": "Route", 
            "typeTrain": "Train"
        }, 
        "position": {
            "errorPosition": "Objet impossible à positionner!", 
            "step": "Etape", 
            "step1Content": "Cliquer sur l'objet", 
            "step2Content": "Cliquer à nouveau sur le même objet", 
            "step3Content": "Positionnement 3D effectué", 
            "title": "Positionner des objets"
        }, 
        "position3d": {
            "title": "Positionnement 3D"
        }, 
        "surveyTrace": {
            "date": "Date", 
            "distance": "Distance", 
            "meters": "Mètres"
        }
    }, 
    "menuAboutImajnet": "A propos", 
    "menuBugReport": "Signaler un problème", 
    "menuHelp": "Aide", 
    "menuNews": "Actualités", 
    "menuSettings": "Paramètres", 
    "noFullAccessMessage": "Votre niveau d'autorisation ne vous permet pas d’accéder au site internet. Une souscription à imajnet avec un niveau d'accès plus élevé est requise.", 
    "noNews": "Aucune actualité", 
    "oldSiteMessage": "En raison de la décision de Google d'arrêter les services Google Maps v2, nous sommes dans l'impossibilité de vous donner accès au website app.imajnet.net. \nNous vous suggérons donc de migrer vers la version la plus récente disponible sur web.imajnet.net.\nLe nouveau site internet a été validé sur plusieurs navigateurs. Cependant, si vous rencontrez un problème, reportez-le à support@imajnet.net en décrivant le problème et en précisant la version exacte du navigateur que vous utilisez.\n\nNous vous souhaitons une bonne navigation,\n\nL'équipe Imajing", 
    "poi": {
        "label": "Points d'intérêt"
    }, 
    "popupSequenceDetails": {
        "location": "Emplacement", 
        "name": "Nom", 
        "operator": "Opérateur", 
        "project": "Projet", 
        "repository": "Entrepôt", 
        "title": "Détails de la séquence"
    }, 
    "productOf": "Imajnet&#174; est un web service conçu et édité par imajing s.a.s, France", 
    "projectedLayers": {
        "addAttribute": "Ajouter un nouvel attribut", 
        "addButton": "Ajouter", 
        "groundProjection": "Projection au sol", 
        "heightOffset": "Décalage en hauteur", 
        "title": "Couches projetées", 
        "zFromAttribute": "Obtenir le Z depuis un attribut"
    }, 
    "security": {
        "logout": "Déconnexion", 
        "sessionExpired": "Votre session a expiré."
    }, 
    "settings": {
        "LRS": {
            "cumulatedAbscisa": {
                "1": "Dist. cumulée", 
                "2": "Dist. cumulée", 
                "label": "Etiquette de l'abscisse cumulée"
            }, 
            "referential": "Référentiel", 
            "relativeAbscisa": {
                "1": "PK+Absc.", 
                "2": "PK+Absc.", 
                "label": "Etiquette de l'abscisse relative"
            }, 
            "relativePoint": {
                "1": "PR", 
                "2": "PK", 
                "label": "Etiquette des bornes"
            }, 
            "road": "Route", 
            "search": "Recherche", 
            "title": "Référentiel", 
            "train": "Ligne"
        }, 
        "LRSSettings": "Paramètres référentiel", 
        "display": {
            "LRSShowCumulated": "Afficher la distance cumulée", 
            "addressDisplayType": {
                "city": "Commune", 
                "full": "Complète", 
                "title": "Niveau de détail de l'adresse"
            }, 
            "addressInLRS": "Combiner le référentiel et l'adresse", 
            "carto": "Carte", 
            "image": "Image", 
            "showLabels": "Afficher les étiquettes", 
            "showPR": "Afficher les PR", 
            "showRoads": "Afficher les routes", 
            "title": "Affichage"
        }, 
        "imageOptions": {
            "BEST": "Best", 
            "CLOSEST": "Closest", 
            "NEWEST": "Newest", 
            "title": "Priority/image retrieval options"
        }, 
        "imageQuality": "Qualité d'image", 
        "imageQualityHigh": "Elevée", 
        "imageQualityLow": "Faible", 
        "imageQualityMedium": "Normale", 
        "imageSectionTitle": "Image", 
        "imageSwitcher": "Rayon de recherche des images", 
        "imageSwitcherHight": "20m", 
        "imageSwitcherLow": "0m", 
        "mapSectionTitle": "Carte", 
        "orientedImages": "Images orientées", 
        "orientedImagesHight": "150m", 
        "orientedImagesLow": "10m", 
        "projection": "Objets visibles", 
        "projectionHigh": "100m", 
        "projectionLow": "10m", 
        "projectionSectionTitle": "Visualisation 3D", 
        "resetDefaultButton": "Revenir aux paramètres par défaut", 
        "saveSettingsButton": "Sauvegarder", 
        "settings": "Paramètres", 
        "surveyTrace": "Projection de la trace du relevé", 
        "surveyTraceHight": "100m", 
        "surveyTraceLow": "10m", 
        "tools": {
            "remainActive": "Rémanents", 
            "title": "Outils"
        }, 
        "units": {
            "feet": "Pieds", 
            "m": "mètres", 
            "title": "Unités", 
            "unit": "Unité"
        }
    }, 
    "timeframe": {
        "active": "Active", 
        "from": "De", 
        "reset": "Réinitialiser", 
        "title": "Timeline", 
        "to": "A"
    }, 
    "units": {
        "feet": "pieds", 
        "feet_short": "ft", 
        "m": "m", 
        "m_short": "m"
    }, 
    "version": "Version"
};
})(jQuery);
