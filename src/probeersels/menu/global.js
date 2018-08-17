function min(a,b) {
	return (a < b ? a : b);
}
function max(a,b) {
	return (a > b ? a : b);
}

function ifset(a, def) {
	if (a === undefined)
		return def;
	return a;
}

// -------------- Drag & drop -----------------------------------------------------
var draggingObject = null, dragOffset = null;
function mouseCoords(ev){
    if(ev.pageX || ev.pageY){
        return {x:ev.pageX, y:ev.pageY};
    }
    return {
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop  - document.body.clientTop
    };
}
function startDragWindow(div, ev) {
	div = $(div);
	var offset = div.offset();
	var top = offset.top;
	var left = offset.left;
	var mousePos = mouseCoords(ev);
	dragOffset = { x: left - mousePos.x, y: top - mousePos.y };
	draggingObject = div;
}
function stopDragElem() {
	if (!draggingObject)
		return;
	draggingObject = null;
	if (window.last_mask) {
		last_mask.css('display', last_mask.last_display);
		last_mask = null;
	}
}
$(document).mouseup(function mouseMove(ev){
	stopDragElem();
});
$(document).mousemove(function mouseMove(ev){
	if (!draggingObject)
		return true;
	ev = ev || window.event;
	var mousePos = mouseCoords(ev);
	draggingObject.css('left', (mousePos.x + dragOffset.x) + 'px').css('top', max(0,(mousePos.y + dragOffset.y)) + 'px');

	return false;
});


// -------------- Overlay functions -----------------------------------------------

/* Ctrl-S & Esc on overlay */
(function() {
var saveTimer = null;

window.overlayKeydown = function(event, div) {
	if (event.which == 27)
		$(div).find("div.cancel").standard_click();
	if (event.which == 83 && event.ctrlKey) {
		clearTimeout(saveTimer);
		saveTimer = setTimeout(function() { $(div).find("div.ok").standard_click(); }, 100);
		return false;
	}
}
})();

/* When overlay data is clean (unchanged), set the appropriate display settings */
function overlayMarkClean(div) {
	div = $(div);
	if (div.css('display') == 'none' || !div.hasClass('popup'))
		return;
	div.removeClass('dirty');
	div.removeClass('removed');
}

/* When overlay data is dirty (changed), set the appropriate display settings */
function overlayMarkDirty(div) {
	div = $(div);
	if (div.css('display') == 'none' || !div.hasClass('popup'))
		return;
	div.addClass('dirty');
	div.trigger('dirty');
}

/* When overlay data is deleted, set the appropriate display settings */
function overlayMarkRemoved(div) {
	div = $(div);
	if (div.css('display') == 'none' || !div.hasClass('popup'))
		return;
	div.addClass('removed');
	div.trigger('removed');
}

function overlayDirtyHandlers(io) {
	io = $(io);
	var elems = io.find('[rel]').not('[dirty-done]');
	elems.filter('input').on('paste', function() {
		if (io.hasClass('dirty'))
			return;
		overlayMarkDirty(io);
	});
	elems.filter('div,[format=date],input[type=checkbox],input[type=radio],input[type=color],select').change(function() {
		if (io.hasClass('dirty'))
			return;
		overlayMarkDirty(io);
	});
	elems.not('div,input[type=checkbox],input[type=radio],select').keypress(function() {
		if (io.hasClass('dirty'))
			return;
		var input = $(this);
		var val = input.val();
		setTimeout(function() {
			if (input.val() != val)
				overlayMarkDirty(io);
		});
	});
	elems.attr('dirty-done','true');
}

function overlayInfo(io, data){
	io = $(io);
	mutation_info = io.find('.mutation_info');
	var invoerder = '';
	var mutator = '';
	var hint = create_div();
	mutation_info.css('display', 'none');

	if (!data)
		return;
	if (data.aanmaak || data.datumbegin) {
		var datum = (data.aanmaak || data.datumbegin).sqlToHumanDateTime();
		var subdiv = create_div().css('margin-bottom', '10px');
		subdiv.append(create_div(naam_invoer + ': ' + datum));
		if (data.invoerder)
			subdiv.append(create_div(naam_door + ': ' + data.invoerder));
		hint.append(subdiv);
		mutation_info.css('display', '');
	}

	if (data.wijziging || data.datumtijd) {
		var datum = (data.wijziging || data.datumtijd).sqlToHumanDateTime();
		var subdiv = create_div().css('margin-bottom', '10px');
		subdiv.append(create_div(naam_wijziging + ': ' + datum));
		if (data.mutator)
			subdiv.append(create_div(naam_door + ': ' + data.mutator));
		hint.append(subdiv);
		mutation_info.css('display', '');
	}

	if (top.isInternalUser() && data.id > 0) {
		var subdiv = create_div();
		subdiv.append(create_div('ID: ' + data.id));
		hint.append(subdiv)
		mutation_info.css('display', '');
	}

	mutation_info.attr('hint', hint.html());
}

function createOverlay(div, success, cancel, has_header, onshow, minimize) {
	if (cancel == undefined)
		cancel = function() { };
	if (has_header == undefined)
		has_header = 3;
	div = $(div);
	var mask = create_div().width($(window).width()).height($(window).height()).on('standard_click', function() {
		var message = (div.is('.dirty') ? window.warning_popup_close : "");
		showMessage(message, function() {
			if (cancel() !== false)
				div.close();
		});
	}).addClass('blackout');
	if (!div.attr('isoverlay'))
		div.on('keydown', function(event) { return overlayKeydown(event, this) });
	div.addClass('popup');
	$('.blackout, .popup:visible').each(function(i,e) {
		$(e).css('z-index', $(e).css('z-index')-1);
	});

	div.find('.overlay_header').remove();
	if (has_header) {
		var has_save = (has_header & 1) == 1;
		var has_cancel = (has_header & 2) == 2;
		var header = create_span().addClass('overlay_header').append(
			create_div().addClass('blockclick')
			,
			create_div().addClass('overlay_buttons').append(
				create_span().addClass('mutation_info').css('display','none')
					.append(create_div().append(top.icons['window_info']))
				,
				create_div().addClass('ok button').attr('hint', 'OK (Ctrl-S)')
					.append(create_div().append(top.icons['window_ok']))
				,
				has_cancel ?
					create_div().addClass('cancel button').attr('hint', 'Cancel (Esc)')
						.append(create_div().append(top.icons['window_close']))
				:
					''
				,
				minimize !== undefined ?
					create_div().addClass('minimize_button button').attr('hint', naam_minimaliseer)
						.append(create_div().append(top.icons['window_minimize']))
				:
					''
			)
		);

		header.mousedown(function(ev) {
			if (!$(ev.target).hasClass('button') && ev.button == 0) {
				window.last_mask = mask;
				mask.last_display = mask.css('display');
				mask.show();
				startDragWindow(div, ev);
				return false;
			}
		});
		div.prepend(header);

		if (has_save)
			div.addClass('dirty');
		else
			header.find('.ok').hide();
	}
	if (div.attr('standard_clicks') != "true") {
		standard_clicks(div);
		div.standard_click(function(e) {
			var target = $(e.target);
			while (!target.is(this) && target.length > 0) {
				if (target.is('a.tabhead') || target.is('.tabcontainer>span>a')) {
					changeTab(target);
					return false;
				}
				target = target.parent();
			}
			return true;
		});
	}
	standard_clicks(mask);
	$(document.body).append(mask);
	if (div.get(0).mask)
		div.get(0).mask.remove();
	div.get(0).mask = mask;
	div.get(0).overlay = div;
	div.css({ 'visibility': 'visible', 'display': 'block', 'position': 'absolute' });
	div.find('a.selected_tab').standard_click();

	var wtop = ((($(window).height() - 40 - div.outerHeight()) / 2)) + 40;
	if (wtop < 40)
		wtop = 40;
	var wleft = ((($(window).width() - div.outerWidth()) / 2));
	if (wleft < 0)
		wleft = 0;
	div.css({ left: wleft, top: wtop, 'z-index': 9999 });

	div.close = div.get(0).close = function() { div.hide(); div.get(0).mask.remove(); div.trigger('popupclose'); }
	if (has_header) {
		header.find('div.ok').attr('tabindex', 0).standard_click(function() {
			if (document.activeElement)
				$(document.activeElement).trigger('blur');
			if (!success || (success() !== false))
				div.close();
		});
		header.find('div.cancel').attr('tabindex', 0).standard_click(function() { if (cancel() !== false) div.close(); });
		header.find('div.minimize_button').attr('tabindex', 0).standard_click(minimize);
	}
	if (onshow)
		onshow(div);
	div.css({ visibility:"visible" });
	updateHintHandlers();
	var autofocus = $(div).find('.autofocus').eq(0);
	if (autofocus.length == 0)
		autofocus = div.find('.cancel');
	autofocus.focus().select();
	return div;
}


// -------------- Cookies ---------------------------------------------------------

function createCookie(name, value, days, path) {
	path = path || '/'
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+escape(value)+expires+"; path="+path;
}

function getCookie(c_name) {
	var arr=document.cookie.split(";");
	for (var i in arr) {
		var x=arr[i].substr(0,arr[i].indexOf("=")).replace(/^\s+|\s+$/g,"");
		if (x == c_name)
			return unescape(arr[i].substr(arr[i].indexOf("=")+1));
	}
	return '';
}


// -------------- IFrame ----------------------------------------------------------

function getIFrameDocument(iframe) {
	iframe = $(iframe).get(0);
	if (!iframe)
		return null;
	var elem = iframe.contentWindow || iframe.contentDocument;
	elem = elem.document || elem;
	return elem;
}


// -------------- Server call -----------------------------------------------------

function callserver(f, params, success, show_loading, error, use_poll, ignore_network, block_resize) {
	if (!f) {
		success(false);
		return;
	}
	if (show_loading == undefined)
		show_loading = true;
	if (ignore_network == undefined)
		ignore_network = false;
	var data = params;
	if (top.MAGIC)
		data.MAGIC = top.MAGIC;
	else
		data.MAGIC = top.name;
	if (top.inAjax <= 0 && !ignore_network && show_loading) {
		top.inAjax++;
		top.showLoading();
	}
	var content_type = 'application/x-www-form-urlencoded; charset=UTF-8';
	var type = 'POST';
	if (top.callserver_type == 'json') {
		content_type = 'application/json; charset=UTF-8';
		data = JSON.stringify(data);
		type = 'PUT';
	}
	return $.ajax({ url: (use_poll ? top.gateway_path_poll : top.gateway_path)+escape(f), type: type,
		error: function(xmlr, str, obj) {
			if (!ignore_network && show_loading) {
				top.inAjax--;
				if (top.inAjax <= 0)
					top.hideLoading();
			}
			if (xmlr.status == 401) {
				top.form_login.authenticate(function() {
					if (!use_poll)
						callserver(f, params, success, show_loading, error, false, ignore_network);
				});
			} else
			if (xmlr.status == 440) {
				if (error)
					error(data);
			} else
			if (xmlr.status == 403) {
			} else {
				console.log("Fout bij de verwerking ("+(xmlr.status || 0)+") "+f);
				if (!ignore_network)
					setTimeout(function() { showError("Fout bij de verwerking ("+(xmlr.status || 0)+") ("+f+")"); }, 1000);
			}
		},
		success: function(data, functionname, xmlr) {
			if (!ignore_network) {
				top.inAjax--;
				if (top.inAjax <= 0)
					top.hideLoading();
			}
			if (!data) {
				console.log("Onbekende fout. Controleer het netwerk. ("+f+")");
				if (!ignore_network)
					setTimeout(function() { showError("Onbekende fout. Controleer het netwerk. ("+f+")"); }, 1000);
			} else
			if (data.error) {
				showError(data.error, data.url || undefined, data.linkname || undefined);
				if (error)
					error(data)
			} else {
				var date = new Date(xmlr.getResponseHeader && xmlr.getResponseHeader('Date') || undefined);
				success(data, date, xmlr);
				if (data.alert)
					showError(data.alert, data.url || undefined, data.linkname || undefined);
			}
			if (!block_resize)
				schedule_resize();
		}, data: data, contentType: content_type
	});
}


// -------------- Uploads ---------------------------------------------------------

function uploadFileApi(file, api, params, f, progress) {
	f = f || function() { };
	progress = progress || function() { };

	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", function(e) {
		if (e.lengthComputable) {
			var percentage = Math.round((e.loaded * 100) / e.total);
			progress(file, percentage);
		}
	}, false);
	xhr.upload.addEventListener("load", function(e){
		progress(file, 100);
	}, false);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 0)
				;
			else
			if (xhr.status != 200) {
				showError('Error: '+this.status);
				return;
			}
			progress(file, 100);
			if (!xhr.response) {
				console.log("Onbekende fout. Controleer het netwerk. ("+f+")");
				setTimeout(function() { showError("Onbekende fout. Controleer het netwerk. ("+f+")"); }, 1000);
				return;
			}
			if (xhr.response.error) {
				showError(xhr.response.error);
				return;
			}
			f(xhr.response, file);
		}
	};
	xhr.open("PUT", top.gateway_path+api+"?MAGIC="+top.MAGIC+"&"+$.param(params));
	xhr.setRequestHeader("X-FileName", encodeURIComponent(file.fileName || file.name), false);
	xhr.responseType = 'json';
	xhr.send(file);
	return xhr;
}


// -------------- General utilities -----------------------------------------------

arrayIndexOf = function(a,v) {
	a = a || [];
	for (var i = a.length; i-- && a[i] !== v; );
		return i;
};
arrayIdIndexOf = function(a,v) {
	a = a || [];
	var i = a.length-1;
	while (i >= 0 && (a[i].id || undefined) != v)
		i--;
	return i;
};
arrayId = function(a,v) {
	var i = a.length-1;
	while (i >= 0 && (a[i].id || undefined) != v)
		i--;
	return (a[i] || undefined);
};

function zeroPad(c) {
	if (c >= 0 && c <= 9)
		c = '0' + c;
	return c;
}
function one_if_zero(v) {
	if (v == 0)
		return 1;
	return v;
}

function stripZero(val) {
	if (typeof(val) != 'string')
		return parseInt(val);
	if (val.length == 0)
		return 0;
	val = val.replace(/^(-)?0+([0-9])/, '$1$2');
	return parseInt(val);
}

String.prototype.sprintf = function(args) {
	var s = this;
	for (var i=0; i < arguments.length; i++)
		s = s.replace('%s', arguments[i]);
	return s;
}

String.prototype.firstUpper = function() {
	return this.substr(0,1).toUpperCase()+this.substr(1);
};

function trim(value) {
	if (typeof(value) != "string")
		return value;
	return value.replace(/^\s+/,'').replace(/\s+$/,'');
}
function cleanspace(value) {
	return value.replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/, ' ');
}

function escapeRegExp(string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function zero_if_below_zero(v) {
	v = parseFloat(v || 0);
	if (v < 0)
		return 0;
	return v;
}

function decode_bitfield(variaties) {
	var result = [];
	var id = 1;
	while (variaties != 0) {
		if (variaties & 1)
			result.push(id);
		id++;
		variaties >>= 1;
	}
	return result.join(',');
}

function encode_bitfield(variaties) {
	var result = 0;
	if (typeof(variaties) == "string")
		variaties = variaties.split(',');
	for (var i in variaties)
		if (variaties[i] != "")
			result += (1 << (variaties[i]-1));
	return result;
}


// -------------- Date/time calculations ------------------------------------------

function datumeindIsVerwijderd(datumeind) {
	return (datumeind > '0000-00-00 00:00:00' && datumeind < '5000-12-31');
}

function days_in_periode(start, eind, allow_negative) {
	var days = Math.round((eind.getTime() - start.getTime()) / dayMillisecs);
	if (!allow_negative && days < 0)
		return 0;
	return days;
}

function days_overlap(start1, eind1, start2, eind2) {
	var start = (start1.getTime() > start2.getTime() ? start1 : start2);
	var eind = (eind1.getTime() < eind2.getTime() ? eind1 : eind2);

	return days_in_periode(start,eind);
}

function format_min(input_minutes, truncate_day, allow_empty) {
	if ((input_minutes === null || input_minutes === undefined) && allow_empty)
		return '';
	var min = input_minutes;
	if (min < 0)
		min = -min;
	var uur = parseInt(Math.round(min)/60);
	if (truncate_day)
		uur = uur % 24;
	min = parseInt(Math.round(min)) % 60;
	if (uur < 10)
		uur = '0' + uur;
	if (min < 10)
		min = '0' + min;
	return (input_minutes < 0 ? '-' : '') + uur + ':' + min;
}

urenToHumanTime = function(uren) {
	uren = parseFloat(uren);
	var sign = '';
	if (uren < 0) {
		sign = '-';
		uren = -uren;
	}
	var uur = parseInt(uren);
	var min = Math.round((parseFloat(uren)-uur)*60);
	if (isNaN(uur) || isNaN(min))
		return '0:00';
	if (uur < 10)
		uur = '0' + uur;
	if (min < 10)
		min = '0' + min;
	return sign + uur + ':' + min;
}
urenToHumanTimeSec = function(uren) {
	uren = parseFloat(uren);
	var sign = '';
	if (uren < 0) {
		sign = '-';
		uren = -uren;
	}
	var uur = parseInt(uren);
	var min = parseInt((parseFloat(uren)-uur)*60);
	var sec = parseInt((((parseFloat(uren)-uur)*60)-min)*60);
	if (isNaN(uur) || isNaN(min) || isNaN(sec))
		return '0:00:00';
	if (uur < 10)
		uur = '0' + uur;
	if (min < 10)
		min = '0' + min;
	if (sec < 10)
		sec = '0' + sec;
	return sign + uur + ':' + min + ':' + sec;
}
humanTimeToUren = function(val){
	if(typeof(val) == 'string' && val.match(/[0-9]+:[0-9]+/)){
		var parts = val.split(':');
		val = stripZero(parts[0])+(stripZero(parts[1])/60.0);
	} else
	if(typeof(val) == 'string')
		val = parseFloat(val.replace(',', '.'));
	if (isNaN(val))
		val = 0;
	return val;
}
humanPercentToFloat = function(val){
	if(typeof(val) == 'string')
		val = parseFloat(val.replace(',', '.'));
	if (isNaN(val))
		val = 0;
	return val / 100;
}
humanCurrencyToFloat = function(val){
	if(typeof(val) == 'string') {
		var pos_comma = val.search(',')
		// Comma with the last 3 characters? Use it as a decimal separator.
		if (pos_comma >= val.length-3)
			val = val.replace(/\./g, '').replace(/,/g, '.');
		else
			val = val.replace(/,/g, '');
		val = parseFloat(val);
	}
	if (isNaN(val))
		val = 0;
	return val;
}
String.prototype.sqlToHumanTime = function(){
	if(this.match(/[0-9]+:[0-9]+/)){
		var parts = this.split(':');
		return parts[0]+':'+parts[1];
	}
	return this;
}

String.prototype.sqlToHumanDateTime = function() {
	var s = this;
	if (/T/.test(s)) {
		s = parseIso8601(s);
	}
	s = s.split(' ');
	if (s.length > 1)
		return s[0].sqlToHumanDate()+" "+s[1].sqlToHumanTime();
	return s[0].sqlToHumanDate();
}

String.prototype.sqlToLongHumanDate = function(){
	var parts = [];
	if(this.match(/[0-9][0-9][0-9][0-9]\-[0-9]+\-[0-9]+/)){
		var parts = this.split('-');
	} else
	if(this.match(/[0-9]+\-[0-9]+\-[0-9][0-9][0-9][0-9]/)){
		var parts = this.split('-');
		var tmp = parts[0];
		parts[0] = parts[2];
		parts[2] = tmp;
	} else
		return '';
	var date = new Date(parts[0], parts[1]-1, parts[2]);
	return window.namen_dagen_long[(date.getDay()+6) % 7].toLowerCase()+' '+stripZero(parts[2]) + ' ' + namen_maanden_long[stripZero(parts[1])-1] + ' ' + parts[0];
}

String.prototype.sqlToShortHumanDate = function(){
	var parts = [];
	if(this.match(/[0-9][0-9][0-9][0-9]\-[0-9]+\-[0-9]+/)){
		var parts = this.split('-');
	} else
	if(this.match(/[0-9]+\-[0-9]+\-[0-9][0-9][0-9][0-9]/)){
		var parts = this.split('-');
		var tmp = parts[0];
		parts[0] = parts[2];
		parts[2] = tmp;
	} else
		return '';
	return stripZero(parts[2]) + ' ' + namen_maanden_short[stripZero(parts[1])-1] + ' ' + parts[0];
}

String.prototype.sqlToHumanDate = function(){
	var result = /([0-9][0-9][0-9][0-9])\-([0-9]+)\-([0-9]+)/.exec(this);
	if (result)
		return pad(result[3])+'-'+pad(result[2])+'-'+result[1];
	return ''+this;
}

String.prototype.humanDateToSql = function(){
	var re1 = /^([0-9]{1,2})[^0-9]([0-9]{1,2})[^0-9]([0-9][0-9]+)$/;
	var re2 = /^([0-9]{1,2})[^0-9]([0-9]{1,2})$/;
	var val = trim(this);
	var data = re1.exec(val);
	if (data) {
		var year = data[3];
		if (year.length <= 2) {
			year = stripZero(data[3]);
			if (year < 40 && data[3])
				year += 2000;
			if (year < 100)
				year += 1900;
		} else
		if (year.length == 3)
			year = '0'+year;

		return year+'-'+pad(data[2])+'-'+pad(data[1]);
	}
	var data = re2.exec(val);
	if (data)
		return new Date().getFullYear()+'-'+pad(data[2])+'-'+pad(data[1]);
	return ''+this;
}

Date.prototype.toDate = function() {
	return new Date(this);
}

String.prototype.toDate = function() {
	var datetimeArray = this.split(' ');

	var dateArray = datetimeArray[0].split('-');

	if (datetimeArray.length > 1){
		var timeArray = datetimeArray[1].split(':');
	}

	var hours = timeArray ? timeArray[0] : 0;
	var minutes = timeArray ? timeArray[1] : 0;

	if (dateArray.length < 2)
		date = new Date();
	else
	if (dateArray.length < 3)
		dateArray[2] = new Date().getFullYear();
	else
	if(Number(dateArray[0]) > 31)
		date = new Date(dateArray[0],(Number(dateArray[1]) - 1),dateArray[2], hours,minutes);
	else
		date = new Date(dateArray[2],(Number(dateArray[1]) - 1),dateArray[0],hours,minutes);
	if (isNaN(date.getTime()))
		return new Date();
	return date;
}


// -------------- Numeric calculations --------------------------------------------

function check_elfproef(a) {
	// . - en spatie verwijderen
	a = (a+'').replace(/[-. ]/g,'');
	// Niet alleen nummers? Dan klopt het niet
	if (!/^[0-9]{9}$/.test(a))
		return false;
	// Aanvullen met 0 aan de linkerkant
	while (a.length < 9)
		a = '0' + a;
	// De eerste 3 cijfers mogen niet alle 3 '0' zijn
	if (a.substr(0,3) == '000')
		return false;
	// Bereken de & controleer de elfproef
	var value = 0;
	for(var i=0; i<8; i++)
		value += (9-i)*parseInt(a[i]);
	value %= 11;
	value %= 10;
	console.log("Digit "+value+" found "+a[8]);
	if (parseInt(a[8]) != value)
		return false;
	// Alle ok? Retourneer het gecorrigeerde nummer
	a = a.replace(/([0-9]{4})([0-9]{2})([0-9]{3})/, "$1.$2.$3");
	return a;
}


function fmtPercent0(percent) {
	percent = parseFloat(percent || 0);
	percent = (Math.round(percent * 100 * 100) / 100).toFixed(2);
	percent = (percent+'').replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
	return percent;
}

function fmtUren(uren, formatAsTijd) {
	uren = parseFloat(uren || 0);
	if (uren == 0)
		return '';
	return fmtUren0(uren, formatAsTijd);
}
function fmtUren0(uren, formatAsTijd, formatWithoutSpace) {
	uren = parseFloat(uren || 0);

	if (formatAsTijd) {
		uren = format_min(uren * 60);
	} else {
		uren = (Math.round(uren * 100) / 100).toFixed(2);
		if (formatWithoutSpace)
			uren = (uren+'').replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
		else
			uren = (uren+'').replace(/0$/, '\u00a0\u00a0').replace(/0\u00a0/, '\u00a0\u00a0\u00a0').replace(/\.\u00a0/, '\u00a0\u00a0').replace('.', ',');
	}

	return uren;
}
function fmtBedrag(bedrag, decimals) {
	bedrag = parseFloat(bedrag || 0);
	if (bedrag == 0)
		return '';
	return fmtBedrag0(bedrag, decimals);
}

function fmtBedrag0(bedrag, decimals, addpoint) {
	if (typeof(decimals) == "undefined")
		decimals = 2;
	addpoint = (typeof(addpoint) == "undefined" || addpoint) ? true : false;
	decimals = parseInt(decimals || 0);
	var factor = Math.pow(10, decimals);
	bedrag = parseFloat(bedrag || 0);
	bedrag = (Math.round(bedrag * factor) / factor).toFixed(decimals);
	bedrag = (bedrag+'').replace('.', ',');
	if (bedrag == "Infinity" || bedrag == "NaN" || bedrag == "null")
		bedrag = '';
	if (addpoint) {
		var pos = bedrag.indexOf(',');
		if (pos < 0)
			pos = bedrag.length;
		pos -= 3;
		while (pos > 0 && (pos > 1 || bedrag[0] != '-')) {
			bedrag = bedrag.substr(0,pos)+'.'+bedrag.substr(pos);
			pos -= 3;
		}
	}

	return bedrag;
}

function fmtBytes(bytes) {
	bytes = parseInt(bytes || 0);
	var divisor = 1024;
	var units = [ 'YB', 'ZB', 'EB', 'PB', 'TB', 'GB', 'MB', 'kB', 'B' ];
	var u = units.length-1;
	while (bytes >= divisor && u > 0) {
		bytes /= divisor;
		--u;
	}
	return bytes.toFixed(1)+' '+units[u];
}

function calc_tijd(from, to, allow_negative) {
	function parse_tijd(s) {
		if (!s)
			s = '0:00';
		s = s + '';
		var sign = 1;
		if (s[0] == '-') {
			sign = -1;
			s = s.substr(1);
		}
		var re = /([0-9]{1,2})([:.]([0-9]{1,2}))?/;
		var data = re.exec(s);
		if (!data)
			return null;
		return sign*(stripZero(data[1],10)*60+stripZero(data[3] || 0,10));
	}
	from = parse_tijd(from);
	if (to == undefined) {
		to = from;
		from = 0;
	} else
		to = parse_tijd(to);
	var uren = to - from;
	if (!allow_negative && uren < 0)
		uren = (uren + 24*60) % (24*60);
	return uren;
}

function fmtFloat(val) {
	return (val+'').replace('.',',');
}

function convertFloat(val) {
	var result = 0;
	if (typeof(val) == "number")
		result = val;
	else
	if (typeof(val) == "string")
		result = parseFloat(val.replace(/\./g,'').replace(',', '.'));
	return result;
}

function checkNaN(result) {
	if (isNaN(result))
		result = 0;
	return result;
}

// ------ EVENTS: Voorkom herhaaldelijk aanroepen updates/resizes etc -------
(function() {
	var scheduled_events = [];
	var schedule_timeout = null;
	window.schedule_trigger = function(div, event, params) {
		div = $(div);
		// Meerdere divs (of geen), dan mbv each voor alle aanroepen en individueel afhandelen.
		if (div.length != 1) {
			div.each(function(i,e) { schedule_trigger(e, event, params); });
			return div;
		}
		// Geen dubbele events
		for (var i in scheduled_events) {
			if (event == scheduled_events[i].event && div.get(0) == scheduled_events[i].div.get(0))
				return div;
		}
		scheduled_events.push({div: $(div), event: event, params: params});
		clearTimeout(schedule_timeout);
		schedule_timeout = setTimeout(function() {
			while (scheduled_events.length > 0) {
				var trigger = scheduled_events.shift();
				trigger.div.trigger(trigger.event, trigger.params);
			}
		}, 50);
	}
	window.schedule_resize = function() { schedule_trigger(window, 'resize'); };
	window.schedule_update = function(event_name, params) { schedule_trigger(document, event_name, params); };
})();

function changeTab(e) {
	e = $(e);
	e.parent().children('a').removeClass('selected_tab');
	e.addClass('selected_tab');
	if ($(e).attr('rel')) {
		var div = $(e.attr('rel'));
	} else {
		var divs = e.parent().parent().children('div');
		var tabs = e.parent().children('a');
		var div = divs.eq(tabs.index(e))
	}
	div.parent().children('div').hide().removeClass('show')
	div.addClass('show').css('display','');
	resizeListView(div.find('.list_view'));
	schedule_resize();
	return false;
}

function getFirstElemOfObject(o) {
	for (var i in o)
		return i;
	return null;
}

function clearIO(div) {
	div = $(div);
	if (div.length == 0)
		return div;
	div.get(0).InVulProcedure = true;
	calendar.initIO(div);
	div.find('[rel]').each(function(i,e) {
		var rel = $(e).attr('rel');
		if (/^#/.test(rel))
			return;
		if (e.tagName == 'IMG') {
			$(e).attr('src', '');
		} else
		if (e.tagName == 'DIV') {
			$(e).attr('value', '').val('');
			$(e);
		} else
		if (e.tagName == 'SELECT') {
			$(e).val('');
			$(e);
		} else
		if (e.tagName == 'TEXTAREA') {
			$(e).val('');
			$(e);
		} else
		if (e.tagName == 'INPUT') {
			if (e.type == 'checkbox') {
				$(e).prop('checked', false);
			} else
				$(e).val('');
		}
	});
	div.get(0).InVulProcedure = false;
	return div;
}
function fillIO(div, data, max, prefix) {
	prefix = prefix || "";
	div = $(div);
	if (div.length == 0)
		return;
	div.get(0).InVulProcedure = true;
	max = max || {};
	calendar.initIO(div);
	div.find('.highlight_changed').attr('hint', '').removeClass('highlight_changed');
	div.find('.wisselalternatief').remove();
	div.find('[data-oud]').removeAttr('data-oud');
	div.find('[data-nieuw]').removeAttr('data-nieuw');
	div.find('[rel]').each(function(i,e) {
		var attr_rel = $(e).attr('rel');
		if (/^#/.test(attr_rel))
			return;

		if (attr_rel.substr(0, prefix.length) != prefix)
			return true;
		attr_rel = attr_rel.substr(prefix.length);

		rel = attr_rel.split('.');
		var p = data;
		for (var i=0; i<rel.length; i++) {
			if (rel[i] == 'id') {
				rel[i] = getFirstElemOfObject(p);
				if (i == rel.length - 1) {
					p = rel[i];
					break;
				}
			}
			if (p[rel[i]] != undefined)
				p = p[rel[i]];
			else {
				p = '';
				break;
			}
		}
		if (e.tagName == 'IMG') {
			$(e).attr('src', p || 'about:blank');
		} else
		if (e.tagName == 'TEXTAREA')
			$(e).val(p);
		else
		if (e.tagName == 'SELECT') {
			if ($(e).children('option[value="'+p+'"]').length == 0 && parseInt(p || 0) != 0)
				$(e).append($('<option/>').text('?').attr('value', p));
			// Treat 0 and "" as identical
			if (p == "0" && $(e).children('option[value="'+p+'"]').length == 0)
				p = "";
			if (p == "" && $(e).children('option[value="'+p+'"]').length == 0)
				p = "0";
			$(e).val(p);
			$(e).trigger('change');
		} else
		if (e.tagName == 'DIV') {
			if ($(e).attr('zoekopties'))
				set_zoek_optie(e, /*value*/p, /*force_change*/true, /*force_add_with_text*/p != 0 ? '?' : undefined);
			else
				$(e).attr('value', p);
		} else {
			var converted = p;
			if ($(e).attr('format') == 'uren') {
				converted = (urenToHumanTime(p));
			} else
			if ($(e).attr('format') == 'time') {
				converted = (p+'').sqlToHumanTime();
			} else
			if ($(e).attr('format') == 'date' || $(e).attr('format') == 'datenotempty') {
				converted = (p+'').sqlToHumanDate();
			} else
			if ($(e).attr('format') == 'currency') {
				converted = fmtBedrag0(p, 2, false);
			} else
			if ($(e).attr('format') == 'percent') {
				converted = fmtPercent0(p);
			} else
			if ($(e).attr('format') == 'datetime') {
				converted = (p.sqlToHumanDateTime());
			}

			if (e.tagName == 'SPAN') {
				$(e).text(converted);
			} else
			if (e.tagName == 'INPUT') {
				if (e.type == 'radio') {
					if (p !== undefined && p == e.value)
						$(e).prop('checked', true);
				} else
				if (e.type == 'checkbox') {
					if (p && p != '0')
						$(e).prop('checked', true);
					else
						$(e).prop('checked', false);
				} else {
					if ((max[attr_rel] || 0) > 0) {
						$(e).attr('maxlength', max[attr_rel]);
						if (($(e).attr('hint') || '') == '')
							$(e).attr('hint', 'max. '+max[attr_rel]+' tekens');
					}
					$(e).val(converted);
				}
			}
			$(e).trigger('change');
		}
	});
	div.get(0).InVulProcedure = false;
}

function readIO(div) {
	div = $(div);
	var data = { };
	var mapping = { };
	// First get all ids and attempt to construct the object
	div.find('[rel$=".id"]').each(function(i,e) {
		var rel = $(e).attr('rel');
		if (/^#/.test(rel))
			return;
		if($(e).val() == "")
			$(e).val(--window.temp_id);
		mapping[rel] = $(e).val();
	});
	div.find('[rel]').each(function(i,e) {
		var rel = $(e).attr('rel');
		if (/^#/.test(rel))
			return;
		if (e.tagName == 'A' || e.tagName == 'LI')
			return;
		rel = rel.split('.');
		var parsed = '';
		var p = data;
		for (var i=0; i<rel.length; i++) {
			if (parsed != "")
				parsed += ".";
			parsed += rel[i];
			if (rel[i] == 'id' && i > 0) {
				if (mapping[parsed] == undefined)
					showError("Interne controlewaarschuwing: "+parsed+" niet aanwezig in io");
				rel[i] = mapping[parsed];
			} else {
				if (i == rel.length-1) {
					if (e.tagName == 'IMG') {
						if (e.src != 'about:blank')
							p[rel[i]] = e.src;
						else
							p[rel[i]] = '';
					} else
					if (e.tagName == 'DIV' && $(e).attr('zoekopties'))
						p[rel[i]] = $(e).attr('value') || '';
					else {
						if ($(e).is('input[type=radio]')) {
							if ($(e).is(':checked'))
								p[rel[i]] = $(e).val();
						} else
						if ($(e).is('input[type=checkbox]'))
							p[rel[i]] = $(e).is(':checked') ? $(e).val() : '';
						else {
							if ($(e).attr('format') == 'currency')
								p[rel[i]] = humanCurrencyToFloat($(e).val());
							else
							if ($(e).attr('format') == 'date' || $(e).attr('format') == 'datenotempty')
								p[rel[i]] = $(e).val().humanDateToSql();
							else
							if ($(e).attr('format') == 'time')
								p[rel[i]] = $(e).val();
							else
							if ($(e).attr('format') == 'percent') {
								p[rel[i]] = humanPercentToFloat($(e).val());
							} else
							if ($(e).attr('format') == 'uren')
								p[rel[i]] = humanTimeToUren($(e).val());
							else
								p[rel[i]] = trim($(e).val() || '');
							if (p[rel[i]] == "") {
								var def = $(e).attr('defaultvalue');
								if (def !== undefined)
									p[rel[i]] = def;
							}
						}
					}
					break;
				} else
				if (typeof(p[rel[i]]) != 'object' && p[rel[i]] !== undefined) {
					console.log("WARNING p[rel[i]]="+p[rel[i]]+" (rel[i]="+rel[i]+")");
					p[rel[i]] = { };
				}
			}
			if (p[rel[i]] == undefined)
				p[rel[i]] = { };
			p = p[rel[i]];
		}
	});

	return data;
}

window.temp_id = -1;

function create_ul() {
	var ul = document.createElement('ul');
	return $(ul);
}

function create_li(text, width) {
	var a = document.createElement('li');
	var text = document.createTextNode(text || '');
	a.appendChild(text);
	if (width != undefined && width != null)
		a.style.width = parseInt(width)+'px';
	return $(a);
}

function create_a(text, width) {
	var a = document.createElement('a');
	var textnode = document.createTextNode(text || '');
	a.appendChild(textnode);
	if (width != undefined && width != null)
		a.style.width = parseInt(width)+'px';
	return $(a);
}

function create_span(text, width) {
	var span = document.createElement('span');
	var text = document.createTextNode(text || '');
	span.appendChild(text);
	if (width != undefined && width != null)
		span.style.width = parseInt(width)+'px';
	return $(span);
}

function create_div(text, width) {
	var div = document.createElement('div');
	var text = document.createTextNode(text || '');
	div.appendChild(text);
	if (width != undefined && width != null)
		div.style.width = parseInt(width)+'px';
	return $(div);
}

function create_textarea() {
	var textarea = document.createElement('textarea');
	return $(textarea);
}

function create_input(type, width) {
	var input = document.createElement('input');
	type = type || "text";
	input.setAttribute("type", type);
	if (type == "checkbox")
		input.value = "1";
	if (width != undefined && width != null)
		input.style.width = parseInt(width)+'px';
	return $(input);
}

function create_label(text, width, _class) {
	if (_class === undefined)
		_class="controlwrap";
	var div = document.createElement('label');
	if (text) {
		var text = document.createTextNode(text || '');
		div.appendChild(text);
	}
	if (width != undefined && width != null)
		div.style.width = parseInt(width)+'px';
	if (_class)
		div.className = _class;
	return $(div);
}

function create_div_right(text, width) {
	var div = document.createElement('div');
	var text = document.createTextNode(text || '');
	div.appendChild(text);
	div.style.textAlign = 'right';
	if (width != undefined && width != null) {
		div.style.width = (parseInt(width)-5)+'px';
		div.style.marginRight = '5px';
	}
	return $(div);
}

function create_ellipsis_div(text, width) {
	var div = document.createElement('div');
	var text = document.createTextNode(text || '');
	div.className = "ellipsis";
	if (typeof(width) != 'string')
		width = (parseInt(width || 5)-5)+'px';
	if (width != '0px')
		div.style.width = width;
	div.appendChild(text);
	div.style.marginRight = '5px';
	return $(div);
}

function create_hiding_div(text, width) {
	var div = document.createElement('div');
	var text = document.createTextNode(text || '');
	div.className = "texthiding";
	if (typeof(width) != 'string')
		width = (parseInt(width || 5)-5)+'px';
	if (width != '0px')
		div.style.width = width;
	div.appendChild(text);
	div.style.marginRight = '5px';
	return $(div);
}

function create_overflow_div(text, width) {
	var div_inner = document.createElement('div');
	var div = document.createElement('div');
	var text = document.createTextNode(text || '');
	div.style.minHeight = '16px';
	div.style.position = 'relative';
	div_inner.appendChild(text);
	div.appendChild(div_inner);
	div_inner.style.width = '4000px';
	div_inner.style.position = 'absolute';
	div_inner.style.display = 'block';
	if (width == undefined || width == null)
		width = 20;
	div.style.width = width;
	return $(div);
}

(function(){
var presstime = 0;
var dblClickWait = null;
var longClickWait = null;
var md_pos = null;
var dblClickWaitUp = false;

function md(event, div) {
	if (event.screenX == undefined && event.originalEvent && event.originalEvent.targetTouches) {
		event.screenX = event.originalEvent.targetTouches[0].pageX;
		event.screenY = event.originalEvent.targetTouches[0].pageY;
	}
	//if (event.button != 0)
	//	return true;
	if (event.button == 2) {
		setTimeout(function() {
			$(event.target).trigger('standard_longclick', event);
			event.stopPropagation();
		}, 0);
		return false;
	}
	if (dblClickWait) {
		clearTimeout(dblClickWait);
		dblClickWait = null;
		dblClickWaitUp = true;
		presstime = 0;
		ml(event,div);
		return false;
	} else {
		presstime = event.timeStamp;
		if (longClickWait == null) {
			md_pos = { x: event.screenX, y: event.screenY };
			longClickWait = setTimeout(function() {
				md_pos = null;
				longClickWait = null;
				$(event.target).trigger('standard_longclick', event);
				presstime = 0;
			}, 1000);
		}
	}
	return true;
}
function mm(event, div) {
	if (md_pos == null)
		return;
	if (event.screenX == undefined && event.originalEvent && event.originalEvent.targetTouches) {
		event.screenX = event.originalEvent.targetTouches[0].pageX;
		event.screenY = event.originalEvent.targetTouches[0].pageY;
	}
	if ((Math.abs(event.screenX - md_pos.x) > 10 || Math.abs(event.screenY - md_pos.y) > 10)) {
		if (longClickWait && md_pos) {
			clearTimeout(longClickWait);
			longClickWait = md_pos = null;
		}
		presstime = 0;
	}
}
function ml(event, div) {
	if (longClickWait != null)
		clearTimeout(longClickWait);
	longClickWait = null;
	return true;
}
function mu(event, div) {
	if (dblClickWaitUp) {
		dblClickWaitUp = false;
		$(event.target).trigger('standard_dblclick', event);
		return false;
	}
	ml(event,div);
	if (event.timeStamp - presstime < 300)
		dblClickWait = setTimeout(function() {
			if (dblClickWait) {
				dblClickWait = null;
				$(event.target).trigger('standard_click', event);
			}
		}, 180);
	return true;
}

function standard_clicks(div) {
	div = $(div);
	if (div.length > 1)
		div.each(function(i,e) { standard_clicks(e); });
	if (div.attr('standard_clicks'))
		return div;
	div.attr('standard_clicks', 'true');
	div.on('touchstart', function(e) { e.preventDefault(); return md(e,div); });
	div.on('touchmove', function(e) { mm(e,div); });
	div.on('touchend', function(e) { e.preventDefault(); mu(e,div); return true; });
	if (!div.is('input,textarea,select'))
		div.attr('draggable', 'true');
	div.mouseup(function(e) {
		window.stopDragElem();
		if (e.button == 0 && $(e.target).is('input,select,textarea,option'))
			e.stopPropagation();
		else
			return mu(e,div);
	});
	div.mousedown(function(e) {
		if (e.button == 0 && $(e.target).is('input,select,textarea,option')) {
			var draggables = $(e.target).parents().add(e.target).filter('[draggable]');
			draggables.removeAttr('draggable');
			setTimeout(function() { draggables.attr('draggable', 'true'); }, 10);
			e.stopPropagation();
		} else
			return md(e,div);
	});
	div.mouseleave(function(e) { return ml(e,div); });
	div.mousemove(function(e) { return mm(e,div); });
	div.on('dragstart', function(e) { return ml(e,div); });
	div.on('contextmenu', function(e) {
		return false;
	});
	return div;
}

/* TODO: Dit levert problemen op in de customer portal als die aanstaat, maar zou het nog ergens zin hebben gehad?
$(document).ond('touchmove', function(e) { e.preventDefault(); });
*/

window.standard_clicks = standard_clicks;
})();

function show_dropdown(div, left, top, onclose) {
	var filter_container = null;
	if (!div)
		return;
	if (left.jquery) {
		var offset = left.offset();
		if (left.parent().hasClass('filter_container'))
			filter_container = left.parent();
		top = offset.top + left.outerHeight()+1;
		left = offset.left;
	}
	var popup = $(div);

	$('.blackout, .popup:visible').each(function(i,e) {
		$(e).css('z-index', $(e).css('z-index')-1);
	});
	if (popup.maskdiv == undefined) {
		if (popup.get(0).maskdiv == undefined)
			popup.get(0).maskdiv = create_div('',$(window).width()).height($(window).height()).on('standard_click', function() { popup.close(); }).addClass('blackout').css('opacity', 0);
		popup.maskdiv = popup.get(0).maskdiv;
		$(document.body).append(popup.maskdiv);
		standard_clicks(popup.maskdiv);
		popup.maskdiv.attr('hint', '');
	}
	popup.close = popup.get(0).close = function() {
		if (filter_container)
			filter_container.removeClass('selected');
		if (popup.get(0).maskdiv)
			popup.get(0).maskdiv.remove();
		popup.maskdiv = popup.get(0).maskdiv = undefined;
		popup.hide();
		if (onclose)
			onclose();
		popup.trigger('popupclose');
	};
	popup.get(0).popup = popup;

	popup.maskdiv.css('z-index', 9998).show();
	popup.show().css({'z-index': -10, 'position': 'absolute', left: 0, top: 0 });
	var w = popup.width();
	var h = popup.height();
	popup.css({'z-index': 9999, 'position': 'absolute', left: left, top: top });
	var o = popup.offset();
	if (o.top + popup.height() + 5 > $(window).height()) {
		o.top = $(window).height() - h - 5;
	}
	if (o.left + popup.width() + 5 > $(window).width()) {
		o.left = $(window).width() - w - 5;
	}
	if (o.top < 5)
		o.top = 5;
	if (o.left < 5)
		o.left = 5;
	popup.css({ left: o.left+'px', top: o.top+'px' });
	if (filter_container)
		filter_container.addClass('selected');
	return popup;
}
function lower_dropdown(div, zindex) {
	div = $(div);
	if (!div.get(0) || !div.get(0).popup)
		return;
	var popup = div.get(0).popup;
	popup.maskdiv.css('z-index', zindex-1);
	popup.css('z-index', zindex);
}

function setCss(div, style, value) {
	div[0].style[style] = value;
}

(function() {
	// Override find with more native method.
	$.fn.oldfind = $.fn.find;
	try {
		// Try to find out if :scope works, as we need it to work.
		var element = document.head.querySelector(':scope head');
		if (element)
			throw ":scope unsupported";
		var element = document.querySelector(':scope head');
		if (!element)
			throw ":scope unsupported";

		$.fn.find = function(_selector) {
			if (!this.length)
				return $();
			// ':visible' is not supported by the browser
			if (/(:visible|:selected)/.test(_selector))
				return this.oldfind(_selector);
			selector = _selector.replace(/(([^",]|"[^"]*")+)/g, ':scope $1');
			var result = $(this.get(0).querySelectorAll(selector));
			if (this.length > 1) {
				for(var i=1; i<this.length; i++)
					result = result.add(this.eq(i).find(_selector));
			}
			return result;
		};

	} catch (e) {
		/*
		   TODO: dit werkt o.a. niet voor de selector: '[hint],[placeholder]'. Daarnaast is niet gemeten of dit daadwerkelijk snelheidsvoordeel biedt.
		   Dit is alleen voor IE/Edge, omdat de rest van de browsers de :scope ondersteunt in recente versies.
		var find_id = 0;

		$.fn.find = function(selector) {
			if (!this.length)
				return $();
			if (/(,|:visible)/.test(selector))
				return this.oldfind(selector);

			if (/^#/.test(selector) || this.is('html'))
				return $(this.get(0).querySelectorAll(selector));
			var id = this.attr('id');
			if (!id) {
				id = 'find_id_'+(++find_id);
				this.attr('id', id);
			}
			selector = selector.replace(/(([^",]|"[^"]*")+)/g, '#'+id+' $1');
			return $(this.get(0).querySelectorAll(selector));
		};
		*/
	};
	$.fn.disabled = function(value) {
		if (value === undefined) {
			if (this.is('input,textarea,select'))
				return this.prop('disabled') ? true : false;
			return this.attr('disabled') ? true : false;
		}
		if (!value)
			this.removeAttr('disabled').prop('disabled', false);
		else
			this.attr('disabled', 'disabled').prop('disabled', true);
		return this;
	};
	$.fn.checked = function(value) {
		if (value === undefined) {
			if (this.is('input,textarea,select'))
				return this.prop('checked') ? true : false;
			return this.attr('checked') ? true : false;
		}
		if (!value)
			this.removeAttr('checked').prop('checked', false);
		else
			this.attr('checked', 'checked').prop('checked', true);
		return this;
	};
	$.fn.readonly = function(value) {
		if (value === undefined) {
			if (this.is('input,textarea,select'))
				return this.prop('readonly') ? true : false;
			return this.attr('readonly') ? true : false;
		}
		if (!value)
			this.removeAttr('readonly').prop('readonly', false);
		else
			this.attr('readonly', 'readonly').prop('readonly', true);
		return this;
	};
	$.fn.standard_longclick = function(f) {
		if (f === undefined)
			$(this).trigger('standard_longclick');
		else {
			standard_clicks($(this));
			$(this).on('standard_longclick', f);
		}
		return this;
	};
	$.fn.standard_dblclick = function(f) {
		if (f === undefined)
			$(this).trigger('standard_dblclick');
		else {
			standard_clicks($(this));
			$(this).on('standard_dblclick', f);
		}
		return this;
	};
	$.fn.standard_click = function(f) {
		if (f === undefined)
			$(this).trigger('standard_click');
		else {
			standard_clicks($(this));
			$(this).on('standard_click', f);
		}
		return this;
	};
	$.fn.outerHtml = function() {
		if (this.length == 0)
			return null;
		return this.get(0).outerHTML;
	};
	var oldval = $.fn.val;
	$.fn.val = function(value) {
		var args = arguments;
		if (value === undefined) {
			if (this.attr('zoekopties') || (this.is('div') && this.attr('value') !== undefined))
				return this.attr('value');
			return oldval.apply(this, args);
		} else {
			this.each(function(i,e) {
				if ($(e).attr('zoekopties'))
					set_zoek_optie(e, value);
				else
				if ($(e).is('div'))
					$(e).attr('value', value);
				else
					return oldval.apply($(e), args);
			});
		}
		return this;
	}
})();


function create_popup(obj, width) {
	var popup = $("<div/>").addClass("popup");
	standard_clicks(popup);

	var ul = popup.ul = $("<ul/>").width(width || 190);
	// Subfunction, only servers to isolate the context of the 'f' from the for loop.
	function onclick(f) { return function() { popup.maskdiv.hide(); popup.hide(); f(popup.attr('ref'), popup.item, popup.context); }; }
	// Create all items in the popup
	for (var title in obj) {
		if (!/^---/.test(title)) {
			ul.append($("<li/>").css({"margin": "0px", 'font-size': '15px', 'padding':'3px'}).attr('ref', title)
				.append($("<a/>").css("padding", "4px").standard_click(onclick(obj[title]))
					.append(create_div().addClass('row force m')
						.append(create_div('', 20).addClass('e0 center popup_mark').append(top.icons['popup_mark']))
						.append(create_ellipsis_div(title).addClass('e100 title'))
					)
				)
			);
		} else {
			ul.append($("<li/>").css("margin", "0px").css('padding', '0px').css('border-top', '1px dashed gray').attr('ref', title));
		}
	}
	popup.addClass("list_view").css('padding', '3px').css('text-align','left').append(ul);

	popup.close = function() {
		popup.maskdiv.hide();
		popup.hide();
		popup.trigger('popupclose');
	};
	popup.popup = function(id, left, top, elem, context) {
		var found = false;
		ul.find('li').each(function(i,e) {
			if ($(e).css('display') != 'none')
				found = true;
		});
		if (!found)
			return;
		if (left && left.originalEvent) {
			var ev = left;
			var left = ev.pageX;
			var top = ev.pageY;
			if (left === undefined || top === undefined) {
				left = ev.clientX;
				top = ev.clientY;
			}
			if (left === undefined || top === undefined) {
				left = ev.originalEvent.targetTouches[0].pageX;
				top = ev.originalEvent.targetTouches[0].pageY;
			}
		}
		if ((left === undefined || top === undefined) && elem && elem.jquery) {
			var offset = elem.offset();
			if (left === undefined)
				left = offset.left;
			if (top === undefined)
				top = offset.top + elem.height()/2;
		}
		if (id.jquery) {
			elem = id;
			id = id.attr('ref');
		}
		popup.item = elem || null;
		popup.context = context || {};
		$('.blackout, .popup:visible').each(function(i,e) {
			$(e).css('z-index', $(e).css('z-index')-1);
		});

		if (popup.maskdiv == undefined) {
			popup.maskdiv = $('<div/>').width($(window).width()).height($(window).height()).on('standard_click', popup.close).on('standard_longclick', popup.close).on('keypress', function(event) { if ((event || window.event).keyCode == 27) popup.close(); }).addClass('blackout').attr('tabindex', 0).css('opacity', 0);
			$(document.body).append(popup.maskdiv);
			standard_clicks(popup.maskdiv);
		}
		popup.maskdiv.css('z-index', 9998).show().focus();
		popup.css({left: left, top: top }).attr('ref', id);
		popup.show().css('z-index', 9999);
		var o = popup.offset();
		if (o.top + popup.height() + 8 > $(window).height()) {
			o.top = $(window).height() - popup.height() - 8;
		}
		if (o.left + popup.width() + 8 > $(window).width()) {
			o.left = $(window).width() - popup.width() - 8;
		}
		if (o.top < 4)
			o.top = 4;
		popup.css({ top: o.top+'px', left: o.left+'px' });
	}
	$(document.body).append(popup);
	popup.functions = obj;
	popup.find_li = function(f) {
		var li = popup.ul.children('li');
		for (var i = li.length-1; i >= 0; i--)
			if (li.eq(i).attr('ref') == f)
				return li.eq(i);
		return $();
	};
	popup.delete_function = function(f) {
		var li = popup.ul.children('li');
		for (var i = li.length-1; i >= 0; i--)
			if (li.eq(i).attr('ref') == f) {
				li.eq(i).remove();
				break;
			}
		if (popup.functions[f])
			delete popup.functions[f];
	};
	popup.show_function = function(f, show) {
		var li = popup.ul.children('li');
		for (var i = 0; i < li.length; i++)
			if (li.eq(i).attr('ref') == f) {
				if (show)
					li.eq(i).css('display', '');
				else
					li.eq(i).css('display', 'none');
				break;
			}
	};
	popup.set_mark = function(f, set) {
		var lis = popup.ul.children('li');
		var li = $();
		for (var i = lis.length-1; i >= 0; i--) {
			if (lis.eq(i).attr('ref') == f) {
				li = lis.eq(i);
				break;
			}
		}
		if (set)
			li.addClass('mark');
		else
			li.removeClass('mark');
	};
	popup.get(0).popup = popup;
	return popup;
}
function add_action_filter(div, f) {
	standard_clicks(div);
	div.on('standard_click', function() {
		if (!$(this).parents('a').eq(0).hasClass('selected'))
			return true;
		f(div);
		return false;
	});
	div.addClass('clickable');
}
function filter_sub_actions(popup, exclude) {
	var result = [];
	for (var i in popup.functions) {
		if (arrayIndexOf(exclude, i) == -1)
			result.push(i);
	}
	return result;
}
// Voeg een actionline toe op basis van een popup:
//	@exceptions: alles wat in de context (onder Meer) moet blijven staan
//	@keep_in_context: alles wat zowel in de actionline als in de context moet staan
//	@ignore: alles wat nergens mag verschijnen
function add_sub_actions(li, popup, exceptions, keep_in_context, ignore) {
	if (!li.get(0) || !popup)
		return;
	// Markeer dat er een popup aan gekoppeld is.
	li.attr("popup", "popup");

	exceptions = exceptions || [ window.naam_verwijderen, window.naam_toevoegen ];
	keep_in_context = keep_in_context || [ window.naam_eigenschappen];
	ignore = ignore || [];
	var first_action = true;
	var show_functions = {};
	var last_is_line = false;
	for (var j in popup.functions) {
		popup.show_function(j, false);

		if (/^---/.test(j)) {
			if (!last_is_line)
				show_functions[j] = true;
			last_is_line = true;
			continue;
		}
		last_is_line = false;

		if (arrayIndexOf(ignore, j) >= 0) {
			continue;
		}
		if (arrayIndexOf(exceptions, j) >= 0) {
			show_functions[j] = true;
			popup.show_function(j, true);
			continue;
		}
		if (arrayIndexOf(keep_in_context, j) >= 0) {
			show_functions[j] = true;
			popup.show_function(j, true);
		}

		if (!first_action)
			li.find('.actionline')
				.append($('<span/>').text('\u00a0|\u00a0').addClass('light'));
		first_action = false;
		var action = $('<span/>').text(j).attr('ref', j).addClass('inline_hover');
		standard_clicks(action.on('standard_click', function() {
			var li = $(this).parents('li').eq(0);
			popup.functions[$(this).attr('ref')](li.attr('ref'), li, $(this));
			return false;
		}));
		li.find('.actionline').append(action);
	}
	if (last_is_line) {
		delete show_functions[j];
	}
	var cnt = 0;
	for (var i in show_functions) {
		if (cnt == 0 && /^---/.test(i)) {
			delete show_functions[i];
		} else
			cnt++;
	}
	if (cnt) {
		li.find('.actionline')
			.append($('<span/>').text('\u00a0|\u00a0').addClass('light'))
			.append(
				standard_clicks($('<span/>').text(meer_tekst+' ▼').addClass('inline_hover').on('standard_click', function() {
					$(this).trigger('standard_longclick');
					return false;
				}))
			);
	}
	li.get(0).init_popup = function() {
		for (var j in popup.functions)
			popup.show_function(j, show_functions[j] || false);
	};
	li.on('standard_longclick', function() {
		li.get(0).init_popup();
		return true;
	});
}

/*
   show a simple message in a popup
*/
function showMessage(text, f, c, buttons, width) {
	if (!buttons && !f)
		buttons = 2;
	width = parseInt(width || 320);
	if (text != undefined && text != '') {
		io = $("<div class='popup message_io' style='display:none;width:"+width+"px;min-height:110px;' title=''><div style='padding:10px'></div></div>");
		$(document.body).append(io);
		io.children('div').html(text);
		return createOverlay(io, function() { io.remove(); if (f) f(); }, function() { io.remove(); if (c) c(); }, buttons || undefined, function() {
			io.find('.ok').focus();
		});
	} else
	if (f != undefined)
		f();
	return $('');
}
/*
   show a simple message in a popup, but now for ERROR-uses. Any number of instances allowed.
*/
function showError(text, url, linkname, width) {
	width = parseInt(width || 320);
	if (text != undefined && text != '') {
		var error_io = $("<div style='display:none;width:"+width+"px;min-height:110px;'><div style='max-height:300px;overflow-y:auto'></div></div>");
		$(document.body).append(error_io);
		error_io.children('div').html(text+"\u00a0");
		if (url) {
			var a = $('<a/>').text(linkname || url || '');
			if (/^ez2xs:\/\//.test(url)) {
				a.attr('href', '#').standard_click(function() {
					top.execUrl(url);
					error_io.close();
					return false;
				});
			} else
				a.attr('href', url || '').attr('target','_blank');
			error_io.children('div').append(a);
		}
		error_io = createOverlay(error_io, function() { error_io.remove(); }, function() { error_io.remove(); }, 2, function() {
			error_io.removeAttr('draggable');
			error_io.find('.overlay_header').addClass('no_select');
			error_io.children('div')
				.on('mousedown', function(e) { e.stopPropagation(); })
				.on('mouseup', function(e) { e.stopPropagation(); })
				.on('contextmenu', function(e) { e.stopPropagation(); })
				;
		});
		return error_io;
	}
	return $();
}

/**
 * Base object for IO-object
 */
var IO = {
	io: undefined, // the detail popup box $('#group_io')for example
	fill: undefined, // the function for filling the non obvious on the screen. Optional
	prefill: undefined, // the function for filling the non obvious on the screen. Optional
	read: undefined, // the function for reading the non-obvious from the screen. Optional
	preread: undefined, // the function for reading the non-obvious from the screen, but _before_ the readIO. Optional
	ok: undefined, // the function called after a saving successfully. Optional
	del: undefined, // the function called after a deleting successfully. Optional, defaults to io.ok
	getapi: undefined, // server api function to be called for getting the content of the popup.
	setapi: undefined, // server api function to be called for saving the content of the popup.
	delapi: undefined, // server api function to be called for deleting an item
	delmessage: undefined, // Confirmation show in messagebox
	allowsave: undefined, // Function that returns if the IO should have a save button
	show: undefined, // Function that executes AFTER the IO has been shown.
	error: undefined, // Function that if the call setapi generates an error
	minimize: undefined, // Enables the io to minimize and maximize
	init: undefined // Initializes the object
};

/**
 * @brief create a list view with standard edit functions.
 * @param id         the ID of the object to be edited
 * @param io         is an object following the structure of the IO prototype, describing the IO to be used
 * @param context    (optional) this gives extra context, that we be saved and passed to the server in the getapi call
 * @param overrides  (optional) if anything from the IO should be overriden, it can be done here.
 * @param f_cancel   (optional) compatibility function for old way of using io.cancel / override.cancel
 */
function viewEditFunction(id, io, context, overrides, f_cancel) {
	context = context || {};
	context.id = id = (id || parseInt($(io.io).parents('.popup').attr('ref')));
	if (typeof(overrides) == "function")
		overrides = { ok: overrides };
	else
	if (typeof(overrides) != "object")
		overrides = {};
	overrides.cancel = overrides.cancel || f_cancel;
	io.overrides = overrides;
	var params = io.params = context;
	if (io.getparams)
		params = io.params = io.getparams(params, id);
	if (overrides.getparams)
		params = io.params = overrides.getparams(params, id);
	if (params === false)
		return;
	callserver(overrides.getapi || io.getapi, params, function(data) {
		if (data[id] === undefined) {
			for (var i in data)
				if (/^-?[0-9]+$/.test(i)) {
					id = i;
					break;
				}
		}
		clearIO(io.io);

		if (io.prefill) {
			if (io.prefill(id, data) === false)
				return;
		}
		if (overrides.prefill) {
			if (overrides.prefill(id, data) === false)
				return;
		}
		fillIO(io.io, data[id] || {}, data.max || {})
		if (io.fill)
			io.fill(id, data, context);
		if (overrides.fill)
			overrides.fill(id, data, context);
		var overlay = createOverlay(io.io, function() {
			var data = {};
			if (io.preread)
				io.preread(id, data, context);
			data[id] = readIO(io.io);
			var ffinal = function() {
				callserver(overrides.setapi || io.setapi, { data: data }, function(data) {
					var result = true;
					if (overrides.ok) {
						if (typeof(overrides.ok) == "string")
							schedule_update(overrides.ok);
						else
							result = overrides.ok(id, data);
					}
					if (result !== false && io.ok) {
						if (typeof(io.ok) == "string")
							schedule_update(io.ok);
						else
							result = io.ok(id, data);
					}
					if (result !== false)
						overlay.close();
				}, undefined, function(data) {
					var result = true;
					if (overrides.error)
						result = overrides.error(data);
					if (result !== false && io.error)
						io.error(data);
				});
			};
			var read_function1 = io.read || function(id, data, f) { return true; };
			var read_function2 = overrides.read || function(id, data, f) { return true; };
			var cont_read = function() {
				result = read_function2.call(io, id, data, ffinal);
				if (result === false)
					return false;
				ffinal();
				return false;
			};
			var result = read_function1.call(io, id, data, cont_read);
			if (result === false)
				return false;
			cont_read();
			return false;
		}, overrides.cancel || undefined, (!io.allowsave || io.allowsave()) ? 3 : 2, function(div) {
			overlayInfo(io.io, data[id]);
			overlayMarkClean(io.io);
			if (id > 0) {
				if (data[id] && data[id].datumeind && datumeindIsVerwijderd(data[id].datumeind))
					overlayMarkRemoved(io.io);
			} else
				overlayMarkDirty(io.io);
			overlayDirtyHandlers(io.io);
			if (overrides.show)
				overrides.show(id, data, io);
			else
			if (io.show)
				io.show(id, data);
		}, io.minimize ?
			function() {
				$(io.minimize).css('display', '');
				$('.minimize_container').append($(io.minimize));
				$(io.io).hide().get(0).mask.hide();
				$(io.io).get(0).mask.off('standard_click').on('standard_click', function() {
					$(io.io).find('.minimize_button').standard_click();
				});
			}
		:
			undefined
		);
		registerMinimizedElement(io.minimize, function() {
			$(io.minimize).hide();
			$(io.io).show().get(0).mask.show();
		});
	});
}
/**
 * @brief Avoid calling the maximize event more than one time
 */
function registerMinimizedElement(elem, maximize) {
	if (!elem || typeof(maximize) !== 'function')
		return;
	if ($(elem).data('maximize') === undefined) {
		$(elem).standard_click(function() {
			var maximize = $(this).data('maximize');
			maximize();
		});
	}
	$(elem).data('maximize', maximize);
}
function viewDelFunction(id, io, elem) {
	io.del = io.del || io.ok || null;
	io.overrides = {};
	var params =  { id: id };
	if (io.predel)
		if (!io.predel(id, elem || undefined, params))
			return false;
	var delmessage = io.delmessage;
	if (delmessage === undefined)
		delmessage = window.naam_delmessage;
	showMessage(delmessage, function() {
		callserver(io.delapi, params, function(data) {
			if (io.del)
				io.del(id, data);
		});
	})
}
function createView(io, header) {
	var list_view = $('<ul/>');
	var a = list_view.header = $('<span/>').addClass("header_view");
	for (var i=1; i < arguments.length; i++)
		a.append(arguments[i]);
	var ul = list_view.ul = $('<ul/>');
	var li = list_view.li = $('<li/>').css({'overflow-x': 'hidden'});
	if (arguments.length > 1)
		list_view.append(a);
	li.append(ul);
	list_view.append(li);
	list_view.update_io = function(io) {
		if (!io) {
			list_view.io = null;
			list_view.popup = null;
			return;
		}
		io.io = $(io.io);
		io.del = io.del || io.ok || null;
		var popup_functions = {};
		popup_functions[ window.naam_toevoegen ] = function(id, elem) { list_view.popup.functions[window.naam_eigenschappen](-1); };
		popup_functions[ window.naam_verwijderen ] = function(id, elem) {
			var id = id || parseInt($(this).parents('.popup').attr('ref'));
			viewDelFunction(id, io, elem);
		};
		popup_functions[ window.naam_eigenschappen ] = function(id, elem) {
			id = id || parseInt($(this).parents('.popup').attr('ref'));
			viewEditFunction(id, io);
		};
		if (io.setpopup)
			popup_functions = io.setpopup(popup_functions);
		list_view.popup = io.popup = create_popup(popup_functions);
		var ul_popup_functions = {
		};
		if (popup_functions[ window.naam_toevoegen ])
			ul_popup_functions[ window.naam_toevoegen ] = function(id) { viewEditFunction(-1, io); };
		if (io.setulpopup)
			ul_popup_functions = io.setulpopup(ul_popup_functions);
		list_view.ul_popup = io.ul_popup = create_popup(ul_popup_functions);

		list_view.io = io;

		list_view.standard_longclick(function(e, orig_e) {
			if (!list_view.ul_popup)
				return true;
			offset = $(this).offset();
			list_view.ul_popup.popup(-1, orig_e, undefined, $(e.target));
			return false;
		});
	}
	list_view.update_io(io || undefined);

	standard_clicks(list_view);
	return list_view;
}
function viewSelect(list_view, elem, allow_toggle) {
	allow_toggle = (allow_toggle !== undefined ? !!allow_toggle : true);
	elem = $(elem);
	if (allow_toggle && elem.children('a').hasClass('selected')) {
		elem.children('a').removeClass('selected');
		return false;
	}
	var ul;
	if (list_view.ul)
		ul = list_view.ul;
	else
	if ($(list_view).hasClass('list_view'))
		ul = $(list_view).children('ul').children('li').children('ul');
	else
	if ($(list_view).parent().hasClass('list_view'))
		ul = $(list_view).children('li').children('ul');
	else
		ul = $(list_view);
	ul.find('a.selected').removeClass('selected');
	elem.children('a').addClass('selected');
	return true;
}

var tab_update_pending = $();

function delayUpdateTab(tab) {
	window.tab_update_pending = window.tab_update_pending.add(tab);
	setTimeout(function() {
		var to_trigger = window.tab_update_pending.filter('.selected');
		window.tab_update_pending = $();
		to_trigger.trigger('update');
	}, 10);
}

function createTab(label, f) {
	if (typeof(label) == "string")
		label = create_div(label);
	if (!label.attr('is-tab'))
		standard_clicks(label).attr('is-tab', 'true').on('select_only', function() {
			$(this).parent().children().removeClass('selected'); $(this).addClass('selected');
		}).on('standard_click', function() {
			$(this).parent().children().removeClass('selected'); $(this).addClass('selected');
			if (f)
				f();
			if ($(this).attr('data-event'))
				$(document).trigger($(this).attr('data-event'));
		}).on('select', function() {
			$(this).parent().children().removeClass('selected'); $(this).addClass('selected');
			delayUpdateTab(this);
		}).on('update', function() {
			if ($(this).attr('data-event'))
				schedule_update($(this).attr('data-event'));
		});
	return label;
}

function registerSearchLine(id, hint, f_keyup, listen_top_text, f) {
	var searchline;
	var li;
	var last_filter = '';
	var input = $('#'+id);

	var speedfilters = [];
	var selects = [];
	var selectsleft = [];

	var speedfilter_count = 0;

	var f = f || function() {
		delayUpdateTab(input.parents('.list_view').eq(0).find('.tab_view').children('.selected'));
	};
	if (listen_top_text === undefined || listen_top_text) {
		listen_top_text = true;
		$(document).on('update_text', function() {
			last_filter = $('#text').val();
			input.val(last_filter);
			f();
		});
	}

	var filterinput;
	function check_has_value() {
		var cnt_hasx = 0;
		for(var i in selectsleft)
			cnt_hasx += selectsleft[i].find(".zoek_flash.x").length;
		if (input.val() != '' || speedfilter_count > 0 || cnt_hasx > 0)
			filterinput.addClass('has_value');
		else
			filterinput.removeClass('has_value');
	}

	if (input.length > 0) {
		return input.parents('.searchline').eq(0).parent();
	} else {
		input = $('<input type="text"/>').keydown(function(ev) {
			ev = ev || window.event;
			setTimeout(check_has_value, 20);
			if (ev.keyCode == 13 && !f_keyup) {
				last_filter = '';
				f();
				return false;
			}
			if (ev.keyCode == 27 || (ev.keyCode == 8 && $(this).val() == '')) {
				last_filter = '';
				if ($(this).val() != '') {
					$(this).val('');
					f();
				} else {
					if (window.speedfilters)
						for (var i in speedfilters)
							window.speedfilters.remove(false, speedfilters[i]);
					for (var i in selectsleft)
						selectsleft[i].find('.zoek_flash.x').standard_click();
				}
				return false;
			}
		}).keyup(function(e) {
			if (f_keyup)
				f_keyup();
		}).mouseup(function(e) {
			if (e.button != 2)
				e.stopPropagation();
		}).mousedown(function(e) {
			if (e.button != 2) {
				var elem = $(this).parents('[draggable]');
				elem.removeAttr('draggable');
				$(this).removeAttr('draggable');
				setTimeout(function() { elem.attr('draggable', 'true'); }, 100);
				e.stopPropagation();
			}
		}).focus(function() {
			//$(this).select();
		}).attr('id', id).val('');
		filterinput = create_div().addClass('filterinput')
			.append(create_div().append(top.icons['zoek']).addClass('zoekicoon'))
			.append($('<div class="speedfilterinput"/>'))
			.append($(input))
			.append($('<span class="x">X</span>').attr('hint', 'Klik hier of druk op Esc om te wissen'))
			;
		searchline = create_div().addClass('searchline')
			.append(create_div().addClass('leftdiv'))
			.append(filterinput)
			.append(create_div().addClass('rightdiv'))
			;
		li = $('<span/>').append(searchline);
		$('#hidden_container').append(li);
	}
	li.find('.zoekicoon').get(0).onclick = f;
	li.find('.x').get(0).onclick = function() {
		if (input.val() != '') {
			input.val('');
			last_filter = '';
		} else {
			if (window.speedfilters)
				for (var i in speedfilters)
					window.speedfilters.update(false, speedfilters[i], 0);
			for (var i in selectsleft)
				selectsleft[i].find('.zoek_flash.x').standard_click();
		}
		if (f_keyup)
			f_keyup();
		else
			f();
		setTimeout(check_has_value, 20);
		schedule_trigger(li, 'reset_filters');
	};

	if (typeof(hint) == "object") {
		input.attr('placeholder', hint.placeholder || hint[1] || hint.hint || window.naam_zoek);
		input.attr('hint', hint.hint || hint[0] || undefined);
	} else {
		input.attr('placeholder', hint || window.naam_zoek);
		input.attr('hint', hint || undefined);
	}

	if (input.is(':focus'))
		window.refocus_control = input;

	function copySpeedFilter(speedfilter) {
		var text = speedfilter.attr('text') || '';
		var hint = text;
		if (text.length > 18)
			text = text.substr(0,17)+'..';
		input.parent().children('.speedfilterinput')
			.append ($('<ins style="box-sizing:border-box;height:100%;display: inline-block; font-size:12px"></ins>')
					.append($('<span style="margin-left:3px;" ref="0">X</span>').standard_click(function() { window.speedfilters.remove(false, speedfilter); }))
					.prepend($('<div/>').text(text))
					.addClass(speedfilter.attr('class'))
					.attr('hint', hint)
					.css('display', speedfilter.css('display')));
		if (speedfilter.css('display') != 'none')
			speedfilter_count++;
	}

	function copySpeedFilters() {
		input.parent().children('.speedfilterinput').children().remove();
		speedfilter_count = 0;
		for (var i in speedfilters)
			copySpeedFilter(speedfilters[i]);
	}

	li.listenSpeedFilter = function(speedfilter) {
		if (!speedfilter)
			return li;
		speedfilter.on('speedfilter_change', function() {
			f();
		});
		speedfilters.push(speedfilter);
		return li;
	}
	li.addSelect = function(select, listen_change) {
		select = $(select);
		selects.push(select);
		if (select.is('div') && select.children('div').length == 0)
			select.append(create_div());
		if (listen_change)
			select.on('change', f);
		return li;
	}
	li.addSelectLeft = function(select) {
		select = $(select);
		selectsleft.push(select);
		if (select.children('div').length == 0)
			select.append(create_div());
		return li;
	}
	li.update = function() {
		if (listen_top_text) {
			var textval = last_filter;
			var inputval = input.val() || '';
			var found = false;
			for (var i in speedfilters) {
				if (speedfilters[i].css('display') != 'none') {
					found = true;
					break;
				}
			}
			if (textval != '') {
				if (found && inputval == textval) {
					input.val('');
				} else
				if (!found && inputval == '') {
					input.val(textval);
				}
			}
		}

		li.find('.speedfilterinput').after(input);
		copySpeedFilters();
		for (var i in selects) {
			var select = selects[i];
			searchline.children('.rightdiv').append(select);
			select.children('div').eq(0).css('padding', '4px 5px');
			if (select.css('display') != 'none')
				select.css('display','inline-block');
		}
		for (var i in selectsleft) {
			var select = selectsleft[i];
			searchline.children('.leftdiv').append(select);
			select.children('div').eq(0).css('padding', '4px 5px');
			if (select.css('display') != 'none')
				select.css('display','inline-block');
		}
		check_has_value();

		return li;
	}
	li.input = input;
	return li;
}

$(window).on('resize', function() {
	$('.list_view .searchline input').keyup();
});

// Show the count result in the searchbar
function countResultsInSearchLine(tab, count, max) {
	var searchbox = tab;
	if (!searchbox.hasClass('list_view'))
		searchbox = tab.parents(".list_view").eq(0);
	var searchicon = searchbox.find("div.zoekicoon");
	searchicon.find('span.zoekresultaten').remove();
	if (count === "" || count === null || count === undefined)
		return;
	max = max === undefined ? top.max_result_count : max;
	if (count > max)
		count = max+"+";
	var newsearch = create_span(""+count).addClass('zoekresultaten').attr('hint', count ? window.naam_zoekresultaten + ": " + count : window.naam_noresult);
	if (count > max)
		newsearch.addClass('large_count');
	searchicon.append(newsearch);
}

function appendLine(list_view, id, content) {
	var args = Array.prototype.slice.call(arguments);
	var list_view = args.shift();
	args.unshift(null);
	args.unshift(list_view);
	return appendLineBefore.apply(window, args);
}
function appendLineBefore(list_view, prev_elem, id, content) {
	var a = $('<a/>');
	for (var i=3; i < arguments.length; i++)
		a.append(arguments[i]);
	var ul = $('<ul/>');
	var li = $('<li/>').append(a).append(ul)
	if (id !== undefined)
		li.attr('ref', id);
	li.children('a').on('standard_longclick', function(e, orig_e) {
		if (!$(this).hasClass('selected'))
			$(this).standard_click();
		return true;
	});
	li.children('a').on('standard_dblclick', function(e, orig_e) {
		if (!$(this).hasClass('selected'))
			$(this).standard_click();
		return true;
	});
	if (list_view && list_view.io && list_view.io.popup) {
		li.on('standard_longclick', function(e, orig_e) {
			var offset = $(this).offset();
			list_view.io.popup.popup($(this), orig_e, undefined, $(e.target));
			return false;
		});
		li.on('standard_dblclick', function() {
			list_view.io.popup.functions[ window.naam_eigenschappen ](id, li);
			return false;
		});
		standard_clicks(li);
	}
	prev_elem = $(prev_elem);
	if (prev_elem.length > 0)
		prev_elem.before(li);
	else
	if (list_view)
		(list_view.ul || $(list_view).children('ul')).append(li);
	li.ul = ul;
	return li;
}

function appendLinePortal(list_view, id, content) {
	var a = $('<a/>');
	for (var i=2; i < arguments.length; i++)
		a.append(arguments[i]);
	var ul = $('<ul/>');
	var li = $('<li/>').append(a).append(ul)
	if (id !== undefined)
		li.attr('ref', id);
	li.on('standard_longclick', function(e, orig_e) {
		if ($(this).children('ul').children().length == 0) {
			$(this).parents('.list_view').eq(0).children('ul').children('li').children('ul').find('a.selected').removeClass('selected');
			$(this).children('a').addClass('selected');
		}
		return true;
	});
	if (list_view && list_view.io) {
		li.on('standard_longclick', function(e, orig_e) {
			var offset = $(this).offset();
			list_view.popup.popup($(this), orig_e, undefined, $(e.target));
			return false;
		});
		li.on('standard_dblclick', function() {
			list_view.popup.functions[ window.naam_eigenschappen ](id, li);
			return false;
		});
		standard_clicks(li);
	}
	if (list_view)
		(list_view.ul || list_view.children('ul')).append(li);
	li.ul = ul;
	return li;
}

function resizeListView(list_view) {
	list_view = $(list_view);
	list_view.each(function(i,e) {
		if (window.use_separator && $(e).attr('separator')) {
			var separator = $(e).next();
			if (!separator.is('.separator')) {
				separator = $('<div class="separator"/>');
				$(e).after(separator);
			}
			var pos = $(e).position();
			var left = (pos.left+$(e).outerWidth()+parseInt(col_sep/2));
			if ($(e).css('display') == 'none' || $(e).css('visibility') == 'hidden' || left >= $(e).parent().innerWidth()-1)
				separator.hide();
			else {
				var marginTop = parseInt($(e).children('ul').css('marginTop') || 0);
				separator.css('left', left+'px').css('top', (pos.top+marginTop)+'px').height($(e).outerHeight()-marginTop);
				separator.show();
			}
		}
	});
}

(function() {

var call_list = [];
var call_timer = null;

function schedule_call(api, params, f) {
	var found = false;

	clearTimeout(call_timer);

	params = JSON.stringify(params);

	for(var i in call_list) {
		if (call_list[i].api == api && call_list[i].params == params) {
			call_list[i].functions.push(f);
			found = true;
			break;
		}
	}

	if (!found) {
		call_list.push({
			api: api,
			params: params,
			functions: [ f ]
		});
	}

	call_timer = setTimeout(function() {
		while (call_list.length > 0) {
			(function(call) {
				callserver(call.api, JSON.parse(call.params), function(data) {
					for(var j in call.functions)
						call.functions[j](data);
				}, false);
			})(call_list.shift());
		}
	}, 5);
}

window.schedule_call = schedule_call;

})();

function initScroll(scrollarea, ul, api, update) {
	ul = $(ul);
	scrollarea = $(scrollarea);
	if (scrollarea.length == 0)
		throw "Scrollarea not defined!";

	var loading = true;
	var done = false;
	var pagetoken;

	scrollarea.on('scroll', function() {
		// Only allow loading if the scroll area is not already loading, is not done and is within 400px of the bottom
		if (loading || done || scrollarea.get(0).scrollTop < scrollarea.get(0).scrollHeight - scrollarea.get(0).offsetHeight - 400)
			return;
		loadData({ pagetoken: pagetoken }, false); // Load next
	});

	// Load the next page
	function loadData(params, firstLoad) {
		loading = true;
		scrollarea.find('.loading').html(top.icons['wait']);
		schedule_call(api, params, function(data) {
			loading = false;
			scrollarea.find('.loading').remove();

			if (!data.list.length > 0 && firstLoad) {
				// In case there are no records and it is the initial load, print a default 'no results'-text in the list dom element
				ul.empty();
				ul.append(create_div(naam_noresult).addClass('no-results'));
			}

			// Append the next page to the list
			data = update(data, params) || data;

			// Remember the status of paging for the next load
			if (data.pagetoken) {
				pagetoken = data.pagetoken;
				ul.append(create_li().addClass('loading'));
				done = false;
				scrollarea.scroll();
			} else {
				done = true;
			}
		}, false);
	}

	return {
		load: function(params) {
			ul.empty();
			ul.append(create_li().addClass('loading'));
			loadData(params || {}, true); // Load initial
		}
	};
}

/** Generic list_view handler for tab_view based 'list_view's. To be used as prototype. */
var List = {
	// Variables to be initialized

	/** api (required). API to call for loading */
	api: undefined,

	/** event (optional). Event to listen for. Taken from tab normally */
	event: undefined,

	/** io (optional). Io to be linked to list_view. */
	io: undefined,

	/** An (optional) searchline */
	searchline: undefined,

	/** An (optional) show_deleted */
	show_deleted: undefined,

	/** Tab (required). May be selector. */
	tab: undefined,

	/** fill (optional). Function that fills the screen. Normally needed. */
	fill: function(list_view, data, params, first) {
	},

	/** initlist (optional). Initializes everything extra */
	initlist: function() {
	},

	/**
	 * getparams (optional). Initializes params for server call
	 * may return false, in case we need to avoid the server call all together.
	 * may modify the params object, or return a new one.
	 */
	getparams: function(params, list_view) {
	},


	// Internal functions, normally can be left alone.

	/** scroll. Will be inited using initScroll. */
	scroll: undefined,

	/** loadfunction. Function that updates the screen. */
	loadfunction: function(list_view, params) {
		var _this = this;
		var first = true;
		_this.scroll = initScroll(list_view.li, list_view.ul, _this.api, function(data) {
			_this.fill(list_view, data, params, first);
			first = false;
		});
		_this.scroll.load(params);
	},

	/** create tabs. Wrapper for global createTabs, so it may be overriden. */
	createTabs: function(tab) {
		return window.createTabs(tab);
	},

	/** Update list view or tab. Needed often to adapt tab layout or insert extra elements into list_view */
	updateView: function(tab, list_view) {
	},

	/** event handler for loading */
	event_handler: function() {
		var tab = $(this.tab);
		var list_view = this.createTabs(tab);
		if (!list_view)
			return;
		console.log(this.event);

		this.updateView(tab, list_view);

		var params = {
		};

		if (this.searchline) {
			list_view.header.after(this.searchline.update());
			params.text = this.searchline.input.val();
		}

		if (this.show_deleted) {
			tab.append(this.show_deleted);
			params.show_deleted = this.show_deleted.checked() ? 1 : 0;
		}

		if (this.io)
			list_view.update_io(this.io);

		var newparams = this.getparams(params, list_view);
		if (newparams === false)
			return;
		if (newparams !== undefined)
			params = newparams;

		this.loadfunction(list_view, params);
	},

	/** bind event for loading data */
	bind_event: function() {
		var _this = this;
		$(document).on(_this.event, function() {
			_this.event_handler();
		});

		if (this.io && !this.io.ok) {
			this.io.ok = function() {
				_this.event_handler();
			};
		}
	},

	/** inits. calls bind_event and initlist. */
	init: function() {
		if (this.tab) {
			if (!this.event)
				this.event = $(this.tab).attr('data-event');
			if (this.event)
				this.bind_event();
		}
		this.initlist();
	},

	/** schedule reload */
	load: function() {
		if (this.event)
			schedule_update(this.event);
	}
};

var dayMillisecs = 60 * 60 * 24 * 1000;

function pad(s) { s=parseInt((s+'').replace(/^0+/, '') || 0); if (s < 10) return '0'+s; return ''+s; }

Date.prototype.weekday2weeks = function() {
	return (Math.round((new Date(Date.parse(this.isoDateFormat())).getTime()-new Date(Date.parse("1900-12-30")).getTime()) / dayMillisecs) + 6) % 14;
}
Date.prototype.get_week_jaar = function() {
	var dagentotdonderdag = (3 - ((this.getDay() + 6) % 7));
	var weekdonderdag = new Date(this.getTime() + dayMillisecs * dagentotdonderdag);
	return weekjaar = weekdonderdag.getFullYear();
}
Date.prototype.get_week = function() {
	var dagentotdonderdag = (3 - ((this.getDay() + 6) % 7));
	var weekdonderdag = new Date(this.getTime() + dayMillisecs * dagentotdonderdag).isoDateFormat().toDate();
	var weekjaar = weekdonderdag.getFullYear();
	return (Math.floor(Math.round((weekdonderdag.getTime() - (new Date (weekjaar, 0, 1)).getTime()) / dayMillisecs) / 7) + 1);
}
Date.prototype.get_weken_in_jaar = function() {
	var week = this.get_week();
	var test = new Date(this.getTime() + (53 - week) * dayMillisecs * 7); // Wat zou week 53 zijn?
	if (test.get_week_jaar() == this.get_week_jaar())
		return 53;
	return 52;
}
Date.prototype.getTimezoneMillisecs = function() {
	return this.getTimezoneOffset()*60*1000;
}
Date.prototype.begin_week = function() {
	var date = new Date(this.getTime() - this.getTimezoneMillisecs() - ((this.getDay() + 6) % 7) * dayMillisecs);
	date = new Date(date.getTime() + date.getTimezoneMillisecs());
	date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
	return date;
}
Date.prototype.begin_jaar = function() {
	return new Date(this.getFullYear(), 0, 1);
}
Date.prototype.eind_jaar = function() {
	return new Date(this.getFullYear(), 11, 31);
}
Date.prototype.eind_week = function() {
	return new Date(this.begin_week().add(7).getTime()-1000);
}
Date.prototype.humanDateFormatWithDay = function() {
	return window.namen_dagen_short[(this.getDay()+6) % 7] + ' ' + pad(this.getDate()) + '-' + pad(this.getMonth() + 1) + '-' + this.getFullYear();
}
Date.prototype.humanDateFormat = function() {
	return pad(this.getDate()) + '-' + pad(this.getMonth() + 1) + '-' + this.getFullYear();
}
Date.prototype.humanTimeFormat = function() {
	return pad(this.getHours()) + ':' + pad(this.getMinutes());
}
Date.prototype.isoDateFormat = function() {
	return this.getFullYear() + '-' + pad(this.getMonth() + 1) + '-' + pad(this.getDate());
}
Date.prototype.add = function(n) {
	var date = new Date(this.getTime() - this.getTimezoneMillisecs() + n*dayMillisecs);
	return new Date(date.getTime() + date.getTimezoneMillisecs());
}
Date.prototype.prev = function() {
	return this.add(-1);
}
Date.prototype.next = function() {
	return this.add(1);
}
Date.prototype.add_month = function(cnt) {
	var new_month = ((this.getMonth()+12+cnt) % 12);
	var new_year = this.getFullYear()+Math.floor((this.getMonth()+cnt) / 12);
	var date = new Date(new_year, new_month, this.getDate());
	if (date.getMonth() != new_month)
		date.setDate(0);
	return date;
}
Date.prototype.prev_month = function() {
	return this.add_month(-1);
}
Date.prototype.next_month = function() {
	return this.add_month(1);
}
Date.prototype.begin_month = function() {
	return new Date(this.getFullYear(), this.getMonth(), 1);
}
Date.prototype.end_month = function() {
	return this.begin_month().next_month().prev();
}
Date.prototype.add_year = function(cnt) {
	var new_year = this.getFullYear()+cnt;
	var date = new Date(new_year, this.getMonth(), this.getDate());
	if (date.getMonth() != this.getMonth())
		date.setDate(0);
	return date;
}
function showDate(d) {
	if (!d)
		return '';
	d = d.split(' ');
	d = d[0];
	var elems = d.split('-');
	if (elems.length < 3)
		return '';
	var date = new Date(elems[0], elems[1]-1, elems[2]);
	var dag = date.getDay();
	dag = namen_dagen_short[(dag+6) % 7].toLowerCase();
	// TODO: Localization!
	var today = new Date()
	if (today.getFullYear() == elems[0] && today.getMonth() == elems[1]-1 && today.getDate() == elems[2])
		return "vandaag";
	if (elems[0] == new Date().getFullYear())
		return dag + ", " + elems[2] + ' ' + namen_maanden_short[elems[1]-1];
	return dag + ", " + d.sqlToShortHumanDate();
}
function showTime(t) {
	t = (t || '').substr(0,5);
	return t;
}
function guessPeriodeTekst(start, eind, show_dates) {
	if (!start || !eind)
		return '';
	if (typeof(start) == 'string')
		start = start.toDate();
	if (typeof(eind) == 'string')
		eind = eind.toDate();
	// één dag
	if (start.isoDateFormat() == eind.isoDateFormat()) {
		return showDate(start.isoDateFormat());
	}
	// één jaar
	if (start.isoDateFormat() == start.begin_jaar().isoDateFormat() && eind.isoDateFormat() == start.eind_jaar().isoDateFormat())
		return start.getFullYear();
	// één maand
	if (start.isoDateFormat() == start.begin_month().isoDateFormat() && eind.isoDateFormat() == start.end_month().isoDateFormat())
		return namen_maanden_short[start.getMonth()] +' '+ start.getFullYear();
	// één week
	if (start.isoDateFormat() == start.begin_week().isoDateFormat() && eind.isoDateFormat() == start.eind_week().isoDateFormat())
		return 'wk'+start.get_week()+' '+start.get_week_jaar();
	if (!show_dates)
		return 'Anders';
	return start.humanDateFormat()+' - '+eind.humanDateFormat();
}
function parseIso8601(d) {
	try {
		var date = new Date(d);
		return date.isoDateFormat() + " "+ pad(date.getHours())+":"+pad(date.getMinutes())+":"+pad(date.getSeconds());
	} catch(e) {
	}
}
function plusEen(type, input, refdate) {
	var val = '';
	if (!refdate)
		refdate = new Date();
	else
	if (typeof(refdate) == "string")
		refdate = refdate.toDate();
	switch (type) {
		case 'vandaag': val = refdate.add(0).humanDateFormat(); break;
		case 'dag':     val = refdate.add(1).humanDateFormat(); break;
		case 'week':    val = refdate.add(7).humanDateFormat(); break;
		case 'maand':   val = refdate.next_month().humanDateFormat(); break;
		case 'kwartaal':val = refdate.add_month(3).humanDateFormat(); break;
		case 'halfjaar':val = refdate.add_month(6).humanDateFormat(); break;
		case 'jaar':    val = refdate.add_year(1).humanDateFormat(); break;
		default: return;
	}
	if (input)
		input.val(val).change();
	return val;
}
function createDateTimeDiv(d, width) {
	var div = create_div('', width);
	if (!d)
		return div;
	var datetext = "";
	var timetext = "";
	var hide_time = false;

	// Split date & time
	var arr = [ '' ];
	if (/T/.test(d)) {
		d = parseIso8601(d);
	}
	arr = d.split(' ');
	d = arr[0];
	var elems = d.split('-');
	if (elems.length < 3)
		return div;
	if (parseInt(elems[2], 10) == 0)
		return div;
	var date = new Date(elems[0], elems[1]-1, elems[2]);
	div.attr('datetime', date.getTime());

	// Convert
	if (arr.length > 1)
		timetext = arr[1].substr(0,5);
	var dag = date.getDay();
	dag = namen_dagen_short[(dag+6) % 7].toLowerCase();
	var today = new Date()
	if (today.getFullYear() == elems[0] && today.getMonth() == elems[1]-1 && today.getDate() == elems[2])
		datetext = "vandaag";
	else
	if (elems[0] == new Date().getFullYear()) {
		datetext = dag + ", " + elems[2] + ' ' + namen_maanden_short[elems[1]-1];
	} else {
		hide_time = true;
		datetext = dag + ", " + d.sqlToShortHumanDate();
	}
	if (width)
		div.css('text-align', 'right');
	div.append($('<span/>').text(datetext));
	if (!hide_time)
		div.append($('<span/>').text(timetext).addClass('tijd'));
	return div;
}


top.dragelem = null;

/* Functie om een object 'draggable' te maken. Handelt geen drop af. */
function make_draggable(elem, type, options, onstart, onend) {
	elem = $(elem);
	if (elem.attr('drag-set'))
		return;

	options = options || {};
	options.attr = options.attr || "ref";
	options.x = options.x || 40;
	options.y = options.y || 7;

	var detectIE = (detectBrowser().name == 'ie');
	if (detectIE)
		elem.find('a').attr('href', '#');

	elem.attr("draggable", "true").attr('drag-set', 'true')
		.on('dragend', function(ev) {
			$(".drag_hover").removeClass('drag_hover');
			$(".drag_hover_selected").removeClass('drag_hover_selected');
			if (onend)
				onend(elem, top.dragelem);
			top.dragelem = null;
		})
		.on('dragstart', function(ev) {
			var text = ev.originalEvent.dataTransfer.getData("text") || '';
			if (text != '' && ! /^http/.test(text))
				return;
			top.dragelem = { type: type, data: $(this).attr(options.attr), draggingelem: this };
			ev.originalEvent.dataTransfer.effectAllowed='all';
			ev.originalEvent.dataTransfer.dropEffect='none';
			if (!detectIE) {
				/*
				if (extradata) {
					for (var i in extradata)
						ev.originalEvent.dataTransfer.setData(i, extradata[i]);
				} else
				*/
				ev.originalEvent.dataTransfer.setData("text/uri-list", 'about:blank');
				ev.originalEvent.dataTransfer.setData("text", type);
				ev.originalEvent.dataTransfer.setDragImage(ev.target, options.x, options.y);
			} else
				ev.originalEvent.dataTransfer.setData("text", type);
			if (window.hideHint)
				window.hideHint()
			if (onstart)
				onstart(elem, top.dragelem);
			return true;
		});
}

/**
 * @brief  detects browser used
 * @return object with name and version of browser, operating system, bits version and desktop yes or no
 */
function detectBrowser() {
	var browserInfo = {};
	var userAgent = window.navigator.userAgent;

	function getOperatingSystem() {
		var platform = window.navigator.platform;
		var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
		var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
		var iosPlatforms = ['iPhone', 'iPad', 'iPod'];
		var os = null;
		var desktop = false;

		if (macosPlatforms.indexOf(platform) !== -1) {
			os = 'Mac OS';
			desktop = true;
		} else
		if (iosPlatforms.indexOf(platform) !== -1) {
			os = 'iOS';
		} else
		if (windowsPlatforms.indexOf(platform) !== -1) {
			os = 'Windows';
			desktop = true;
		} else
		if (/Android/.test(userAgent)) {
			os = 'Android';
		} else
		if (!os && /Linux/.test(platform)) {
			os = 'Linux';
			desktop = true;
		}

		browserInfo.os = os;
		browserInfo.desktop = desktop;
	}

	function getBrowser() {
		browserInfo.name = 'unknown';
		browserInfo.version = 0;

		var browsers = [
			[ 'edge', /Edge\/([0-9\._]+)/ ],
			[ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
			[ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
			[ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
			[ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
			[ 'firefox_ios', /FxiOS\/([0-9\.]+)/ ],
			[ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
			[ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
			[ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/ ],
			[ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
			[ 'ie', /MSIE\s(7\.0)/ ],
			[ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
			[ 'android', /Android\s([0-9\.]+)/ ],
			[ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
			[ 'safari', /Version\/([0-9\._]+).*Safari/ ]
		];
		for (var i in browsers) {
			var rule = browsers[i][1];
			var match = rule.exec(userAgent);
			if (match) {
				var version = match[1].split(/[._]/).slice(0,3);
				browserInfo.name = browsers[i][0];
				browserInfo.version = version;
				break;
			}
		}
	}

	function getBitsVersion() {
		browserInfo.bits = 32;

		var rule = /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i;
		var match = rule.exec(userAgent);
		if (match)
			browserInfo.bits = 64;
	}

	getOperatingSystem();
	getBitsVersion();
	getBrowser();

	return browserInfo;
}

/* Functie om een dragging te accepteren (droppable). Handelt geen start dragging af. */
function make_droppable(elem, func_accept_drop, func_drop, type) {
	$(elem).on('dragenter', function(ev) {
			if (detectBrowser().name == 'ie')
				return false;
			if (ev.originalEvent.dataTransfer.getData("text") == type && func_accept_drop(ev, top.dragelem.data, this, top.dragelem.draggingelem) === false) {
				$(".drag_hover").removeClass('drag_hover');
				$(this).addClass('drag_hover');
			}
			return false;
		}).on('dragleave', function(ev) {
			$(this).add($(this).parents()).removeClass('drag_hover');
			return false;
		}).on('dragover', function(ev) {
			if (top.dragelem && top.dragelem.type == type)
				if (func_accept_drop(ev, top.dragelem.data, this, top.dragelem.draggingelem) === false) {
					$(this).addClass('drag_hover');
					return false;
				}
			return true;
		}).on('drop', function(ev) {
			$(this).removeClass('drag_hover');
			if (top.dragelem && top.dragelem.type == type)
				return !!func_drop(ev, top.dragelem.data, this, top.dragelem.draggingelem);
			return true;
		});
}

/**
 * @brief Drop files from outside of the system.
 * @param elem      the target drop elem.
 * @param ondrop    callback function after de file is dropped.
 * @param onend     callback function on end of drop
 * @return elem (as jQuery-object)
 */
function make_droppable_files(elem, ondrop, onend) {
	elem = $(elem);
	elem.on('dragover', function(e) {
		e = e.originalEvent;
		var dt = e.dataTransfer;
		for (var i=0; i<dt.types.length; i++) {
			if (dt.types[i] == 'Files' || dt.types[i] == 'application/x-moz-file') {
				e.dataTransfer.dropEffect = 'copy';
				e.preventDefault();
				$(this).addClass('drag_hover');
				return false;
			}
		}
		return true;
	});
	elem.on('drop', function(e) {
		e = e.originalEvent;
		e.dataTransfer.dropEffect = 'copy';
		if (e.preventDefault)
			e.preventDefault();
		var dt = e.dataTransfer;
		if (!e.dataTransfer.files || e.dataTransfer.files.length == 0)
			return true;
		if (ondrop)
			ondrop(e.dataTransfer.files, $(this), e);
		$('.drag_hover').removeClass('drag_hover');
		return false;
	});
	elem.on('dragend', function(e) {
		$('.drag_hover').removeClass('drag_hover');
		$(".drag_hover_selected").removeClass('drag_hover_selected');
		if (onend)
			onend(elem);
	});

	return elem;
}

/* Prevent default drop actions */
$(document).on('dragover', function(e) {
	e = e.originalEvent;
	e.dataTransfer.dropEffect = 'none';
	e.preventDefault();
	return false;
});
$(document).on('drop', function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return false;
});

function setval(elem, val) {
	elem = $(elem);
	if (elem.length == 0)
		return '';
	switch (elem.get(0).tagName) {
		case 'INPUT':
		case 'TEXTAREA':
		case 'SELECT': return elem.val(val);
	}
	if (elem.is('.filter_container'))
		return elem.val(val);
	children = elem.children('input,textarea,select,.filter_container')
	if (children.length == 1)
		return children.val(val);
	return elem.text(val);
}
function valof(elem) {
	elem = $(elem);
	if (elem.length == 0)
		return '';
	switch (elem.get(0).tagName) {
		case 'INPUT':
		case 'TEXTAREA':
		case 'SELECT': return elem.val();
	}
	if (elem.is('.filter_container'))
		return elem.val();
	children = elem.children('input,textarea,select,.filter_container')
	if (children.length == 1)
		return children.val();
	return elem.text();
}

function scrollWith(id, orig) {
	var elem = document.getElementById(id);
	elem.scrollLeft = orig.scrollLeft;
}
function bind_needed(e) {
	var e = $(e);
	e.each(function(i,e) {
		var input = $(e);
		if (input.is('label'))
			input = input.children('input,select,div').eq(0);
		input.on('change', function() { check_needed(e); });
		input.on('keyup', function() { check_needed(e); });
	});
}
function check_needed(e) {
	var e = $(e);
	var input = e;
	if (input.is('label'))
		input = input.children('input,select,div.filter_container').eq(0);
	if ((input.val() || 0) == 0 || input.val().replace(/ /g, '') == '')
		e.attr('error', 'error');
	else
		e.removeAttr('error');
}
function zoekPlaats(search) {
	if (/^[ \t]*$/.test(search || ''))
		return naam_onbekend;
	// Pak de tekst na de postcode (nederlandse stijl)
	text = search.replace(/\b[0-9][0-9][0-9][0-9] *[A-Za-z][A-Za-z][, ]+(.*)/, "$1");
	var last_word_break = text.length;
	var i;
	for (i = text.length - 1; i >= 0; i--) {
		if (text.substr(i,1) == ',') {
			i=i+1;
			break;
		}
		if (text.substr(i,1) == ' ')
			last_word_break = i;
		if (text.substr(i,1) >= '0' && text[i] <= '9') {
			i = last_word_break;
			break;
		}
	}
	if (i < 0)
		i=0;
	var plaats = text.substr(i).replace(/^ */, '').replace(/ *$/, '');
	if (plaats.toUpperCase() == 'NEDERLAND' || /^[ \t]*$/.test(plaats))
		return zoekPlaats(text.substr(0,i-1));
	text = text.substr(i);
	if (text == "")
		return search;
	return text;
}

$(window).on('resize', function() { $("div.blackout").width($(window).width()).height($(window).height()); });

function flikkerElem(field, f) {
	field = $(field);
	var parents = field.parents();
	for (var i=1; i<parents.length; i++) {
		if (parents.eq(i).is('.tabcontainer')) {
			var tab = parents.eq(i-1);
			var container = parents.eq(i);
			var a = $();
			if (tab.attr('id'))
				a = container.children('span').children('a[rel="#'+tab.attr('id')+'"]');
			if (a.length == 0) {
				var index = container.children('div').index(tab);
				a = container.children('span').children('a').eq(index);
			}
			a.standard_click();
		}
	}
	function setBoxShadow(field, shadow) {
		field.css({ 'box-shadow': shadow, '-moz-box-shadow': shadow, '-o-box-shadow': shadow, '-webkit-box-shadow': shadow });
	}
	setBoxShadow(field, '0px 0px 2px 2px red');
	setTimeout(function() {
		setBoxShadow(field, '');
		setTimeout(function() {
			setBoxShadow(field, '0px 0px 2px 2px red');
			setTimeout(function() {
				setBoxShadow(field, '');
				if (f)
					f();
			}, 300);
		}, 300);
	}, 300);
}


/* BEGIN HINT -------------- */
(function() {
var hint_timeout = null;
var mouse_pos = { x: 0, y: 0 };
var actual_mouse_pos = { x: 0, y: 0 };
var elem = null;

function move_get_mouse_pos(event) {
	actual_mouse_pos = mouseCoords(event);
	if (Math.abs(actual_mouse_pos.x - mouse_pos.x) > 10 || (Math.abs(actual_mouse_pos.x + mouse_pos.x) > 10)) {
		cancel_hint();
		schedule_showhint(actual_mouse_pos, elem);
	}
}
function do_showhint(e) {
	if (!$(e).is(':visible'))
		return;
	var hint = $(e).attr('forcehint') || $(e).attr('hint') || $(e).attr('placeholder') || '';
	if (!hint)
		return;
	$('#hint').children('.content').html(hint);
	var offset = $(e).offset();
	$('#hint').css('left', (offset.left+($(e).width()-$('#hint').width())/2)+'px').css('top', (offset.top+$(e).height()+2)+'px');
	$('#hint').show();
	var left = actual_mouse_pos.x-8-($('#hint').width() / 2);
	var top = (offset.top+$(e).outerHeight()+8);
	$('#hint .arrow').removeClass('up').removeClass('down');;
	if (left + $('#hint').outerWidth() > $(window).width())
		left = $(window).width()-$('#hint').outerWidth();
	if (left < 0)
		left = 0;
	if (top + $('#hint').outerHeight() > $(window).height()) {
		top = offset.top-$('#hint').outerHeight();
		$('#hint .arrow').addClass('down');
	} else
		$('#hint .arrow').addClass('up');
	$('#hint').css('left', left+'px').css('top', top+'px');
}
function schedule_showhint(pos, e) {
	mouse_pos = pos;
	actual_mouse_pos = pos;
	elem = e;
	$(document).off('mousemove', move_get_mouse_pos);
	$(document).on('mousemove', move_get_mouse_pos);
	clearTimeout(hint_timeout);
	hint_timeout = setTimeout(function() { do_showhint(e); }, 400);
}
function cancel_hint() {
	clearTimeout(hint_timeout);
	$(document).off('mousemove', move_get_mouse_pos);
	$('#hint').hide();
}
function showhint(event, elem) {
	schedule_showhint(mouseCoords(event), this);
}
function hidehint() {
	cancel_hint();
}
function updateHintHandlers(div) {
	div = $(div || window.document);
	var list = div.find('[hint],[placeholder]').add(div.filter('[hint],[placeholder]'));
	list.not('[hinted]').attr('hinted', 'hinted').mouseenter(showhint).mouseleave(hidehint);
	if (window.refocus_control) {
		window.refocus_control = $(window.refocus_control);
		var val = window.refocus_control.val() || '';
		window.refocus_control.focus();
		window.refocus_control.val('');
		window.refocus_control.val(val);
		window.refocus_control = null;
	}
	cancel_hint();
}
window.updateHintHandlers = updateHintHandlers;
window.hideHint = hidehint;
window.forceHint = function(x,y,text) {
	cancel_hint();
	$('#hint').children('.content').html(text);
	$('#hint').css('left', x+'px').css('top', y+'px');
	$('#hint').show();
};

$(document).ready(function() {
	var ua = navigator.userAgent;
	if (ua.match(/(iPhone|iPod|iPad)/) || ua.match(/BlackBerry/) || ua.match(/Android/)) {
		window.updateHintHandlers = function() {
			$('input')
				.on('touchstart', function(e) { e.stopPropagation(); return true; })
				.on('touchend', function(e) { e.stopPropagation(); return true; })
				.on('click', function(e) { e.stopPropagation(); return true; });
		};
		window.hideHint = function() { };
		window.forceHint = function() { };
	} else
		$(document.body).append('<div id="hint" style="display:none;position:absolute;"><div class="arrow up"></div><div class="content"></div></div>');
	updateHintHandlers();
});
})();
/* EINDE HINT -------------- */

$(document.body).on('dragover', function(e) { e.originalEvent.dataTransfer.dropEffect = 'none'; if (e.preventDefault) e.preventDefault(); return false; });
$(document.body).on('drop', function(e) { e = e.originalEvent; if (e.preventDefault) e.preventDefault(); return false; });
$(document.body).keyup(function(e) {
	if (e.keyCode == 8 || e.keyCode == 27)
		return false;
	return true;
});

function createNiveau5oTimeline(niveau5o, timeline_width, timeline_scale) {
	if (niveau5o.afgewerkt)
		var finished_time_dm = niveau5o.afgewerkt.toDate().getTime() / dayMillisecs;
	if (niveau5o.eind)
		var end_time_dm = niveau5o.eind.toDate().getTime() / dayMillisecs;

	if (finished_time_dm && end_time_dm && finished_time_dm > end_time_dm) {
		var start_bar2 = niveau5o.eind;
		var eind_bar2 = niveau5o.afgewerkt;
		var color_bar2 = 'red';
	}

	var now_dm = new Date().getTime() / dayMillisecs;

	return createTimeLine(niveau5o.start, niveau5o.eind, timeline_width, timeline_scale, undefined, start_bar2, eind_bar2, color_bar2, undefined,
		function() {
			if (!end_time_dm)
				return true;
			if (!finished_time_dm)
				return (now_dm > end_time_dm);
			return (finished_time_dm > end_time_dm);
		}
	);
}

function createTimeLine(start, eind, time_w, time_scale, background, start2, eind2, background2, naam, mark_overdue) {
	if (mark_overdue === undefined)
		mark_overdue = ((eind || '0000-00-00') != '0000-00-00' && new Date().getTime() - eind.toDate().getTime() > dayMillisecs);
	else
	if (typeof(_mark_overdue) == "function")
		mark_overdue = mark_overdue(start, eind, start2, eind2);

	time_scale = time_scale || 365;
	naam = naam || naam_looptijd;
	var time_div = create_div().height(10).css({'background': '#eee', 'margin': '2px 0px 0px 0px', 'position': 'relative', 'border': '1px solid white', 'text-align': 'left'});
	var today = new Date().getTime() / dayMillisecs;
	if (mark_overdue)
		time_div.css('background', '#fdd');
	if (time_w)
		time_div.width(time_w);

	function add_bar(start, eind, background) {
		var start_time = start.toDate().getTime() / dayMillisecs;
		var eind_time = eind.toDate().getTime() / dayMillisecs;

		if (start_time < today - time_scale)
			start_time = today-time_scale;
		if (eind_time > today + time_scale)
			eind_time = today+time_scale;

		time_div.append($('<div/>').css({height: '100%', background: background, width: 100 * ((eind_time-start_time) / (time_scale*2)) + '%',
				minWidth:'2px', position: 'absolute', top: '0px', left: 100 * ((start_time-(today-time_scale)) / (time_scale*2)) + '%'}));
	}
	if (start && eind)
		add_bar(start, eind, background || 'darkgray');
	if (start2 != undefined && eind2 !== undefined)
		add_bar(start2, eind2, background2 || 'black');
	time_div.append(create_div().css({height: '100%', background: 'white', width: '2px', position: 'absolute', top: '0px', left: '50%', marginLeft:'-1px'}));

	if (start && eind && start != '0000-00-00' && eind != '5000-12-31')
		time_div.attr('hint', naam+': '+start.sqlToHumanDate() + " - " + eind.sqlToHumanDate());
	else
	if (start && start != '0000-00-00')
		time_div.attr('hint', naam+': vanaf '+start.sqlToHumanDate());
	else
	if (eind && eind != '5000-12-31')
		time_div.attr('hint', naam+': t/m '+eind.sqlToHumanDate());
	return time_div;
}

function createAdvertentieLine(nr, advertentie, start, eind, inschrijvingstart, inschrijvingeind, width) {
	var hint = '';
	var _class = '';
	start = start || '';
	eind = eind || '';
	var now = new Date().isoDateFormat();
	if ((inschrijvingstart || '') == "")
		inschrijvingstart = start;
	else
	if (inschrijvingstart < start)
		inschrijvingstart = start
	if ((inschrijvingeind || '')  == "")
		inschrijvingeind = eind;
	else
	if (inschrijvingeind > eind)
		inschrijvingeind = eind;
	if (advertentie === null) {
		hint = 'Niet gepubliceerd';
		start = eind = inschrijvingstart = inschrijvingeind = '0000-00-00';
	} else
	if (eind < now) {
		hint = 'Publicatie op het internet verlopen<br>'+
			'van '+start.sqlToHumanDate()+' t/m '+eind.sqlToHumanDate() +'<br>'+
			nr +' - '+ advertentie;
		_class = 'inactief';
	} else
	if (start > now) {
		hint = 'Publicatie op het internet staat gepland<br>'+
			'van '+start.sqlToHumanDate()+' t/m '+eind.sqlToHumanDate() +'<br>'+
			nr +' - '+ advertentie;
		_class = 'inactief';
	} else
	if (inschrijvingstart > now) {
		hint = 'Inschrijving op het internet staat gepland voor '+inschrijvingstart.sqlToHumanDate()+'<br>'+
			'Publicatie van '+start.sqlToHumanDate()+' t/m '+eind.sqlToHumanDate() +'<br>'+
			nr +' - '+ advertentie;
		_class = 'actief';
	} else
	if (inschrijvingeind < now) {
		hint = 'Inschrijving op het internet afgerond op '+inschrijvingeind.sqlToHumanDate()+'<br>'+
			'Publicatie van '+start.sqlToHumanDate()+' t/m '+eind.sqlToHumanDate() +'<br>'+
			nr +' - '+ advertentie;
		_class = 'actief';
	} else {
		hint =	'Publicatie op het internet<br>'+
			'van '+start.sqlToHumanDate()+' t/m '+eind.sqlToHumanDate() +'<br>'+
			nr +' - '+ advertentie;
		_class = 'inschrijven';
	}
	return createTimeLine(start, eind, width, 365, '#000',
			inschrijvingstart, inschrijvingeind, '#88f')
		.attr('hint', hint).addClass(_class);
}
function createTargetLine(gebruikt, budget, width, decimals, gebruikttekst, color1, textwidth, extrahint) {
	color1 = color1 || 'gray';
	gebruikttekst = gebruikttekst || 'omzet';
	gebruikt = parseFloat(gebruikt || 0);
	budget = parseFloat(budget || 0);
	decimals = decimals || 0;
	textwidth = textwidth || 50;
	var factor = Math.pow(10,decimals);
	var w1 = 0;
	var color = '';
	var title = '';
	var rest = '';
	if (budget > 0)
		rest = gebruikt/budget;
	width = width || 150;
	if (budget <= 0) {
		color = '#eee';
		rest = '';
		title = 'Geen target, '+gebruikttekst+' '+(gebruikt.toFixed(decimals));
	} else
	if (parseFloat(gebruikt) > parseFloat(budget) * 3.5) {
		var total = parseFloat(gebruikt);
		w1 = Math.round(width * budget / total);
		color = 'gold';
		title += 'Over target '+(gebruikt-budget).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', budget '+(budget).toFixed(decimals)
			;
	} else
	if (parseFloat(gebruikt) > parseFloat(budget) * 2.5) {
		var total = parseFloat(gebruikt);
		w1 = Math.round(width * budget / total);
		color = 'green';
		title += 'Over target '+(budget-gebruikt).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', target '+(budget).toFixed(decimals)
			;
	} else
	if (parseFloat(gebruikt) > parseFloat(budget)) {
		var total = parseFloat(gebruikt);
		w1 = Math.round(width * budget / total);
		color = 'black';
		title += 'Over target '+(budget-gebruikt).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', target '+(budget).toFixed(decimals)
			;
	} else {
		var total = parseFloat(budget);
		w1 = Math.round(width * (parseFloat(gebruikt) / total) * factor) / factor;
		color = 'red';
		title += 'Onder target '+(budget-gebruikt).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', target '+(budget).toFixed(decimals)
			;
	}
	if (extrahint)
		title += extrahint;
	return $('<div/>').attr('hint', title).css({'text-align':'left'})
			.append(create_div(""+(rest == '' ? '' : (rest.toFixed(1)+'').replace('.', ',')+'x'), textwidth)
					.css({ 'margin-right': '5px', 'text-align': 'right', display:'inline-block' }))
			.append(create_div('', width).css('background', color).css({height:'10px','margin-top': '2px', 'border': '1px solid white', display:'inline-block'}).append(
					create_div('', w1).css('background', color1)
						.css('border-right', (w1 > 0 ? 2 : 0)+'px solid white').height(10)));
}
function createBudgetLine(gebruikt, budget, width, decimals, gebruikttekst, color1, textwidth, extrahint, timeFormat) {
	color1 = color1 || 'gray';
	gebruikttekst = gebruikttekst || 'boeking';
	gebruikt = parseFloat(gebruikt || 0);
	budget = parseFloat(budget || 0);
	decimals = decimals || 0;
	textwidth = textwidth || 40;
	var factor = Math.pow(10,decimals);
	var w1 = 0;
	var color = '';
	var title = '';
	var rest = (budget-gebruikt);
	width = width || 150;
	if (budget <= 0) {
		color = '#eee';
		rest = '';
		if (timeFormat == 1) {
			title = 'Geen budget, '+gebruikttekst+' '+ format_min(gebruikt * 60);
		} else {
			title = 'Geen budget, '+gebruikttekst+' '+(gebruikt.toFixed(decimals));
		}
	} else
	if (parseFloat(gebruikt) > parseFloat(budget)) {
		var total = parseFloat(gebruikt);
		w1 = Math.round(100 * budget / total);
		color = 'red';
		if (timeFormat) {
			title += 'Over budget '+ format_min((gebruikt-budget) * 60 ) +
			', '+gebruikttekst+' '+ format_min(gebruikt * 60) +
			', budget '+ format_min(budget * 60);
		} else {
			title += 'Over budget '+(gebruikt-budget).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', budget '+(budget).toFixed(decimals)
			;
		}
	} else
	if (parseFloat(gebruikt) > parseFloat(budget) * 0.8) {
		var total = parseFloat(budget);
		w1 = Math.round(100 * (parseFloat(gebruikt) / total) * factor) / factor;
		color = '#ffb400';
		if (timeFormat == 1) {
			title += 'Restbudget '+ format_min((budget-gebruikt) * 60) +
			', '+gebruikttekst+' '+ format_min(gebruikt * 60) +
			', budget '+ format_min(budget * 60);
		} else {
			title += 'Restbudget '+(budget-gebruikt).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', budget '+(budget).toFixed(decimals)
			;
		}
	} else {
		var total = parseFloat(budget);
		w1 = Math.round(100 * (parseFloat(gebruikt) / total) * factor) / factor;
		color = 'black';
		if (timeFormat == 1) {
			title += 'Restbudget '+ format_min((budget-gebruikt) * 60) +
			', '+gebruikttekst+' '+ format_min(gebruikt * 60) +
			', budget '+ format_min(budget * 60);
		} else {
			title += 'Restbudget '+(budget-gebruikt).toFixed(decimals) +
			', '+gebruikttekst+' '+(gebruikt).toFixed(decimals) +
			', budget '+(budget).toFixed(decimals)
			;
		}
	}
	if (extrahint)
		title += extrahint;

	var calcRest = "";
	if (rest != "") {
		calcRest = (rest.toFixed(decimals)+ '').replace('.', ',');
		if (timeFormat == 1) {
			calcRest = format_min(rest * 60);
		}
	}

	var container = create_div().attr('hint', title).css({'text-align':'left'});
	var text_div = create_div(""+(rest == '' ? '' : calcRest), textwidth).css({ float:'left', textAlign:'right' });
	var bar_div = create_div('').css('background', color).css({height:'10px','margin-top': '2px', 'border': '1px solid white'})
		.append(create_div().css({background:color1, borderRight: (w1 > 0 ? 2 : 0)+'px solid white', width:w1+'%', 'vertical-align': 'top'}).height(10));
	bar_div.css({marginLeft:(textwidth+5)+'px',display:'block'});
	if (width)
		container.width(width+textwidth+5);
	container.append(text_div);
	container.append(bar_div);
	return container;
}

function createPercentGraph(used, total, width, color1, color2) {
	var div = create_div()
		.css({'border':'1px solid gray','overflow':'hidden','border-radius':'50%','position':'relative','background':color2,'box-sizing':'border-box'})
		.css({'background-repeat':'no-repeat'});
	if (width)
		div.width(width).height(width);
	else
		div.css({width:'100%',height:'100%'});

	var percent = 100 * used / total;
	if (percent > 80)
		div.css({'background':color1});
	else
	if (percent > 55) {
		div.css({'background-color':color1});
		div.css({'background-image':'-webkit-linear-gradient(90deg, '+color2+', '+color2+')'})
		div.css({'background-image':'-moz-linear-gradient(90deg, '+color2+', '+color2+')'});
		div.css({'background-size':'50% 50%','background-position':'0% 0%','background-repeat':'no-repeat'});
	} else {
		div.css({'background-image':'-webkit-linear-gradient(90deg, '+color1+', '+color1+')'})
		div.css({'background-image':'-moz-linear-gradient(90deg, '+color1+', '+color1+')'});
		if (percent > 30) {
			div.css({'background-size':'50% 100%','background-position':'100% 0%','background-repeat':'no-repeat'});
		} else {
			div.css({'background-size':'50% 50%','background-position':'100% 0%','background-repeat':'no-repeat'});
		}
	}

	return div;
}

function createUrenLine(used, total, width, color1, color2) {
	used = parseFloat(used || 0);
	var decimals = 0;
	var factor = Math.pow(10,decimals);
	var w1 = 0;
	var title = '';
	var rest = (total-used);
	width = width || 150;
	if (total <= 0)
		w1 = 0;
	else
	if (used > total)
		w1 = width;
	else
		w1 = Math.round(width * (used / total) * factor) / factor;
	var divbar = create_div('', w1).css('background', color1).css('border-right', (w1 > 0 ? 2 : 0)+'px solid white').height(10)
	var div = $('<div/>').attr('hint', title).css({'text-align':'left'})
			.append(create_div('', width).css('background', color2).css({height:'10px','margin-top': '2px', 'border': '1px solid gray',overflow:'hidden'}).append(divbar));
	div.bar = divbar;
	return div;
}

function init_filterinput(filterinput, f, incr_search) {
	var input = filterinput.find('input[type=text]');
	var img = $(top.icons['zoek']).attr('hint', 'Klik hier of druk op enter om te zoeken');
	var x = $('<span class="x">X</span>');
	x.attr('hint', 'Klik hier of druk Esc om te wissen');
	img.get(0).onclick = f;
	img.addClass('e0 center zoekicoon');
	filterinput.prepend(img);
	input.after(x);
	x.addClass('e0 center');
	standard_clicks(filterinput);
	input.focus(function() { $(this).parent().addClass('focused'); $(this).select(); });
	input.blur(function() { $(this).parent().removeClass('focused'); });
	input.change(function() {
		this.value_changed = true;
		if (($(this).val() || '') != '')
			filterinput.addClass('has_value');
		else
			filterinput.removeClass('has_value');
	}).keydown(function(event) {
		var _this = this;
		setTimeout(function() {
			if (($(_this).val() || '') != '')
				filterinput.addClass('has_value');
			else
				filterinput.removeClass('has_value');
		}, 10);
		if (event.keyCode == 13)
			f();
		else
		if (event.keyCode == 27) {
			setTimeout(function() { input.val('').change(); f(); }, 10);
			return false;
		}
	});
	if (incr_search) {
		var timeout = null;
		input.keypress(function() {
			clearTimeout(timeout);
			timeout = setTimeout(function() { f(); }, 100);
		});
	}
	x.get(0).onclick = function() {
		input.val('').change();
		f();
		return false;
	};
}

function createSpeedFilter(div, refresh, add) {
	if (add === undefined)
		add = false;
	div = $(div);
	if (div.length == 0) {
		div = create_div().hide();
		$(document.body).append(div);
	}
	if (div.children().length > 0)
		return;

	var speedfiltercontainer = create_div().addClass('speedfilterinput');
	if (!add)
		speedfiltercontainer.hide();

	var input = $('<input autocomplete="off" id="text" type="text"/>').keydown(function(e) {
			var input = $(this);
			setTimeout(check_has_value, 20);
			if (e.keyCode == 8) {
				if ($('#text').val() == "" && speedfiltercontainer.children('ins:visible').length > 0)
					setTimeout(function() { removeAll(); }, 10);
				return true;
			} else
			if (e.keyCode == 13) {
				$(document).trigger('update_text');
				removeAll();
			} else
			if (e.keyCode == 27) {
				setTimeout(function() { removeAll(); $('#text').val(''); $(document).trigger('update_text');}, 10);
				$(this).blur();
				$(this).focus();
			} else
				return true;
			return false;
		}).change(function() {
			setTimeout(check_has_value, 20);
		}).focus(function() {
			div.addClass('focused');
		}).blur(function() {
			div.removeClass('focused');
		});
	div.append(create_div().append(top.icons['zoek']).addClass('zoekicoon').click(function() {
		$(document).trigger('update_text');
	}).attr('hint','Klik hier of klik op enter om te zoeken'));
	div.append(speedfiltercontainer);
	div.append(input);
	div.append($('<span class="x">X</span>').attr('hint', 'Klik hier of druk op Esc om te wissen').standard_click(function() {
		setTimeout(function() { removeAll(); $('#text').val(''); $(document).trigger('update_text');}, 10);
	}));
	refresh = div.get(0).refresh = refresh || window.update || function() {};

	function check_has_value() {
		if (input.val().trim() != '')
			div.addClass('has_value');
		else
			div.removeClass('has_value');
	}

	var add = div.get(0).add = function(reset_function) {
		var nr = speedfiltercontainer.children('ins').length;
		var speedfilter_ins = $('<ins/>')
			.append('<a/>')
			.append($('<span ref="'+nr+'" style="margin-left:3px;" />').text('x').standard_click(function() { remove(false, $(this).attr('ref')); }))
			.hide();
		speedfilter_ins.get(0).reset = function(block_update) {
			var old_ref = speedfilter_ins.attr('ref');
			speedfilter_ins.attr('ref', '');
			reset_function(block_update, old_ref);
		};
		speedfiltercontainer.append(speedfilter_ins);
		return speedfilter_ins;
	};
	var remove = div.get(0).remove = function(block_update, nr) {
		if (typeof(nr) == "object")
			nr = speedfiltercontainer.children('ins').index(nr);
		nr = nr || 0;
		var ins = speedfiltercontainer.children('ins').eq(nr);
		if (ins.length == 0)
			return;
		try {
			if (ins.get(0).removing)
				return;
			ins.get(0).removing = true;
			if (ins.css('display') != 'none') {
				ins.get(0).reset(block_update || false);
				ins.hide();
				if (!block_update)
					ins.trigger('speedfilter_change');
			}
			ins.attr('ref','');
		} finally {
			ins.get(0).removing = false;
		}
	};
	var removeAll = div.get(0).removeAll = function(f) {
		setTimeout(function() {
			speedfiltercontainer.children('ins').hide().each(function(i,e) { e.reset(true); });
			//speedfiltercontainer.children('ins').trigger('speedfilter_change');
			//align();
			if (f)
				f();
			else
				refresh();
			check_has_value();
		});
	};
	var update = div.get(0).update = function(filter, nr, id) {
		if (typeof(nr) == "object")
			nr = speedfiltercontainer.children('ins').index(nr);
		nr = nr || 0;
		var ins = speedfiltercontainer.children('ins').eq(nr);
		if (filter === false) {
			if (ins.css('display') != 'none') {
				ins.get(0).reset(true);
				ins.hide().trigger('speedfilter_change');
			}
			ins.attr('ref', '');
		} else {
			// Was al zichtbaar (dus actief) en is hetzelfde filter, dan niets doen.
			if (ins.css('display') != 'none' && id !== undefined && id == ins.attr('ref'))
				return;
			ins.attr('text', filter);
			ins.attr('ref', id || '');
			filter = filter || '';
			if (filter.length > 18)
				filter = filter.substr(0,17)+'..';
			ins.css('display', 'inline-block').children('a').text(filter);
			ins.trigger('speedfilter_change');
		}
	};

	return div.get(0);
}

$(window).on('resize', function() {
	updateHintHandlers();
});
$(document).ready(function() { schedule_resize(); });
function createUploadIn(div, target, name, completefunction, getparams) {
	div = $(div);
	name = name || 'upload';
	var rndname = 'iframe'+(new Date().getTime())+Math.random();
	var form = $('<form method="POST" enctype="multipart/form-data" target="'+rndname+'" action="'+target+'" style="display:block;position:absolute;left:0px;bottom:0px"></form>');
	var wait = create_div().append(wait_icon).css({'margin':'-3px 2px','display':'none'});
	var input = $('<input type="file" '+(/\[\]$/.test(name) ? ' multiple="multiple" ' : '')+' name="'+name+'" style="right:0px;top:0px;opacity:0;filter:alpha(0);position:absolute;cursor:pointer;"/>');
	$(document.body).append(form);
	$(document.body).append('<iframe style="display:none" src="about:blank" name="'+rndname+'"></iframe>');
	div.append(input);
	div.append(wait);

	function reset_input() {
		form.append(input);
		form.get(0).reset();
		div.append(input);
	}

	window['funccomplete_'+rndname] = function(data) {
		wait.hide();
		reset_input();
		form.empty();
		input.hide();
		if (completefunction)
			completefunction(data == undefined ? undefined : data);
	}

	function uploadMouseOver(e) {
		input.show();
		var a = this;
		var e = e || window.event;
		var offset = $(a).offset();
		var right = parseInt($(a).width() - (e.clientX - offset.left) - 30);
		var top = '-1px';//parseInt(e.clientY - a.offsetTop - input.offsetHeight/2);
		input.get(0).style.right = right+'px';
		input.get(0).style.top = top+'px';
	}
	function uploadMouseLeave(e) {
		input.hide();
	}
	div.on('mouseover', uploadMouseOver);
	div.on('dragover', uploadMouseOver);
	div.on('dragleave', uploadMouseLeave);
	div.on('mouseleave', uploadMouseLeave);
	input.on('change', function() {
		if (!target) {
			completefunction(input.get(0));
			return;
		}
		form.empty();
		var params = {};
		if (getparams)
			params = getparams();
		if (params === false) {
			reset_input();
			return;
		}
		params['MAGIC'] = top.MAGIC;
		params['output_format'] = "iframe_html";
		for (var n in params) {
			var param_input = $('<input type="hidden" />');
			param_input.attr('name', n).val(params[n])
			form.append(param_input);
		}
		form.append(input);
		form.submit();
		wait.css('display','inline-block');
	});
	var position = div.css('position');
	if (position != 'relative' && position != 'absolute')
		div.css('position', 'relative');
	div.css('overflow', 'hidden');

	return input;
}

/** @brief  Object for retrieving type information based on MIME-type and extension */
var document_info = {
	/** @brief gets the image, type and extension information. */
	getIconDetails: function(type, _extension) {
		var image = top.icons['default_image'];
		var extension = (_extension || '').toLowerCase();
		for (var i in this.extmap) {
			if (this.extmap[i]['extensions'][extension] !== undefined) {
				return {
					image: top.icons['file/'+this.extmap[i]['extensions'][extension]] || image,
					type: extmap_extension_category[i] || naam_onbekend.toLowerCase(),
					extension: extension
				};
			}
			if (this.extmap[i]['types'][type] !== undefined) {
				return {
					image: top.icons['file/'+this.extmap[i]['types'][type]] || image,
					type: extmap_extension_category[i] || naam_onbekend.toLowerCase(),
					extension: extension
				};
			}
		}
		return {
			image: image,
			type: naam_onbekend.toLowerCase(),
			extension: naam_onbekend.toLowerCase()
		}
	},

	/** @brief gets the image */
	getIcon: function(type, _extension) {
		return this.getIconDetails(type, _extension).image;
	},

	/** @brief gets the hint */
	getIconHint: function(type, _extension) {
		var details = this.getIconDetails(type, _extension);
		return create_div().append(
				create_span(naam_type),
				': ',
				create_span(details.type),
				'<br/>',
				create_span(naam_extensie),
				': ',
				create_span(details.extension)
			).html();
	},

	/* Actual mapping table */
	extmap: {
		afbeelding: {
			extensions: {
				'gif': 'gif',
				'jpg': 'jpg',
				'png': 'png',
				'psd': 'psd'
			},
			types: {
				'image/gif': 'gif',
				'image/jpeg': 'jpg',
				'image/png': 'png'
			}
		},
		audio: {
			extensions: {
				'mp3': 'mp3',
				'mp4': 'mp4',
				'mov': 'mp4',
				'wmv': 'mp4'
			},
			types: {}
		},
		memo: {
			extensions: {},
			types: {
				'ez2xs/taakvoortgang': 'ez2xs_taakvoortgang',
				'ez2xs/memo': 'ez2xs_memo'
			}
		},
		sms: {
			extensions: {},
			types: {
				'ez2xs/sms': 'ez2xs_sms'
			}
		},
		database: {
			extensions: {
				'mdb': 'm_mdb',
				'mdbx': 'm_mdbx'
			},
			types: {}
		},
		document: {
			extensions: {
				'doc': 'm_doc',
				'docx': 'm_docx',
				'indd': 'indd',
				'mpp': 'm_mpp',
				'mppx': 'm_mppx',
				'one': 'm_one',
				'onex': 'm_onex',
				'rtf': 'm_doc',
				'epub': 'm_epub'
			},
			types: {
				'application/msword': 'm_doc',
				'application/onenote': 'm_one',
				'application/rtf': 'm_doc',
				'application/vnd.oasis.opendocument.text': 'l_doc',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'm_doc',
				'document': 'g_doc',
				'text/rtf': 'm_doc'
			}
		},
		email: {
			extensions: {
				'eml': 'm_emlx',
				'msg': 'm_emlx'
			},
			types: {}
		},
		formulier: {
			extensions: {},
			types: {
				'ez2xs/vragenlijst': 'ez2xs_vragenlijst'
			}
		},
		illustratie: {
			extensions: {
				'ai': 'ai',
				'dwg': 'dwg',
				'vsd': 'm_vsd',
				'vsdx': 'm_vsdx'
			},
			types: {}
		},
		ingepakt_bestand: {
			extensions: {
				'zip': 'zip',
				'rar': 'zip',
				'arj': 'zip',
				'lzo': 'zip',
				'iso': 'iso'
			},
			types: {}
		},
		pdf: {
			extensions: {
				'pdf': 'pdf'
			},
			types: {
				'application/pdf': 'pdf',
				'pdf': 'pdf'
			}
		},
		presentatie: {
			extensions: {
				'ppt': 'm_ppt',
				'pptx': 'm_pptx'
			},
			types: {
				'application/vnd.mspowerpoint': 'm_ppt',
				'application/vnd.oasis.opendocument.presentation': 'l_ppt',
				'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'm_ppt',
				'presentation': 'g_ppt'
			}
		},
		rapport: {
			extensions: {},
			types: {
				'text/html': 'rpt',
				'text/troff': 'rpt'
			}
		},
		spreadsheet: {
			extensions: {
				'csv': 'm_xls',
				'xls': 'm_xls',
				'xlsb': 'm_xls',
				'xlsm': 'm_xls',
				'xlsx': 'm_xlsx'
			},
			types: {
				'application/vnd.msexcel': 'm_xls',
				'application/vnd.ms-excel': 'm_xls',
				'application/vnd.oasis.opendocument.spreadsheet': 'l_xls',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'm_xls',
				'spreadsheet': 'g_xls'
			}
		}
	}
};

function create_zoek_niveau4(div, searchfunction, contextfunction, defaulttext) {
	if (div.length == 0)
		return div;
	defaulttext = defaulttext || naam_selecteer.sprintf(window.niveau['4'][0]);
	if (typeof(searchfunction) == "string") {
		var api = searchfunction;
		searchfunction = function(val, f) {
			if (typeof(contextfunction) == "function")
				context = contextfunction(div, val);
			else
			if (typeof(contextfunction) == "object") {
				context = contextfunction;
				context.filter = val;
			} else
				context = {};
			callserver(api, context, function(data) {
				data = data.niveau4 || [];
				data.unshift( { id: "", naam: defaulttext } );
				f(data);
			});
		}
	} else
	if (typeof(searchfunction) != "function")
		searchfunction = function(val, f) { f({}); };

	create_zoek_opties([{ id: "", naam: defaulttext }], div, {
		searchfunction: searchfunction,
		filter: function() { },
		min_width: '450',
		has_x: true
	}).on('select', function(event, optie) {
		if (!optie || $(this).val() == "")
			return;
		var data = optie.data || optie;
		data.naam = data.naam || '';
		if(data.niveau4datumeind > '0000-00-00' && data.niveau4datumeind < '5000-12-31'){
			$(this).addClass('verwijderd');
		}
		else
			$(this).removeClass('verwijderd');

		var niveau4_naam = createDebiteurNrDiv(data.naam, data.debiteurnr, data.betaalgedrag);
		$(this).children().children('div').eq(0).empty()
			.append($('<li/>').css({'display':'inline','list-style':'none'})
				.append(niveau4_naam.addClass('niveau4 big').css({'margin-right':'0px','display':'inline'}))
				.append(create_div(data.plaats ? ', '+data.plaats : ' ').addClass('niveau4 big').css('display', 'inline'))
				.append(data.niveau4soorten ? create_div(data.niveau4soorten).addClass('documentclass').css('display', 'inline') : "")
			);

	}).on('append', function(event, li, optie) {
		if (!optie)
			return;
		var data = optie.data || optie;
		data.naam = data.naam || '';
		var niveau4_naam = createDebiteurNrDiv(data.naam, data.debiteurnr, data.betaalgedrag);
		li.children('a').addClass('row force m').empty()
			.append(create_ellipsis_div().addClass('e100')
				.append(niveau4_naam.addClass('niveau4 big').css({'margin-right':'0px'}))
				.append(create_span(data.plaats ? ', '+data.plaats : ' ').addClass('niveau4 big'))
				.append(data.niveau4soorten ? create_div(data.niveau4soorten).addClass('documentclass') : "")
			);
	});
	return div;
}

function create_zoek_niveau9(div, searchfunction, contextfunction, defaulttext) {
	if (div.length == 0)
		return div;
	defaulttext = defaulttext || (div.attr('readonly') ? '' : naam_selecteer.sprintf(window.niveau['9'][0]));
	if (typeof(searchfunction) == "string") {
		var api = searchfunction;
		searchfunction = function(val, f) {
			if (typeof(contextfunction) == "function")
				context = contextfunction(div, val);
			else
			if (typeof(contextfunction) == "object") {
				context = contextfunction;
				context.filter = val;
			} else
				context = {};
			callserver(api, context, function(data) {
				data = data.niveau9 || [];
				data.unshift( { id: "", naam: defaulttext } );
				f(data);
			});
		}
	} else
	if (typeof(searchfunction) != "function")
		searchfunction = function(val, f) { f({}); };
	create_zoek_opties([{ id: "", naam: defaulttext }], div, {
		searchfunction: searchfunction,
		filter: function() { },
		min_width: '400',
		has_x: true
	}).on('append', function(event, li, optie) {
		if (!optie)
			return;
		var data = optie.data || optie;
		var div = li.children('a');
		div.empty()
			.append(data.vertrokken == "1" ? create_div("Vertrokken").addClass('vertrokken') : "")
			.append(data.overledenper ? create_div(window.naam_overleden).addClass('overleden') : "")
			.append(create_div(data.naam).addClass('niveau9 big'))
			;
	}).on('select', function(event, optie) {
		var data = optie.data || optie;
		if(data.overledenper)
			$(this).children('div').eq(0).addClass('row force m').prepend(create_div(window.naam_overleden).addClass('overleden e0 center'));
		if(data.niveau9datumeind > '0000-00-00' && data.niveau9datumeind < '5000-12-31')
			$(this).addClass('verwijderd');
		else
			$(this).removeClass('verwijderd');
	});
	div.get(0).popup.find('input').after(
		create_label(naam_show_all_niveau9, undefined, '').prepend(
			create_input("checkbox").click(function() {
				div.get(0).search(true);
			})
		)
	);
	return div;
}

function create_zoek_niveau5(div, searchfunction, contextfunction, defaulttext) {
	div = $(div);
	if (div.length == 0)
		return $();
	var toonalleniveau5 = create_input("checkbox");
	defaulttext = defaulttext || naam_selecteer.sprintf(window.niveau['5'][0]);
	if (typeof(searchfunction) == "string") {
		var api = searchfunction;
		searchfunction = function(val, f) {
			if (typeof(contextfunction) == "function")
				context = contextfunction(div, val);
			else
			if (typeof(contextfunction) == "object") {
				context = contextfunction;
				context.filter = val;
			} else
				context = {};
			context.toonalleniveau5 = toonalleniveau5.checked() ? 1 : 0;
			callserver(api, context, function(data) {
				data = data.niveau5 || [];
				data.unshift( { id: "", naam: defaulttext } );
				f(data);
			});
		}
	} else
	if (typeof(searchfunction) != "function")
		searchfunction = function(val, f) { f({}); };
	create_zoek_opties([{ id: "", naam: defaulttext }], div, {
		searchfunction: searchfunction,
		filter: function() { },
		min_width: '400',
		has_x: true
	}).on('select', function(event, optie) {
		if (!optie)
			return;
		var data = optie.data || optie;
		if (!optie.id && !optie.rel)
			return;
		$(this).children().children('div').eq(0).empty()
			.append($('<li/>').css({'display':'inline','list-style':'none'})
				.append(createNiveau5Div(data.nr, data.soort, data.code).addClass('niveau5').css('display', 'inline'))
				.append(data.status == "0" ? "" : create_span(data.statusnaam || '').addClass('documentclass').css('display', 'inline'))
				.append(data.workflow ? create_span(data.workflow).addClass('workflow').css('display', 'inline') : '')
				.append(createDebiteurNrDiv(data.niveau4, data.niveau4debiteurnr, data.niveau4betaalgedrag).css('display', 'inline'))
			);
	}).on('append', function(event, li, optie) {
		if (!optie)
			return;
		var data = optie.data || optie;
		if (!optie.id && !optie.rel)
			return;
		var div = li.children('a');
		div.empty()
			.append(createNiveau5Div(data.nr, data.soort, data.code).addClass('niveau5').css('display', 'inline'))
			.append(data.status == "0" ? "" : create_div(data.statusnaam || '').addClass('documentclass'))
			.append(data.workflow ? create_span(data.workflow).addClass('workflow').css('display', 'inline') : '')
			.append(createDebiteurNrDiv(data.niveau4, data.niveau4debiteurnr, data.niveau4betaalgedrag).css('display', 'inline'))
			;
	});

	div.get(0).popup.find('input').after(
		create_label(naam_show_all_niveau5, undefined, '').prepend(
			toonalleniveau5.click(function() {
				div.get(0).search(true);
			})
		)
	);
	return div;
}

function create_top_filters(div, zoekniveau4api) {
	div = $(div);
	var select_refniveau4 = div.find('[rel=refniveau4]');
	create_zoek_niveau4(select_refniveau4, zoekniveau4api, function(select, val){
		return {
			idniveau9: div.find('[rel=refniveau9]').val(),
			idniveau5: div.find('[rel=refniveau5]').val(),
			privecontext: div.attr('privecontext') || window.privecontext || 0,
			filter: val
		};
	});
	select_refniveau4.on('change', function () {
		var idniveau4 = div.find('[rel=refniveau4]').val();
		var idniveau9 = div.find('[rel=refniveau9]').val();
		var idniveau5 = div.find('[rel=refniveau5]').val();
		var privecontext = div.attr('privecontext') || window.privecontext || 0;
		if (div.get(0).InVulProcedure)
			return;
		callserver(zoekniveau4api, { privecontext: privecontext, idniveau4: idniveau4, idniveau5: idniveau5, idniveau9: idniveau9 }, function(data) {
			div.find('[rel=refniveau4]').attr('hint', (data.niveau4tel ? data.niveau4tel+" - " : "") + naam_dubbelklik_om_te_openen);
			fill_top_filters(div, data, idniveau4, idniveau9, idniveau5);
		});
	}).on('standard_dblclick', function() {
		if (top.hasRecht('relatiebeheer', 1) && window.editRelatie && $(this).val())
			editRelatie($(this).val());
	}).on('standard_longclick', function() {
		$(this).trigger('standard_dblclick');
	});

	var select_refniveau5 = div.find('[rel=refniveau5]');
	select_refniveau5.on('standard_dblclick', function() {
		if (top.hasRecht('project', 1) && window.editProject && $(this).val())
			editProject($(this).val());
	}).on('standard_longclick', function() {
		$(this).trigger('standard_dblclick');
	});
	create_zoek_niveau5(select_refniveau5, zoekniveau4api, function(select, val) {
		var checkbox = select_refniveau5.get(0).popup.find('input[type=checkbox]');
		return {
			refniveau4: div.find('[rel=refniveau4]').val(),
			refniveau9: div.find('[rel=refniveau9]').val(),
			privecontext: div.attr('privecontext') || window.privecontext || 0,
			toonafgewerkt: (checkbox.length > 0 && checkbox.is(':checked')) ? 1 : 0,
			filter: val
		};
	}).on('change', function() {
		var idniveau4 = div.find('[rel=refniveau4]').val();
		var idniveau9 = div.find('[rel=refniveau9]').val();
		var idniveau5 = div.find('[rel=refniveau5]').val();
		if (div.get(0).InVulProcedure)
			return;
		callserver(zoekniveau4api, { privecontext: privecontext, idniveau4: idniveau4, idniveau5: idniveau5, idniveau9: idniveau9 }, function(data) {
			fill_top_filters(div, data, idniveau4, idniveau9, idniveau5);
			fillSelectMap(div.find('[rel="reftag"]'), data.tags);
		});
	});

	var divniveau9 = div.find('[rel=refniveau9]');
	create_zoek_niveau9(divniveau9, zoekniveau4api, function(select, val){
		var checkbox = divniveau9.get(0).popup.find('input[type=checkbox]');
		return {
			idniveau4:  checkbox.is(':checked') ? 0 : div.find('[rel=refniveau4]').val(),
			privecontext: div.attr('privecontext') || window.privecontext || 0,
			filter: val
		};
	}).on('change', function() {
		div.find('[rel=refniveau9]').attr('forcehint', '');
		div.find('.foto').attr('src', '/images/contactpersoon.png');
	}).standard_dblclick(function() {
		if (top.hasRecht('relatiebeheer', 1) && window.contactpersoonio && $(this).val())
			viewEditFunction($(this).val(), contactpersoonio);
	}).standard_longclick(function() {
		$(this).trigger('standard_dblclick');
	}).on('change', function () {
		var idniveau4 = div.find('[rel=refniveau4]').val();
		var idniveau9 = div.find('[rel=refniveau9]').val();
		var idniveau5 = div.find('[rel=refniveau5]').val();
		var privecontext = div.attr('privecontext') || window.privecontext || 0;
		if (div.get(0).InVulProcedure)
			return;
		callserver(zoekniveau4api, { privecontext: privecontext, idniveau4: idniveau4, idniveau9: idniveau9, idniveau5: idniveau5 }, function(data) {
			div.find('[rel=refniveau4]').attr('hint', (data.niveau4tel ? data.niveau4tel+" - " : "") + naam_dubbelklik_om_te_openen);
			fill_top_filters(div, data, idniveau4, idniveau9, idniveau5);
		});
	});

	var divtaak = div.find('[rel=reftaak]');
	if (divtaak.get(0)) {
		create_zoek_opties([{ id: "", naam: 'Selecteer taak' }], divtaak, {
			searchfunction: function(val, f) {
				var idniveau4 = parseInt(div.find('[rel=refniveau4]').val() || 0);
				var checkbox = divtaak.get(0).popup.find('input[type=checkbox]');
				callserver("api.taken.getTaken", {
					status: !idniveau4 && val == "" ? 10 : checkbox.is(':checked') ? -1 : 0,
					text: val,
					refmedewerkers: -1,
					refniveau4: (checkbox.is(':checked') ? 0 : idniveau4),
					sort: 'datum_desc'
				}, function(data) {
					var result = [ { id: "", naam: 'Selecteer taak' } ];
					if (data.list.length > 0) {
						for (var i in data.list) {
							var item = data.list[i];
							result.push({ id: item.id, naam: (top.interface_options['toon_taak_nummer'] ? item.nr : '') + ' ' + item.naam + ' '+
									(parseInt(item.refmedewerkers || 0) > 0 ? (item.eind || '').sqlToHumanDate() : ''), data: item });
						}
					}
					f(result);
				});
			},
			filter: function() {
			},
			has_x: true,
			min_width:'600'
		});
		divtaak.get(0).popup.find('input').after(
			create_label(naam_show_all_taak, undefined, '').prepend(
				create_input("checkbox").click(function() {
					divtaak.get(0).search(true);
				})
			)
		);
		divtaak.on('append', function(event, li, optie) {
			if (!optie || !optie.id)
				return;
			var text = li.children('a').text();
			li.children('a').empty()
				.append(create_div(text). addClass('taak big'));
		});
		divtaak.on('select', function() {
			if (parseInt(divtaak.val() || 0) > 0)
				setTimeout(function() { divtaak.attr('hint', divtaak.attr('text') + " - " + naam_dubbelklik_om_te_openen) }, 10);
		});
		divtaak.on('standard_dblclick', function() {
			if (window.editTaak && $(this).val())
				editTaak($(this).val());
		}).on('standard_longclick', function() {
			$(this).trigger('standard_dblclick');
		}).attr('forcehint', 'Taak');
	}
	div.get(0)._filled_top_filters = {};
}

function fill_top_filters(div, data, idniveau4, idniveau9, idniveau5, reftag, iddocumentclass, idtaak) {
	div = $(div);
	div.get(0)._filled_top_filters = data || {};
	div.get(0).InVulProcedure = true;
	var select_refniveau9 = div.find('[rel=refniveau9]');

	if (!data.niveau4)
		data.niveau4 = [];
	if (!data.niveau9)
		data.niveau9 = [];
	if (!data.niveau5)
		data.niveau5 = [];

	if (parseInt(idniveau4 || 0)) {
		if (parseInt(idniveau4 || 0)) {
			if (arrayIdIndexOf(data.niveau4, idniveau4) < 0)
				data.niveau4.push({ id: parseInt(idniveau4 || 0), naam: data.niveau4naam || '??' });
		}
		div.find('[rel=refniveau4]').attr('value', idniveau4); // Blokkeren onchange
		fillSelect(div.find('[rel=refniveau4]'), data.niveau4, naam_selecteer.sprintf(window.niveau['4'][0]));
		div.find('[rel=refniveau4]').val(idniveau4);
		div.find('[rel=refniveau4]').attr('forcehint', (data.niveau4tel ? data.niveau4tel+" - " : "") + naam_dubbelklik_om_te_openen);
		var divtaak = div.find('[rel=reftaak]');
		if (divtaak.length > 0 && !parseInt(divtaak.val() || 0) && divtaak.get(0).search)
			divtaak.get(0).search(true);
	} else {
		fillSelect(div.find('[rel=refniveau4]'), data.niveau4, naam_selecteer.sprintf(window.niveau['4'][0])).val('');
	}
	if (parseInt(idniveau5 || 0)) {
		if (parseInt(idniveau5 || 0) && arrayIdIndexOf(data.niveau5, parseInt(idniveau5 || 0)) < 0)
			data.niveau5.push({ id: parseInt(idniveau5 || 0), naam: data.niveau5naam || '??' });
		div.find('[rel=refniveau5]').attr('value', idniveau5); // Blokkeren onchange
		fillSelect(div.find('[rel=refniveau5]'), data.niveau5, naam_selecteer.sprintf(window.niveau['5'][0]));
		div.find('[rel=refniveau5]').val(idniveau5);
	} else
		fillSelect(div.find('[rel=refniveau5]'), data.niveau5, naam_selecteer.sprintf(window.niveau['5'][0])).val('');
	if (parseInt(idniveau9 || 0)) {
		select_refniveau9.val(idniveau9);
		div.find('[rel=refniveau9]').attr('forcehint', (data.niveau9tel ? data.niveau9tel+" - " : "") + naam_dubbelklik_om_te_openen);
		div.find('[rel=refniveau9]').attr('value', idniveau9); // Blokkeren onchange
		fillSelect(select_refniveau9, data.niveau9, naam_selecteer.sprintf(window.niveau['9'][0]), 'naam');
		div.find('[rel=refniveau9]').val(idniveau9);

	} else {
		fillSelect(select_refniveau9, data.niveau9, select_refniveau9.attr('readonly') ? '' : naam_selecteer.sprintf(window.niveau['9'][0]), 'naam').val('');
		div.find('[rel=refniveau9]').attr('forcehint', ' ');
	}

	var foto_elem = div.find('.foto');
	if (foto_elem.length > 0) {
		var foto_src = '/images/contactpersoon.png';
		if (parseInt(idniveau9 || 0))
			foto_src = data.niveau9foto || '/images/contactpersoon.png';
		else
		if (parseInt(idniveau4 || 0))
			foto_src = data.niveau4foto || '/images/niveau4.png';
		else
		if (parseInt(idniveau5 || 0))
			foto_src = data.niveau5foto || '/images/niveau4.png';
		else
			foto_src = '/images/contactpersoon.png';
		foto_elem.attr('src', foto_src);
	}
	var foto_elem = div.find('.niveau4foto');
	if (foto_elem.length > 0) {
		var foto_src = '/images/niveau4.png';
		if (parseInt(idniveau4 || 0))
			foto_src = data.niveau4foto || '/images/niveau4.png';
		else
		if (parseInt(idniveau5 || 0))
			foto_src = data.niveau5foto || '/images/niveau4.png';
		else
			foto_src = '/images/niveau4.png';
		foto_elem.attr('src', foto_src);
	}

	fillSelectMap(div.find('[rel="reftag"]'), data.tags);
	div.find('[rel=reftag]').val(reftag || 0);
	div.trigger('filled_top_filters', [ data, idniveau4, idniveau9, idniveau5 ]);
	div.get(0).InVulProcedure = false;
}

function wisselAlternatiefImg(div) {
	var img = $(div).closest('.io_logo').find('img[rel=foto]');
	var val = img.attr('src');
	if (val == img.attr('data-oud'))
		img.attr('src', img.attr('data-nieuw'));
	else
		img.attr('src', img.attr('data-oud'));
}
function wisselAlternatief(div) {
	var input = $(div).prev();
	var val = input.val();
	if (val == input.attr('data-oud'))
		input.val(input.attr('data-nieuw'));
	else
		input.val(input.attr('data-oud'));
	input.trigger('change');
}

function addWisselAlternatiefFoto(input, newval, use_val) {
	var container = input.closest('.io_logo');
	var wissel_icon = container.find('.img_actions>.switch_img');

	wissel_icon.css('display', 'none');
	input.removeAttr('data-oud');
	input.removeAttr('data-nieuw');

	if (!/^(http|https|data):/.test(newval))
		return;

	// No old picture, do nothing.
	if (/about:blank/.test(newval))
		return;

	if (use_val)
		changeImage(input.parent(), newval);

	// No old picture, no need for switching.
	var oud = input.attr('src');
	if (/about:blank/.test(oud))
		return;

	input.attr('data-oud',oud);
	input.attr('data-nieuw',newval);

	wissel_icon.css('display', '');
}

function addWisselAlternatief(input, newval, use_val) {
	if (input.is('[type="checkbox"],[type="radio"]'))
		return;
	if (newval === undefined || newval === null)
		newval = "";
	newval = newval+"";
	if (use_val === undefined)
		use_val = 1;
	input = $(input);
	if (input.is('img[rel=foto]'))
		return addWisselAlternatiefFoto(input, newval, use_val);
	if (input.is('img,[type=checkbox],[type=radio]'))
		return;
	if (input.is('[format=date]'))
		newval = newval.sqlToHumanDate();
	var this_val = input.val();
	if (input.is('div')) {
		if (this_val == "0")
			this_val = "";
		if (newval == "0")
			newval = "";
	}
	if (newval != '' && (input.val() || '').toLowerCase() != newval.toLowerCase()) {
		var is_controlwrap = input.parent().is('label.controlwrap');
		input.attr('hint', 'Nu: '+create_div(newval).html()+'<br>Was: '+create_div(input.val()).html());
		input.attr('data-oud', input.val());
		input.attr('data-nieuw', newval);
		input.after(
			create_span().addClass("wisselalternatief center").html(top.icons['wisselalternatief'])
				.attr('hint', "Klik om te schakelen tussen oud en nieuw")
				.standard_click(function() {
					wisselAlternatief(this);
				})
		);

		if (use_val || !input.val())
			input.val(newval);
		input.addClass('highlight_changed');
		if (is_controlwrap)
			input.parent().addClass('highlight_changed');
	}
}
function fillWisselTelefoon(div, type, value, is_bestaand) {
	var field = null;
	div = $(div);
	div.find('[rel$=".refteltype"]').each(function(i,e) {
		if ($(e).val() == type)
			field = $(e).parents('a').eq(0);
	});
	if (value == '')
		return;
	var input;
	if (!field)
		input = addContactLine(div, { id: --window.temp_id, refteltype: type, naam: '' }, 'cominfo').find('input[rel$=naam]');
	else
		input = field.find('input[rel$=naam]');
	if (is_bestaand)
		addWisselAlternatief(input, value, 1);
	else
		input.val(value);
}
function project_create_markblok(facturabel, salesstatus, status) {
	facturabel = parseInt(facturabel || 0);
	status = parseInt(status || -2);
	salesstatus = parseInt(salesstatus || 3);
	var blok = $('<div class="markblok"></div>').addClass('status');
	var blokwrapper = $('<div class="blokwrapper"></div>');
	blokwrapper.append(blok);
	if (salesstatus == 1)
		blok.addClass('lead').attr('hint', 'Lead');
	else
	if (salesstatus == 2)
		blok.addClass('offerte').attr('hint', 'Offerte');
	else
	if (facturabel)
		blok.addClass('actief').attr('hint', 'Facturabel');
	else
		blok.attr('hint', 'Niet facturabel');
	return blokwrapper;
}

function create_shareblock() {
	return $('<div class="share_icon"><div class="head"></div><div></div></div>');
}

function create_kandidaatstatus_blok(type, showhint) {
	if (showhint === undefined)
		showhint = true;
	var markblok = create_div().html(top.icons['play']);
	var div = create_div().addClass('blokwrapper');
	var _class = 'shared selection';
	var hint = "Lopend";
	if (type == "6" || type == "7" || type == "8" || type == "9") {
		_class='predefined';
		hint = "Automatisch";
	} else
	if (type == "5") {
		_class='automatisch';
		hint = "Automatisch";
	} else
	if (type == "4") {
		_class='afgerond';
		hint = "Afgerond";
		markblok.html(top.icons['stop']);
	} else
	if (type == "3") {
		_class='geplaatst';
		hint = "Geplaatst";
		markblok.html(top.icons['stop']);
	} else
	if (type == "2") {
		_class='nietgeplaatst';
		hint = "Niet geplaatst";
		markblok.html(top.icons['stop']);
	} else
	if (type == "1") {
		_class='aanmelding';
		hint = "Aanmelding";
	}
	div.append(markblok);
	markblok.addClass('markblok_kandidaatstatus').addClass(_class);
	if (showhint)
		$(markblok).parent().attr('hint', hint);
	return div;
}

function periode_of(datumtijd) {
	if (!datumtijd)
		return window.naam_onbekend;

	var tekst = window.naam_eerder;

	var datum = datumtijd.toDate().isoDateFormat().toDate();
	var now = new Date().isoDateFormat().toDate();

	var begin_week = now.begin_week();

	var diff_now = Math.round((now.getTime()-datum.getTime()) / dayMillisecs);

	if (diff_now < 0)
		tekst = window.naam_toekomst;
	else
	if (diff_now == 0)
		tekst = window.naam_vandaag;
	else
	if (diff_now == 1)
		tekst = window.naam_gisteren;
	else {
		var diff_week = Math.round((begin_week.getTime()-datum.getTime()) / dayMillisecs);
		if (diff_week <= 0)
			tekst = window.namen_dagen_long[(datum.getDay()+6) % 7];
		else
		if (diff_week <= 7)
			tekst = window.naam_vorige_week;
		else
		if (diff_week <= 14)
			tekst = window.naam_2_weken_geleden;
	}
	return tekst.firstUpper();
}

function addDate(input, diff) {
	input = $(input);
	var date = (input.val() || '').toDate();
	date = date.add(diff);
	input.val(date.humanDateFormat()).change();
}
function createTabs(tab) {
	// Sanity check
	if (!tab.parent().hasClass('tab_view') || tab.parents('.list_view').length == 0)
		return null;

	var tabs = tab.parent().children().not('.filler').not('.minimize');

	// Geen tab geselecteerd? Dan nemen we deze maar
	if (!tab.is('.selected')) {
		if (tab.parent().children().filter('.selected').length == 0)
			tab.addClass('selected');
		else
			return null;
	}
	// Geen dubbele selecties.
	tabs.not(tab).removeClass('selected');

	var activeElement = document.activeElement;
	// Opzij zetten controls om events te bewaren
	var td = tab.parents(".list_view").eq(0);
	var id_elements = td.find('[id]').not(tab.parent().children('div'));
	id_elements.each(function(i,e) {
		if ($(e).parents().filter(td).length > 0)
			$('#hidden_container').append(e);
	});
	$('#hidden_container').append(td.find('.filter_container'));
	$('#hidden_container').append(td.find('input'));

	// Kopieer de tabs
	var list_view = createView( undefined, '' );
	tabs.each(function(i,e) {
		list_view.header.append(createTab($(e)).text($(e).attr('defaulttext')));
	});
	list_view.header.append(create_div("").addClass('filler'));
	list_view.header.removeClass('header_view').addClass('tab_view');
	if (!window.iScroll) {
		var ul = td.children('ul').children('li').children('ul');
		if (ul.get(0))
			list_view.scrollTop = ul.get(0).scrollTop;
	}

	td.empty().append(list_view);
	schedule_resize();

	if (activeElement) {
		setTimeout(function() {
		$(activeElement).focus();
		}, 10);
	}

	return list_view;
}

function create_filter_type_historie(select_type_historie, f) {
	f = f || function() { };
	if (!select_type_historie) {
		select_type_historie = $('#select_document_type');
		if (select_type_historie.length == 0) {
			select_type_historie = create_div().attr('id', 'select_document_type').addClass('periode');
			$('#hidden_container').append(select_type_historie);
		}
	}
	create_zoek_opties([
		{ rel: '', naam: window.niveau[8][0].firstUpper() },
		{ rel: 'email', naam: 'Email' },
		{ rel: 'document', naam: 'Documenten' },
		{ rel: 'vragenlijst', naam: 'Formulier' },
		{ rel: 'historie', naam: 'Taakvoortgang' },
		{ rel: 'notitie', naam: 'Memo' },
		{ rel: 'sms', naam: 'SMS' },
		{ rel: 'rapport', naam: 'Rapport' }
	], select_type_historie, { maxlength: 30, filter: function() { }, is_multiple: true, has_x: true });
	set_zoek_optie(select_type_historie, '');
	select_type_historie.on('change', f);
	return select_type_historie;
}

/**
 * @brief Convert translate to new names. Implements in JS what is also in the server part.
 * @param translate   Old name.
 * @param translates  List of available translates. If the old name exists in this array, do NOT convert
 * @result The converted name
 */
function _compatTranslate(translate, translates) {
	if (translates[translate] !== undefined)
		return translate;
	translate = translate
		.replace(/^(PROJECT|ZAAK|OPDRACHT)$/, "N5NAME")
		.replace(/^(PROJECT|ZAAK|OPDRACHT)/, "N5")
		.replace(/KVKNUMMER/, "COC")
		.replace(/BTWNUMMER/, "VAT")
		.replace(/TELEFOON$/, "TEL")
		.replace(/^TAAKBEDRIJF(.)/, "TAAK$1")
		.replace(/^BEZOEK/, "VISIT")
		.replace(/^N5BEZOEK/, "N5VISIT")
		.replace(/^TAAKBEZOEK/, "TAAKVISIT")
		.replace(/REKENINGNUMMER$/, "BANK")
		.replace(/^KANDIDAATFOTO$/, "PHOTO")
		.replace(/WEBSITE$/, "WWW")
		;
	return translate;
}

function translateField(translates, field, recursion) {
	recursion = recursion == undefined ? 2 : recursion;

	var redata = /([^%\/]+)(\/[^%]*)?/.exec(field)
	if (!redata)
		return '';
	var fieldname = redata[1];
	var format = redata[2] || null;
	var redatum = /(([+-][0-9]+)(W|M|D|Y)?)$/;
	var datummatch = redatum.exec(fieldname);
	fieldname = fieldname.replace(redatum,'');
	fieldname = _compatTranslate(fieldname, translates);
	var formdata = /^FORMULIER\[(.*)\]$/.exec(fieldname);
	var translatedata = /^TRANSLATE\[(.*)\]$/.exec(fieldname);
	var translatedatahtml = /^TRANSLATEHTML\[(.*)\]$/.exec(fieldname);
	var translatedataimg = /^TRANSLATEIMG\[(.*)\]$/.exec(fieldname);
	var text = '';
	if (fieldname == 'DATUM')
		text = new Date().isoDateFormat();
	else
	if (formdata)
		text = translates.FORMULIER && translates.FORMULIER[formdata[1]] || '';
	else
	if (translatedataimg)
		text = '<img src="'+(translates.TRANSLATEIMG && translates.TRANSLATEIMG[translatedataimg[1]] || '')+'"/>';
	else {
		// These may be filled by recursion

		if (translatedata)
			text = translates.TRANSLATE && translates.TRANSLATE[translatedata[1]] || '';
		else
		if (translatedatahtml)
			text = translates.TRANSLATEHTML && translates.TRANSLATEHTML[translatedatahtml[1]] || '';
		else
		if (translates[fieldname] === undefined)
			return "{%"+field+"%}";
		else
			text = translates[fieldname] || '';

		text = applyTranslates(translates, text, recursion);
	}
	if (/^[1-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(text)) {
		if (!format)
			format = '/DATE:DD-MM-YYYY';
		if (datummatch) {
			var date = text.toDate();
			var cnt = parseInt(datummatch[2] || 0);
			switch (datummatch[3] || '') {
				case 'W': date = date.add(cnt*7); break;
				case 'M': date = date.add_month(cnt); break;
				case 'Y': date = date.add_year(cnt); break;
				default: date = date.add(cnt); break;
			}
			text = date.isoDateFormat();
		}
	}
	if (format) {
		if (/^\/DATE:/.test(format) && text) {
			var date = text.toDate();
			text = '';
			format = format.substr('/DATE:'.length);
			while (format.length > 0) {
				var re = /^(Y{1,4}|M{1,4}|D{1,4})/;
				var formatdata = re.exec(format);
				if (formatdata) {
					format = format.substr(formatdata[0].length);
					switch (formatdata[0]) {
						case 'YYYY': text += date.getFullYear(); break;
						case 'YYY': text += date.getFullYear() % 1000; break;
						case 'YY': text += date.getFullYear() % 100; break;
						case 'Y': text += date.getFullYear() % 10; break;
						case 'MMMM': text += namen_maanden_long[date.getMonth()]; break;
						case 'MMM': text += namen_maanden_short[date.getMonth()]; break;
						case 'MM': text += zeroPad(date.getMonth()+1); break;
						case 'M': text += date.getMonth()+1; break;
						case 'DDDD': text += namen_dagen_long[(date.getDay()+6) % 7]; break;
						case 'DDD': text += namen_dagen_short[(date.getDay()+6) % 7]; break;
						case 'DD': text += zeroPad(date.getDate()); break;
						case 'D': text += date.getDate(); break;
					}
				} else {
					text += format.substr(0,1);
					format = format.substr(1);
				}
			}
		} else
		if (/^\/APPROVED:/.test(format) && text) {
			format = parseInt(format.substr('/APPROVED:'.length));
			text = text.filter(function(a) { return parseInt(a["approved"] || 0) == format; });
		}
	}

	if (text instanceof Array) {
		list = text;
		text = [];
		for(var i in list) {
			if (list[i] instanceof Object && list[i]["naam"])
				text.push(list[i]["naam"]);
		}
		text = text.join(", ");
	}

	return text;
}

function applyTranslates(translates, val, recursion) {
	recursion = recursion == undefined ? 2 : recursion;
	recursion--;
	if (recursion <= 0)
		return val;

	var fields = {};
	var re = /{%(([^%\/]+)(\/[^%]*)?)%}/g;
	do {
		var redata = re.exec(val);
		if (!redata)
			break;
		fields[redata[1]] = true;
	} while (1);
	for (var field in fields)
		val = val.split("{%"+field+"%}").join(translateField(translates, field));
	return val;
}

function fillParcialTranslatesEditor(translates, editor) {
	var editor = tinyMCE.get(editor);
	var text = editor.getContent();
	text = create_div().html(text);
	text.find('ins[data-field]').each(function(i,e) {
		var field = $(e).attr('data-field');
		var newval = translateField(translates, field);
		if (!/^{%.*%}$/.test(newval))
			$(e).text(newval);
	});
	editor.setContent(text.html());
}

function fillTranslatesEditor(translates, editor) {
	var editor = tinyMCE.get(editor);
	var text = editor.getContent();
	text = create_div().html(text);
	text.find('ins').removeClass('empty').removeClass('field').empty().each(function(i,e) {
		$(e).replaceWith(document.createTextNode('{%'+$(e).attr('data-field')+'%}'));
	});
	text = text.html();
	text = text.replace(/{%([^%]+)%}/g, '<ins class="field mceNonEditable">{%$1%}</ins>');
	text = create_div().html(text);
	text.find('ins').each(function(i,e) {
		var field = $(e).text().replace(/^{%/,'').replace(/%}$/,'');
		$(e).attr('data-field', field);
		var text = translateField(translates, field);

		if (/HANDTEKENING$/.test(field)) {
			if (!translates[field])
				$(this).addClass('empty').text('{%'+field+'%}');
			else
				$(this).removeClass('empty').html(text);
		} else
		if (!text) {
			if (!/^(TAAKAFWIJKINGEN|TUSSENVOEG.*|VOORTITEL|ACHTERTITEL|EMAILCC|EMAILAAN|EMAILVAN|EMAILONDERWERP)$/.test(field))
				$(this).addClass('empty');
			else
				$(this).text('');
		} else
		if (/^(PHOTO|KANDIDAATFOTO|LOGO|N5LOGO|N1LOGO)$/.test(field))
			$(this).removeClass('empty').html('<img src="'+text+'"/>');
		else
		if (/^(PORTAL|LINK|BERICHT|EMAILHEADER|TAAKTEXT.*|TRANSLATEIMG.*|TRANSLATEHTML.*)$/.test(field))
			$(this).removeClass('empty').html(text);
		else {
			$(this).removeClass('empty').text(text);
			$(this).html($(this).html().replace(/\n/g, '<br/>'));
		}
	});
	editor.setContent(text.html());

	if (editor.done_move)
		return;
	editor.done_move = true;

	function moveSelection() {
		editor.dom.removeClass(editor.dom.select('ins.field'), 'field');
		var node = editor.selection.getNode();
		var p = node;
		while (p.parentNode) {
			if ((p.nodeName || '') == 'INS') {
				$(p).addClass('field mceNonEditable')
				break;
			}
			if ((p.nodeName || '') == 'BODY')
				break;
			p = p.parentNode;
		}
	};
	editor.on('mouseup', moveSelection);
	editor.on('mousedown', moveSelection);
	editor.on('keydown', moveSelection);
	editor.on('keyup', moveSelection);
}

/**
 * Function to create a div with the payment status.
 * Used for certifications.
 */
function create_factstatus_div(betaald, status, datum) {
	var factstatus = create_div('€').addClass('factstatus');
	if (betaald)
		factstatus.addClass('betaald').attr('hint', window.naam_factuur_betaald);
	else
	if (parseInt(status || 0) >= 2)
		factstatus.addClass('fact').attr('hint', window.naam_factuur_gemaakt);
	else
	if (datum)
		factstatus.addClass('concept').attr('hint', window.naam_factuur_in_concept);
	else
		factstatus.addClass('nietfact').attr('hint', window.naam_factuur_niet_gefactureerd);
	return factstatus;
}

/*
   Functie voor 'sticky' headers.
   - De parent van de scrolldiv mag geen padding hebben en moet position:relative of position:absolute zijn.
   - De titlediv moet een parent hebben die zijn grootte behoud ook als de titlediv zelf d.m.v. position:absolute eruit gehaald wordt.
   - De titlediv moet zelf zorgen voor zijn breedte
*/
function checkSticky(scrolldiv, title_div) {
	title_div = $(title_div);
	if (title_div.parent().css('position') == 'sticky')
		return;
	var titletop = title_div.parent().get(0).offsetTop;
	var top = $(scrolldiv).get(0).scrollTop;
	if (top > titletop)
		title_div.addClass('sticky');
	else
		title_div.removeClass('sticky');
}

/* Custom checkbox */
(function() {
$.fn.is_checked = function() {
	var checkbox = $(this).children().parents('.checkbox').eq(0);
	return checkbox.hasClass('active');
};
var keyhandler_done = false;
window.create_select_actions = function(div) {
	div = $(div);
	div.addClass('selector_actions');

	div.on('select', function(option) {
		if ($(this).val() == '') {
			var container = div.parents('.can_selector');
			var lis = container.find('li.checkbox.active');
			var all_lis = container.find('li.checkbox');
			var checkbox = create_checkbox();
			checkbox.addClass('checkbox').css('display','inline-block');
			if (all_lis.length == lis.length && all_lis.length > 0)
				checkbox.addClass('active');
			checkbox.change(function() {
				var container = div.parents('.can_selector');
				var lis = container.find('li.checkbox.active');
				var all_lis = container.find('li.checkbox');
				if (all_lis.length == lis.length) {
					lis.removeClass('active');
					container.trigger('selector_check_clean');
				} else
					all_lis.addClass('active');
			});
			checkbox.attr('hint','Markering wissen');
			$(this).children().children('div').eq(0).empty()
				.append(checkbox)
				.append("("+lis.length+")")
				;
			updateHintHandlers(this);
		}
	});

	create_zoek_opties([ { rel: '', naam: '' } ], div, { maxlength: 10, has_x: true, filter: function() { }, closefunction: function() {
		var container = div.parents('.can_selector');
		div.removeClass('popupopen');
		container.trigger('selector_check_clean');
	} });

	div.change(function() {
		var container = div.parents('.can_selector');
		var val = div.val();
		if (val != "") {
			var lis = container.find('li.checkbox.active');
			var all_lis = container.find('li.checkbox');
			if (val == 'deselect' && lis.length > 0) {
				lis.removeClass('active');
			} else
			if (val == 'select' && all_lis.length > 0) {
				container.addClass('selector');
				all_lis.addClass('active');
			} else
				div.trigger('execute-actions', [ val, lis ] );
		}
		container.trigger('selector_check_clean');
	});
	div.on('standard_click', function() {
		var container = div.parents('.can_selector');
		div.addClass('popupopen');
	});
	div.on('standard_longclick', function() {
		div.trigger('standard_click');
		return false;
	});
};
window.init_selector = function(div) {
	div = $(div || ".can_selector");
	div.mouseenter(function(e) {
		$(this).addClass('mouse_hover');
		if (e.ctrlKey)
			$(this).addClass('selector');
	});
	div.mouseleave(function(e) {
		$(this).removeClass('mouse_hover');
		$(this).trigger('selector_check_clean');
	});
	div.on('selector_check_clean', function() {
		if ($(this).hasClass('selector')) {
			var lis = $(this).find('li.checkbox.active').add($(this).find('div.selector_actions.popupopen'));;
			if (lis.length == 0) {
				$(this).removeClass('selector');
				$(this).find('.selector_actions').val('');
			} else
				$(this).find('.selector_actions').val('');
		}
	});
	if (!keyhandler_done) {
		keyhandler_done = true;

		$(window).keydown(function(e) {
			if (e.keyCode == 17 && e.ctrlKey)
				$('.mouse_hover.can_selector').addClass('selector');
		});

		$(window).keyup(function(e) {
			if (e.keyCode == 17 && !e.ctrlKey)
				$('.can_selector.selector').trigger('selector_check_clean');
		});
	}
};
/**
  * \Brief create_checkbox
  *	@param has_indeterminate    has_indeterminate==false, geen indeterminate mogelijk
  *	                            has_indeterminate > 1, indeterminate mogelijk en selecteerbaar
  *				    has_indeterminate < 0, indeterminate mogelijk, maar niet selecteerbaar voor gebruiker.
  */
window.create_checkbox = function(has_indeterminate) {
	var checkbox = create_div('',16).addClass('checkbox_control')
		.append(create_div()
			.append(window.check_active)
			.append(window.check_inactive)
			.append(has_indeterminate ? window.check_indeterminate : '')
		);
	checkbox.get(0).set_checked = function(value) {
		var checkbox = $(this).children().parents('.checkbox').eq(0);
		if (value === undefined)
			value = 1;
		if (value == -1 && has_indeterminate)
			checkbox.removeClass('active').addClass('indeterminate');
		else
		if (!value)
			checkbox.removeClass('active').removeClass('indeterminate');
		else
		if (value)
			checkbox.addClass('active').removeClass('indeterminate');
	};
	checkbox.get(0).toggle_checked = function() {
		var checkbox = $(this).children().parents('.checkbox').eq(0);
		if (checkbox.length == 0) {
			checkbox = $(this);
			checkbox.addClass('checkbox');
		}
		if (checkbox.hasClass('indeterminate')) {
			checkbox.removeClass('indeterminate');
		} else
		if (checkbox.hasClass('active')) {
			checkbox.removeClass('active');
			if (has_indeterminate > 0)
				checkbox.addClass('indeterminate');
		} else
			checkbox.addClass('active');
		checkbox.trigger("change");
		checkbox.parents('.can_selector').trigger("selector_check_clean");
	};
	checkbox.standard_longclick(function() {
		this.toggle_checked();
		return false;
	});
	checkbox.standard_click(function() {
		this.toggle_checked();
		return false;
	});
	return checkbox;
};
})();

function img_show_popup(img) {
	if (img.length == 0 || !img[0].src || /(contactpersoon|niveau[45]).png$/.test(img[0].src) || /about:blank/.test(img[0].src))
		return;
	standard_clicks(img);
	img.on('standard_click', function() {
		var _this = this;
		var image = new Image();
		image.onload = function() {
			var popup = $('#contactpersoon_img_hover');
			var blackout = $('#contactpersoon_img_hover_blackout');
			if (_this.parentNode != popup.get(0))
				_this.last_parent = $(_this.parentNode);
			var offset = _this.last_parent.offset();
			popup.css('left', max(2,(offset.left+16-(image.width / 2)))+'px');
			popup.css('top', max(2,min($(window).height()-image.height-2, (offset.top+16-(image.height / 2))))+'px');
			popup.fadeIn();
			blackout.show();
			popup.empty();
			popup.append(image);
		};
		image.src = this.src;
		return false;
	});
};

function filter_list(input, list_view, no_searchline_count) {
	input = $(input);
	if (!list_view)
		list_view = input.parents('.list_view').eq(0);
	var ul = list_view.ul || list_view.children('ul').children('li').children('ul').eq(0);
	setTimeout(function() {
		ul.children('.no-results').remove();
		if (ul.children().length == 1 && ul.children().hasClass('light'))
			return;
		var text = escapeRegExp((input.val() || '').toLowerCase());
		var count = 0;
		ul.find('li[ref]').not('.filtered').hide().not('.periode').each(function(i, e) {
			var cpy = $(e).clone();
			cpy.find('.actionline').remove();
			if (cpy.text().toLowerCase().search(text) < 0)
				return;
			$(e).css('display', '');
			$(e).parents('.periode').css('display','');
			count++;
		});
		if (count == 0) {
			ul.append(create_div(naam_noresult).addClass('no-results'));
		}

		if (!no_searchline_count)
			countResultsInSearchLine(list_view, count || '');
	}, 0);
	return list_view;
}

function createNiveau5Div(nr, soort, code, _class_niveau5nr, _class_niveau5soorten, _class_niveau5) {
	var position = parseInt(top.interface_options['toon_niveau5soorten_cnt'] || 0);
	var nr_div = $();
	var soort_div = $();
	if (top.interface_options['toon_niveau5_nummer'] || 0 && nr)
		nr_div = create_div(nr).addClass('niveau5nr').addClass(_class_niveau5nr);
	if (position > 0 && soort)
		soort_div = create_div(soort.substr(0,position)).addClass('niveau5soorten').addClass(_class_niveau5soorten);
	return nr_div.add(soort_div).add(create_div(code).addClass('niveau5').addClass(_class_niveau5));
}

function createDebiteurNrDiv(naam, debiteurnummer, betaalgedrag) {
	var result = naam || '';
	var position = parseInt(top.interface_options['toon_debiteur_nummer_position'] || 3);
	var div = create_span(naam || "").addClass('niveau4');
	if (debiteurnummer) {
		switch(position) {
			case 1: div.append(" ("+debiteurnummer+")"); break;
			case 2: div.prepend("("+debiteurnummer+") "); break;
		}
	}
	if (parseInt(betaalgedrag || 0) < 0)
		div.prepend($(top.icons['factuur']).css('color', 'red'), ' ');
	return div;
}

/*
 * @brief        Create a span with an image of letter
 *               If there is an image available the image will be set otherwise a letter will show
 * @param img    The image of the item
 * @param name   The name of the item, used for creating a letter in the default image
 * @param niveau The niveau of the item, used for setting a fitting background color
 */
function createLogoElem(img, name, niveau) {
	var div = create_span().addClass('img_container img_' + niveau).append(
		(img && img != "about:blank" ?
			$("<img/>").attr('src', img)
			:
			create_span( (name || '').substring(0, 1) )
		)
	);

	return div;
}

/**
 * Tooggle fullscreen.
 */
function toggle_fullscreen() {
	element = document.documentElement;
	var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
	if (fullscreenElement == undefined) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {

		}
		return false;
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		return false;
	}
};

/**
 * @brief     Html escape
 * @param str The string to escape
 */
function htmlEscape(str) {
	if (!str)
		return "";
	return create_span(str).html().replace(/\n/,'<br/>');
}

function breakLines(tekst, minlength, maxlength) {
	var result = [];
	var re = new RegExp("^(.{"+minlength+","+maxlength+"}) (.*)$");
	while (tekst.length > maxlength) {
		var data = re.exec(tekst);
		if (!data || !data[1]) {
			data = [
				tekst,
				tekst.substr(0,50),
				tekst.substr(50)
			];
		}
		result.push(data[1]);
		tekst = data[2];
	}
	result.push(tekst);
	return result;
}

(function() {

var document_ready = false;

/**
 * @brief  Create a object, with an optional prototype
 * @param  _prototype  The prototype for the new object
 * @param  _object     The object to be merged in the new object
 * @return             Then newly created object
 */
function createObject(_prototype, _object) {
	var obj = Object.create(_prototype);
	Object.assign(obj, _object);
	obj.parent = _prototype;
	if (typeof(obj.initImmediate) == "function") {
		obj.initImmediate();
	}
	if (typeof(obj.init) == "function") {
		if (document_ready) {
			obj.init();
		} else {
			$(document).ready(function() {
				obj.init();
			});
		}
	}
	return obj;
}


/**
 * @brief  Create a new prototype object, with an optional prototype
 * @param  _prototype  The prototype for the new object
 * @param  _object     The object to be merged in the new object
 * @return             Then newly created object
 */
function createPrototype(_prototype, _object) {
	var obj = Object.create(_prototype);
	Object.assign(obj, _object);
	obj.parent = _prototype;
	return obj;
}



$(document).ready(function() {
	document_ready = true;
});

window.createObject = createObject;
window.createPrototype = createPrototype;

})();























var Menu = {

	central_item: [],                   // Associative array containing the config of all central (sub)menu items.
	icon_more: undefined,               // Icon used to indicate that a menu item contains submenu items.
	item_width: 200,                    // Number of pixels indicating the menu and submenu width, NOT included in CSS to make it flexible.
                                        // If you change this value, also change in CSS: .menu .has-submenu:hover>.submenu.left + .menu .has-submenu:hover>.submenu.right
	this_list: undefined,               // 'this' Context of the listview that contains the menu interface.
	result_custom_condition_check: "",  // String that indicates how to display a menu item after it has been checked on it's custom conditions.

	STATE_DISABLED: "disabled",
	STATE_NOACCESS: "noaccess",

	//icon_more: top.icons["meer"], // geeft een undefined op top.icons, vreemd genoeg doet ie het wel.

	/**
	 * @brief  Fills the associative array 'central_item' with config for all central (sub)menu items.
	 */
	setConfigCentralItems: function() {
		/*
			Documentation of all possible properties and methods for menu items:
			- bar_menu                     Boolean indicating if the menu item should be included in the expandable 'More' icon on the menu bar. Default = true.
			- bar_primary                  Boolean indicating if the menu item should be included as a primary menu item on the menu bar. Default = false.
			- contextmenu                  Boolean indicating if the menu item should be included in the row context menu. Default = true.
			- icon                         (required) String containing the font awesome icon as configured in the central icons array.
			- label                        (required) String containing the translated label of the menu item, used also as hint for primary menu items.
			- multi_doc                    Boolean indicating if the menu item is enabled in case multiple rows have been selected. Default = true.
			- right_access                 Number containing the bit number the user must at least have, to have access to the menu item.
			- right_module                 String containing the module name the user must have access to, to have access to the menu item.
			- subitems                     Associative array containing the submenu items related to this parent menu item. The subitems are configured separately.
			- zero_doc                     Boolean indicating if the menu item is enabled in case no rows have been selected. Default = true.
			- callback                     Callback function to call when the user clicks on the menu item.
			- callback_custom_condition    Callback function to call that checks the display of the menu item based on custom conditions.
		*/
		_this = this;
		this.central_item["create"] = {
			bar_menu: true,
			bar_primary: true,
			contextmenu: true,
			icon: "plus",
			label: naam_toevoegen,
			multi_doc: false,
	// 		right_access: 1,
	// 		right_module: "document",
			subitems: [],
			zero_doc: false,
		};
			this.central_item["create"]["document"] = {
				icon: "document",
				label: "Document",
				callback: function() { alert("Clicked on 'toevoegen document'") },
			};
			this.central_item["create"]["email"] = {
				icon: "email",
				label: "Email",
				callback: function() { alert("Clicked on 'toevoegen email'") },
			};
			this.central_item["create"]["memo"] = {
				icon: "taak",
				label: "Memo",
				subitems: [],
			};
				this.central_item["create"]["memo"]["sub1"] = {
					icon: "taak",
					label: "Sub1",
					callback: function() { alert("Clicked on 'Sub1'") },
				};
				this.central_item["create"]["memo"]["sub2"] = {
					icon: "taak",
					label: "Sub2",
					callback: function() { alert("Clicked on 'Sub2'") },
				};
				this.central_item["create"]["memo"]["sub3"] = {
					icon: "taak",
					label: "Sub3",
					callback: function() { alert("Clicked on 'Sub3'") },
				};

		this.central_item["edit"] = {
			bar_primary: true,
			icon: "edit",
			label: naam_eigenschappen,
			multi_doc: false,
			zero_doc: false,
			callback: function() { _this.this_list.callback_edit(); },
		};

		this.central_item["delete"] = {
			bar_menu: false,
			bar_primary: true,
			icon: "delete",
			label: naam_verwijderen,
			zero_doc: false,
			callback: function() { _this.this_list.callback_delete(); },
		};

		this.central_item["report"] = {
			icon: "document",
			label: "Rapport",
			subitems: [],
		};
			this.central_item["report"]["tasks"] = {
				icon: "email",
				label: "Taken",
				callback: function() { alert("Clicked on 'rapport taken'") },
			};
			this.central_item["report"]["correspondence"] = {
				icon: "email",
				label: "Correspondentie",
				callback: function() { alert("Clicked on 'rapport correspondentie'") },
			};
			this.central_item["report"]["projectmap"] = {
				icon: "email",
				label: "Projectkaart",
				callback: function() { alert("Clicked on 'rapport projectkaart'") },
			};
			this.central_item["report"]["projectlist"] = {
				icon: "email",
				label: "Lijst projecten",
				callback: function() { alert("Clicked on 'rapport lijst projecten'") },
			};
			this.central_item["report"]["visual_planning"] = {
				icon: "email",
				label: "Visuele planning",
				callback: function() { alert("Clicked on 'rapport visuele planning'") },
			};
			this.central_item["report"]["documentcheck"] = {
				icon: "email",
				label: "Documentcontrole",
				callback: function() { alert("Clicked on 'rapport documentcontrole'") },
			};

		this.central_item["overview"] = {
			icon: "positive",
			label: "Overzicht",
			callback: function() { alert("Clicked on 'overzicht'") },
		};

		this.central_item["create"].order = 10;
		this.central_item["edit"].order = 20;
		this.central_item["delete"].order = 30;
		this.central_item["report"].order = 40;
		this.central_item["overview"].order = 50;

		this.central_item["create"]["document"].order = 10;
		this.central_item["create"]["email"].order = 20;
		this.central_item["create"]["memo"].order = 30;

		this.central_item["report"]["tasks"].order = 10;
		this.central_item["report"]["correspondence"].order = 20;
		this.central_item["report"]["projectmap"].order = 30;
		this.central_item["report"]["projectlist"].order = 40;
		this.central_item["report"]["visual_planning"].order = 50;
		this.central_item["report"]["documentcheck"].order = 60;
	},

	/**
	 * @brief  Expands or collapses the menu. Also used for primary menu items that have submenu items. First all central menu items are included, then all decentral.
	 * @param  button          DOM element containing the button the user clicks on.
	 * @param  expand_left     Boolean indicating whether the submenu items should be expanded to the left of the parent menu item (default is to the right).
	 * @param  row_context     Boolean indicating whether the toggle was triggered from the row action.
	 * @param  id              String containing the ID of the row. (In case the toggle was triggered from the row action).
	 *                         Can also contain the order ID of the menu item (In case the toggle was triggered from a primary menu item).
	 * @param  central         Object array containing the config of menu items to be displayed.
	 *                         Only used for subitems of primary menu items. If undefined it takes the config of all central menu items by default.
	 * @param  decentral       Object array containing the config of menu items to be displayed. Only used for subitems of primary menu items.
	 *                         Only used for subitems of primary menu items. If undefined it takes the config of all decentral menu items by default.
	 */
	toggleMenu: function(button, expand_left, row_context, id, central, decentral) {
		var _this = this;

		// If the menu is on screen, remove it, remove the transparant cover and stop further processing.
		if($(".menu").is(":visible")) {
			$(".menu").remove();
			this.toggleCover();
			return;
		}

		// Fill the entire screen with transparant layer, so nothing can be clicked/hovered except for the items in the menu.
		this.toggleCover();

		// In case the function is called from a primary menu button that hasn't got a submenu, the button variable is not defined and we stop this function.
		if (button == undefined || button == null) {
			return;
		}

		id = id ? id : "";

		// Check if the toggle was triggered from the row action.
		if (row_context) {
			// Uncheck all selected rows.
			this.this_list.uncheckAllRows();

			// Check the row the user clicked on.
			this.this_list.widget.find('.col-checkbox input[value="' + id + '"]').prop('checked', true);

			// Re-render the primary menu items.
			this.printPrimaryMenuItems();
		}

		// Which central and decentral menu items config are we gonna use?
		// By default we use the object arrays of all centrally and decentrally configured menu items,
		// but for primary menu items we need only the config of the subitems related to that primary menu item. In that case these are passed to this function.
		var central_items = central ? central : this.this_list.central_items;
		var decentral_items = decentral ? decentral : this.this_list.decentral_items;

		// Sort both object arrays on the order property.
		central_items.sort(function(obj1, obj2) { return obj1.order - obj2.order; });
		decentral_items.sort(function(obj1, obj2) { return obj1.order - obj2.order; });

		var show_central = central_items && central_items.length > 0 ? true : false;
		var show_decentral = decentral_items && decentral_items.length > 0 ? true : false;

		// Only show menu if there are menu items.
		if ( show_central || show_decentral ) {

			// Store IDs of selected rows.
			this.this_list.setSelectedRows(this.this_list.widget);

			// Should the menu be expanded to the right (default) or to the left (in case there's no space on the right).
			var class_hor = this.getHorPos(button);

			// Create the menu.
			var menu = create_div().addClass('menu' + class_hor).css('width', this.item_width + 'px');
			button.append(menu);

			// Append all central menu items.
			if (show_central) {
				central_items.map(function(menu_item, index){
					_this.addMenuItem(menu_item, menu, "_c" + index, expand_left, row_context, id);
				});
			}

			// Include a horizontal line if applicable.
			var hr = show_central && show_decentral ? create_div().addClass('hr') : "";
			menu.append(hr);

			// Append all decentral menu items.
			if (show_decentral) {
				decentral_items.map(function(menu_item, index){
					_this.addMenuItem(menu_item, menu, "_d" + index, expand_left, row_context, id);
				});
			}

			// Menu is hidden by default, show it!
			$(".dropmenu" + id + " .menu").css("display", "flex");

			// Should the menu be positioned upwards from the bottom (in case there is no space downwards) or not (default).
			var class_ver = this.getVerPos(menu);
			menu.addClass(class_ver);
		}
	},

	/**
	 * @brief  Appends a single menu item to the menu.
	 * @param  item            Object containing the config of the menu item to append.
	 * @param  container       DOM element to append the menu item to.
	 * @param  index           String containing an ID used for identifying menu items that contain submenu items.
	 * @param  expand_left     Boolean indicating whether the submenu items should be expanded to the left of the parent menu item (default is to the right).
	 * @param  row_context     Boolean indicating whether the toggle was triggered from the row action.
	 * @param  id              String containing the ID of the row. (In case the toggle was triggered from the row action).
	 *                         Can also contain the order ID of the menu item (In case the toggle was triggered from a primary menu item).
	 */
	addMenuItem: function(item, container, index, expand_left, row_context, id) {
		// If the menu has been triggered from the row, check if we should include this menu item.
		if (row_context && item.contextmenu === false) {
			return;
		}

		// If the menu has been triggered from the 'More'-menu (in that case 'id' is empty), check if we should include this menu item.
		if (id === "" && item.bar_menu === false) {
			return;
		}

		// Get info about how to display the menu item: display, disable or do not display.
		var check_item_display = this.checkMenuItem(item, id);

		// Create outer div for the new menu item.
		var _this = this;
		var submenu_id = "";

		// In case the menu item contains subitems, the HTML structure contains an extra class (has-submenu).
		var new_item_outer = item.subitems ? create_div().addClass('has-submenu') : new_item_outer = create_div();
		container.append(new_item_outer);

		// Create menu item itself.
		var new_item = create_div().addClass('item ' + check_item_display.disabled + ' ' + check_item_display.access);
		var icon = create_div().append(top.icons[item.icon]).addClass('icon');
		var label = create_div(item.label).addClass('label');
		new_item.append(icon, label);
		this.setOnClick(item, new_item, check_item_display);

		// Create icon indicating the menu item has subitems and add the onclick.
		if (item.subitems) {
			submenu_id = "id" + index.toString();
			var more = create_div().append(this.icon_more).addClass('more');
			new_item.append(more);
		}

		// Append the (parent) menu item.
		new_item_outer.append(new_item);

		// Handle submenu items. If the parent item is disabled, the sub items should not be generated.
		if (item.subitems && check_item_display.disabled === "") {

			// Calculate the class that positions the submenu items in relation to the parent menu item.
			var class_pos = "right ";
			if (window.innerWidth > 768) {
				if (expand_left) {
					class_pos = "left ";
				}
			} else {
				class_pos = "central ";
			}

			// If there are submenu items, create a container for them.
			var submenu_container = create_div().addClass('submenu ' + class_pos + submenu_id).css('width', this.item_width + 'px');
			new_item_outer.append(submenu_container);

			// Sort the submenu items (object array).
			item.subitems.sort(function(obj1, obj2) { return obj1.order - obj2.order; });

			// Append all submenu items
			item.subitems.map(function(submenu_item, index_sub){
				_this.addMenuItem(submenu_item, submenu_container, "_si" + index.toString() + index_sub.toString(), expand_left, row_context, id);
			});
		}
	},

	/**
	 * @brief  Appends primary menu items to the menu bar. The order is central menu items then decentral menu items.
	 */
	printPrimaryMenuItems: function() {
		var _this = this;

		// Remove all current primary menu items, we have to re-render after user checks or unchecks a single row.
		this.this_list.widget.find('.primary-menu-item').remove();

		var central_items = this.this_list.central_items;
		var decentral_items = this.this_list.decentral_items;

		// Because we're gonna prepend the items, the last must be printed first, so we have to reorder both object arrays.
		central_items.sort(function(obj1, obj2) { return obj2.order - obj1.order; });
		decentral_items.sort(function(obj1, obj2) { return obj2.order - obj1.order; });

		// Store IDs of selected rows.
		this.this_list.setSelectedRows(this.this_list.widget);

		// Find the menu bar the primary menu items should be appended to.
		var bar = this.this_list.widget.find('.bar-action');

		// First the decentral items, cause they are the last in line.
		decentral_items.map(function(menu_item, index){
			_this.addPrimaryMenuItem(bar, menu_item);
		});

		// Then the central items, cause they are the first in line.
		central_items.map(function(menu_item, index){
			_this.addPrimaryMenuItem(bar, menu_item);
		});

		// Because we removed and added all primary menu items, the hints do not work anymore. Therefore update the hint handlers.
		updateHintHandlers();
	},

	/**
	 * @brief  Appends a single menu item to the menu bar as a primary menu item.
	 * @param  bar        DOM element containing the menu bar the primary menu items should be appended to..
	 * @param  item       Object containing the config of the primary menu item to append.
	 */
	addPrimaryMenuItem: function(bar, item) {
		var _this = this;

		// Check if this menu item should be included as a primary menu item.
		if (item.bar_primary !== true) {
			return;
		}

		var check_item_display = this.checkMenuItem(item);

		// Append the primary menu item.
		var action = create_div().addClass('action primary-menu-item ' + check_item_display.disabled + ' ' + check_item_display.access).attr('hint', item.label).append(top.icons[item.icon]);

		// In case the primary menu item has subitems, add a visual indication for that.
		if (item.subitems) {
			action.append(
				create_span().addClass('dropdown-icon').append(top.icons['dropdown'])
			);
		}

		if (item.subitems && check_item_display.disabled === "") {
			// Handle submenu items. If the parent item is disabled, the sub items should not be generated.

			// In case the menu item has submenu items, a click should expand a menu with these submenu items.
			action.click(function(){
				_this.toggleMenu(_this.this_list.widget.find('.dropmenu' + item.order), true, false, item.order, item.subitems, []);
			});

			// In case of submenu items the 'action' div must be wrapped in a 'dropmenu' div.
			var dropdown = create_div().addClass('dropmenu' + item.order + ' primary-menu-item ' + check_item_display.access);
			dropdown.append(action);
			bar.prepend(dropdown);

			// Create dropable menu for the submenu items.
			var show_menu = item.subitems.length > 0 ? true : false;
			if (show_menu) {
				var menu = create_div().addClass('menu').css('width', this.item_width + 'px');
				dropdown.append(menu);

				item.subitems.map(function(menu_item, index){
					_this.addMenuItem(menu_item, menu, "_ps" + index, true, false);
				});
			}

		} else {
			// No submenu items. Append the action directly to the menu bar and set the onclick callback.
			bar.prepend(action);
			this.setOnClick(item, action, check_item_display);
		}
	},

	/**
	 * @brief  Checks how the menu item should be displayed.
	 * @param  item       Object containing the config of the menu item to check.
	 * @param  id         String containing the ID of the row. (In case the toggle was triggered from the row action).
	 *                    Can also contain the order ID of the menu item (In case the toggle was triggered from a primary menu item).
	 * @return result     Object with two properties (disabled and access) indicating how to handle the display of the menu item.
	 */
	checkMenuItem: function(item, id) {
		var result = {};
		id = id ? id : "";

		// Following checks are only applicable for the 'More-'-menu (in that case 'id' is empty).
		var disabled = "";
		if (id === "") {
			// Check if MULTIPLE rows have been selected and the item should be disabled in that case.
			if (this.this_list.selected.length > 1 && item.multi_doc === false) {
				disabled = this.STATE_DISABLED;
			}

			// Check if NO rows have been selected and the item should be disabled in that case.
			if (this.this_list.selected.length === 0 && item.zero_doc === false) {
				disabled = this.STATE_DISABLED;
			}
		}

		// Check if the current user has enough rights to trigger the item.
		var access = "";
		if (item.right_module && item.right_access) {
			if (!top.hasRecht(item.right_module, item.right_access)) {
				disabled = this.STATE_DISABLED;
				access = this.STATE_NOACCESS;
			}
		}

		// Check if there are customized conditions for displaying the menu item yes or no, combined with the selected row(s).
		// These conditions are specified per menu item in the callback method 'callback_custom_condition'.
// 		var show_menu_item = this.checkMenuItemOnCustomConditions(item);
		var show_menu_item = item.callback_custom_condition ? item.callback_custom_condition(this.getInfoForCallbacks()) || "" : "";
		if (show_menu_item === this.STATE_DISABLED) {
			disabled = this.STATE_DISABLED;
		} else if (show_menu_item === this.STATE_NOACCESS) {
			access = this.STATE_NOACCESS;
		}

		result.disabled = disabled;
		result.access = access;

		return result;
	},

	/**
	 * @brief  Checks if customized conditions are applicable for a menu item and checks those conditions. The outcome has impact on the display of the menu item.
	 * @param  item      Object containing the config of the menu item to be checked on customized conditions.
 	 * @return result    String that can have three values: 1)no value (meaning the item can be displayed), 2)"disabled", 3)"noaccess". TODO UPDATE
	 */
/*
	checkMenuItemOnCustomConditions: function(item) {
 		// Extra context:
		// 1. User selects a row.
		// 2. It might be that certain menu actions are not applicable for the selected row.
		//    This can differ per row. (f.i. When selecting an invoice that has been paid, the 'Pay' menu item should be disabled).
		// 3. We check the row against customized conditions, which are triggered via a callback function as configured in the menu item config.

		// Check customized conditions only if at least one row has been selected and the menu item has a callback function configured for custom conditions.
		return item.callback_custom_condition ? item.callback_custom_condition(this.getInfoForCallbacks()) || "" : "";
	},
*/

	/**
	 * @brief  Specific data per row can be stored (on list level) in a associative object array (row_data). This function returns data from the first selected row.
	 * @return data   Object containing data from the first selected row. This data can be anything and is coded in the decentral lists.
	 */
	getDataFirstSelectedRow: function() {
		var data = {};
		if (this.this_list.row_data) { // It's not mandatory for listviews to store row data, so check if row_data exists.
			var row_id = this.this_list.selected[0];
			data = this.this_list.row_data[row_id];
		}
		return data;
	},

	/**
	 * @brief  Called from the init of a listview. Returns an object array with the config of all centrally configured menu items that should be included in a particular listview.
	 * @param    central_items     Object containing references to the centrally configured menu and submenu items that should be included.
	 * @return   return_items      Object array containing the central menu and submenu items that should be included in a particular listview.
	 */
	getCentralMenuItems: function(central_items) {
		var _this = this;
		var return_items = [];
		var main = null;
		var sub = null;

		// Get object array containing the config of all centrally configured menu items.
		this.setConfigCentralItems();

		central_items.map(function(central_main_item){
			// Get config of the main item.
			main = _this.central_item[central_main_item.main];

			// Append submenu item, all levels deep (appendCentralSubMenuItems is recursive).
			main = _this.appendCentralSubMenuItems(main, central_main_item);

			// Add main item.
			return_items.push(main);
		});
		return return_items;
	},

	/**
	 * @brief  Appends an object array containing the central configuration of sub menu items related to the parent menu item. Recursive method.
	 * @param    parent                 Object containing the central configuration of the parent menu item.
	 * @return   central_menu_item      Object containing a reference to the sub menu items to be included.
	 *                                  If the object has no 'sub' attribute, nothing will be appended.
	 */
	appendCentralSubMenuItems: function(parent, central_menu_item) {
		var _this = this;

		// Add submenu items to parent item.
		if (central_menu_item.sub) {
			central_menu_item.sub.map(function(central_sub_item) {
				sub = parent[central_sub_item.name];
				sub = _this.appendCentralSubMenuItems(sub, central_sub_item);
				parent.subitems.push(sub);
			});
		}

		return parent;
	},

	/**
	 * @brief  Returns an object with all possible data to be used in callback functions.
	 */
	getInfoForCallbacks: function() {
		// data: object with data of the (first) selected row.
		return {
			data: this.getDataFirstSelectedRow(),  // Many times callback functions are interested in data of a single selected row.
			this_menu: this,                       // 'this' context of the menu object.
			this_list: this.this_list              // 'this' context of the listview object.
		};
	},

	/**
	 * @brief  Sets all handling on a menu item for if the user clicks on it.
	 * @param  item                 Object containing the config of the menu item.
	 * @param  element              DOM element representing the menu item which the user clicks on.
	 * @param  check_item_display   Object containing information whether the menu item is disabled or not.
	 */
	setOnClick: function(item, element, check_item_display) {
		var _this = this;

		// In case the menu item has a callback function configured AND it is enabled, we set a 'click' event.
		if (item.callback && check_item_display.disabled === "") {
			element.click(function() {
				_this.toggleMenu(); // Close menu if user clicks on whatever menu item.
				_this.this_list.setSelectedRows(_this.this_list.widget); // Set an array with IDs of selected rows.
				item.callback(_this.getInfoForCallbacks()); // Call the callback and pass all data the callback possibly needs.
			});
		}
	},

	/**
	 * @brief  Toggles the cover that is used to prevent clicking/hovering on non-menu-related DOM elements in case the menu is expanded.
	 */
	toggleCover: function() {
		_this = this;

		if($(".cover").is(":visible")) {
			// Remove the cover and it's click event.
			$(".cover").css("display", "none").off('standard_click');
		} else {
			// Add the cover and if the user clicks on it, it should remove the expanded menu.
			$(".cover").css("display", "flex").standard_click(function(){ _this.toggleMenu(); });
		}
	},

	/**
	 * @brief   Checks the vertical space available downwards and returns a class that forces the menu to be displayed upwards from the bottom.
	 * @param   menu         DOM element containing the menu to be displayed.
	 * @return  class_add    Extra class to reposition the expanded menu.
	 */
	getVerPos: function(menu) {
		var class_add = "";

		if (menu.offset().top - menu.height() > 0 && menu.offset().top + menu.height() > window.innerHeight) {
			class_add = " up";
		}

		return class_add;
	},

	/**
	 * @brief   Checks the horizontal space available on the right and returns a class that forces the menu to be displayed left from the button.
	 * @param   button       DOM element containing the button that expands the menu when clicked on.
	 * @return  class_add    Extra class to reposition the expanded menu.
	 */
	getHorPos: function(button) {
		var class_add = "";

		if (button.offset().left + this.item_width > window.innerWidth) {
			class_add = " left";
		}

		return class_add;
	}

};
