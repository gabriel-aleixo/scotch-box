/**
 * Created by Atomic 1 on 8/7/2015.
 */
jQuery(document).ready(function ($) {

    // ATOMIC REACH SCORE REMINDER
    $("#awAdminNoticeSignup").click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#aranalyzer_metabox").offset().top
        }, 1000, function () {
            // Animation complete.
            $("#aranalyzer_metabox .inside").addClass('aw-glow');
            setTimeout(function () {
                $("#aranalyzer_metabox .inside").removeClass('aw-glow');
            }, 1000)
        });
    });

    $("#aw-goTosignInForm").click(function (e) {
        e.preventDefault();
        $("#aw-signUp").fadeOut(function () {
            // Animation complete.
            $("#aw-signIn").fadeIn();
        });
    });

    $("#aw-signUpForm").submit(function (e) {
        e.preventDefault();
        var email = $("#aw-signUpEmail").val();
        var pass = $("#aw-signUpPassword").val();
        var pass2 = $("#aw-signUpPasswordReType").val();

        if (pass != pass2) {
            $("#aw-API-Error").html("Password do not match!").show().delay(5000).fadeOut("slow", function () {
                $(this).empty()
            });
            return;
        }
        if (!jQuery("#tos").is(":checked")) {
            $("#aw-API-Error").html("Unfortunately you cannot set up an account without accepting our Terms of Use. Please feel free to use our" +
                " <a href='https://www.atomicreach.com/' target='_blank'>Web App</a>.").show().delay(9000).fadeOut("slow", function () {
                $(this).empty()
            });
            return;

        }
        // var newtab = window.open('', '', "width=600, height=800, menubar=0, status=0, titlebar=0, toolbar=0");
        //var newtab = window.open('','_blank') ;

        $(".awloadingIcon").show();

        var data = {
            'action': 'awSignUpEmail_ajax',
            'email': email,
            'test': 'test',
            'pass': pass
        };
        $.post(ajaxurl, data, function (response) {
            console.log(response);

            if (!response.match(/ok/g)) {
                // newtab.close();
                var value = JSON.parse(response);

                if (typeof value.data.email !== 'undefined') {
                    emailMessages = Object.keys(value.data.email);
                    $.map(emailMessages, function (val, i) {
                        $("#aw-API-Error").append("<p class='text-danger'><strong>Create Account</strong> - Email Error: " + value.data.email[val] + "</p>");
                    });
                }
                if (typeof value.data.password !== 'undefined') {
                    passwordMessages = Object.keys(value.data.password);
                    $.map(passwordMessages, function (val, i) {
                        $("#aw-API-Error").append("<p class='text-danger'> <strong>Create Account</strong> - Password Error: " + value.data.password[val] + "</p>");
                    });
                }

                $("#aw-API-Error").show().delay(5000).fadeOut("slow", function () {
                    $(this).empty()
                });
            } else {
                var x = response.split("-");
                // newtab.location = 'https://www.atomicreach.com/wordpress-signup/?accountId=' + x[1];


                $("#aw-atomicAdminNotice").fadeOut();
                $("#AW-StandBy").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/audSlider-score.html", function () {
                    $("#AW-notLoggedIn").slideUp("slow", function () {
                        $("#AW-StandBy").slideDown("slow");
                        createTooltipsyForTheI();
                    });
                });

            }
            $(".awloadingIcon").hide();
        }).done(function () {
        }).always(function () {
        });
    });

    $("#aw-signInFormSubmit").click(function (e) {
        e.preventDefault();
        var email = $("#aw-signInEmail").val();
        var pass = $("#aw-signInPassword").val();
        var data = {
            'action': 'awSignInEmail_ajax',
            'email': email,
            'test': 'test',
            'pass': pass
        };
        $(".awloadingIcon").show();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            async: false,
            success: function (response) {

                var data = $.parseJSON(response);

                console.log(data);

                if(data['status'] == 10){
                    $("#aw-atomicAdminNotice").fadeOut();
                    $("#AW-StandBy").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/go-to-create.php", function () {
                        $("#AW-notLoggedIn").slideUp("slow", function () {
                            $("#AW-StandBy").slideDown("slow");
                            createTooltipsyForTheI();
                        });
                    });
                }else{
                    $("#aw-API-Error").html(response).fadeIn().delay(5000).fadeOut("slow");
                }


                $(".awloadingIcon").hide();
            },
            done: function () {
            }, always: function () {
            }
        });
    });


    var audBand = 5;
    // change audience slider
    $("#aranalyzer_metabox").on("change", '.ar-aud-slider_WP', function (e) {

        var audnum = $(this).val();
        var audText = '';


        if (audnum == 1) {
            audText = 'General';
            audBand = 5;

            $('#ar_desc-aud_WP, #ar_desc-aud_WP2').html("Beginner Novice Basic")
        } else if (audnum == 2) {

            audText = 'Knowledgeable';
            audBand = 4;
            $('#ar_desc-aud_WP, #ar_desc-aud_WP2').html("Aware Familiar Informed");

        } else if (audnum == 3) {
            audText = 'Specialist';
            audBand = 3;
            $('#ar_desc-aud_WP, #ar_desc-aud_WP2').html("Advanced Trained Well-versed")
        } else if (audnum == 4) {
            audText = 'Academic';
            audBand = 2;
            $('#ar_desc-aud_WP, #ar_desc-aud_WP2').html("Scholarly Collegiate Masterful")
        } else if (audnum == 5) {
            audText = 'Genius';
            audBand = 1;
            $('#ar_desc-aud_WP, #ar_desc-aud_WP2').html("Expert Brilliant Intellectual")
        }


        $('#arSelectedAud_WP, #arSelectedAud2').text(audText).removeClass().addClass(audText + "ColorText");
        $('#ar_desc-aud_WP, #ar_desc-aud_WP2').removeClass().addClass(audText + "ColorText");

        targetAud = audText.toUpperCase();
    });
    // Click Score button
    $("#aranalyzer_metabox").on("click", "#arScore_WP", function (e) {
        e.preventDefault();

        var title = $("#title").val();
        var content = tinyMCE.activeEditor.getContent();

        if (title == "") {
            $("#right-score").html("<span style='color: #ff0000;'>ERROR! : Title is missing. Please write your title and try again.</span>").fadeIn().delay(5000).fadeOut();
            return;
        }
        if (content == "") {
            $("#right-score").html("<span style='color: #ff0000;'>ERROR! : Content is missing. Please write some content and try again.</span>").fadeIn().delay(5000).fadeOut();
            return;
        }

        var STARTTIME,ENDTIME;

        var data = {
            'action': 'aranalyzer_ajax',
            'arTitle': title,
            'arContent': content,
            'segmentId': audBand
        };
        var quote = displayQuote();


        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: data,
            beforeSend: function () {
                STARTTIME = +new Date();
                if ($("#right-score").is(":visible")) {
                    $("#right-score").slideUp(function () {
                        $("#AW-staticBlock").fadeOut(function () {
                            $("#awloadingBlock").fadeIn();
                            $(".ar-selectAudSlider_WP").show();
                            $("#arAudDetails").hide();
                        });
                    });
                } else {
                    $("#AW-staticBlock").fadeOut(function () {
                        $("#awloadingBlock").fadeIn();
                    });
                }
                $('.randomQuote').find('p').html(quote[0])
                $('.randomQuote').find('.quoteFooter').html(quote[1]);
                clearAllhighlighting();
            },
            success: function (response) {
                jQuery("#right-score").html(response).hide();
                ARTabs();
                ar_tips();
                ar_tipsread();
                ar_scoreDisplay();
                sortTitleMeasure();
                ENDTIME =  +new Date();
                $("#scoreTime small").html( "(" + Math.round(((ENDTIME - STARTTIME)/1000)) + " Seconds)").css('color', '#777;');

                //OnSuccessFeedback(response)

            },
            error: function (response) {

            },
            complete: function () {
                $("#awloadingBlock").fadeOut(function () {
                    $(".ar-selectAudSlider_WP").hide();
                    $("#arAudDetails").show();
                    $("#AW-staticBlock").fadeIn(function () {
                        $("#right-score").slideDown("slow");
                    })
                });
                $("#arScore_WP").text("RESCORE")

                // Show audience box when click
                $('#changeAudience').unbind('click').bind('click', function (e) {
                    e.preventDefault();
                    console.log(e);
                    //$('#scoreButton').remove();
                    $('.ar-selectAudSlider_WP').slideToggle();
                });

            }
        });


    });


    /********************************/
    /**** Score Button & new-meta.php Tabs ui ****/
    /********************************/
    $("#right-score").on("load", "ul.AR-tabs", ARTabs());
    function ARTabs() {


        $('ul.AR-tabs').each(function () {
            // For each set of tabs, we want to keep track of
            // which tab is active and it's associated content
            var $active, $content, $links = $(this).find('a');

            // If the location.hash matches one of the links, use that as the active tab.
            // If no match is found, use the first link as the initial active tab.

            $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[2]);
            $active.addClass('active');
            $content = $($active[0].hash);

            // Hide the remaining content
            $links.not($active).each(function () {
                $(this.hash).hide();
            });

            // Bind the click event handler
            $(this).on('click', 'a', function (e) {
                // Make the old tab inactive.
                $active.removeClass('active');
                $content.hide();

                // Update the variables with the new link and content
                $active = $(this);
                $content = $(this.hash);

                // Make the tab active.
                $active.addClass('active');
                $content.show();

                // Prevent the anchor's default click action
                e.preventDefault();
            });
        });
    }

    function ar_scoreDisplay(){
        $('#scoreBubble').css('margin-left', (ARTICLESCORE - 12) + '%');
        $('#scoreBubble > span').text(ARTICLESCORE);
        $('#scoreBar').css('width', ARTICLESCORE + '%');

        if (ARTICLESCORE > ATOMICSCORE) {
            $('#notHIT').hide();
            $('#HIT').show();
        }else{
            $('#notHIT').show();
            $('#HIT').hide();
        }
        if (ATOMICSCORE > 0) {
            $('div#atomicScoreIndicator').show();
            $('#atomicScoreIndicator').css('margin-left', (ATOMICSCORE - 4) + '%');
            $('#atomicScoreIndicator  strong').html(ATOMICSCORE);
        } else {
            $('div#atomicScoreIndicator').hide();
        }
        var so = soHL;
        if(so.state == 10) {
            so.state == 'green' ? $('#audienceWrapper p.so-actual').hide() : $('#audienceWrapper p.so-actual').show();


            $('#audienceWrapper p.so-target > span').html(so.detail.toLowerCase());
            $('#audienceWrapper p.so-target > strong').html(typeof so.target == 'undefined' ? so.actual : so.target);
            $('#audienceWrapper p.so-actual > strong').html(so.actual);
            //$('i.so-actual').addClass("color-aud-"+val.data.analysis.so.actual);
            $('#audienceWrapper p.so-target > strong, i.so-target').removeClass(function (index, css) {
                return (css.match(/\bcolor-aud-\S+/g) || []).join(' ');
            }).addClass("color-aud-" + so.target);
            $('#audienceWrapper p.so-actual > strong, i.so-actual').removeClass(function (index, css) {
                return (css.match(/\bcolor-aud-\S+/g) || []).join(' ');
            }).addClass("color-aud-" + so.actual);
        }else if(so.state == 14){
            noAccessDisplay();
        }else{
            console.error("something went wrong",so);
        }
    }

    function noAccessDisplay(){
        var LockIconHTML = '<i class="fa fa-lock ar-feature-lock"></i>';
        $("#scoreBubble > span")
            .html(LockIconHTML)
            .css({
                'top': '16px'
                ,'left': '23px'
                ,'color': '#ddd'
            });
        $("#notHIT, #HIT, .text-center.so-target, .text-center.so-actual").hide();

        $("#targetandactual").addClass('ar-feature-lock');

        $("#targetandactual").find("i.fa-circle").removeClass("fa-circle").addClass("fa-lock fa-lock-background");

        if(ARBELOW50) {
            $('#scoreBubble').css('margin-left', (19 - 12) + '%');
            $("#BELOW50").show();
            $("#ABOVE50").hide();
        }
        if(AROVER50){
            $('#scoreBubble').css('margin-left', (51 - 12) + '%');
            $("#ABOVE50").show();
            $("#BELOW50").hide();
        }


        $("#ar-WCbtn").find(".onoffswitch").html('<i style="float: right;" class="fa fa-lock fa-2x ar-feature-lock"></i>');

        $(".ar-feature-lock").tooltipsy({
            offset: [-4, 0],
            className: 'arTooltipsy arlockedTooltip',
            content: 'Please upgrade your account to use this locked feature. <a href="https://my.atomicreach.com/cs/account#plan" target="_blank"><button class="btn btn-orange">Upgrade</button></a>'
        });


    }


    function ar_tips() {

        if (titleKeywordState.toLowerCase() != 'green') {

            $("#ar-kword").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Your Keywords:</b> <br><p>' + tgKeywords + '</p>'
            });

        }

        if (lengthState == 'red' || 'yellow') {

            $("#ar-ln").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b> <br>You have <span>' + lengthCount + '</span> sentences. Hit the ideal mark of 26-75 sentences to increase readability.'
            });
        } else if (lengthState == 'green') {

            $("#ar-ln").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b> <br>Length of article is <span>' + lengthCount + ' </span>sentences. You are good to go!'
            });
        }

        if (grammarState == 'green') {

            $("#ar-gm").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>' +
                'Whoa, you are good!'
            });
        } else if (grammarState == 'red' || 'yellow') {

            $("#ar-gm").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>' +
                ' Turn on the highlight feature to identify grammar issues.'
            });
        }

        if (spellState == 'green') {

            $("#ar-sm").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>' +
                'You are a great speller!'
            });
        } else if (spellState == 'red' || 'yellow') {

            $("#ar-sm").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>' +
                'Turn on the hightlight feature to fix or add words to dictionary.'
            });
        }
        ;


        if (linkState == 'green') {

            $("#ar-lc").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>' +
                'Your links are valid. Phew!'
            });
        }
        else if (linkState == 'red' || 'yellow') {


            $("#ar-lc").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br> Link is broken or slow-to-load.'
            });
        }

        jQuery(".titleTooltip").tooltipsy({
            offset: [-10, 0],
            className: 'arTooltipsy'
        });



    }

    function ar_tipsread() {
        if (emState == 'green') {

            $("#ar-em").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br> Connect with your readers using a positive or negative emotion.'
            });
        }
        else if (emState == 'red' || 'yellow') {


            $("#ar-em").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br> Turn on highlighting to see how you are emotionally connecting with your readers.'
            })
        }


        if (pwdState == 'green') {
            $('#ar-PWDbtn').remove();

            $("#ar-pwd").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br> Paragraph density is great, making reading a breeze!'
            });
        }
        else if (pwdState == 'red' || 'yellow') {


            $("#ar-pwd").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>Turn on the highlight feature and revise those sections.'
            })
        }

        if (senState == 'green') {
            $('#ar-SObtn').remove();
            $("#ar-so").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br> Sentence density matches audience readability.'
            });
            $("#ar-wc").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br> Word complexity matches audience readability.'
            });
        }
        else if (senState == 'red' || 'yellow') {

            if (soHL.detail == "TOO COMPLEX") {
                var contentWC = "Turn on highlighting and replace some of the words that are too complicated for your audience.";
                var contentSO = "";
            }
            if (soHL.detail == "TOO SIMPLE") {
                var contentWC = "Turn on highlighting and replace some of the words that are too simple for your audience.   ";
                var contentSO = "";
            }

            $("#ar-so").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>  Turn on highlighting and revise most of these sections.'
            });

            $("#ar-wc").tooltipsy({
                offset: [-10, 0],
                className: 'arTooltipsy',
                content: '<b>Tip:</b><br>' + contentWC
            })
        }


    }

// clear highlight before submiting form, this way will clean the html added to the iframe
    $('form#post').submit(function () {
        clearAllhighlighting();
        return true;
    });

    function clearAllhighlighting() {
        var element = $('#content_ifr').contents().find('body');

        forceRemoveHighlightPopup();

        if ($(element).find("span.sm").length > 0) {
            if ($(element).find("span.sm").text().length == 0) {
                $(element).find("span.sm").remove()
            }else {
                $(element).removeHighlight('.sm');
            }
        }
        if ($(element).find("span.arGMhighlight").length > 0) {
            if ($(element).find("span.arGMhighlight").text().length == 0) {
                $(element).find("span.arGMhighlight").remove()
            }else {
                $(element).removeHighlight("span.arGMhighlight");
            }
        }

        if ($(element).find("span.arEMhighlight").length > 0) {
            $(element).find("span.arEMhighlight").removeAttr('style');
            $(element).find("span.arEMhighlight").contents().unwrap();
        }

        if ($(element).find("span.SenCompHighlight").length > 0) {
            $(element).find("span.SenCompHighlight").removeAttr('style');
            $(element).find("span.SenCompHighlight").contents().unwrap();
        }

        if ($(element).find("span.pwdHighlight").length > 0) {
            $(element).find("span.pwdHighlight").removeAttr('style');
            $(element).find("span.pwdHighlight").contents().unwrap();
        }

        if ($(element).find("span.arLNhighlight").length > 0) {
            $(element).find("span.arLNhighlight").removeAttr('style');
            $(element).find("span.arLNhighlight").contents().unwrap();
        }

        if ($(element).find("span.arWChighlight").length > 0) {
            if ($(element).find("span.arWChighlight").text().length == 0){
                $(element).find("span.arWChighlight").remove();
            }else {
                $(element).find("span.arWChighlight").removeAttr('style');
                $(element).removeHighlight('.arWChighlight');
            }
            if ($(element).find("span.WordCompHighlight").length > 0)
                $(element).find('.WordCompHighlight').contents().unwrap();
        }

    }


    $("#aw_moretips_WP p").click(function (e) {
        e.preventDefault();

        $("ul#aw_titletips_WP").slideToggle();
    });

    createTooltipsyForTheI();
// SELECT AUDIENCE CIRCLES
    var audBand = 5;
    $("#aranalyzer_metabox").on("mouseenter", ".audCircle", function (e) {
    //$('.audCircle').mouseenter(function (e) {

        $('.audCircle').not($(this)).removeClass('active');
        $(this).addClass('active');

        var audId = $(this).data('audid');

        $(".audienceRelText[data-audid='" + audId + "']").show();
        $(".audienceRelText:not([data-audid='" + audId + "'])").hide();

        $('.top_arrow_box').attr('data-audid', audId);


        $(this).unbind('click').bind('click', function () {
            audBand = audId;
        });

    }).mouseleave(function (e) {

        if ($(this).data('audid') != audBand) {
            setTimeout(function () {
                if ($("#audCircleList").is(':hover') === false) {
                    $(".audCircle").not($(".audCircle[data-audid='" + audBand + "']")).removeClass('active');
                    $(".audCircle[data-audid='" + audBand + "']").addClass('active');
                    $(".audienceRelText[data-audid='" + audBand + "']").show();
                    $(".audienceRelText:not([data-audid='" + audBand + "'])").hide();

                    $('.top_arrow_box').attr('data-audid', audBand);
                }
            }, 500);
        }
    });


    jQuery(".ar_info").tooltipsy({
        offset: [-10, 0],
        className: 'arTooltipsy'});


});
function createTooltipsyForTheI() {

    jQuery(".ar_info").tooltipsy({
        offset: [-10, 0],
        className: 'arTooltipsy'});


    jQuery("#aud_info_WP").tooltipsy({
        offset: [-10, 0],
        className: 'arTooltipsy',
        content: "<p><strong>The knowledge levels to choose from are:</strong><br>" +
        "<strong>General</strong> - your audience has a basic understanding of the content topic or theme.<br>" +
        "<strong>Knowledgeable</strong> - your audience has an advanced understanding of content or theme.<br>" +
        "<strong>Specialist</strong> - your audience has a superior understanding &nbsp;of content or theme.<br>" +
        "<strong>Academic</strong> - your audience has a proficient&nbsp;understanding of content or theme.<br>" +
        "<strong>Genius</strong> - your audience has an expert&nbsp;understanding of content or theme.</p>"
    });
}

function OnSuccessFeedback(val){
    console.log(val);
    ARTICLESCORE = val.data.scoring;


    if (ARTICLESCORE > ATOMICSCORE) {
        $('#notHIT').hide();
        $('#HIT').show();
    }else{
        $('#notHIT').show();
        $('#HIT').hide();
    }


    $('#scoreBubble').css('margin-left', (ARTICLESCORE - 12) + '%');
    $('#scoreBubble > span').text(ARTICLESCORE);
    $('#scoreBar').css('width', ARTICLESCORE + '%');


    if (ATOMICSCORE > 0) {
        $('div#atomicScoreIndicator').show();
        $('#atomicScoreIndicator').css('margin-left', (ATOMICSCORE - 6) + '%');
        $('#atomicScoreIndicator  strong').html(ATOMICSCORE);
    } else {
        $('div#atomicScoreIndicator').hide();
    }

    val.data.analysis.so.state == 'green' ? $('#audienceWrapper p.so-actual').hide() : $('#audienceWrapper p.so-actual').show();


    $('#audienceWrapper p.so-target > span').html(val.data.analysis.so.detail.toLowerCase());
    $('#audienceWrapper p.so-target > strong').html(typeof val.data.analysis.so.target == 'undefined' ? val.data.analysis.so.actual : val.data.analysis.so.target);
    $('#audienceWrapper p.so-actual > strong').html(val.data.analysis.so.actual);
    //$('i.so-actual').addClass("color-aud-"+val.data.analysis.so.actual);
    $('#audienceWrapper p.so-target > strong, i.so-target').removeClass (function (index, css) {
        return (css.match (/\bcolor-aud-\S+/g) || []).join(' ');
    }).addClass("color-aud-"+val.data.analysis.so.target);
    $('#audienceWrapper p.so-actual > strong, i.so-actual').removeClass (function (index, css) {
        return (css.match (/\bcolor-aud-\S+/g) || []).join(' ');
    }).addClass("color-aud-"+val.data.analysis.so.actual);
}

function displayQuote() {
    var quotes = [
        ["It's none of their business that you have to learn to write. Let them think you were born that way.", "Ernest Hemingway"],
        ["If you can tell stories, create characters, devise incidents, and have sincerity and passion, it doesn't matter a damn how you write.", "Somerset Maugham"],
        ["To produce a mighty book, you must choose a mighty theme.", "Herman Melville"],
        ["It took me fifteen years to discover I had no talent for writing, but I couldn't give it up because by that time I was too famous.", "Robert Benchley"],
        ["I have been successful probably because I have always realized that I knew nothing about writing and have merely tried to tell an interesting story entertainingly.", "Edgar Rice Burroughs"],
        ["Words are a lens to focus one's mind.", "Ayn Rand"],
        ["Don't try to figure out what other people want to hear from you; figure out what you have to say. It's the one and only thing you have to offer.", "Barbara Kingsolver"],
        ["Half my life is an act of revision.", "John Irving"],
        ["Writing a novel is like driving a car at night. You can only see as far as your headlights, but you can make the whole trip that way.", "E. L. Doctorow"],
        ["Get it down. Take chances. It may be bad, but it's the only way you can do anything really good.", "William Faulkner"],
        ["It is the writer who might catch the imagination of young people, and plant a seed that will flower and come to fruition.", "Isaac Asimov"],
        ["Writing is its own reward.", "Henry Miller"],
        ["The unread story is not a story; it is little black marks on wood pulp. The reader, reading it, makes it live: a live thing, a story.", "Ursula K. Le Guin"],
        ["Almost anyone can be an author; the business is to collect money and fame from this state of being.", "A. A. Milne"],
        ["Anecdotes don't make good stories. Generally I dig down underneath them so far that the story that finally comes out is not what people thought their anecdotes were about.", "Alice Munro"],
        ["You learn by writing short stories. Keep writing short stories. The money's in novels, but writing short stories keeps your writing lean and pointed.", "Larry Niven"],
        ["Everywhere I go I'm asked if I think the university stifles writers. My opinion is that they don't stifle enough of them.", "Flannery O'Connor"],
        ["I can't write five words but that I change seven.", "Dorothy Parker"],
        ["A poet can survive everything but a misprint.", "Oscar Wilde"],
        ["Rejection slips, or form letters, however tactfully phrased, are lacerations of the soul, if not quite inventions of the devil-but there is no way around them.", "Isaac Asimov"],
        ["Great is the art of beginning, but greater is the art of ending.", "Henry Wadsworth Longfellow"],
        ["Tell the readers a story! Because without a story, you are merely using words to prove you can string them together in logical sentences.", "Anne McCaffrey"],
        ["Everybody walks past a thousand story ideas every day. The good writers are the ones who see five or six of them. Most people don't see any.", "Orson Scott Card"],
        ["All the words I use in my stories can be found in the dictionary-it's just a matter of arranging them into the right sentences.", "Somerset Maugham"],
        ["Exercise the writing muscle every day, even if it is only a letter, notes, a title list, a character sketch, a journal entry. Writers are like dancers, like athletes. Without that exercise, the muscles seize up.", "Jane Yolen"],
        ["If you write one story, it may be bad; if you write a hundred, you have the odds in your favor.", "Edgar Rice Burroughs"]
    ];
    var randomNumber = getRandomInt(0, (quotes.length - 1));
    return quotes[randomNumber];
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sortTitleMeasure(){
    var myArray = jQuery("p.titleMeasure");
    // sort based on timestamp attribute
    myArray.sort(function (a, b) {

        // convert to integers from strings
        a = parseInt(jQuery(a).attr('data-sort'), 10);
        b = parseInt(jQuery(b).attr('data-sort'), 10);

        // compare
        if(a > b) {
            return 1;
        } else if(a < b) {
            return -1;
        } else {
            return 0;
        }
    });

// put sorted results back on page
    jQuery("article.ac-large.tmBox").append(myArray);
}
