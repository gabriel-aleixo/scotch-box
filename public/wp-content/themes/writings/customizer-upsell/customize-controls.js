( function( api ) {
	api.sectionConstructor['writings-upsell'] = api.Section.extend( {
		attachEvents: function () {},

		isContextuallyActive: function () {
			return true;
		}
	} );

} )( wp.customize );
