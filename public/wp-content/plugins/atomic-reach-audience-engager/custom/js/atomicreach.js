window.onload = function () {
    tinymce.get('content').on('keyup',function(e){
        forceRemoveHighlightPopup();
    });
}

jQuery(document).ready(function ($) {
    clearAllhighlighting();
    $("#aranalyzer_metabox").on("change", ".onoffswitch > input[type=checkbox]", function (e) {
        jQuery(".onoffswitch > input[type=checkbox]").not($(this)).prop('checked', false);
    })


    function clearAllhighlighting() {
        var element = $('#content_ifr').contents().find('body');

        forceRemoveHighlightPopup()

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

        $(element).unmark();

    }

    $(document).ajaxComplete(function (event, xhr, settings) {
        var settingsURL = settings.url.match("admin-ajax.php");
        if (settingsURL) {


            if (typeof spellHL != "undefined")
                if (spellHL.length == 0) {
                    $('#ar-spellingHighlightButton').remove();
                } else {
                    $("#writer_Spelling").change(function () {
                        var sm = spellHL;
                        clearAllhighlighting();
                        var thisSMword;
                        var contentWrapper = $('#content_ifr').contents().find('body');

                        if ($("#writer_Spelling").is(":checked")) {

                            for (var i = 0; i < sm.detail.length; i++) {

                                if ($('span.sm:contains(' + sm.detail[i].string + ')').length == 0) {
                                    contentWrapper.highlightRegex('\\b' + sm.detail[i].string + '\\b', {'className': 'sm'});
                                    thisSMword = $(contentWrapper).find('span.sm');
                                    $(contentWrapper).find('span.sm:contains(' + sm.detail[i].string + ')').data('suggestions', sm.detail[i].suggestions.option);
                                }
                            }
                            var beforeHover;
                            var afterHover;
                            $(thisSMword).unbind('click').bind('click', function (e) {
                                if (e.target.className == 'sm') {
                                    $(contentWrapper).find("#load_spelling-popup").remove();

                                    beforeHover = $(this).prop("textContent");

                                    var p;
                                    if (typeof p === 'undefined')
                                        p = $(contentWrapper).find('span.sm:contains(' + $(this).prop("textContent") + ')').data('suggestions');

                                    // since hover function was being called multiple time, it now checks if #load_spelling_popup exists. If not it
                                    // creates it otherwise nothing.
                                    if ($(contentWrapper).find("#load_spelling-popup").length < 1) {
                                        $(this).append('<div id="load_spelling-popup"></div>');
                                        _this = $(this);

                                        // bind CSS before load html
                                        $(contentWrapper).find("#load_spelling-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php  .writer-spelling_fix", {}, function () {


                                            $(contentWrapper).find(".writer-spelling_fix").removeClass("writer-hide");
                                            $(contentWrapper).find(".suggestions_header-sm").prepend(beforeHover);

                                            //var p =  $(contentWrapper).find(_this.data('suggestions'));
                                            if ($.isArray(p)) {
                                                for (var key in p) {
                                                    if (p.hasOwnProperty(key)) {

                                                        $(contentWrapper).find('.writer-spelling_fix .spellings_list').append('<li>' +
                                                            '<strong>' + p[key] + '</strong></li>');
                                                    }
                                                }
                                            } else {
                                                $(contentWrapper).find('.writer-spelling_fix .spellings_list')
                                                    .append('<li><strong>' + p + '</strong><i class="fa fa-refresh r" ></i></li>');
                                            }

                                            $(contentWrapper).find('.writer-spelling_fix .spellings_list > li strong').unbind('click').bind('click', function (e) {

                                                var x = $(this).text();
                                                afterHover = x;
                                                var r = this.closest("span.sm").childNodes[0].textContent;
                                                this.closest("span.sm").childNodes[0].textContent = x;
                                                $(this).text(r);


                                            });


                                            $(contentWrapper).find('#add_dictionary').click(function (e) {
                                                e.preventDefault();

                                                var word = _this.not($('#load_spelling-popup'))[0].childNodes[0].data.toLowerCase();
                                                //console.log(_this);
                                                var response = addToDictionary(word);

                                                if (response) {
                                                    alert('Word added to the Dictionary');
                                                    //TODO: remove highlighting right here
                                                    _this.removeAttr('style').removeClass('.sm').contents().unwrap();
                                                } else {
                                                    alert('An error occurred');
                                                }

                                            });

                                            // Fix popup Position
                                            if (e.pageY < $(contentWrapper).find("#load_spelling-popup > div").outerHeight() + 20) {
                                                var bottom = "0";
                                                var top = null;
                                            } else {
                                                var bottom = null;
                                                var top = "-" + $(contentWrapper).find("#load_spelling-popup > div").outerHeight() + "px";
                                            }
                                            if (e.pageX > $(contentWrapper).find("#load_spelling-popup > div").outerWidth()) {

                                                var tempWidth = $(contentWrapper).find("#load_spelling-popup > div").outerWidth() - 40;
                                                var left = "-" + tempWidth + "px";
                                            } else {
                                                var left = 0;
                                            }

                                            $(contentWrapper).find("#load_spelling-popup").css({
                                                "left": left,
                                                "top": top,
                                                "bottom": bottom
                                            });

                                            // close the pop up
                                            $(contentWrapper).find('#wcClose').bind('click', function (e) {
                                                $(contentWrapper).find("#load_spelling-popup").remove();
                                                if (typeof afterHover != 'undefined')
                                                    if (beforeHover != afterHover) {
                                                        $(contentWrapper).find('span.sm:contains(' + afterHover + ')').removeClass('sm').contents().unwrap();
                                                    }
                                            });
                                        });
                                    }
                                }//endif
                            })
                        } else {
                            clearAllhighlighting();


                        }
                    })
                }
            if (typeof grammarHL != "undefined")
                if (grammarHL.total == 0) {
                    $('#ar-grammarHighlightButton').remove()
                } else {

                    $("#writer_Grammar").change(function () {
                        var gm =  grammarHL.detail;
                        console.log(gm);
                        clearAllhighlighting();

                        var contentWrapper = $('#content_ifr').contents().find('body');
                        var gmWord;
                        if ($("#writer_Grammar").is(":checked")) {
                   /*         for (var i = 0; i < gm.detail.length; i++) {
                                if ($('span.arGMhighlight:contains(' + gm.detail[i].string + ')').length == 0) {
                                    contentWrapper.highlightRegex('\\b' + gm.detail[i].string + '\\b', {className: 'arGMhighlight'});
                                    gmWord = $(contentWrapper).find('span.arGMhighlight');
                                    $(gmWord).css({});
                                    $(contentWrapper).find('span.arGMhighlight:contains("' + gm.detail[i].string + '")')
                                        .data('suggestions', gm.detail[i].suggestions.option)
                                        .data('description', gm.detail[i].description)
                                        .data('url', gm.detail[i].url);
                                }
                            }// end for*/


                            for (var i = 0; i < gm.length; i++) {
                                console.log(gm[i].string);

                                if ($('span.arGMhighlight:contains(' + gm[i].string + ')').length == 0) {
                                    //contentWrapper.highlightRegex('\\b' + gm[i].string + '\\b', {className: 'arGMhighlight'});
                                    //if ( gm[i].description == "Possible spelling mistake found") continue;

                                    var wordBoundary = (gm[i].string[0].match(/(\.|\?|\!)/) == null ? "\\b" : "");
                                    var regex = wordBoundary + escapeCharForRegex(gm[i].string) +  wordBoundary;
                                    //var regex =  escapeCharForRegex(gm[i].string) ;
                                    var regexp = new RegExp(regex,'gm');

                                    // console.log(regexp);

                                    $(contentWrapper).markRegExp(regexp, {
                                        "element": "span",
                                        "accuracy": {
                                            "value": "exactly"
                                            ,"limiters": [",", ".", ";", ":", "?", "!", ")", "(", "{", "}"]
                                        },
                                        "className": 'arGMhighlight',
                                        "separateWordSearch": true,
                                        "diacritics": true,
                                        "iframes": false,
                                        "debug": false,
                                        "filter": function(node, term)
                                        {
                                            console.log(gm[i].string + " matches "+term);
                                            if (gm[i].string == term) {

                                                var dot = (term[0].match(/(\.|\?|\!)/) != null ? "" : ".");
                                                var r = escapeCharForRegex(gm[i].precontext) + dot + escapeCharForRegex(term);
                                                r = new RegExp(r, 'g');

                                                console.log(node, term, r);


                                                if (node.textContent.match(r) != null)
                                                    return true;

                                            }
                                        }
                                    });

                                    gmWord = $(contentWrapper).find('span.arGMhighlight');
                                    $(gmWord).css({});
                                    $(contentWrapper).find('span.arGMhighlight:contains("' + gm[i].string + '")')
                                        .data('suggestions', gm[i].suggestions.option)
                                        .data('description', gm[i].description)
                                        .data('category', gm[i].category)
                                        .data('url', gm[i].url);
                                }
                            }// end for

                            //$('span[data-color="green"]').css({'background-color': '#5FFF6B'});
                            var beforeHover;
                            var afterHover;
                            $(gmWord).unbind('click').bind('click', function (e) {
                                if(e.target.className == 'arGMhighlight') {
                                    $(contentWrapper).find("#load_grammar-popup").remove();
                                    var p, l, d, c;
                                    if (typeof p === 'undefined')
                                        p = $(contentWrapper).find('span.arGMhighlight:contains(' + $(this).prop("textContent") + ')').data('suggestions');
                                    if (typeof l === 'undefined')
                                        l = $(contentWrapper).find('span.arGMhighlight:contains(' + $(this).prop("textContent") + ')').data('url');
                                    if (typeof d === 'undefined')
                                        d = $(contentWrapper).find('span.arGMhighlight:contains(' + $(this).prop("textContent") + ')').data('description');
                                    if (typeof c === 'undefined')
                                        c = $(contentWrapper).find('span.arGMhighlight:contains(' + $(this).prop("textContent") + ')').data('category');


                                    if ($(contentWrapper).find("#load_grammar-popup").length == 0) {
                                        $(this).append('<div id="load_grammar-popup"></div>');
                                        beforeHover = $(this).prop("textContent");
                                        _this = $(this);
                                        $(contentWrapper).find("#load_grammar-popup").css({});
                                    $(contentWrapper).find("#load_grammar-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php  .writer-grammar_fix",
                                        p, function () {
                                            $(contentWrapper).find(".suggestions_header-gm span").html(c);
                                            $(contentWrapper).find(".writer-grammar_fix").removeClass("writer-hide");

                                            //"see explanation"
                                            $(contentWrapper).find('.writer-grammar_fix .suggestions_content').html(
                                                '<p class="">Revise: ' + d + '</p>');
                                            //.append("<hr/>");
                                            if (typeof l == "string" && l != "")
                                                $(contentWrapper).find('.writer-grammar_fix .suggestions_link .grammar-suggestion-link').attr('href', l).show();
                                            for (var key in p) {
                                                if (p.hasOwnProperty(key)) {
                                                    $(contentWrapper).find('.writer-grammar_fix div').append('<p class="suggestions_content">' + p[key] + '</p>');
                                                    $(contentWrapper).find('.writer-grammar_fix .replacement_list').append('<li><strong>' + p[key] + '</strong></li>');
                                                }
                                            }
                                            $(contentWrapper).find('.writer-grammar_fix a.grammar-suggestion-link').click(function (e) {
                                                e.preventDefault();
                                                newwindow = window.open(l, 'name', 'height=400,width=450');
                                                if (window.focus) {
                                                    newwindow.focus()
                                                }
                                                return false;
                                            })

                                            // click on the replacement word
                                            $(contentWrapper).find('.writer-grammar_fix .replacement_list > li strong').unbind('click').bind('click', function (e) {

                                                var x = $(this).text();
                                                afterHover = x;
                                                var r = this.closest("span.arGMhighlight").childNodes[0].textContent;
                                                this.closest("span.arGMhighlight").childNodes[0].textContent = x;
                                                $(this).text(r);

                                            });


                                            // Fix popup Position
                                            if (e.pageY < $(contentWrapper).find("#load_grammar-popup > div").outerHeight() + 20) {
                                                var bottom = "0";
                                                var top = null;
                                            } else {
                                                var bottom = null;
                                                var top = "-" + $(contentWrapper).find("#load_grammar-popup > div").outerHeight() + "px";
                                            }
                                            if (e.pageX > $(contentWrapper).find("#load_grammar-popup > div").outerWidth()) {

                                                var tempWidth = $(contentWrapper).find("#load_grammar-popup > div").outerWidth() - 60;
                                                var left = "-" + tempWidth + "px";
                                            } else {
                                                var left = 0;
                                            }

                                            $(contentWrapper).find("#load_grammar-popup").css({
                                                "left": left,
                                                "top": top,
                                                "bottom": bottom
                                            });
                                            $(contentWrapper).find('#wcClose').bind('click', function (e) {
                                                $(contentWrapper).find("#load_grammar-popup").remove();
                                                if (typeof afterHover != 'undefined')
                                                    if (beforeHover != afterHover) {
                                                        $(contentWrapper).find('span.arGMhighlight:contains('+afterHover+')').removeClass('arGMhighlight').contents().unwrap();
                                                    }
                                            })
                                        });
                                }
                            }
                            })

                        }
                        else {
                            clearAllhighlighting();
                        }
                    });
                }//if grammar mistakes are found.

            if (typeof linkHL != "undefined")
                if (linkHL.invalid == 0) {
                    $('#ar-linksHighlightButton').remove();
                } else {

                    $("#writer_Links").change(function () {
                        var lc = linkHL;
                        clearAllhighlighting();
                        var contentWrapper = $('#content_ifr').contents().find('body');

                        if ($("#writer_Links").is(":checked")) {

                            for (var i = 0; i < lc.detail.length; i++) {
                                link = contentWrapper.find('a[href="' + lc.detail[i] + '"]');
                                if (link.parent('span').length != 1 || !link.parent('span').hasClass('highlight')) {
                                    link.wrap('<span class="arLNhighlight"></span>');
                                }
                            }

                            $(contentWrapper).find("span.arLNhighlight").unbind('click').bind('click', function (e) {
                                if(e.currentTarget.className == 'arLNhighlight'
                                    && e.target.className != "ion-android-close pull-right") {
                                    $(contentWrapper).find("#load_links-popup").remove();

                                if ($(contentWrapper).find("#load_links-popup").length == 0) {
                                    $(this).append('<div id="load_links-popup"></div>');

                                    _this = $(this);
                                    $(contentWrapper).find("#load_links-popup").css({
                                        'left': '0',
                                        'bottom': '0',
                                        'position': 'absolute',
                                        'display': 'inline'
                                    });
                                    $(contentWrapper).find("#load_links-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php .writer-links_fix", function () {
                                        $(contentWrapper).find(".writer-links_fix").removeClass("writer-hide");
                                        var p = _this.data('suggestions');
                                        for (var key in p) {
                                            if (p.hasOwnProperty(key)) {
                                                $(contentWrapper).find('.writer-links_fix div').prepend('<p class="suggestions_content">' + p[key] + '</p>');
                                            }
                                        }
                                        // close the pop up
                                        $(contentWrapper).find('.writer-modal-header > #wcClose').bind('click', function (e) {
                                            $(contentWrapper).find("#load_links-popup").remove();
                                        });
                                    });
                                }
                            }
                            })

                        } else {
                            clearAllhighlighting();
                        }
                    });
                }

            $("#writer_EM").change(function () {
                clearAllhighlighting();
                var contentWrapper = $('#content_ifr').contents().find('body');

                var thisEMword;
                if ($("#writer_EM").is(":checked")) {
                    var em = emWords;
                    //var emotionWordsV2 = ;
/*
                    $.each(em, function (i, v) {
                        if ($('span.arEMhighlight:contains(' + i + ')').length == 0) {
                            contentWrapper.highlightRegex('\\b' + i + '\\b', {'className': 'arEMhighlight'});
                            thisEMword = $(contentWrapper).find('span.arEMhighlight');

                            if (v == 'red') {
                                $(contentWrapper).find('span.arEMhighlight:contains(' + i + ')').css({'border-bottom-color': 'rgb(125, 208, 255)'});
                            } else if (v == 'green') {
                                $(contentWrapper).find('span.arEMhighlight:contains(' + i + ')').css({'border-bottom-color': 'rgb(255, 243, 128)'});
                            }

                            $(contentWrapper).find('span.arEMhighlight:contains(' + i + ')').data('val', v);
                        }
                    }); // for loop

                    $(thisEMword).unbind('click').bind('click', function (e) {
                        if(e.target.className == 'arEMhighlight') {
                            $(contentWrapper).find("#load_emotion-popup").remove();
                            var p;
                            if (typeof p === 'undefined')
                                p = $(contentWrapper).find('span.arEMhighlight:contains(' + $(this).prop("textContent") + ')').data('val');
                            var thisWord = $(this).prop("textContent");
                            if ($(contentWrapper).find("#load_emotion-popup").length < 1) {
                                $(this).append('<div id="load_emotion-popup"></div>');
                                _this = $(this);

                            $(contentWrapper).find("#load_emotion-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php .writer-emotion_fix", {}, function () {
                                $(contentWrapper).find('.writer-emotion_fix .suggestions_header-em b').text(thisWord);
                                if (p == "red") {
                                    $(contentWrapper).find('.writer-emotion_fix .ar-emRED').show();
                                } else if (p == "green") {
                                    $(contentWrapper).find('.writer-emotion_fix .ar-emGREEN').show();
                                }

                                $(contentWrapper).find(".writer-emotion_fix").removeClass("writer-hide");


                                // Fix popup Position
                                if (e.pageY < $(contentWrapper).find("#load_emotion-popup > div").outerHeight() + 20) {
                                    var bottom = "0";
                                    var top = null;
                                } else {
                                    var bottom = null;
                                    var top = "-" + $(contentWrapper).find("#load_emotion-popup > div").outerHeight() + "px";
                                }

                                if (e.pageX > $(contentWrapper).find("#load_emotion-popup > div").outerWidth()) {

                                    var tempWidth = $(contentWrapper).find("#load_emotion-popup > div").outerWidth() - 40;
                                    var left = "-" + tempWidth + "px";
                                } else {
                                    var left = "0";
                                }

                                $(contentWrapper).find("#load_emotion-popup").css({
                                    "left": (left == null ? left : left.replace('--', '-')),
                                    "top": (top == null ? top : top.replace('--', '-')),
                                    "bottom": (bottom == null ? bottom : bottom.replace('--', '-'))
                                });


                                $(contentWrapper).find('.writer-modal-header > #wcClose').bind('click', function (e) {
                                    $(contentWrapper).find("#load_emotion-popup").remove();
                                });

                            });//end load

                        }
                    }
                    });*/

                    var $paragraphs = $(contentWrapper).find("p,li");

                    $.each($paragraphs, function (i)
                    {
                        var $paragraphEl = $($paragraphs[i]);


                            //console.log('Paragraph index | '+i);
                            //console.log($paragraphEl.text());
                            //console.log(emotionWordsV2[i]);


                        if(typeof emotionWordsV2[i]=='undefined')
                            return true; // continue

                        $.each(emotionWordsV2[i], function (word, synonymsArray)
                        {
                            // mark the words
                            doMarkWord($paragraphEl, word, synonymsArray, 'arEMhighlight');
                        });


                    }); // end for each paragraph

                    mapPopoversV2(contentWrapper, 'wordComplexity', 'arEMhighlight');

                } else {
                    clearAllhighlighting();
                }

            });//end change

            $("#writer_ParaDensity").change(function () {
                clearAllhighlighting();
                var contentWrapper = $('#content_ifr').contents().find('body');
                if ($("#writer_ParaDensity").is(":checked")) {
                    var pwd = pwdHL.detail.paragraphs;
                    var maxWords = pwdHL.recommended.paragraphWordDensityMax;
                    var regex = /\s+/gi;

                    $.each($(contentWrapper).find('p,li'), function (ind, val) {
                        if (pwd[ind] != "length_hit" && pwd[ind] != "" && typeof pwd[ind] != "undefined") {
                            $(this).wrapInner("<span class='pwdHighlight'></span>");
                            $(this).data("value", pwd[ind]);

                            //console.log($(this));
                            var word_count = $(this).text().trim().replace(regex, ' ').split(' ').length;
                            $(this).data("wordcount", word_count);


                        }
                    }); // end each loop

                    var contentWrapper = $('#content_ifr').contents().find('body');
                    $(contentWrapper).find("span.pwdHighlight").hover(function (e) {

                        $(this).click(function () {
                            $(this).children("#load_ParaComp-popup").remove();
                            $(this).unbind('hover');
                        })


                        var responseData = $(this).parents('p,li').data();

                        if ($(contentWrapper).find("#load_ParaComp-popup").length == 0) {
                            $(this).append('<div id="load_ParaComp-popup"></div>');

                            $(contentWrapper).find("#load_ParaComp-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php .writer-paragraph_Complexity", function () {
                                titleText = responseData.value.matchResult;

                                switch (responseData.value.matchResult) {
                                    case "toolong":
                                        titleText = "Too Long";
                                        break;
                                    case "tooshort":
                                        titleText = "Too Short";
                                        break;
                                }
                                $($(contentWrapper).find(".writer-paragraph_Complexity p")[0]).text(titleText);
                                $(contentWrapper).find("#numberOfWords").text(maxWords);
                                $(contentWrapper).find(".suggestions_header-pwd").html(responseData.wordcount + ' words');
                                $($(contentWrapper).find(".writer-paragraph_Complexity p")[0]).text();
                                $(contentWrapper).find(".writer-paragraph_Complexity").removeClass("writer-hide");


                                if (e.pageY > $(contentWrapper).find("#load_ParaComp-popup > div").outerHeight() + 50) {
                                    var top = '0';
                                    var bottom = null;
                                } else {
                                    var top = null;
                                    var bottom = "-" + $(contentWrapper).find("#load_ParaComp-popup > div").outerHeight() + "px";
                                }


                                $(contentWrapper).find("#load_ParaComp-popup").css({
                                    "top": top,
                                    "bottom": bottom
                                });

                            })//end load
                        }
                    }, function () {
                        $(contentWrapper).find("#load_ParaComp-popup").remove();
                    })
                    ;
                }

                else {
                    clearAllhighlighting();
                }
            });


        /*    $("#writer_SenComp").change(function () {
                clearAllhighlighting();
                if ($("#writer_SenComp").is(":checked")) {


                    var contentWrapper = $('#content_ifr').contents().find('body');


                    $.each($(contentWrapper).find('p'), function (i, v) {
                        if (typeof soHL.sentences[i] != "undefined") {
                            var sent = $(v).prop('textContent').split(/[\?\.\!]\n|[\?\.\!]\s/);

                            for (var x = 0; x < sent.length; x++) {

                                if (soHL.sentences[i][x] != "UNAVAILABLE") {
                                    $(this).highlight(sent[x].trim(), "SenCompHighlight");
                                    //$(this).wrapInner('<span class="SenCompHighlight"></span>');
                                    $(this).find("span.SenCompHighlight").css({
                                        "background-color": 'rgba(246, 197, 164, 0.70)',
                                        "position": "relative",
                                        "display": "inline"
                                    });
                                    $(this).data("value", soHL.sentences[i][x])

                                }

                            }
                        }

                    });

                    var contentWrapper = $('#content_ifr').contents().find('body');


                    $(contentWrapper).find("span.SenCompHighlight").hover(function (e) {
                        //console.log($(this));
                        $(this).click(function () {
                            $(this).children("#load_SenComp-popup").remove();
                            $(this).unbind('hover');
                        });

                        if (e.pageY > $(contentWrapper).height() - 180) {
                            var top = -155;
                        } else {
                            var bottom = 0;
                        }

                        var responseData = $(this).parents('p').data();

                        if ($(contentWrapper).find("#load_SenComp-popup").length == 0)
                            $(this).append('<div id="load_SenComp-popup"></div>');
                        $(contentWrapper).find("#load_SenComp-popup").css({
                            'left': '0',
                            'bottom': bottom + 'px',
                            'top': top + 'px',
                            'z-index': '99999',
                            'font-weight': "normal",
                            'text-decoration': "none",
                            'position': 'absolute',
                            'display': 'inline'
                        });

                        $(contentWrapper).find("#load_SenComp-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php .writer-sentence_Complexity", function () {
                            //$( $(".writer-word_Complexity")[0] ).text(responseData.value.matchResult);
                            //console.log(responseData.value);
                            if (responseData.value == "TOO COMPLEX") {

                                $(contentWrapper).find('.writer-sentence_Complexity .ar-tooComplex').show();
                            } else if (responseData.value == "TOO SIMPLE") {
                                $(contentWrapper).find('.writer-sentence_Complexity .ar-tooSimple').show();
                            }
                            $(contentWrapper).find('.writer-sentence_Complexity').removeClass("writer-hide");
                        });
                    }, function () {
                        $(contentWrapper).find("#load_SenComp-popup").remove();
                    })

                } else {
                    var contentWrapper = $('#content_ifr').contents().find('body');
                    if ($(contentWrapper).find("span.SenCompHighlight").length > 0) {
                        contentWrapper.removeHighlight(".SenCompHighlight");
                        $(contentWrapper).find(".writer-sentence_Complexity").addClass("writer-hide");
                    }
                }
            });*/


            // +++++++++++++ WORD COMPLEXITY +++++++++++++++++++
            $("#writer_WordComp").change(function () {
                if ($("#writer_WordComp").is(":checked")) {
                    clearAllhighlighting();
                    var wc = soHL.synonyms;
                    var contentWrapper = $('#content_ifr').contents().find('body');
                    var sugg = [];

                    $.each($(contentWrapper).find('p,li'), function (i, v) {
                        if (typeof wc[i] != "undefined") {
                            var sent = $(v).prop('textContent').split(/[\?\.\!]\n|[\?\.\!]\s/);
                            for (var x = 0; x < sent.length; x++) {
                                if (typeof wc[i][x] !== "undefined" && wc[i][x] != 'UNAVAILABLE') {
                                    $(this).wrapInner("<span class='WordCompHighlight'></span>");
                                    var _this = $(this);
                                    var wordCount = 0;

                                    $.each(wc[i][x], function (i2, v2) {
                                        //if (wordCount >= wordsToHighlight) return false;
                                        $(_this).find("span.WordCompHighlight").highlightRegex('\\b' + i2 + '\\b', {'className': 'arWChighlight'});
                                        thisWDword = $(contentWrapper).find('span.WordCompHighlight > span.arWChighlight');
                                        sugg = []; //reset variable
                                        for (var k = 0; k < v2.length; k++) {
                                            sugg.push(v2[k]);
                                        }
                                        $(_this).find('span.arWChighlight:contains(' + i2 + ')').data('suggestions', sugg);
                                        wordCount ++;
                                    });

                                }
                            }
                        }
                    });


                    var contentWrapper = $('#content_ifr').contents().find('body');
                    var beforeHover;
                    var afterHover;


                    $(thisWDword).unbind('click').bind('click', function (e) {

                        if(e.target.className == 'arWChighlight') {
                            $(contentWrapper).find("#load_wordComplexity-popup").remove();

                            beforeHover = $(this).prop("textContent");
                            var thisword = $(this).text();



                            if (e.pageX > $(contentWrapper).width() - 200) {
                                var left = -180;
                            } else {
                                var left = 0;
                            }
                            var p;

                            if (typeof p === 'undefined')
                                p = $(contentWrapper).find('span.arWChighlight:contains(' + beforeHover + ')').data('suggestions');


                            if ($(contentWrapper).find("#load_wordComplexity-popup").length < 1) {

                                $(this).append('<div id="load_wordComplexity-popup"></div>');
                                $(contentWrapper).find("#load_wordComplexity-popup").css({
                                    "position": "absolute",
                                    "display": "inline",
                                });

                            $(contentWrapper).find("#load_wordComplexity-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php .writer_wordComplexity", function () {
                                $(contentWrapper).find(".writer_wordComplexity").removeClass("writer-hide");

                                $(contentWrapper).find(".writer_wordComplexity .wordCompWord span#replaceWord").html(thisword);
                                var haystack = [];
                                var skip;
                                if ($.isArray(p)) {
                                    for (var key in p) {
                                        if (p.hasOwnProperty(key)) {
                                            skip = false;
                                            var words = '';



                                            for (var x = 0; x < p[key][1].length; x++) {
                                                if (typeof p[key][1][x][0] != "undefined") {
                                                    if ($.inArray(p[key][1][x][0], haystack) == -1) {
                                                        words += "<span class='ar-synonym'><strong>" + p[key][1][x][0].replace("_", " ") + "</strong></span>";
                                                    } else {
                                                        skip = true;
                                                    }
                                                    haystack.push(p[key][1][x][0]);
                                                }
                                            }
                                            if (typeof words != 'undefined' && !skip) {
                                                if (typeof p[key][0] == "string")
                                                    $(contentWrapper).find('.writer_wordComplexity .wordCompright').append("<p" +
                                                        " class=\"word-complexity-def\" >" + p[key][0] + "</p>");

                                                $(contentWrapper).find('.writer_wordComplexity .wordCompright').append('<p class="word-complexity-sug">' +
                                                    words.replace(/,\s*$/, "") + "</p>");

                                            }

                                        }
                                    }

                                    if (e.pageY < $(contentWrapper).find("#load_wordComplexity-popup > div").outerHeight() + 20) {
                                        var bottom = "-" + $(contentWrapper).find("#load_wordComplexity-popup > div").outerHeight() + "px";
                                        var top = null;
                                    } else {
                                        var bottom = null;
                                        var top = 0;
                                    }

                                    if (e.pageX > $(contentWrapper).find("#load_wordComplexity-popup > div").outerWidth()) {

                                        var tempWidth = $(contentWrapper).find("#load_wordComplexity-popup > div").outerWidth() - 40;
                                        var left = "-" + tempWidth + "px";
                                    } else {
                                        var left = 0;
                                    }


                                    $(contentWrapper).find("#load_wordComplexity-popup").css({
                                        "left": left,
                                        "top": top,
                                        "bottom": bottom
                                    });

                                    /*$(contentWrapper).find('.writer_wordComplexity .wordCompright .word-complexity-sug .ar-synonym .i').unbind("click").bind("click", function (e) {
                                     $(this).parents(".word-complexity-sug").next('.word-complexity-def').slideToggle();
                                     $(contentWrapper).find(".writer_wordComplexity .word-complexity-def").not($(this).parents(".word-complexity-sug").next('.word-complexity-def')).slideUp();
                                     });*/

                                    // REPLACE WORD
                                    $(contentWrapper).find('.writer_wordComplexity .wordCompright .word-complexity-sug .ar-synonym').unbind("click").bind("click", function (e) {
                                        var x = $(this).children('strong').text();
                                        afterHover = x;
                                        var r = this.closest("span.arWChighlight").childNodes[0].textContent;

                                        this.closest("span.arWChighlight").childNodes[0].textContent = x;
                                        $(this).children('strong').text(r);

                                    });


                                }


                                // close the pop up
                                $(contentWrapper).find('.writer-modal-header > #wcClose').bind('click', function (e) {
                                    $(contentWrapper).find("#load_wordComplexity-popup").remove();
                                    if (typeof afterHover != 'undefined')
                                        if (beforeHover != afterHover)
                                            $(contentWrapper).find('span.arWChighlight:contains(' + afterHover + ')').removeClass('arWChighlight').contents().unwrap();
                                });

                            });//end .load
                        }
                    }
                    })
                } else {

                    clearAllhighlighting();
                }

            });

            $("#aw_moretips_WP p").unbind('click').bind('click', function (e) {
                e.preventDefault();
                $("ul#aw_titletips_WP").slideToggle();
            });
        }
    });

    function addToDictionary(w) {

        return jQuery.ajax({
                url: 'admin-ajax.php',
                data: {action: 'atomicreach_custom_dictionary', word: w},
                async: false
            }).responseText == 'OK';
    }

});
function forceRemoveHighlightPopup(){
    var element = jQuery("#content_ifr").contents().find('body');
    if (jQuery(element).find('.writer-modal').length > 0) {
        jQuery(element).find('.writer-modal').remove()
    }
}

function escapeCharForRegex(word) {
    return word.replace(/(\.|\"|\'|\?|\/|\)|\(|\[|\]|\$|\+)/g,"\\$1");
}

function doMarkWord(paragraphEl, word, synonymsArray, className)
{
    //console.log('doMarkWord(\''+word+'\')');
    //console.log('paragrahEl', paragraphEl);
    //console.log('synonymsArray(\''+synonymsArray+'\')');


    if(typeof className=='undefined')
        className = 'arWChighlight';

    var counter = -1;



    var wordBoundary = (word.match(/(\.|\?|\!)/) == null ? "\\b" : "");
    var regex = wordBoundary + escapeCharForRegex(word) +  wordBoundary;
    //var regex =  escapeCharForRegex(gm[i].string) ;
    var regexp = new RegExp(regex,'gm');


    //$(contentWrapper).markRegExp(regexp);



    paragraphEl.markRegExp(regexp, {
        "element": "span",
        "accuracy": {
            "value": "exactly"
            ,"limiters": [",", ".", ";", ":", "?", "!", ")", "(", "{", "}"]
        },
        "className": className,
        "diacritics": true,
        "iframes": false,
        "debug": false,
        "filter": function(node, term, counter2, totalCounter)
        {
            counter++;

            //console.log('filter | '+term+'['+counter+']');
            //
            //console.log("Typeof",typeof synonymsArray);
            //console.log(synonymsArray);
            if(!jQuery.isArray(synonymsArray[counter]))
                return false;

            // do the mark
            return true;

        },
        "each": function(el)
        {
            //console.log('each | ', el, word, counter, synonymsArray);

            // load the element with the suggestions data
            if(jQuery.isArray(synonymsArray[counter]))
            {
                jQuery.data(el, 'suggestions', {
                    "originalWord": word,
                    "synonymsArray": synonymsArray[counter]
                });
            }
            //else
            //console.log(word, counter, synonymsArray[counter]);
        }
    });
}

function mapPopoversV2(contentWrapper, actionType, className)
{
    if(typeof actionType=='undefined')
        actionType = 'wordComplexity';

    if(typeof className=='undefined')
        className = 'arWChighlight';

    var defaultUnderlineColor = '#F24A15'; // red
    var measureName = 'wordComplexity';

    switch(className)
    {
        case 'arEMhighlight':
            defaultUnderlineColor = '#5fe61a';
            measureName = 'emotion';
            break;
    }

    var thisWord = jQuery(contentWrapper).find('span.'+className);
    var beforeHover;
    var afterHover;

    jQuery(thisWord).unbind('click').bind('click', function (e)
    {

        if(e.target.className == className)
        {
            jQuery(contentWrapper).find("#load_"+actionType+"-popup").remove();

            beforeHover = jQuery(this).prop("textContent");
            var word = jQuery(this).text();
            var left = 0;
            if (e.pageX > jQuery(contentWrapper).width() - 200) {
                left = -180;
            }

            // load the suggestions jQuery data
            var wordDataArray = jQuery.data(this, 'suggestions');
            var p = wordDataArray["synonymsArray"];

            if (jQuery(contentWrapper).find("#load_"+actionType+"-popup").length < 1) {

                jQuery(this).append('<div id="load_'+actionType+'-popup"></div>');
                jQuery(contentWrapper).find("#load_"+actionType+"-popup").css({
                    "position": "absolute",
                    "display": "inline"
                });


                jQuery(contentWrapper).find("#load_"+actionType+"-popup").load("../wp-content/plugins/atomic-reach-audience-engager/custom/html/popups.php .writer_"+actionType, function ()
                {
                    jQuery(contentWrapper).find(".writer_"+actionType).removeClass("writer-hide");

                    var $popoverHeaderEl = jQuery(contentWrapper).find(".writer_"+actionType+" .writer-modal-header");

                    $popoverHeaderEl.find("#replaceWord").html(word);

                    var haystack = [];
                    var skip;
                    if (jQuery.isArray(p))
                    {
                        var $popoverContentEl = jQuery(contentWrapper).find('.writer_'+actionType+' .wordCompright');

                        // activate emotion legend
                        if(measureName=='emotion')
                        {
                            $popoverHeaderEl.find(".originalWord").html(wordDataArray["originalWord"]);
                            $popoverHeaderEl.find("#emotionLegend").show();
                        }

                        for (var key in p)
                        {
                            if (p.hasOwnProperty(key)) {
                                skip = false;
                                var words = '';

                                for (var x = 0; x < p[key][1].length; x++) {
                                    if (typeof p[key][1][x][0] != "undefined") {
                                        if (jQuery.inArray(p[key][1][x][0], haystack) == -1)
                                        {
                                            var synStyleStr = '';

                                            // if less value
                                            if(typeof p[key][1][x][1]!='undefined' && p[key][1][x][1]=='-')
                                                synStyleStr = " style='color: blue;'";

                                            words += "<span class='ar-synonym'><strong "+synStyleStr+">" + p[key][1][x][0].replace("_", " ") + "</strong></span>";

                                        } else {
                                            skip = true;
                                        }
                                        haystack.push(p[key][1][x][0]);
                                    }
                                }

                                if (typeof words != 'undefined' && !skip)
                                {
                                    // add description
                                    if (typeof p[key][0] == "string")
                                        $popoverContentEl.append("<p" +
                                            " class=\"word-complexity-def\" >" + p[key][0] + "</p>");

                                    // add word suggestion
                                    $popoverContentEl.append('<p class="word-complexity-sug">' +
                                        words.replace(/,\s*$/, "") + "</p>");

                                }

                            }
                        }

                        var top = 0;
                        var bottom = null;
                        if (e.pageY < jQuery(contentWrapper).find("#load_"+actionType+"-popup > div").outerHeight() + 20) {
                            bottom = "-" + jQuery(contentWrapper).find("#load_"+actionType+"-popup > div").outerHeight() + "px";
                            top = null;
                        }

                        if (e.pageX > jQuery(contentWrapper).find("#load_"+actionType+"-popup > div").outerWidth()) {

                            var tempWidth = jQuery(contentWrapper).find("#load_"+actionType+"-popup > div").outerWidth() - 40;
                            left = "-" + tempWidth + "px";
                        }


                        jQuery(contentWrapper).find("#load_"+actionType+"-popup").css({
                            "left": left,
                            "top": top,
                            "bottom": bottom
                        });

                        // REPLACE WORD
                        $popoverContentEl.find(".word-complexity-sug .ar-synonym").unbind("click").bind("click", function (e)
                        {
                            var x = jQuery(this).children('strong').text();
                            //afterHover = x;

                            var r = this.closest("span."+className).childNodes[0].textContent;

                            // if original first letter is uppercase
                            if(r[0]===r[0].toUpperCase())
                            {
                                // replacement first letter should also be uppercase
                                x = capitalizeFirstLetter(x);
                            }

                            this.closest("span."+className).childNodes[0].textContent = x;
                            jQuery(this).children('strong').text(r);


                            // replace highlighting with blue underline
                            jQuery(contentWrapper).find('span.'+className+':contains(' + x + ')').css({
                                "border-bottom": "2px solid #04aaf9"
                            });

                            // close popover
                            jQuery(contentWrapper).find("#load_"+actionType+"-popup").remove();

                        });


                    } // end if is array of suggestions

                    // revert to original word
                    jQuery(contentWrapper).find('.writer-modal-header > #originalRevert').bind('click', function (e)
                    {
                        // replace word
                        this.closest("span."+className).childNodes[0].textContent = wordDataArray["originalWord"];

                        // replace highlighting with defaultUnderlineColor
                        jQuery(contentWrapper).find('span.'+className+':contains(' + wordDataArray["originalWord"] + ')').css({
                            "border-bottom": "2px solid "+defaultUnderlineColor
                        });

                        // close popover
                        jQuery(contentWrapper).find("#load_"+actionType+"-popup").remove();

                    });

                    // close the pop up
                    jQuery(contentWrapper).find('.writer-modal-header > #wcClose').bind('click', function (e)
                    {
                        jQuery(contentWrapper).find("#load_"+actionType+"-popup").remove();

                        // remove highlighting
                        /*
                         if (typeof afterHover != 'undefined')
                         if (beforeHover != afterHover)
                         $(contentWrapper).find('span.'+className+':contains(' + afterHover + ')').removeClass(className).contents().unwrap();
                         */
                    });


                }); //end .load
            }
        }


    });

}
function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
