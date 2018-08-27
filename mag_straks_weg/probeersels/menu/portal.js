"use strict";

var Portal = {};

Portal.Base = {
	/* Interface part. These should be set in the individual widgets */

	/** (optional) server api */
	api: null,

	/** (required) widget object */
	widget: null,

	/** (optional) returns params the server api takes */
	getParams: function(params) { return params; },


	/* Should be implemented in base objects below */

	/** (optional) Initializes the widget */
	initWidget: function() {
		var _this = this;
		if (this.initialized)
			return false;

		this.widget = $(this.widget);
		this.widget.on("load", function() {
			_this.load();
		});

		this.initialized = true;

		return true;
	},
	/** (optional) Immediate initialization */
	initImmediate: function() {
		var _this = this;

		$(document).on('init_widget', function() {
			_this.initWidget();
		});
	},

	/** (optional) Creates the default params object */
	getDefaultParams: function() {
		return {};
	},

	/** Executes the call */
	call: function(params) {
	},


	/* Internal part. */

	/** internal state object */
	initialized: false,

	/** internal cache object to prevent loading twice the same content */
	last_params: null,

	/**
	 * @brief  Loads the data, and loads it into the list
	 * @param force_reload  (optional) override the last_params cache, so the reload will take place anyway
	 */
	load: function(force_reload) {
		if (!this.initialized) {
			this.initWidget();
		}

		var params = this.getParams(this.getDefaultParams());
		if (!force_reload) {
			// A hash change triggers a new load (via treatHash). That causes flickering in a multi-widget, single screen portal.
			// This check prevents reloading.
			var new_params = JSON.stringify(params);
			if (this.last_params == new_params)
				return;
		}
		this.last_params = new_params;
		if (params.load !== false) { // For some widgets (register f.i.) there's no initial load of the list, only after a search.
			this.call(params);
		}
	},

};

Portal.dashboard = createPrototype(Portal.Base, {
	call: function(params) {
		var _this = this;
		schedule_call(this.api, params, function(data) {
			var count = parseInt(data.cnt || 0) || (data.list && data.list.length) || 0;
			var countPrint = count < parseInt(top.max_result_count) ? count : (top.max_result_count - 1) + "+";
			_this.widget.find('.count').text(countPrint);
		});
	},
});
Portal.listWidget = createPrototype(Portal.Base, {
	/* Interface part. These should be set in the individual widgets */

	/** (required) function to create a row entry */
	createRow: null,

	/** (required) scrollable area. defaults to $(this.widget).find(".table_list") */
	list: null,

	/** (optional) element to fill. defaults to $(this.widget).find(".table_list .body>ul") */
	ul: null,

	/** (optional) hook to fill a category to group list items. */
	createRowCategory: function() {},

	/** (optional) hook to handle extra data */
	handleData: function(data, params) {},

	/** (optional) use the search on the server. defaults to false */
	use_server_search: false,


	/** internal scroll object */
	scroll: null,

	/** internal searchbox container element (can be empty) */
	searchbox: null,

	/** internal searchbox input element (can be empty) */
	searchbox_input: $(),
	/** internal searchbox remove element (can be empty) */
	searchbox_remove: $(),
	/** internal searchbox search button element (can be empty) */
	searchbox_search: $(),

	/** array containing IDs of selected rows **/
	selected: null,

	call: function(params) {
		if (this.scroll)
			this.scroll.load(params);
	},

	/**
	 * @brief  filters the list, by using server or client side filtering
	 * @param search_server  (optional) we are allowed to call the server to do the filtering
	 */
	filter: function(search_server) {
		// If we do NOT have a server side search, filter it right now
		if (!this.use_server_search)
			filter_list(this.searchbox_input, this, true);
		else
		// Only ask the server, if we're requested to do so
		if (search_server)
			this.load();

		// Check to show/hide the remove-searchtext icon
		this.searchbox_remove.css("display", (this.searchbox_input.val() != "" ? "" : "none"));
	},

	/**
	 * By default get the value of the searchbox as paramter
	 */
	getDefaultParams: function() {
		return {
			text: this.searchbox_input.val() || undefined
		}
	},

	/**
	 * Initializes widget. Returns true if something had to be done
	 */
	initWidget: function() {
		var _this = this;

		if (!Portal.Base.initWidget.call(this))
			return false;

		this.searchbox = this.widget.find('.bar-search');
		if (this.searchbox.length > 0) {
			this.searchbox_input = create_input().attr({ 'type': 'text', 'placeholder': naam_zoek + '...', 'autocomplete': 'off' });
			this.searchbox_remove = create_div().addClass('remove-searchtext').css('display', 'none').append(top.icons["select_x"]);
			this.searchbox_search = create_div().addClass('trigger-search').append(top.icons["search_img"]);

			this.searchbox_search.click(function() {
				_this.filter(true);
			});

			this.searchbox_input.on('input', function() {
				_this.filter();
			})
			this.searchbox_input.keypress(function(event) {
				if (event.keyCode == 13 || event.keyCode == 10) {
					_this.filter(true);
				}
			});
			this.searchbox_remove.click(function() {
				_this.searchbox_input.val("");
				_this.filter(true);
			});

			this.searchbox.empty().append(
				_this.searchbox_input,
				_this.searchbox_remove,
				_this.searchbox_search
			);
		}

		if (!this.list)
			this.list = this.widget.find(".table_list");
		if (!this.ul)
			this.ul = this.widget.find(".table_list .body>ul");

		this.scroll = initScroll(this.list, this.ul, this.api, function(data, params) {
			return _this.fillList(data, params);
		});

		return true;
	},

	fillList: function(data, params) {
		data = this.handleData(data, params) || data; // Some portals require manipulation of the data object before display.
		this.createRowCategory(data);
		for (var i in data.list) {
			this.createRow(data.list[i], data);
		}
		return data;
	},

	addRowToList: function(row, ref_row, row_classes, attribs, ul) {
		var line = create_li().append(
			create_a().append(row)
		);
		line.attr('ref', ref_row);

		// Append all custom attributes to the li.
		for (var i in attribs) {
			line.attr(attribs[i].name, attribs[i].val);
		}

		if (row_classes !== null && row_classes !== undefined && row_classes.length > 0) {
			line.addClass(row_classes);
		}

		var ulToAppendTo = ul || this.ul;
		ulToAppendTo.append(line);
		return line;
	},

	/**
	 * @brief  Triggers the menu interface and adds it to the listview.
	 * @param widget  string containing the id of the widget that contains the menu interface.
	 */
	initMenu: function(widget) {
		var _this = this;

		// Set a callback for if the user clicks the 'More' button in the menu bar.
		$('#' + widget + ' .action-menu').standard_click(function(e) {
			_this.menu.toggleMenu(_this.widget.find('.dropmenu'), false);
			return false;
		});

		// Create the object from the menu constructor and pass the 'this' context of the list.
		this.menu = createObject(Menu, { this_list: this });

		// Get the centrally configured menu items.
		this.central_items = this.menu.getCentralMenuItems(this.central_items_include);

		// Set the icon that indicates that there is a submenu.
		this.menu.icon_more = top.icons["meer"];

		// Print the primary menu items.
		this.menu.printPrimaryMenuItems();

		// Set click event of the toggle_all checkbox.
// 		$('#' + widget).find('[name=toggle_all]').standard_click(function() {
		$("#" + widget).find("input[name=toggle_all]").click(function() { // TODO : Jos, de .standard_click wrapper werkt hier niet, de jQuery method .click wel !!! checkbox???
			_this.toggleAllRows();
		});

	},

	/**
	 * @brief  Deselects all rows in the listview.
	 */
	uncheckAllRows: function() {
		this.widget.find('.body .col-checkbox input').prop('checked', false);
		this.setSelectedRows(this.widget);
	},

	/**
	 * @brief  Selects all rows in the listview.
	 */
	checkAllRows: function() {
		this.widget.find('.body .col-checkbox input').prop('checked', true);
		this.setSelectedRows(this.widget);
	},

	toggleAllRows: function() {
		if (this.selected.length > 0) {
			this.uncheckAllRows();
			this.widget.find("input[name=toggle_all]").prop('checked', false);
		} else {
			this.checkAllRows();
		}
	},

	/**
	 * @brief  Stores the IDs of all selected rows as an array in the listview property 'selected'.
	 * @param  widget     ID of the widget to inspect.
	 */
	setSelectedRows: function(widget) {
		var _this = this;

		this.selected = []; // Empty the current array.
		widget.find('.body .col-checkbox input:checked').each(function() {
			_this.selected.push($(this).attr('value'));
		});
	},

	/**
	 * @brief  Adds the action to the action column to expand a context menu when the user clicks on the row.
	 * @param obj           Object containing all data of the applicable row.
	 * @param action_row    DOM element that contains the action column.
	 */
	addContextMenuToRow: function(obj, action_row) {
		var _this = this;

		// Create the action.
		var but_menu = create_div().addClass('box-button box-button-dropdown icon').html(top.icons['select_v']).click(function(e){
				e.stopPropagation();
				_this.menu.toggleMenu(_this.widget.find('.dropmenu' + obj.id), false, true, obj.id);
			});

		// Append the action to the actionrow.
		action_row.append(
			create_span().addClass('col-action expand dropmenu' + obj.id).append(but_menu)
		);
	}

});
