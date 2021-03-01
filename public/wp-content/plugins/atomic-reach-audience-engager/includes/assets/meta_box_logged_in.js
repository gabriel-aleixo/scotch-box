
/*wp.blocks.registerBlockStyle( 'core/paragraph', {
    name: 'fancy-quote',
    label: 'Fancy Quote'
} );*/




wp.data.subscribe(function() {

    const coreEditor = wp.data.select('core/editor');
    const hasSelectedBlock = coreEditor.hasSelectedBlock();
    if(hasSelectedBlock) {
        const selectedBlock = coreEditor.getSelectedBlock();
        console.log("+", hasSelectedBlock, selectedBlock, coreEditor.hasChangedContent(selectedBlock) );

        console.log(coreEditor.getEditedPostContent());


    }

})
( function( blocks, editor, element ) {
    var el = element.createElement;
    var RichText = editor.RichText;
    var AlignmentToolbar = editor.AlignmentToolbar;
    var BlockControls = editor.BlockControls;


    console.log(blocks.getSelectedBlock());


}(
    window.wp.blocks,
    window.wp.editor,
    window.wp.element
) );


/*
// On Ready
$(function() {
    // On Load
    $( window ).on( "load", function($) {
        console.log("in in in in ", ajaxurl);



        // atomicreach_document_analyze_on_load();








    });
});

function atomicreach_document_analyze_on_load(){
    console.log("on load calling");

    const data = {
        'action': 'atomicreach_document_analyze_on_load_ajax',
    };

    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: data,
        beforeSend: function () {
            STARTTIME = +new Date();

        },
        success: function (response) {

            console.log("success", response);


        },
        error: function (response) {
            console.log("error: ", response);
        },
        complete: function () {

            ENDTIME =  +new Date();

            console.log("Completed In: ",Math.round(((ENDTIME - STARTTIME) / 1000)) + " Seconds");


        }
    });


}
*/
