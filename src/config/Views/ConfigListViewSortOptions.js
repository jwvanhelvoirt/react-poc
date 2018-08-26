const listViewConfig = {
	columns: [
		{
			id: 'label',
			label: 'Sorteer optie',
			data: 'label',
			displayOn: 'always',
			show: true,
			size: 'Flex100'
		}
	],
	row: { selectable: true, menu: false },
	viewType: 'sort'
}

export default listViewConfig;
