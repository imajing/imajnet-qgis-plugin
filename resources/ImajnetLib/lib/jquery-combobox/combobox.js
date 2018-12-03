Combobox = {
    defaultOptions: {
        _create: function() {
            var input, self = this, select = this.element.hide(), selected = select.children(":selected"), value = selected.val() ? selected.text() : "", wrapper = this.wrapper = jQuery("<span>").attr('id', jQuery(this.element).attr('id') + 'Combobox').addClass("ui-combobox ui-combobox-" + jQuery(this.element).attr('id')).insertAfter(select), firstOption = null;
            input = jQuery("<input>").appendTo(wrapper).val(value).addClass('ui-state-default ui-combobox-input' + (self.options.permisive ? ' ui-combobox-input-permisive' : ' ui-combobox-input-nopermisive')).autocomplete({
                delay: 0,
                minLength: 0,
                source: function(request, response) {
                    if (typeof FeaturesListing !== 'undefined' && typeof MainMethodsCore !== 'undefined' && MainMethodsCore.rowIsAddNew(this.element[0].parentNode.parentNode.parentNode.id)) {
                        var selectId = this.element[0].parentNode.previousElementSibling.id;
                        FeaturesListing.cacheNewRowData(selectId.substring(selectId.indexOf('_') + 1, selectId.length), this.element[0].value);
                    }
                    self.firstOption = null;
                    var matcher = new RegExp(jQuery.ui.autocomplete.escapeRegex(request.term),"i");
                    var maxResults = typeof LRS !== 'undefined' ? (LRS.maxRoadsInSelect - 1) : 9999;
                    var results = select.children("option").map(function() {
                        var text = jQuery(this).text();
                        //if (this.value && (!request.term || matcher.test(text))) {
                        if(!request.term && !this.value) { // If no filter input and select contain empty option allow it	
                            return {
                            	label: '&nbsp;',
                            	value: '',
                            	option: this
                            };
                        } else if(!request.term || matcher.test(text)) {
                            if (!self.firstOption) {
                                self.firstOption = this;
                            }
                            return {
                                label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)","gi"), "<strong>$1</strong>"),
                                value: text,
                                option: this
                            };
                        }
                    });
                    if (results.length > maxResults) {
                        results = results.slice(0, maxResults);
                        results = results.toArray();
                        results.push({
                            label: '<span style="color: red">' + jQuery.imajnet.map.popupSearchLRS.moreResults + '</span>',
                            value: 'maxResults',
                            option: ''
                        })
                    }
                    response(results);
                },
                select: function(event, ui) {
                    self.firstOption = null;
                    if (ui.item.value == 'maxResults') {
                        Nigsys.disableEventPropagationFull(event);
                        return;
                    }
                    ui.item.option.selected = true;
                    self._trigger("selected", event, {
                        item: ui.item.option
                    });
                },
                change: function(event, ui) {
                    if (self.options.permisive) {
                        return true;
                    }
                    if (!ui.item) {
                        var matcher = new RegExp("^" + jQuery.ui.autocomplete.escapeRegex(jQuery(this).val()) + "$","i")
                          , valid = false;
                        select.children("option").each(function() {
                            if (jQuery(this).text().match(matcher)) {
                                this.selected = valid = true;
                                return false;
                            }
                        });
                        if (!valid) {
                        	var firstOptionValue = '';
                        	if(select.children("option")[0] && select.children("option")[0].value) {
                        		firstOptionValue = select.children("option")[0].value;
                        	}
                        	
                            jQuery(this).val(firstOptionValue);
                            select.val(firstOptionValue);
                            input.data("autocomplete").term = firstOptionValue;
//                            jQuery(this).val("");
//                            select.val("");
//                            input.data("autocomplete").term = "";
                            return false;
                        }
                    }
                }
            }).focusout({
                self: self
            }, function(event) {
//            	return;
//                if (jQuery(this).is(':visible') && this.value && self.firstOption) {
//                    this.value = event.data.self.firstOption.text;
//                    event.data.self.firstOption.selected = true;
//                    event.data.self._trigger("selected", event, {
//                        item: event.data.self.firstOption
//                    });
//                }
            }).addClass('ui-widget ui-widget-content ui-corner-left');
            input.val(jQuery("#" + select.attr("id") + " :selected").text());
            input.data("autocomplete")._renderItem = function(ul, item) {
                jQuery('.imajnetAutocomplete').css('margin-top', '0');
                ul.addClass('imajnetAutocomplete');
                ul.attr('id', jQuery(this.element).parent().attr('id').replace('Combobox', 'Autocomplete'));
                if (this.element[0] && this.element[0].parentNode && this.element[0].parentNode.offsetParent) {
                    ul.addClass(this.element[0].parentNode.offsetParent.id + 'SelectOptions');
                }
                ul.on('mouseleave', function(event) {
                	if(event && event.currentTarget && event.currentTarget.className && (event.currentTarget.className.indexOf('imajnetSettingsMenuSelectOptions') !== -1 || event.currentTarget.className.indexOf('imajnetSettingsMenuLocaleSelectOptions') !== -1)) {
                	    if(Nigsys.getCookie('IMAJNET', 'DOCKING_header') == 'false') {
                	    	ImajnetUI.docking.header.collapseTopContainer({isTriggered: true, target: {}, data: {type: 'header'}});
                	    }
                	}
                });
                return jQuery("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
            };
            
            if(select.hasClass('datePicker') || select.hasClass('dateTimePicker')) {
            	Nigsys.appendDateTimePickerToElement(input, (select.hasClass('datePicker') ? 'xsd:date' : 'xsd:dateTime'), input.val());
            }
            
            jQuery("<a>").attr("tabIndex", -1).attr("title", "Show All Items").text(typeof CommonCore !== 'undefined' && CommonCore.isMobile ? '+' : '').appendTo(wrapper).button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            }).removeClass("ui-corner-all").addClass("ui-corner-right ui-combobox-toggle").click(function(event) {
                if (input.autocomplete("widget").is(":visible")) {
                    input.autocomplete("close");
                    return;
                }
                self._trigger("open", event);
                jQuery(this).blur();
                input.autocomplete("search", "");
                //input.focus(); // Bug fix for POI on imajnet, select menu not close
            });
        },
        destroy: function() {
            var comboboxParent = this.element.parent();
            this.wrapper.remove();
            this.element.show();
            jQuery.Widget.prototype.destroy.call(this);
            if (this.options.permisive) {
                Nigsys.onComboboxDestroy(comboboxParent, this.wrapper.children('.ui-combobox-input').val());
            }
        }
    },
    permisiveOptions: {
        _create: function() {
            var input, self = this, select = this.element.hide(), selected = select.children(":selected"), value = selected.val() ? selected.text() : "", wrapper = this.wrapper = jQuery("<span>").addClass("ui-combobox").insertAfter(select);
            input = jQuery("<input>").appendTo(wrapper).val(value).addClass("ui-state-default ui-combobox-input").autocomplete({
                delay: 0,
                minLength: 0,
                source: function(request, response) {
                    var matcher = new RegExp(jQuery.ui.autocomplete.escapeRegex(request.term),"i");
                    response(select.children("option").map(function() {
                        var text = jQuery(this).text();
                        if (this.value && (!request.term || matcher.test(text)))
                            return {
                                label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)","gi"), "<strong>$1</strong>"),
                                value: text,
                                option: this
                            };
                    }));
                },
                select: function(event, ui) {
                    ui.item.option.selected = true;
                    self._trigger("selected", event, {
                        item: ui.item.option
                    });
                }
            }).addClass('ui-widget ui-widget-content ui-corner-left');
            input.val(jQuery("#" + select.attr("id") + " :selected").text());
            input.data("autocomplete")._renderItem = function(ul, item) {
                return jQuery("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
            }
            ;
            jQuery("<a>").attr("tabIndex", -1).attr("title", "Show All Items").appendTo(wrapper).button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            }).removeClass("ui-corner-all").addClass("ui-corner-right ui-combobox-toggle").click(function() {
                if (input.autocomplete("widget").is(":visible")) {
                    input.autocomplete("close");
                    return;
                }
                jQuery(this).blur();
                input.autocomplete("search", "");
                //input.focus(); // Bug fix for POI on imajnet, select menu not close
            });
        },
        destroy: function() {
            this.wrapper.remove();
            this.element.show();
            jQuery.Widget.prototype.destroy.call(this);
        }
    },
    init: function() {
        jQuery.widget("ui.combobox", this.defaultOptions);
        jQuery.widget("ui.comboboxPermisive", this.permisiveOptions);
    }
};
