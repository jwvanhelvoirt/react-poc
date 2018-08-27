<?php
$screencolor = 'flex_color';

/*
$color_positief = '#86c250';
$color_negatief = '#bb1955';
$color_afgewerkt = '#a0a0d0';
$color_open = '#f59331';
$color_neutraal = '#999999';
*/
/*
$color_positief = '#4c5f1c';
$color_negatief = '#d41d01';
$color_afgewerkt = '#fdb05e';
$color_open = '#d06b50';
$color_neutraal = '#aaaaaa';
*/
/*
$color_positief = '#169010';
$color_negatief = '#DE0A0C';
$color_afgewerkt = '#2579CF';
$color_open = '#FF9600';
$color_neutraal = '#aaaaaa';
*/
/*
$color_positief = '#839c24';
$color_negatief = '#DE0A0C';
$color_afgewerkt = '#3d67b1';
$color_open = '#f57f27';
$color_neutraal = '#aaaaaa';
$color_positief = '#839c24';
#$color_extra = '#593484';

$certificering_open_tekst = "Nog in te vullen";
$certificering_afgewerkt_tekst = "Te behandelen";
$certificering_negatief_tekst = "Negatief";
$certificering_positief_tekst = "Positief";
*/

$color_open = "#0275D8";
$color_afgewerkt = "#F0AD4E";
$color_cap = "#5BC0DE";
$color_positief = "#5CB85C";
$color_negatief = "#D9534F";
$color_neutraal = '#aaaaaa';

$certificering_open_tekst = "Behandelen";
$certificering_afgewerkt_tekst = "Ingediend";
$certificering_cap_tekst = "Verbeterpunten";
$certificering_negatief_tekst = "Afgekeurd";
$certificering_positief_tekst = "Goedgekeurd";
$certificering_compleet_tekst = "Afgerond";


$color_opdrachtgever = '#55BBFF';
$color_opdrachtnemer = '#BB44FF';

$color_positief_light = light_color($color_positief);
$color_negatief_light = light_color($color_negatief);
$color_afgewerkt_light = light_color($color_afgewerkt);
$color_open_light = light_color($color_open);
$color_neutraal_light = light_color($color_neutraal);

global $config, $portal_widgets, $loader, $base_path;

$loader->load("portalwidget/css");

foreach($portal_widgets as $portal_widget) {
	if (check_config('/config/portal/widgets/'._H($portal_widget["id"]), 'enabled', false)) {
		foreach($portal_widget['modules'] as $module)
			$loader->load("portalwidget/$module");
	}
}

include_once("$base_path/client/cc_app.php");

include_once("$base_path/client/graph_include.php");
include_once("$base_path/flex/client/niveau5edit_io.php");
include_once("$base_path/flex/client/roledit_io.php");

?>
<script>
<?/* Code to avoid loading this file directly without iframe */?>
try {
	if (!top.icons)
		throw new Exception("IFrame Error");
} catch(e) {
        document.location = "/<?=$portal?>";
}
</script>

<script>
$(document).on('click', '.expander>header', function() {
	$(this).parent().toggleClass('expanded');
	return false;
});

function downloadDocument(id) {
	window.open(top.gateway_path+"api.document.downloadDocument?MAGIC="+top.MAGIC+"&id="+id);
}

$(document).on('click', '.portal_block[data-goto-page]', function() {
	var _this = $(this);
	goto_page(_this.attr('data-goto-page'), _this.attr('data-goto-page-id'));
	return false;
});

$(document).on('click', '.simplelistbox li', function(){
	var _this = $(this);
	if (_this.hasClass('actionline'))
		return false;
	var block = _this.parents('.portal_block');
	var is_selected = _this.hasClass('selected');
	li = block.find('.selected').removeClass('selected');
	block.find('.actionline').hide();
	if (!is_selected) {
		_this.addClass('selected');
		_this.next().show();
	}
});

function addButtons(li, create_button_callback, data)  {
	//var widget = li.parents('.portal_block').eq(0);
	li.attr('tabindex', '0');
	li.click(function() {
		return false;
	});
	li.focus(function() {
		var li = $(this);
		//goto_widget(widget, false);
		li.parent().find('.selected').removeClass('selected');
		li.find('.buttons').remove();
		setTimeout(function() {
			li.find('.buttons').remove();
			create_button_callback(li, data);
			setTimeout(function() {
				li.addClass('selected');
			}, 10);
		});
		return false;
	});
	li.blur(function() {
		var li = $(this);
		li.removeClass('selected');
		li.find('.buttons').remove();
	});
}

function goto_page(new_page, page_id, name) {
	if (!(page_id instanceof Array))
		page_id = [ page_id ];
	if (window.addHash)
		window.addHash(new_page, page_id, name);
	else
		show_page(new_page, name);
}

function show_page(new_page_elem, name) {
	if (new_page_elem && typeof(new_page_elem) == "string")
		new_page_elem = $('#'+new_page_elem);
	if (!new_page_elem.length)
		new_page_elem = $('.pages>section').eq(0);
	new_page_elem.parent().children().removeClass('shown');
	new_page_elem.addClass('shown');
	if (new_page_elem.get(0).onload)
		new_page_elem.get(0).onload();
	top.document.title = name + top.postfix_title;
	return new_page_elem;
}

$(document).on('contextmenu', function(e) {
	e.preventDefault();
	return false;
});
</script>
<style>
nav {
	background: white;
	height: 54px;
	line-height: 54px;
	font-size: 18px;
	padding: 8px;
	<?=class_flex_row()?>;
}
nav .title {
	color: #666;
	margin-right: 10px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
nav #portalname {
	display: none;
	font-weight: bold;
}
nav #icons { display: none; }
nav .title>* { <?=class_align('center')?>; }
nav .navmenu {
	color: #666;
	background: white;
}
nav>.navmenu { display: flex; flex-flow: row; padding-bottom: 10px; }
nav>.navmenu>ul { display: flex; flex-flow: row; }
nav>.navmenu>ul>li>a { margin: 0px 10px; padding: 0px 10px; border-radius: 3px; display: block; cursor: pointer; }
nav>.navmenu>ul>li.selected>a { background: #0275D8; color: white; }
nav>.navmenu>ul>li:not(.selected)>a:hover { background: #dedede; color: black; }
nav .menuicon { display: none; }
nav .fa { font-size: 25px; vertical-align: middle; }

@media (max-width: 600px) {
	nav .menuicon { display: inline-block; margin-right:10px; }
	nav { display: block; }
	nav #portalname { display: block; }
	nav #icons { display: block; }
	nav #icons>ul { display: flex; flex-flow: row; }
	nav #icons>ul>li>a { margin: 0px 0px; padding: 0px 5px; border-radius: 3px; display: block; cursor: pointer; }
	nav #icons>ul>li.selected>a { background: #0275D8; color: white; }
	nav #icons>ul>li:not(.selected)>a:hover { background: #dedede; color: black; }
	nav>* { display: block; position: relative; z-index: 1; }
	nav>.navmenu.closed { display: none; }
	nav>.navmenu>ul { display: block; }
	nav>.navmenu { border-bottom: 1px solid #ececec; }
}
</style>
<nav style="display: none;" draggable="true" class="e0">
	<div class="title">
		<span>
<!--			<span class="menuicon" onclick="$('nav .navmenu').toggleClass('closed');"><?=icon('menu')?></span> -->
			<span class="menuicon" onclick="top.document.location.hash = ''; $('nav #portalname').text('<?=_HF(_('dashboard'))?>')"><?=icon('home')?></span>
			<img src="/images/login.png" style="height: 40px; vertical-align: middle; display: none;"/>
		</span>
		<span id="portalname"><?=_HF(_("dashboard"))?></span>
		<span id="icons">
			<ul>
				<?/* TODO: deze code is dubbel */?>
				<li><a onclick="goto_page('admin')"><?=icon('user')?></a></li>
				<li><a onclick="top.logout()"><?=icon('afsluiten')?></i></a></li>
			</ul>
		</span>
	</div>
	<div class="navmenu closed e100">
		<ul class="e100 back_to_widgets">
		</ul>
		<ul class="e0">
			<li><a onclick="goto_page('admin')"><?=icon('user')?></i></a></li>
			<li><a onclick="top.logout()"><?=icon('afsluiten')?></i></a></li>
		</ul>
	</div>
</nav>
<script>
$(document).on('click', 'nav a[data-page]', function() {
	var page = $(this).attr('data-page');
	$(this).closest('ul').find('.selected').removeClass('selected'); $(this).parent().addClass('selected');
	app_frame.goto_page(page);
});
$(document).on('update_config', function() {
	$('nav').css('display', '');
});
</script>
<div class="cover"></div> <!-- Transparant layer that covers the entire screen. -->
<div class="pages e100 no_select">
	<section id="page_main" data-url="" class="shown">
	</section>
	<section id="hidden_page" style="display:none">
	</section>
</div>

<script>
/* ------------------- MESSAGE/POPUP HANDLING  -------------------*/
function showConfirm(message, actions, show_function, width) {
	width = parseInt(width || 340);
	var io = create_div().addClass('popup').css('width', width + 'px');
	$(document.body).append(io);

	var button_div = create_div().addClass('rown');

	io.append(create_div().addClass('column').append(
		(typeof(message) == "string" ?
			create_div(message)
		:
			message
		),
		button_div
	));

	var ok_function = undefined, cancel_function = undefined;

	for (var i in actions) {
		var action = actions[i];
		action.action = action.action || function() { };
		if (action.naam) {
			(function(action) {
				var div = create_div(action.naam).addClass('box-button large');
				button_div.append(div);
				div.click(function() {
					if (action.action() !== false)
						io.find('.cancel').standard_click();
				});
			})(action);
		}
		if (action.ok)
			ok_function = action.action;
		if (action.cancel)
			cancel_function = action.action;
	}

	createOverlay(
		io,
		function() {
			if (ok_function && ok_function() === false)
				return false;
			io.find('.cancel').standard_click();
			io.remove();
		},
		function() {
			if (cancel_function && cancel_function() === false)
				return false;
			io.remove();
		},
		undefined,
		function() {
			io.find('.ok').hide();
			if (show_function)
				show_function();
		}
	);
}

function showMessage(text, f, c, buttons, show_function, width, btnOk, btnCancel) {
	if (!text)
		return f();

	btnOk = btnOk === null || btnOk === undefined ? true : btnOk;
	btnCancel = btnCancel === null || btnCancel === undefined ? true : btnCancel;

	showConfirm(
		text,
		[
			btnOk ? { naam: <?=_JF(_("Ok"))?>, action: f } : {},
			btnCancel ? { naam: <?=_JF(_("annuleren"))?>, action: c, cancel: 1 } : {}
		],
		show_function,
		width
	);
}

function showOverlay(io, success_function, cancel_function, show_function) {
	io = $(io);
	if (!io.parent().is('body'))
		$(document.body).append(io);
	createOverlay(
		io,
		success_function,
		cancel_function,
		undefined,
		function() {
			io.find('.ok').hide();
			if (show_function)
				show_function();
		}
	);
}

/* ------------------- HASH HANDLING  -------------------*/

function getHashPage() {
	return window.current_page;
}

function getHashPageId(index) {
	var page = getHashPage();

	var page_id_arr = window.hash_map[page];

	if (index !== undefined)
		return page_id_arr[index];

	return page_id_arr;
}

function setHashPageId(page_id, index) {
	var page = getHashPage();

	if (!(page_id instanceof Array)) {
		var value = page_id;
		page_id = getHashPageId();
		index = index || 0;
		page_id[index] = value;
	}

	var result_hash = [];

	for (var i in window.hash_array) {
		last_hash = window.hash_array[i].hash;
		result_hash.push(last_hash);
	}

	result_hash.pop();
	result_hash.push(genHash(page, page_id));

	top.document.location.hash = result_hash.join('/');
}

function addHash(page, page_id, name) {
	var last_hash = undefined;
	var result_hash = [];

	for (var i in window.hash_array) {
		last_hash = window.hash_array[i].hash;
		result_hash.push(last_hash);
	}
	var new_hash = genHash(page, page_id);
	if (last_hash != new_hash)
		result_hash.push(new_hash);

	page_name_map[new_hash] = name || '';

	top.document.location.hash = result_hash.join('/');
}

function parseHash(hash) {
	var arr = hash.split('+');
	return { page: arr.shift() || "" , page_id: arr, hash: hash };
}

function genHash(page, page_id) {
	//console.log("genHash: page="+page);
	if (page === undefined || page === null)
		page = getHashPage();

	var hash = page;
	if (page_id instanceof Array) {
		var last;
		do {
			last = page_id.pop();
		} while (page_id.length > 0 && (last === undefined || last === "" || last === null));

		if (last) {
			page_id.push(last);
			hash += '+'+page_id.join('+');
		}
	}

	return hash;
}

var hash_map = { "": [] };
var hash_array = [];
var current_page = "";
var page_name_map = {};

function treatHash() {
	window.hash_map = { "": [] };
	window.hash_array = [];
	window.current_page = "";
	window.hash_array = top.document.location.hash.replace('#', '').split('/').filter(function(a) { return !!a; });
	for (var i=0; i<hash_array.length; i++) {
		var hash = parseHash(hash_array[i]);
		window.hash_array[i] = hash;
		window.hash_map[hash.page] = hash.page_id;
		window.current_page = hash.page;
	}
	if (window.hash_array.length == 0 || window.hash_array[0].page != "")
		window.hash_array.unshift(parseHash(""));

	var page_url = current_page;

	/*
	var selected_tab = top.$('nav a[data-page="'+page_url+'"]');
	if (selected_tab.length > 0) {
		top.$('nav a[data-page]').parent().removeClass('selected');
		selected_tab.parent().addClass('selected');
	}
	*/

	var page = $('section[data-url="'+page_url+'"]');
	page = show_page(page, window.page_name_map[genHash(getHashPage(), getHashPageId())] || "");
	var active = page.children('.portal_block');
	active.each(function(i,e) {
		$(e).trigger('load');
	});
	renderBreadcrumb();
}

function renderBreadcrumb() {
	function createCrumb(title, hash_part, hash_complete) {
		var a = create_a(title);
		var elem = create_li().append(a);
		if (!title)
			a.html(<?=_J(icon("home"))?>);

		elem.attr('data-url', hash_part);
		elem.click(function() {
			top.document.location.hash = hash_complete;
			return false;
		});
		return elem;
	}

	var breadcrumb = create_div();
	var hash_url = [];
	for (var i=0; i<window.hash_array.length; i++) {
		var hash = window.hash_array[i];
		var new_hash = hash.hash;
		$('section[data-url="'+hash.page+'"]').trigger('page-get-name', hash);
		hash_url.push(new_hash);
		breadcrumb.append(createCrumb(window.page_name_map[new_hash] || hash.page, new_hash, hash_url.join('/')));
		i === 1 ? $('nav #portalname').text(window.page_name_map[new_hash]) : ""; // to fill the portalname for the mobile context
	}
	breadcrumb.children().last().addClass('selected');
	$('.back_to_widgets').empty().append(breadcrumb.children());
}

function updatePageName(page, page_id, name, only_not_empty) {
	var hash = genHash(page, page_id);
	var last_hash = window.hash_array[window.hash_array.length-1];
	if (only_not_empty && window.page_name_map[hash])
		return;
	if (page == last_hash.page && page_id == last_hash.page_id)
		top.document.title = name + top.postfix_title;
	window.page_name_map[hash] = name;
	$('section[data-url="'+hash.page+'"]').trigger('page-set-name', hash.page, hash.page_id, name);
	$('.back_to_widgets').find('[data-url="'+hash+'"]').children('a').text(name);
}

$(document).bind('update_config', function() {
	var articles = $('article.portal_block');
	$('#hidden_page').append(articles);

	if (!top.config || !top.config.portal_widget)
		return;


	for (var i in top.config.portal_widget) {
		var widget_module = 'portalwidget/'+top.config.portal_widget[i];
		loadModule(widget_module, function(widget) {
			var widget_elem = $(widget.widget);
			if (widget_elem.length == 0) {
				console.log("error loading ", widget_module);
				return;
			}
			var page = widget_elem.attr('data-page') || 'main';
			var section = $('section#page_'+page);
			if (section.length == 0) {
				section = $('<section/>').attr('id', 'page_'+page).attr('data-url', page);
				$('.pages').append(section);
			}
			section.append(widget_elem);
			if (widget.initWidget)
				widget.initWidget();
			else
				console.log("error init ", widget_module);
		});
	}

	treatHash();

	if (getHashPage() == "") {
		var articles = $('#page_main').find('article.portal_block[data-goto-page]');
		if (articles.length == 1)
			goto_page(articles.attr('data-goto-page'), articles.attr('data-goto-page-id'));

		$('#page_main').show();
	}
});

$(document).ready(function() {
	schedule_update('update_config');
});
</script>

<style>
/* Status & geldigheid */
.status_line_blocks { <?=class_flex_row()?>; align-items: center; }
.status_line_blocks>span { <?=class_e(25)?>; border-bottom: 2px solid #DEDEDE; }
.status_line_blocks>div { height:12px; width: 12px; border-radius:50%; border:2px solid #DEDEDE; background: #FFF; padding: 2px; color: white; line-height: 0.9em; font-size: 0.9em; }
.status_line_blocks>div.done { background-color: #999; border-color: #999; }
.status_line_blocks>div.open { border-color: #999; }

.valid_blocks { padding: 6px 0px; }
.valid_blocks>div:before { position: absolute; left: 50%; height:17px; border-left: 1px solid #666; top: -6px; content: " "; }
.valid_blocks>div { height: 5px; background: #DEDEDE; position: relative; }
.valid_blocks>div>div { height: 5px; background: #5CB85C; position: absolute; }
</style>
<script>
function createStatus(status) {
	var block = create_div().addClass('status_line_blocks').append(
		create_div(),
		create_span(),
		create_div(),
		create_span(),
		create_div(),
		create_span(),
		create_div()
	);
	if (status > 0)
		block.children('div').slice(0,status).html('<i class="fa fa-check"></i>').addClass('done');
	block.children('div').eq(status).addClass('open');
	return block;
}

function getCertificationPhase(item) {
	var status = 1; // Ingediend als default
	if (item.cap == <?=_J(CAP_KLANT)?>) {
		status = 2; // CAP bij klant
	} else
	if (item.portalshare == "1") {
		status = 0; // Nog in te vullen formulier
	} else
	if (item.type == <?=_J(STATUS_GEPLAATST)?> && new Date().add(30).isoDateFormat() < item.validto) {
		status = 4; // Positief, niet verlopen
	} else
	if (item.type == <?=_J(STATUS_GEPLAATST)?> && new Date().isoDateFormat() <= item.validto) {
		status = 5; // Positief, bijna verlopen
	} else
	if (item.type == <?=_J(STATUS_NIETGEPLAATST)?> || new Date().isoDateFormat() > item.validto) {
		status = 6; // Negatief of verlopen
	}
	return status;
}

function createValid(start, eind, reference, scale) {
	reference = reference || new Date().isoDateFormat();
	scale = scale || 365;
	var inner_block = create_div();
	var block = create_div().addClass('valid_blocks').append(
		create_div().append(
			inner_block
		)
	);
	if (!start || !eind) {
		block.children().hide();
	} else {
		var startsec = start.toDate().getTime() / dayMillisecs;
		var eindsec = eind.toDate().getTime() / dayMillisecs;
		var zero_point = reference.toDate().getTime() / dayMillisecs - scale;
		var left = min(100, max(0, ((startsec-zero_point) / (scale*2)) * 100));
		var width = min(100-left, max(0, ((eindsec - max(zero_point, startsec)) / (scale*2)) * 100));
		inner_block.css({
			'left': left+'%',
			'width': width+'%'
		});

		block.attr('hint', htmlEscape(<?=_JF(_("geldigheid"))?>+": "+start.sqlToHumanDate()+" - "+eind.sqlToHumanDate()));
	}
	return block;
}

function _printTaskDetails(obj, _this) {
	obj['obs_conform'] = parseInt(obj['observation0-25'] || 0);
	obj['obs_minor' ] = parseInt(obj['observation25-50'] || 0);
	obj['obs_minor3'] = parseInt(obj['observation50-75'] || 0);
	obj['obs_major'] = parseInt(obj['observation75-100'] || 0);
	obj['obs_onbeantwoord'] = parseInt(obj['onbeantwoord'] || 0);
	var printObservation = obj.obs_onbeantwoord || obj.obs_major || obj.obs_minor3 || obj.obs_minor || obj.obs_conform ? true : false;

	obj['score_conform'] = parseInt(obj['score0-25'] || 0);
	obj['score_minor' ] = parseInt(obj['score25-50'] || 0);
	obj['score_minor3'] = parseInt(obj['score50-75'] || 0);
	obj['score_major'] = parseInt(obj['score75-100'] || 0);
	obj['score_onbeantwoord'] = parseInt(obj['onbeantwoord'] || 0);
	var printScore = obj.score_onbeantwoord || obj.score_major || obj.score_minor3 || obj.score_minor || obj.score_conform ? true : false;

/*
	if (parseInt(obj.refdocumentfilled || 0) && parseInt(obj.refdocument || 0) > 0) {
		but = create_div().addClass('box-button').html('<i class="fa fa-download"></i>').click(function(e){
			downloadKeurmerkhouderRapport(obj.id, obj.refniveau5);
		});
	}
*/

	var formButton = create_div().addClass('box-button').html('<i class="fa fa-wpforms fa-fw"></i>').click(function(e){
		e.stopPropagation(); // Prevent the onclick on the row, which would open the invoice.
		top.openPopupVragenlijst({ refstart: obj.refdocument });
	});

//	var image = document_info.getIcon(obj.documenttype, obj.extension);
	var image = "";
	if (parseInt(obj.refrapport || 0)) {
		image = $(document_info.getIcon('application/pdf', 'pdf'));
		image.click(function() {
			downloadDocument(obj.refrapport);
		});
	}

	var row = create_div().addClass('row pointer').append(
/*
		create_span().addClass('col-action').append(formButton),
*/
		create_span().addClass('col-icon').append(image),
		create_span(obj.niveau4).addClass('col-organization ellipsis'),
		create_span(obj.kvk).addClass('col-kvk ellipsis'),
		create_span(obj.adres + ', ' + obj.plaats).addClass('col-address ellipsis'),

		create_span().addClass('col-timeline').append(
			createValid(obj.validfrom, obj.validto, undefined, 365*3)
		),

		create_span(obj.auditor_refniveau4naam).addClass('col-auditor ellipsis'),

		create_div().addClass('col-observation statistics').append( // with a span the outer hint will overrule the inner hint
			(printObservation ?
				create_span().attr('hint', <?=_JF(_("observatie"))?>).append(
					create_div(obj.obs_conform || '0').addClass('conform'),
					create_div(obj.obs_minor || '0').addClass('minor'),
					create_div(obj.obs_minor3 || '0').addClass('minor3'),
					create_div(obj.obs_major || '0').addClass('major'),
					create_div(obj.obs_onbeantwoord || '0').addClass('onbeantwoord')
						.attr('hint', obj.onbeantwoord + ' ' + <?=_JF(_("onbeantwoorde items"))?> || '0'),
					$('<br/>')
				)
			:
				""
			),
			(printScore ?
				create_span().attr('hint', <?=_JF(_("score"))?>).append(
					create_div(),
					create_div(obj.score_minor || '0').addClass('minor'),
					create_div(obj.score_minor3 || '0').addClass('minor3'),
					create_div(obj.score_major || '0').addClass('major'),
					create_div()
				)
			:
				""
			)
		)
	);

	row.click(function() {
//		downloadDocument(obj.refdocument);
	});

	_this.addRowToList(row, obj.id);
}

/**
 * @brief           Returns the first date of a specific month as a date object.
 * @param  periode  periode in format 201706
 * @return          date object
 */
function getDateFromPeriod(periode) {
	var year = periode.substring(0, 4);
	var month = periode.substring(4, 6);
	var firstDay = new Date(year, parseInt(month)-1, 1);
	return firstDay;
}

/**
 * @brief           Returns the first date of a specific month, ISO formatted.
 * @param  periode  periode in format 201706
 * @return          date string in ISO format 2017-06-01
 */
function getFirstDayOfTheMonth(periode) {
	return getDateFromPeriod(periode).begin_month().isoDateFormat();
}

/**
 * @brief           Returns the last date of a specific month, ISO formatted.
 * @param  periode  periode in format 201706
 * @return          date string in ISO format 2017-06-30
 */
function getLastDayOfTheMonth(periode) {
	return getDateFromPeriod(periode).end_month().isoDateFormat();
}

</script>
