// window.addEventListener('load', function(evt) {
jQuery(document).ready(function($) {


    $("#ar_login_form").on('submit', function(e) {
        e.preventDefault();

        const $loginButton = $("#ar_login_submit");

        //@todo: Add loading icon and disable the login button.

        const email = $("#ar-login-email").val();
        const pass = $("#ar-login-password").val();
        const data = {
            'action': 'awSignInEmail_ajax',
            'email': email,
            'pass': pass
        };

        $loginButton.attr("disabled", true);

        $(".awloadingIcon").show();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            async: false,
            success: function(response) {

                const data = $.parseJSON(response);
                if(data['status'] == 10) {
                    window.location.reload();
                } else {
                    $("#aw-API-Error").html(data['data']).fadeIn().delay(5000).fadeOut("slow");
                }


                $(".awloadingIcon").hide();
            }, complete: function() {
                $loginButton.attr("disabled", false);
            },
        });


    });

    $("#ar_disconnect").click(function(e) {
        e.preventDefault();
        const data = {
            'action': 'disconnect_ajax'
        };
        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: data,
            success: function(response) {
                console.log(response);
                location.reload();
            }
        });
    });


    $("input[name='editorHighlight'][value=" + aranalyzer_params.isHighlightingEnabled + "]").attr('checked', 'checked');
    $("input[name='editorHighlight']").on('change', function(e){
        const data = {
            'action': 'update_editor_highlighting',
            'value': jQuery("input[name='editorHighlight']:checked").val(),
        };
        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: data,
            success: function(response) {
                var responseObj = JSON.parse(response);
                console.log(response, responseObj);
                $('#ar_success').fadeIn().delay(1000).fadeOut();
            }
        });
    })



});
