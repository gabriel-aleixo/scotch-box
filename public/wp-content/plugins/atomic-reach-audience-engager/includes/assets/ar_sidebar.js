// import { Button } from '@wordpress/components';

/*export default function MyButton() {
    return <Button>Click Me!</Button>;
}*/


( function( wp ) {
    var registerPlugin = wp.plugins.registerPlugin;
    var PluginSidebar = wp.editPost.PluginSidebar;
    const  { PluginBlockSettingsMenuItem, PluginDocumentSettingPanel } = wp.editPost;
    var el = wp.element.createElement;





    function MyDocumentSettingPlugin() {
        return el(
            PluginDocumentSettingPanel,
            {
                className: 'my-document-setting-plugin',
                title: 'My Panel',
            },
             'My Document Setting Panel'
        );
    }

    // registerPlugin( 'ar-plugin', {
    //     render: MyDocumentSettingPlugin
    // } );


    wp.data.subscribe(function () {
        // const meta = wp.data.select( 'core/editor' ).getBlocks();
        // const meta = wp.data.select( 'core/editor' ).getEditedPostContent();
        // const meta = wp.data.select( 'core/editor' ).getMultiSelectedBlocks();
        // console.log(meta);





    })
    var Text = wp.components.TextControl;


    registerPlugin( 'atomicreach-sidebar', {
        render: function() {
            return el( PluginSidebar,
                {
                    name: 'atomicreach-sidebar',
                    icon: 'palmtree',
                    title: 'Atomic Reach',
                },
                el( 'div',
                    { className: 'plugin-sidebar-content' },
                    el( Text, {
                        label: 'Meta Block Field',
                        value: 'Initial value',
                        onChange: function( content ) {
                            console.log( 'content changed to ', content );
                        },
                    } )
                )
            );
        },
    } );
} )( window.wp );

function a(){

// return MyButton();
    return

}
