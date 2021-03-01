/**
 * Created by Hassan on 2019-11-05.
 */

const VALID_HTML_TAG_NAMES = ["P", "LI", "H1", "H2", "H3", "H4", "H5", "H6"];
const OPTIMIZE_BUTTON_ID = "atomicreach-optimize-button";
const OPTIMIZE_BUTTON_CONTAINER_ID = "optimize-button-container";
const REVERT_OPTIMIZE_BUTTON_ID = "atomicreach-optimize-revert-button";
const REVERT_OPTIMIZE_BUTTON_CONTAINER_ID = "revert-button-container";
const PROFILE_DROPDOWN = "ar_profiles";
const MARK_TAG_NAME = "armarker";
const SPELLING_GRAMMAR_CLASS = "arSpellingGrammar";
const COMPLIANCE_CLASS = "complianceWord";
const OPTIMIZED_WORD_CLASS = "optimizedWord";
const HIGHLIGHT_BUTTON = "#atomicreach-highlight-paragraph";
const TRACK_OPTIMIZE = "Optimize";
const TRACK_UNDERLINING = "Underlining";
const TRACK_SAVE = "Save";
const TRACK_APP_CLASSIC = "ClassicEditor";
const STORED_UNIQID = "aranalyzer_uniqueId";

// Virtual Store
const vStore = {
    'oneClickOptimizeFeedback': [],
    'paragraphTextContent': [],
    'paragraphOptimizedWords': [],
    'titleDocumentFeedback': {},
    'spellingIssues': {},
    'spellingGrammerFeedback': {},
    'totalOptimizeWordsToHighlight': 0,
    'profileDetails': {},
    'popoverWordsFlagged' : [],
    'popoverShow': false,
    'paragraphs': {},
    'content': '',
    'showHighlighting': true,
    'longParClicked': false, // Shorten paragraphs button shown clicked
    'responseOptimized': false
};


window.addEventListener('load', function () {
    const TINYMCE = tinyMCE.activeEditor;
    const updated = jQuery('#post-status').val();
    const notice = jQuery('.ar-notice');

    clearAllHighlighting();
    getAllProfiles(storeProfileDetails);

    //if post has been updated or
    if (!updated) {
        arMapDocument();
        callParagraphFeedback();
    }

    /**
     * Logs to DB custom events around Classic editor.
     * @param {Object} params - Parameters to store on DB log.
     */
    function trackLog(params) {
        const uniqueId = window.localStorage.getItem(STORED_UNIQID);
        if (!uniqueId) {
          if (window.loadingUniqueId) {
            return; // already creating uniqueId, abort
        }
          window.loadingUniqueId = true;
          arAjaxCallHandler(
            "/logging/createUniqueId/",
            {},
            "GET",
            resp => {
              window.localStorage.setItem(STORED_UNIQID, resp.uniqueId);
              window.loadingUniqueId = false;
              params.uniqueId = resp.uniqueId;
              arAjaxCallHandler("/logging/log/", params, "POST");
            },
            error => {
              console.log("Error loading uniqueId:", error);
              window.loadingUniqueId = false;
            }
          );
        } else {
          params.uniqueId = uniqueId;
          arAjaxCallHandler("/logging/log/", params, "POST");
        }
    }

    // clear highlight before submiting form, this way will clean the html added to the iframe
    jQuery('form#post').submit(function () {
        // Track Save Draft button click on DB log
        trackLog({
            eventName: TRACK_SAVE,
            appName: TRACK_APP_CLASSIC
        });
        clearAllHighlighting();
        return true;
    });

    jQuery("#" + PROFILE_DROPDOWN).change(function (e) {

        clearAllHighlighting("optimizedWord");
        enableOptimizeButton();
    });

    tinymce.get('content').on('keyup',editorKeyUp);
    tinymce.get('content').on('keydown',editorKeyDown);
    tinymce.get('content').on('paste',editorPaste);

    jQuery('#title').on('keyup',editorKeyUp);
    jQuery('#myonoffswitch').change(function() {
        // Track Underlining/Highlighting button click on DB log
        trackLog({
            eventName: TRACK_UNDERLINING,
            appName: TRACK_APP_CLASSIC,
            jsonData: {
                isOn: this.checked
            }
        });
        if(this.checked) {
            vStore.showHighlighting = true;
            if(vStore.content === md5(TINYMCE.getContent())) {
                reHighlightOptimizedWords();
                arHighlightSGC(vStore.spellingGrammerFeedback);
                showRevertButton();
            }

            return true;
        } else {
            hideRevertButton();
        }


        showNotice('warning','Warning: Underlining of optimized words will be lost if article is updated while Atomic Reach underlining is turned off');
        jQuery('#atomicreach-highlight-paragraph').removeClass('active');
        storeOptimizedWords();
        clearAllHighlighting();
        vStore.content = md5(TINYMCE.getContent());
        vStore.showHighlighting = false;


    });

    tinymce.get('content').on('click', function (event) {
        let mark = event.target;

        if (mark.classList.contains(SPELLING_GRAMMAR_CLASS)) {
            mark.arSuggestions = vStore.spellingIssues[mark.getAttribute('paragraph_index') + '_' + mark.getAttribute('spelling_id')];
        } else if (mark.classList.contains(OPTIMIZED_WORD_CLASS)) {
            mark.arSuggestions = vStore.oneClickOptimizeFeedback[parseInt(mark.dataset.blockIndex)][parseInt(mark.dataset.optimizeId)];
        }
        if (mark.classList.contains(SPELLING_GRAMMAR_CLASS) || (mark.classList.contains(OPTIMIZED_WORD_CLASS) || (mark.classList.contains(COMPLIANCE_CLASS)))) {
            renderPopover(getPopoverState(mark));
            doRePositioningXYEditor(mark);
        } else {
            closePopover();
        }


    });

    /*Override Default WordPres Dismiss Features*/
    jQuery('.ar-notice .notice-dismiss').unbind('click').bind('click', removeNotice);

    document.body.addEventListener("click", function(e) {
        if (jQuery(e.target).closest('.ar-popover').length === 0)
            closePopover();
    });

    // Optimize button clicked.
    jQuery("#atomicreach_metabox").on("click", "#" + OPTIMIZE_BUTTON_ID, function (e) {
        e.preventDefault();
        toggleIsBusyOptimizeButton();
        hideRevertButton();
        jQuery('#atomicreach-highlight-paragraph').removeClass('active');
        vStore.showHighlighting = false;

        clearAllHighlighting();
        TINYMCE.setMode('readonly');
        hideFeedback(); // hide Sidebar sections: Improvements, Title insights

        const data = {
            profileId: getSelectedProfile(),
            content: arGetContent()
        };

        showHighlighting();
        // Track optimize button click on DB log
        trackLog({
            eventName: TRACK_OPTIMIZE,
            appName: TRACK_APP_CLASSIC
        });
        arAjaxCallHandler("/optimize/article/", data, "POST", function (resp) {
            if (typeof resp !== 'object') {
                enableOptimizeButton();
                showNotice('error','Something Went Wrong. Please contact your Client Success Manager for support.');
            } else {
            const reorderResp = reorderParagraphsResponse(
                resp,
                arGetValidEditorNodes()
            );
            vStore.oneClickOptimizeFeedback = reorderResp;
            disableOptimizeButton();
            arProcessOneClickOptimize(reorderResp);
            storeOptimizedWords();

            // Send request for title. Also updates sidebar sections
            titleDocumentFeedback(noticeFeedback, true);
            }
        }, function() {
            showNotice('error',`An unexpected error has occurred. Please contact your Client Success Manager for support`)
        });

        setTimeout(function () {
            TINYMCE.setMode('design')
        }, 2000)

    });

    jQuery("#atomicreach_metabox").on("click", "#" + REVERT_OPTIMIZE_BUTTON_ID, function (e) {
        revertOptimizedWords();
        removeNotice()
    });


    function storeProfileDetails(resp) {
        resp.map(function (data) {
            vStore.profileDetails[data.value] = data;
        });

    }

    function noticeFeedback(resp) {
        // Call checkForOptimization() to set vStore.responseOptimized
        checkForOptimization(resp);
        if (!resp || !resp.data) {
            showNotice('warning', 'Your language cannot be optimized to hit the target readability and emotion for the profile. You can improve your content by applying feedback in the Improvements and Title Insights list.')
            return;
        }
        var hasWords = vStore.totalOptimizeWordsToHighlight  > 0;
        var hasReadability = resp.data.Readability && resp.data.Readability.state === true;
        var hasEmotion = resp.data.Arousal && resp.data.Arousal.state === true;

        if (hasWords) {
            var profileSelected = getSelectedProfile();
            var engagementStr = getEngagementStr(vStore.profileDetails[profileSelected]);
            const tense = (vStore.totalOptimizeWordsToHighlight !== 1) ? 'changes were' : 'change was';
            showNotice('success', 'Your language is now optimized for ' + engagementStr + '. ' + vStore.totalOptimizeWordsToHighlight + ' ' + tense + ' made.');
            showRevertButton();
        } else if (hasReadability && hasEmotion) {
            var profileSelected = getSelectedProfile();
            var engagementStr = getEngagementStr(vStore.profileDetails[profileSelected]);
            showNotice('success', 'Your language is already optimized for ' + engagementStr + '.')
        } else if (!hasReadability && hasEmotion) {
            showNotice('warning', 'Your language&#39;s emotion already hits the profile but its readability cannot be optimized. You can improve your content by applying feedback in the Improvements and Title Insights list.')
        } else if (hasReadability && !hasEmotion) {
            showNotice('warning','Your language&#39;s readability already hits the profile but its emotion cannot be optimized. You can improve your content by applying feedback in the Improvements and Title Insights list.')
        } else if (!hasReadability && !hasEmotion) {
            showNotice('warning', 'Your language cannot be optimized to hit the target readability and emotion for the profile. You can improve your content by applying feedback in the Improvements and Title Insights list.')
        }
    }

    function resetFeedback() {
        setSelectedProfile('null');
        vStore.totalOptimizeWordsToHighlight = 0;
        vStore.oneClickOptimizeFeedback = [];

    }


});
