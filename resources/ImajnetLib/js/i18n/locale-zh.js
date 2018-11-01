(function(jQuery) {
jQuery.imajnet = {
    "LRSSettings": "LRS设置", 
    "aboutImajnet": "Imajnet是一种提供地理空间数据和地平面图像的交互式Web服务。<br/>通过Web浏览器可以访问Imajnet，也可以通过ArcGIS解决方案的插件使用Imajnet。 Imajnet也可以集成到现有的网络或应用程序中。", 
    "address": {
        "label": "地址"
    }, 
    "buildDate": "创建日期", 
    "button": {
        "cancel": "取消", 
        "clickMode": "点击模式", 
        "close": "关闭", 
        "closestImage": "最近的影像", 
        "enableImajnet": "imajnet插件", 
        "nextImage": "下一张影像", 
        "no": "No", 
        "ok": "Ok", 
        "previousImage": "上一张影像", 
        "search": "搜索", 
        "yes": "Yes"
    }, 
    "dateTime": {
        "closeText": "Ok", 
        "currentText": "现在", 
        "day1Min": "星期天", 
        "day2Min": "星期一", 
        "day3Min": "星期二", 
        "day4Min": "星期三", 
        "day5Min": "星期四", 
        "day6Min": "星期五", 
        "day7Min": "星期六", 
        "hourText": "小时", 
        "minuteText": "分", 
        "month1": "1月", 
        "month10": "10月", 
        "month11": "11月", 
        "month12": "12月", 
        "month2": "二月", 
        "month3": "三月", 
        "month4": "4月", 
        "month5": "5月", 
        "month6": "6月", 
        "month7": "7月", 
        "month8": "8月", 
        "month9": "9月", 
        "timeText": "时间"
    }, 
    "downloadDocument": "下载用户手册", 
    "errors": {
        "genericError": "请联系管理员！代码："
    }, 
    "help": "<h3>导航</h3> <b>地图</b> - 地图上点击不同的位置可跳转。 通过缩放和平移地图，可以导航到所需的位置。<br/><b>影像</b> - 使用鼠标滚轮或按钮，可以移动到下一个/上一个影像.<br/><img id=\"helpImajnetTraceImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>轨迹</b> - 跳转至指定影像。<br/><h3>点击模式</h3> <img id=\"helpImajnetClosestModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>点击定位</b> - 在此模式下，相机定位在与点击的坐标最接近的影像上.<br/><img id=\"helpImajnetClickModeImage\" height=\"24\" width=\"24\" align=\"left\" border=\"0\" /><b>点击浏览</b> - 在这种模式下，相机定位在朝向被点击物体的最佳影像上。<br/>\t\t\t<h3>查询</h3> <b>地址</b> - 按地址查询。<br/><b>LRS系统</b> - LRS查询。<br/><h3>时间轴</h3> Imajnet数据按时间索引。 影像和数据可以按时间段进行过滤。<br/>", 
    "helpDownload": "点击下载PDF", 
    "helpWarning": "本浏览器不支持PDF。 ", 
    "image": {
        "save": "保存照片", 
        "switcher": {
            "centerButtonTitle": "点击最大化"
        }, 
        "zoomButton": "缩放"
    }, 
    "imajnetNotAvailable": "imajnet不可用", 
    "link": "www.imajing.eu", 
    "loading": "导入中...", 
    "locale": {
        "en": "English", 
        "es": "Español", 
        "fr": "Français", 
        "ja": "日本語", 
        "zh": "中文"
    }, 
    "login": {
        "button": "登录", 
        "error": {
            "forbidden": "查看此网页权限不够", 
            "header": {
                "accountDisabled": "未授权！账户已禁用。", 
                "accountExpierd": "未授权！账户已过期。", 
                "accountLocked": "未授权！账户被锁定。", 
                "credentialsExpired": "未授权！凭证已过期。", 
                "invalidApplicationKey": "未授权！此程序未被授权连接imajnet。", 
                "invalidSessionType": "未授权！ 向Imajnet请求的会话类型无效。", 
                "unauthenticated": "用户名或密码错误", 
                "unauthorized": "未授权！您的用户名/密码正在使用中，并已达到同时连接的最大数量。", 
                "unauthorizedSessionType": "未授权！ 您无权打开所请求类型的会话。"
            }, 
            "invalidServerUrl": "服务地址无效。", 
            "movedTemporarily": "临时移动", 
            "noInternetConnection": "无网络连接", 
            "serviceUnavailable": "服务器停机维护。 非常抱歉对您造成不便，请稍后再试。", 
            "sessionExpired": "会话过期", 
            "unableToConnect": "无法连接服务器", 
            "unknown": "错误"
        }, 
        "forgotPassword": {
            "title": "忘记密码"
        }, 
        "password": "密码", 
        "rememberMe": "两周内免密码", 
        "requestAccess": {
            "text": "请通过&#64;imajing.eu联系我们", 
            "title": "申请连接"
        }, 
        "serverUrl": "服务器", 
        "title": "登录", 
        "username": "用户名"
    }, 
    "management": {
        "archiveSequence": {
            "confirmMessage": "确定要归档序列吗？", 
            "title": "归档序列"
        }, 
        "createPOI": "创建POI", 
        "deleteSequence": {
            "confirmMessage": "确定删除本序列？", 
            "title": "删除序列"
        }, 
        "groundPlaneDetails": "地平面详情", 
        "reimportSequence": {
            "confirmMessage": "确定要重新导入序列吗？", 
            "title": "重新导入序列"
        }, 
        "sequenceDetails": "序列详情", 
        "title": "管理", 
        "unarchiveSequence": {
            "confirmMessage": "确定要取消归档序列吗？", 
            "error": "取消归档序列遇到了问题，请稍后再试", 
            "success": "该序列已成功取消归档", 
            "title": "取消归档序列"
        }
    }, 
    "map": {
        "LRSEnd": "结束", 
        "LRSLoading": "LRS导入中...", 
        "LRSStart": "开始", 
        "OCM": "Open Cycle Map", 
        "OSM": "Open Street Map", 
        "OSMMapnik": "OSM Mapnik", 
        "OTM": "打开Transportation Map", 
        "bingAerial": "Bing Satellite", 
        "bingAerialWithLabels": "Bing Hybrid", 
        "bingRoad": "Bing Road", 
        "clipboard": {
            "clearButton": "清除", 
            "comment": "备注", 
            "deleteItem": "删除项", 
            "doubleClick": "双击编辑评论", 
            "enableClipboard": "显示剪贴板", 
            "exportButton": "导出", 
            "imageTag": "影像标签", 
            "meters": "米", 
            "noItems": "无内容", 
            "notify": {
                "text": "添加要素至剪贴板", 
                "title": "剪贴板通知"
            }, 
            "popupExport": {
                "donwloadFile": "下载文件", 
                "download": "下载", 
                "email": "E-mail", 
                "exportComplete": "输出完成", 
                "exportError": "导出错误", 
                "exportProgress": "正在导出...", 
                "exportStatus": "导出状态", 
                "fileType": "文件类型", 
                "from": "自", 
                "message": "消息", 
                "send": "发送", 
                "title": "Export", 
                "to": "至"
            }, 
            "position3D": "3D定位", 
            "precisionRating": "位置精度等级", 
            "precisionUnknown": "位置精度未知", 
            "title": "Clipboard", 
            "titleItem": {
                "polygon": "多边形", 
                "polyligne": "折线"
            }
        }, 
        "contextMenu": {
            "closeTool": "关闭工具", 
            "deleteLastPoint": "删除最后一个点", 
            "finishGeometry": "完成", 
            "resetGeometry": "重置几何"
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
            "noImajnetImageAtPosition": "所选区域无影像", 
            "noLRS": "无线性参考系统", 
            "unableToNavigate": "无法导航"
        }, 
        "hidePreviewPanel": "不再显示！", 
        "measurement": {
            "errorMeasurement": "不可量测!", 
            "step": "步骤", 
            "step1Content": "点击要素的两端", 
            "step2Content": "再次点击同一要素的两端", 
            "step3Content": "完成测量", 
            "title": "测量", 
            "titleConstraint": "约束测量"
        }, 
        "poi": {
            "label": "POI", 
            "optionDefault": "选择"
        }, 
        "polygon": {
            "errorPosition": "无法定位要素！", 
            "step": "步骤", 
            "step1Content": "点击要素", 
            "step2Content": "再次在同一要素上点击", 
            "step3Content": "点击完成", 
            "title": "绘制多边形"
        }, 
        "polyligne": {
            "errorPosition": "无法定位对象！", 
            "step": "步骤", 
            "step1Content": "点击要素", 
            "step2Content": "在同一要素上点击", 
            "step3Content": "点击完成", 
            "title": "绘制折线"
        }, 
        "popupSearchAddress": {
            "buttonSearchName": "搜索", 
            "error": "地址搜索错误", 
            "latitude": "纬度", 
            "longitude": "经度", 
            "noResultsFound": "未找到结果", 
            "spectrumCity": "城市", 
            "spectrumCountry": "国家", 
            "spectrumStreet": "街道", 
            "title": "搜索地址"
        }, 
        "popupSearchLRS": {
            "moreResults": "未全部显示", 
            "roadInputPlaceholder": "输入道路名称", 
            "search": "搜索 ", 
            "title": "搜索参考", 
            "type": "LRS类型", 
            "typeAny": "任意", 
            "typeBoat": "水路", 
            "typeRoad": "公路", 
            "typeTrain": "铁路"
        }, 
        "position": {
            "errorPosition": "无法定位要素！", 
            "step": "步骤", 
            "step1Content": "点击要素", 
            "step2Content": "在同一要素上再次点击", 
            "step3Content": "3D定位完成", 
            "title": "定位要素"
        }, 
        "position3d": {
            "title": "3D定位要素"
        }, 
        "surveyTrace": {
            "date": "日期", 
            "distance": "距离", 
            "meters": "米"
        }
    }, 
    "menuAboutImajnet": "关于", 
    "menuBugReport": "反馈问题", 
    "menuHelp": "帮助", 
    "menuNews": "消息", 
    "menuSettings": "设置", 
    "noFullAccessMessage": "  您的imajnet权限级别不允许您访问该网站，需要更高级别的imajnet权限。", 
    "noNews": "无消息", 
    "oldSiteMessage": "由于谷歌决定停止Google Maps v2服务，我们无法让您访问app.imajnet.net网站。\n我们建议您前往到最新的web.imajnet.net网站。\n这个新网站已在许多浏览器上验证过。 但是，如果您遇到任何问题，请通过support@imajnet.net报告问题描述以及您使用的确切浏览器版本。\n\n我们希望您拥有完美的体验，\n\nImajing团队", 
    "poi": {
        "label": "POI"
    }, 
    "popupSequenceDetails": {
        "location": "位置", 
        "name": "名称", 
        "operator": "采集者", 
        "project": "工程", 
        "repository": "仓库", 
        "title": "序列详情"
    }, 
    "productOf": "Imajnet&#174; is designed and published by imajing s.a.s, France", 
    "security": {
        "logout": "退出", 
        "sessionExpired": "您的回话已过期。"
    }, 
    "settings": {
        "LRS": {
            "cumulatedAbscisa": {
                "1": "累计距离", 
                "2": "累计距离", 
                "label": "横坐标累积"
            }, 
            "referential": "参考", 
            "relativeAbscisa": {
                "1": "累计距离", 
                "2": "累计距离", 
                "label": "相对横坐标"
            }, 
            "relativePoint": {
                "1": "公里标", 
                "2": "PK", 
                "label": "相对点标签"
            }, 
            "road": "公路", 
            "search": "搜索", 
            "title": "参考", 
            "train": "铁路"
        }, 
        "LRSSettings": "LRS设置", 
        "display": {
            "LRSShowCumulated": "显示累计距离", 
            "addressDisplayType": {
                "city": "城市", 
                "full": "全部", 
                "title": "地址细节级"
            }, 
            "addressInLRS": "结合LRS和地址", 
            "carto": "地图", 
            "image": "影像", 
            "showLabels": "显示标签", 
            "showPR": "显示公里标", 
            "showRoads": "显示道路", 
            "title": "显示"
        }, 
        "imageOptions": {
            "BEST": "最好", 
            "CLOSEST": "最近", 
            "NEWEST": "最新", 
            "title": "优先/影像检索选项"
        }, 
        "imageQuality": "图片质量", 
        "imageQualityHigh": "高", 
        "imageQualityLow": "低", 
        "imageQualityMedium": "中", 
        "imageSectionTitle": "图片", 
        "imageSwitcher": "影像搜索半径", 
        "imageSwitcherHight": "20m", 
        "imageSwitcherLow": "0m", 
        "mapSectionTitle": "地图", 
        "orientedImages": "定向影像", 
        "orientedImagesHight": "150m", 
        "orientedImagesLow": "10m", 
        "projection": "可显示要素", 
        "projectionHigh": "100m", 
        "projectionLow": "10m", 
        "projectionSectionTitle": "投影", 
        "resetDefaultButton": "重置设置", 
        "saveSettingsButton": "保存", 
        "settings": "设置", 
        "surveyTrace": "轨迹投影", 
        "surveyTraceHight": "100m", 
        "surveyTraceLow": "10m", 
        "tools": {
            "remainActive": "保持激活", 
            "title": "工具"
        }, 
        "units": {
            "feet": "英尺", 
            "m": "米", 
            "title": "单位", 
            "unit": "单位"
        }
    }, 
    "timeframe": {
        "active": "可用", 
        "from": "开始", 
        "reset": "重置", 
        "title": "时间轴", 
        "to": "截止"
    }, 
    "units": {
        "feet": "英尺", 
        "feet_short": "英尺", 
        "m": "米", 
        "m_short": "米"
    }, 
    "version": "版本"
};
})(jQuery);
