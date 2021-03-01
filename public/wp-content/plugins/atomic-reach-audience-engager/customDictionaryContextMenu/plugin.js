/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add('customdictionarycontextmenu', function(editor) {
	var menu;

	editor.on('contextmenu', function(e) {
		var contextmenu;

		e.preventDefault();

		contextmenu = editor.settings.contextmenu || 'link image inserttable | cell row column deletetable';

		// Render menu
		var items = [];

		var selection = editor.selection;
		var element = selection.getNode() || editor.getBody();

		if (element.nodeName == 'SPAN' && editor.dom.getAttrib(element, 'class') == 'highlight-sp') {
			contextmenu = 'customdictionarycontextmenu';
			editor.addMenuItem('customdictionarycontextmenu', {
				text : 'Add to dictionary',
				onclick : function() { 
						var body = editor.getBody();
						if (CustomDictionary.add(element.textContent)) {
							body.innerHTML = body.innerHTML.replace(element.outerHTML, element.textContent);
							editor.windowManager.alert('The word was added to the dictionary successfully. Please analyze the post again to see the new results.');
						}
						else {
							editor.windowManager.alert('There was an error adding the to the dictionary. Please try again.');
						}
					} });
		}
		
		tinymce.each(contextmenu.split(/[ ,]/), function(name) {
			var item = editor.menuItems[name];

			if (name == '|') {
				item = {text: name};
			}

			if (item) {
				item.shortcut = ''; // Hide shortcuts
				items.push(item);
			}
		});

		for (var i = 0; i < items.length; i++) {
			if (items[i].text == '|') {
				if (i === 0 || i == items.length - 1) {
					items.splice(i, 1);
				}
			}
		}
		menu = new tinymce.ui.Menu({
			items: items,
			context: 'contextmenu'
		});
		
		menu.renderTo(document.body);
			
		// Position menu
		var pos = tinymce.DOM.getPos(editor.getContentAreaContainer());
		pos.x += e.clientX;
		pos.y += e.clientY;

		menu.moveTo(pos.x, pos.y);

		editor.on('remove', function() {
			menu.remove();
			menu = null;
		});
	});
});