(function() {
	"use strict";

	$(document).on('page-get-name', 'section[data-url="invoices"]', function(e, hash) {
		updatePageName(hash.page, hash.page_id, <?=_JF(_portalName("facturen"))?>);
	});

	return createObject(Portal.listWidget, {
		api: "api.klant.getInvoices",
		use_server_search: true,
		widget: '#widget_facturen_facturen',
		initWidget: function() {
			var _this = this;
			this.context = this;

			if (!this.parent.initWidget.call(this))
				return false;

			this.initMenu("widget_facturen_facturen");

			return true;
		},
		central_items_include: [
			// Get the definitions of the centrally configured menu items we want to include into this view.
			{ main: "create",
			  sub: 	[
						{ name: "document" },
						{ name: "memo", sub: [ { name: "sub1" }, { name: "sub3" } ] },
					]
			},
			{ main: "edit" },
			{ main: "delete" },
		],
		central_items: null,
		decentral_items: [
			{
				icon: "view",
				label: <?=_JF(_("sample"))?>,
				order: 5,
				subitems: [
					{
						icon: "view",
						label: <?=_JF(_("sub1"))?>,
						order: 10,
						subitems: [
							{
								icon: "view",
								label: <?=_JF(_("subsub1"))?>,
								order: 10,
							},
							{
								icon: "view",
								label: <?=_JF(_("subsub2"))?>,
								order: 20,
							},
							{
								icon: "view",
								label: <?=_JF(_("subsub3"))?>,
								order: 30,
							},
						],
					},
					{
						icon: "view",
						label: <?=_JF(_("sub2"))?>,
						order: 20,
					},
					{
						icon: "view",
						label: <?=_JF(_("sub3"))?>,
						order: 30,
					},
				],
			},
			{
				icon: "view",
				label: <?=_JF(_("downloaden"))?>,
				order: 10,
				callback: function(info) {
					downloadDocument(info.this_list.selected[0]);
				},
			},
			{
				bar_primary: true,
				icon: "factuur",
				label: <?=_JF(_("betalen"))?>,
				multi_doc: false,
				order: 20,
				zero_doc: false,
				callback: function(info) {
					info.this_list.payInvoice(info.data.reffact);
				},
				callback_custom_condition: function(info) {
					// If no rows have been selected the info.data object is undefined. TODO : this is temporary, should become a more solid construction.
					return (info.data && (parseInt(info.data.betaald || 0) || parseInt(info.data.betaling_gespreid || 0))) ? Menu.STATE_DISABLED : "";
				},
			}
		],

		row_data: [],

		callback_edit: function() {
			alert("edit");
		},

		callback_delete: function() {
			alert("delete");
		},

		createRow: function(obj, data) {
			var _this = this;

			var action_row = create_span().addClass('col-actions');

			var row = create_div().addClass('row pointer').append(
				create_span().addClass('col-checkbox').html('<input type="checkbox" name="selected" value="' + obj.id + '">').click(function(){ _this.menu.printPrimaryMenuItems();} ),
				action_row,
				create_span(obj.naam).addClass('col-name ellipsis'),
				createDateTimeDiv(obj.datum).addClass('col-date ellipsis')
			);

			this.addContextMenuToRow(obj, action_row, row);

			row.click(function() {
			});

			row.dblclick(function() {
			});

			this.addRowToList(row, obj.id);

			this.row_data[obj.id] = {
				betaald: obj.betaald,
				betaling_gespreid: obj.betaling_gespreid,
				reffact: obj.reffact
			};
		},

		/*
		** @brief  Starts a payment transaction for a particular invoice and provides the user a popup window to complete the transaction.
		*/
		payInvoice: function(reffact) {
			callserver("api.klant.payInvoice", { id: reffact }, function(data) {
				var pu_width = max(900, window.screen.availWidth - 40);
				var pu_height = max(800, window.screen.availHeight - 40);
				var pu_left = parseInt((window.screen.availWidth - pu_width) / 2);
				var pu_top = parseInt((window.screen.availHeight - pu_height) / 2);
				window.open(
					data.url, "_blank", "titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes," +
					"top=" + pu_top + ",left=" + pu_left + ",width=" + pu_width + ",height=" + pu_height
				);
			});
		}
	});
})();
