var typingTimer = null;
const optimziedMeasures = [
    'Arousal',
    'Readability'
];

function removeNotice() {
    const notice = jQuery('.ar-notice');
    notice.addClass('hide');
    notice.removeClass('notice-error')
        .removeClass('notice-warning')
        .removeClass('notice-info')
        .removeClass('notice-success');

    notice.find('p').html('');
}

function showNotice(status = 'success', message) {
    removeNotice();
    const notice = jQuery('.ar-notice');
    notice.removeClass('hide');
    notice.addClass('notice-' + status);
    notice.find('p').html(message);

    //scroll to the top of the page to see the notice
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function arAjaxCallHandler(path, data, type, onSuccessCallback, onFailureCallback, debug) {

    type = type || "POST";
    data = data || {};
    debug = debug || false;

    if(path === undefined) {
        console.error("Must Provide Endpoint Param To xhrCall");
        return "Must Provide Endpoint param";
    }


    path = "/atomicreach/v1" + path;

    // console.log(window,  wp.apiRequest());
    // console.log(path, data, type, beforeCallback, onFailCallback, onSuccessCallback, onCompleteCallback);

   return new Promise (function(resolve) {
       wp.apiRequest({
            type,
            path,
            data,
        }).then(function(resp) {
            if(typeof onSuccessCallback === 'function') {
                onSuccessCallback(resp);
            }
           resolve(resp);
        }).fail(function(resp){
            disableOptimizeButton();
            callParagraphFeedback();
            if(typeof onFailureCallback === 'function') {
                onFailureCallback(resp);
            }
        });
    });

    if(debug) {
        console.log("Finished Ajax Call: ", type, path, data);
    }

}

function arGetContent(format = 'html') {
    return tinyMCE.activeEditor.getContent({format:format});
}

function arGetTitle() {
    return jQuery('#title').val();
}

function arGetOptimizedWords(node) {

    let optimizedWords = node.querySelectorAll('.optimizedWord');
    optimizedWords.forEach(function(node) {
        // console.log(node.innerHTML);
        node.dataset.word = node.innerHTML
    });


    return optimizedWords
}

function storeOptimizedWords() {

    vStore.paragraphOptimizedWords = [];
    const markedNodes = arGetValidEditorNodes();
    if (!vStore.paragraphs || vStore.paragraphs.length === 0) {
        return;
    }
    for(let index in vStore.paragraphs) {
        const nodeContent = markedNodes[index];
        if (nodeContent) {
            const optimizedWords = arGetOptimizedWords(nodeContent);
            vStore.paragraphOptimizedWords.push(optimizedWords);
        }
    }
}

function arMapDocument() {

    const body = tinyMCE.activeEditor.getBody();
    let arIndex = 0;


    for(var i = 0; i < body.childNodes.length; i++) {
        const node = body.childNodes[i];
        const nodeName = node.nodeName;
        if(VALID_HTML_TAG_NAMES.includes(nodeName)) {
            node.dataset.arIndex = arIndex;
            arIndex++;
        }
    }

}

function arReMapDocument(prevElement){
    const body = tinyMCE.activeEditor.getBody();

    console.log(body, prevElement);

    console.log(Array.prototype.indexOf.call(body.children, prevElement));

    return;

    for(var i = 0; i < body.childNodes.length; i++) {
        const node = body.childNodes[i];
        const nodeName = node.nodeName;
        if(VALID_HTML_TAG_NAMES.includes(nodeName)) {
            node.dataset.arIndex = arIndex;
            arIndex++;
        }
    }

}

function callParagraphFeedback() {
    clearTimeout(typingTimer);
    typingTimer = null;
    const requestArray = [];

    let markedNodes = arGetValidEditorNodes();
    if(markedNodes.length === 0) {
        arMapDocument();
        markedNodes = arGetValidEditorNodes();

        //Try to mark paragraphs again
        if(markedNodes.length === 0) {
            console.error("Error: unable to find marked paragraphs... possible incompatible HTML detected.", markedNodes);
            return;
        }
    }
    var hasMeasureData = false;

    for(const node of markedNodes) {
        const paragraphArray = {};

        paragraphArray.contentTypeName = "Article";
        paragraphArray.environment = "PRODUCTION";
        paragraphArray.measureNamesArray = ["rtSpellingGrammar", "rtComplianceList"];


        if(Object.keys(vStore.titleDocumentFeedback).length) {
            const paragraphLength = vStore.titleDocumentFeedback.data.PercentageParagraphsIdealWordCount;
            if(!paragraphLength.state) {
                paragraphArray.readabilityTargetBucket = vStore.titleDocumentFeedback.data.Readability.target;
                paragraphArray.measureNamesArray.push("rtParagraphLength")
                hasMeasureData = true;
            }
        }

        paragraphArray.content = encodeURIComponent(node.innerHTML);
        paragraphArray.measureNamesArray = JSON.stringify(paragraphArray.measureNamesArray);
        requestArray.push(paragraphArray);
    }

    const data = {requestArray: JSON.stringify(requestArray)};

    arAjaxCallHandler("/paragraphAnalyze/article/", data, "POST",function(resp){
        if (resp.length > 0) {
            arHighlightSGC(resp);
            if (hasMeasureData) {
                titleDocumentFeedback();
            }
        }
    });

}



function getAllProfiles(callback = function(){}){
    arAjaxCallHandler("/get-profiles", {}, "GET",function(resp){
        //render profile selection
        generateProfileList(resp);
        callback(resp);

    });
}

function generateProfileList(resp){


    $profileSelection = jQuery("#"+PROFILE_DROPDOWN);
    $profileSelection.html('');

    if(resp.length > 0){
        $profileSelection.prop('disabled', false);
        resp.map(function(data){
            $profileSelection.append('<option value="'+data.value+'" >'+data.label+'</option>');
        });
    }else{
        $profileSelection.append('<option value="null" >No Profiles Found</option>');
    }

}

function getEngagementStr(profileDetails) {

    let engagementNames = {
        GA_pageviews: 'Page Views',
        GA_uniquepageviews: 'Unique Views',
        GA_goalcompletionsall: 'Total Conversions',
        GA_avgTimeOnPage: 'Avg. Time on Page',
        GA_timeonpage: 'Time on Page',
        HS_ampViews: 'AMP Views',
        HS_ctaclick: 'CTA Clicks',
        HS_ctaRate: 'CTA Rate',
        HS_ctaviews: 'CTA Views',
        HS_entrances: 'Page Entrances',
        HS_leads: 'Leads',
        HS_marketingQualifiedLeads: 'Marketing Qualified Leads',
        HS_opportunities: 'Marketing Opportunities',
        HS_others: 'Others',
        HS_submissions: 'Submissions',
        HS_subscribers: 'Subscribers',
        HS_pageviews: 'Views',
        HS_pageTime: 'Time on Page',
        HS_timePerPageview: 'Time Per Pagview ',
        HS_submissionsPerPageview: 'View to Submission Rate',
        HS_contactsPerPageview: 'View to Contact Rate',
    };

    let titleEngagement = engagementNames[profileDetails.titleEngagement];
    let bodyEngagement = engagementNames[profileDetails.bodyEngagement];
    let engagementStr = '';

    if(titleEngagement === bodyEngagement)
        engagementStr = titleEngagement;
    else
        engagementStr = `${titleEngagement} and ${bodyEngagement}`;

    return engagementStr;
}

function selectedProfile(id){

    $optimize_button = jQuery('#atomicreach-optimize-button');
    if(isNaN(id)){
        $optimize_button.addClass('disabled');

    }else{
        $optimize_button.removeClass('disabled')
    }
}

function revertOptimizedWords() {
    const optimizedWords = tinyMCE.activeEditor.getBody().querySelectorAll('.optimizedWord');

    vStore.oneClickOptimizeFeedback.forEach(function (paragraphFeedback, paragraphIndex) {

        if (Object.keys(paragraphFeedback).length > 0) {
            for (let wordFeedback in paragraphFeedback) {
                const feedbackText = paragraphFeedback[wordFeedback].text; // og word
                const optimizeId = '#optimize_id_' + paragraphIndex + '_' + paragraphFeedback[wordFeedback].key;
                let optimizeWord = tinyMCE.activeEditor.getBody().querySelector(optimizeId);
                if (optimizeWord) {
                  optimizeWord.outerHTML = feedbackText;
                } else {
                  console.log("optimizeWord not found", optimizeWord);
                }
            }

        }
    });
    // enable optimize button
    enableOptimizeButton();
    // disable revert button
    hideRevertButton();
    // reset vStore
    vStore.oneClickOptimizeFeedback = [];
    vStore.totalOptimizeWordsToHighlight = 0;
}

function arProcessOneClickOptimize(feedback){

    if(Object.entries(feedback).length === 0 ){
        return true;
    }
    const optimizeFeedbackDuplicate = _.clone(feedback);
    const nodes = arGetValidEditorNodes();

    vStore.totalOptimizeWordsToHighlight = 0; // resets
    vStore.paragraphTextContent = [];
    for(let index = 0 ; index < nodes.length ; index++) {

        if(feedback[index].length === 0) {
            continue;
        }

        vStore.totalOptimizeWordsToHighlight += Object.keys(feedback[index]).length;

        Object.keys(optimizeFeedbackDuplicate[index]).map(function(key, val) {

            optimizeFeedbackDuplicate[index][key]['start'] = optimizeFeedbackDuplicate[index][key]['idx'];
            optimizeFeedbackDuplicate[index][key]['length'] = optimizeFeedbackDuplicate[index][key]['text'].length;
            optimizeFeedbackDuplicate[index][key]['key'] = parseInt(key);

        });

        const instance = new Mark(nodes[index]);

        instance.markRanges(Object.values(optimizeFeedbackDuplicate[index]), {
            "element": "armarker",
            "className": "optimizedWord",
            "filter": (function(textNode, range, term) {
                // console.log("filter: ", textNode, range, term, counter);

                if(term !== range.text) {
                    console.log("Unable to Highlight [" + range.text + "] | ", range, " | ", term);
                    return false;
                }

                // if(!isReHighlighting)
                //     this.adjustReHighlightingFeedback(blockIndex, range.key);

                return true;
            }), "each": (function(node, range) {
                // node is the marked DOM element
                // range is the corresponding range

                node.setAttribute("id", "optimize_id_" + index + "_" + range.key);

                // if(!isReHighlighting)
                // node.innerText = range.replacement;

                node.dataset.optimizeId = range.key;
                node.dataset.blockIndex = index;
                //@todo: add instance.

            }),
        });

        vStore.paragraphTextContent.push({ 'index': index, 'text': nodes[index].textContent});
    }
}

/**
 * Returns TRUE if apiFeedback is not an array containing empty objects/arrays.
 * If article sent to API is invalid, endpoint returns [[], []...]
 * @param {Array} apiFeedback - API response array
 * @returns {Boolean}
 */
function responseHasContent(apiFeedback) {
    if (apiFeedback.length > 0) {
        for (let i = 0; i < apiFeedback.length; i += 1) {
            if (!_.isEmpty(apiFeedback[i])) {
                return true;
            }
        }
    }
    return false;
}

/*Highlight Spelling Grammar & Compliance*/
function arHighlightSGC(apiFeedback){
    if (!responseHasContent(apiFeedback)) {
        return;
    }

    vStore.spellingGrammerFeedback = apiFeedback;
    if(vStore.showHighlighting === false) {
        return true;
    }

    let counter = 0;

    const markedNodes = arGetValidEditorNodes();
    let spellingIssue = {};

    for(const feedback of apiFeedback) {
        if(feedback.data.rtComplianceList.detail.length > 0){
            arComplianceListHighlighting(feedback.data.rtComplianceList.detail, markedNodes[counter]);
        }
        clearAllHighlighting("arSpellingGrammar",markedNodes[counter]);

        if(!feedback.data.rtSpellingGrammar.state) {
            const detail = feedback.data.rtSpellingGrammar.detail;
            let pSpellingIssue = arSpellingGrammarHighlighting(detail,markedNodes[counter],counter);
            spellingIssue = Object.assign(pSpellingIssue,spellingIssue)
        }
        counter++;
    }

    vStore.spellingIssues = spellingIssue;
    vStore.paragraphs = apiFeedback;
}

function arSpellingGrammarHighlighting(detail, element,paragraphIndex){

    let spellIssue = {};
    let totalMatches = 0;

    for(const index in detail) {
        const data = detail[index];
        const word = data.string.replace(',', '');
        const wordBoundary = (word.match(/(\.|\?|\!)/) == null ? '\\b' : '');
        let regex = escapeCharForRegex(word)+wordBoundary;
        if (data.precontext !== '') {
            regex = wordBoundary + escapeCharForRegex(word) + wordBoundary;
        }

        const regexp = new RegExp(regex, 'g');

        try{
            const marker = new Mark(element);
            const word = data.string;

            marker.markRegExp(regexp, {
                element: "armarker",
                exclude: ['.arSpellingGrammar', '.optimizedWord', '.complianceWord'],
                accuracy: {
                    value: 'exactly',
                    limiters: [',', '.', ';', ':', '?', '!', ')', '(', '{', '}', '\'', '“', '”', '-'],
                },
                className:'arSpellingGrammar',
                diacritics: true,
                separateWordSearch: false,
                acrossElements: false,
                debug: false,
                log: window.console,
                filter: function(node, term) {
                    if(word === term) {
                        const dot = (term[0].match(/(\.|\?|\!)/) != null ? '' : '.');
                        let r = escapeCharForRegex(data.preContext) + dot + escapeCharForRegex(term);
                        r = new RegExp(r, 'i');
                        const postPreContextPattern = escapeCharForRegex(term) + escapeCharForRegex(data.postContext);
                        const postPreContextRegex = new RegExp(postPreContextPattern, 'i');

                        if(data.preContext === '' && word === term) {
                            totalMatches = ++totalMatches || 0;
                            return true;
                        }
                        if(data.preContext !== '' && node.textContent.match(r) != null) {
                            totalMatches = ++totalMatches || 0;
                            return true;
                        } else if(data.postContext !== '' && node.textContent.match(postPreContextRegex) !== null) {
                            totalMatches = ++totalMatches || 0;
                            return true;
                        }
                        totalMatches = ++totalMatches || 0;
                        return true;
                    }
                    return false;
                },
                each: function(node) {
                    node.setAttribute("spelling_id", totalMatches);
                    node.setAttribute("paragraph_index", paragraphIndex);
                    node.setAttribute("id", 'spelling_'+paragraphIndex+'_'+totalMatches);

                    spellIssue[paragraphIndex+'_'+totalMatches] = {
                        data,
                        originalWord:data.string
                    };

                }
            });
        }catch(e) {
            console.error(e);
        }

    }

    return spellIssue;

}

function arComplianceListHighlighting(complianceList, element){

    const marker = new Mark(element);

    clearAllHighlighting("complianceWord",element);

    marker.mark(complianceList,{
        element: "armarker",
        // exclude: ['.arSpellingGrammar', '.optimizedWord'],
        accuracy: {
            value: 'exactly',
            limiters: [',', '.', ';', ':', '?', '!', ')', '(', '{', '}', '\'', '“', '”', '-'],
        },
        className:"complianceWord",
        diacritics: true,
        separateWordSearch: false,
        acrossElements: false,
        debug: false,
        log: window.console,
    })

}

function arParagraphLengtHighlight(){
    const markedNodes = arGetValidEditorNodes();
    storeOptimizedWords();
    clearAllHighlighting();
    vStore.paragraphs.forEach(function (feedback, index) {

        const marker = new Mark(markedNodes[index]);

        if (!feedback.data.rtParagraphLength.detail.maxCharsPerParagraph.passed) {
            const stringToHighlight = markedNodes[index].textContent.substr(
              feedback.data.rtParagraphLength.detail.maxCharsPerParagraph.maximum,
                markedNodes[index].textContent.length
            );


            marker.mark(stringToHighlight,{
                element: "armarker",
                className: "arParagraphLength",
                separateWordSearch: false,
                acrossElements: true,
                accuracy: {
                    value: 'partially',
                    limiters: [',', '.', ';', ':', '?', '!', ')', '(', '{', '}', '\'', '“', '”', '’'],
                },
                synonyms: {
                    '-': '–',
                    '\'': '’',
                    '\'': '‘',
                    '“': '"',
                    '”': '"',
                },
                diacritics: true,
            });

        }
    });
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function updateCurrentOptimizedWord(optimizeFeedbackDuplicate) {
    const nodes = arGetValidEditorNodes();

    for (let index = 0; index < nodes.length; index++) {
      if (
        !optimizeFeedbackDuplicate[index] ||
        optimizeFeedbackDuplicate[index].length === 0
      ) {
        continue;
      }
      if (
        !vStore.paragraphOptimizedWords[index] ||
        vStore.paragraphOptimizedWords[index].length === 0
      ) {
        continue;
      }
      let innerCounter = 0;

      for (let feedback in optimizeFeedbackDuplicate[index]) {
        let feedbackReplacement =
          optimizeFeedbackDuplicate[index][feedback].replacement;

        if (
          typeof vStore.paragraphOptimizedWords[index][innerCounter] ===
          "undefined"
        )
          continue;

        const currentOptimizedWord =
          vStore.paragraphOptimizedWords[index][innerCounter].dataset.word;

        if (feedbackReplacement !== currentOptimizedWord) {
          const alternatives =
            optimizeFeedbackDuplicate[index][feedback].alternatives;
          const indexOfAlternative = alternatives.indexOf(currentOptimizedWord);
          // adjust alternatives array
          if (indexOfAlternative !== -1) {
            alternatives.splice(indexOfAlternative, 1, feedbackReplacement);
            optimizeFeedbackDuplicate[index][
              feedback
            ].alternatives = alternatives;
          }
          optimizeFeedbackDuplicate[index][
            feedback
          ].replacement = currentOptimizedWord;
        }
        innerCounter++;
      }
    }

    return optimizeFeedbackDuplicate;
}

function adjustOptimizeFeedbackIdx(optimizeFeedbackDuplicate) {
    const nodes = arGetValidEditorNodes();

    optimizeFeedbackDuplicate = updateCurrentOptimizedWord(optimizeFeedbackDuplicate);
    // find words in paragraph and adjust index
    for (let index = 0 ; index < nodes.length ; index++) {


        if (optimizeFeedbackDuplicate[index].length === 0) continue;

        // loop through the current feedback to find and update index
        for(let feedback in optimizeFeedbackDuplicate[index]) {
            const nodeText = nodes[index].textContent;

            const feedbackText = optimizeFeedbackDuplicate[index][feedback].text;
            const feedbackReplacemnt = optimizeFeedbackDuplicate[index][feedback].replacement;

            const indecesFound = getIndicesOf(feedbackReplacemnt, nodeText);

            if (indecesFound.length > 1) {
                // loop to find closest index
                const indiceToChoose = indecesFound.map(function(value, i) {
                    return (
                        {
                            'idx': optimizeFeedbackDuplicate[index][feedback].idx,
                            'distance': optimizeFeedbackDuplicate[index][feedback].idx - indecesFound[i],
                            'newIdx': indecesFound[i]
                        }
                    )
                });

                const filteredIndex = indiceToChoose.filter(function (d) {
                    return d.distance >= 0;
                });

                const distancesFound = filteredIndex.map(function(data) {
                    return data.distance;
                });

                filteredIndex.forEach(function (value, i, array) {
                    const minDistance = Math.min(...distancesFound);

                    if (minDistance === value.distance) {
                        optimizeFeedbackDuplicate[index][feedback].idx = value.newIdx;
                        optimizeFeedbackDuplicate[index][feedback].start = value.newIdx;
                        optimizeFeedbackDuplicate[index][feedback].length = feedbackReplacemnt.length;
                    }
                })
            }
            if (indecesFound.length == 1) {
                optimizeFeedbackDuplicate[index][feedback].idx = indecesFound[0];
                optimizeFeedbackDuplicate[index][feedback].start = indecesFound[0];
                optimizeFeedbackDuplicate[index][feedback].length = feedbackReplacemnt.length;
            }
        }
    }
}

function reHighlightOptimizedWords() {
  const nodes = arGetValidEditorNodes();
  if (vStore.oneClickOptimizeFeedback.length === 0) {
    return true;
  }
  const optimizeFeedbackDuplicate = _.clone(vStore.oneClickOptimizeFeedback);
  adjustOptimizeFeedbackIdx(optimizeFeedbackDuplicate);
  for (let index = 0; index < nodes.length; index++) {
    if (optimizeFeedbackDuplicate[index].length === 0) {
      continue;
    }
    Object.keys(optimizeFeedbackDuplicate[index]).map(function(key, val) {
      optimizeFeedbackDuplicate[index][key]["start"] =
        optimizeFeedbackDuplicate[index][key]["idx"];
      optimizeFeedbackDuplicate[index][key]["length"] =
        optimizeFeedbackDuplicate[index][key]["replacement"].length;
      optimizeFeedbackDuplicate[index][key]["key"] = parseInt(key);
    });
    let isEqualContent = false;
    vStore.paragraphTextContent.forEach(function(data) {
      if (data.index === index) {
        isEqualContent = data.text === nodes[index].textContent;
      }
    });
    if (isEqualContent) {



      const instance = new Mark(nodes[index]);
      instance.markRanges(Object.values(optimizeFeedbackDuplicate[index]), {
        element: "armarker",
        className: "optimizedWord",
        filter: function(textNode, range, term) {
          if (term !== range.replacement) {
            console.log(
              "reHighlightOptimizedWords: Unable to Highlight [" +
                range.replacement +
                "]",
              {
                textNode,
                range,
                term
              }
            );
            return false;
          }
          return true;
        },
        each: function(node, range) {
          // node is the marked DOM element
          // range is the corresponding range
          node.setAttribute("id", "optimize_id_" + index + "_" + range.key);
          // if(!isReHighlighting)
          node.innerText = range.replacement;
          node.dataset.optimizeId = range.key;
          node.dataset.blockIndex = index;
          //@todo: add instance.
        }
      });
    }
  }

  vStore.paragraphOptimizedWords = [];
}

function arGetValidEditorNodes() {
    // Regular HTML, pasted or created from scratch
    let paragraphs = tinyMCE.activeEditor.getBody().querySelectorAll('[data-ar-index]');
    if (paragraphs.length === 0) {
        // HTML pasted from Gutenberg
        paragraphs = tinyMCE.activeEditor.getBody().querySelectorAll('[id^="arIndex_"]');
    }
    return paragraphs;
}


function escapeCharForRegex(word) {
    if (word) {
        return word.replace(/(\.|\"|\'|\?|\/|\)|\(|\[|\]|\$|\+)/g, '\\$1');
    }
    return '';
}

function editorKeyUp(event) {
    let id = event.target.id;

    if ([37, 38, 39, 40].indexOf(event.keyCode) !== -1) return;


    if(vStore.content ===  md5(arGetContent('text') ) && ([13, 8, 46].indexOf(event.keyCode) === -1 ))  return;


    clearTimeout(typingTimer);
    typingTimer = setTimeout(function() {
      clearTimeout(typingTimer);
      if (
        getSelectedProfile() !== "null" &&
        vStore.oneClickOptimizeFeedback.length > 0
      ) {
        var myCallback = id !== "title" ? callParagraphFeedback : null;
        titleDocumentFeedback(myCallback);
      } else {
        callParagraphFeedback();
      }
    }, 1300);

    if(getSelectedProfile() !== 'null')
        enableOptimizeButton();
}

function editorKeyDown(){
    //do not want to be storing large articles in memory
    vStore.content = md5(arGetContent('text'));

}

function titleDocumentFeedback(callback, execParagraphRequest) {
    var profileId = getSelectedProfile();
    if (!profileId || profileId === "null") {
        return;
    }
    const options ={
        profileId: profileId,
        title: arGetTitle,
        contentHtml: arGetContent()
    };
    arAjaxCallHandler("/titleDocumentAnalyze/article/", options, "POST", function(resp) {
        if (typeof callback === 'function') {
            callback(resp);
        }
        var shortenParagraphAppears = buildDocumentFeedback(resp);
        vStore.titleDocumentFeedback = resp;
        if (execParagraphRequest || shortenParagraphAppears) {
            callParagraphFeedback();
        }
    });
}

function highlightHandler(event){
    event.preventDefault();
    toggleParagraphHighlightButton();
}

function checkForOptimization(feedback){
    let optimized =  true;
    if(typeof feedback !== 'undefined') {
        optimziedMeasures.forEach(function(measure) {
            if (feedback.data[measure].state === false) {
                optimized = false
            }
        });
    } else {
        optimized = false;
    }
    vStore.responseOptimized = optimized;
    return optimized;
}

function editorPaste(){
    setTimeout(function() {
        arMapDocument();
        callParagraphFeedback();
        //Add delay because tinyMCE calls paste function before content is actaully set
    },250);
}

function clearAllHighlighting(className, element){

    var options = {};
    if(className !== undefined)
        options.className = className;

    element = element || tinyMCE.activeEditor.getBody();

    var instance = new Mark(element);
    instance.unmark(options);

    return true;

}

function getSelectedProfile(){
    return jQuery("#ar_profiles").find("option:selected").val();
}

function setSelectedProfile(value){
    return jQuery("#ar_profiles").val(value);
}

function enableOptimizeButton(){

        const button = document.getElementById(OPTIMIZE_BUTTON_ID);
        const buttonContainer = document.getElementById(OPTIMIZE_BUTTON_CONTAINER_ID);
        button.innerText = 'Optimize';
        if (hasClass(button, 'disabled')) {
            button.classList.remove('disabled', "is-busy");
            buttonContainer.classList.remove('disable');
        }
        if (!hasClass(button, 'disabled')){
            button.removeAttribute("disabled");
        }
}

function showRevertButton(){
    return;// never enable revert button
    const button = document.getElementById(REVERT_OPTIMIZE_BUTTON_ID);
    if (hasClass(button, 'hide')) {
        button.classList.remove('hide', 'disabled');
        button.classList.add('show');
        button.classList.add('active');
        button.disabled = false;
    }
}

function hideRevertButton() {
    const button = document.getElementById(REVERT_OPTIMIZE_BUTTON_ID);
    if (hasClass(button, 'show')) {
        button.classList.remove('show');
        button.classList.add('hide');
        button.classList.add('disabled');
    }
}

function disableRevertButton() {
    const button = document.getElementById(REVERT_OPTIMIZE_BUTTON_ID);
    const buttonContainer = document.getElementById(REVERT_OPTIMIZE_BUTTON_CONTAINER_ID);
    if (hasClass(button, 'active')) {
        button.classList.remove('active');
        button.classList.add('disabled');
        buttonContainer.classList.add('disable');
        button.disabled = true;
    }
}

function enableRevertButton() {
    const button = document.getElementById(REVERT_OPTIMIZE_BUTTON_ID);
    const buttonContainer = document.getElementById(REVERT_OPTIMIZE_BUTTON_CONTAINER_ID);
    button.classList.toggle('active');
    if (hasClass(button, 'active')) {
        button.classList.remove('disabled');
        buttonContainer.classList.remove('disabled');
        button.classList.add('active');
        button.disabled = false;
    }
}

function disableOptimizeButton(){
    const button = document.getElementById(OPTIMIZE_BUTTON_ID);
    const buttonContainer = document.getElementById(OPTIMIZE_BUTTON_CONTAINER_ID);
    button.innerText = 'Optimize';
    button.classList.remove("is-busy"); // Just in case.
    button.classList.add('disabled');
    buttonContainer.classList.add('disable');

    if(hasClass(button,'disabled'))
        button.setAttribute("disabled", "disabled");
}

function removeTooltip(){
    if(typeof jQuery("#" + OPTIMIZE_BUTTON_ID).data('tooltipsy') !== 'undefined')
        jQuery("#"+OPTIMIZE_BUTTON_ID).data('tooltipsy').destroy();
}
function addToolTip(){

    const button = document.getElementById(OPTIMIZE_BUTTON_ID);

    let content = '';
    if((hasClass(button,"disabled") || hasClass(button,"is-busy")) && getSelectedProfile() == 'null'){
        content  = "Select a profile before optimizing"
    } else if (hasClass(button,"disabled")) {
        content = "Your language cannot be optimized";
        if (vStore.totalOptimizeWordsToHighlight > 0
            || vStore.responseOptimized) {
            content = "Your language is optimized";
        }
    }
/*    else if(hasClass(button,"is-busy")){
        content = "Your language is being optimized"
    }*/

    if(content !== "" && !hasClass(button,"is-busy")) {
        jQuery("#" + OPTIMIZE_BUTTON_ID).tooltipsy({
            content,
            alignTo: 'cursor',
            // offset: [10, 10]
        }).data('tooltipsy').show();
    }
}

function toggleIsBusyOptimizeButton(){
    const button = document.getElementById(OPTIMIZE_BUTTON_ID);
    const highlightButton = document.querySelector(HIGHLIGHT_BUTTON);
    button.classList.add('disabled');
    button.classList.toggle('is-busy');

    if(hasClass(button,'is-busy')){
        button.innerText = 'Optimizing';
        // button.setAttribute("disabled", "disabled");
        if (highlightButton !== null && hasClass(highlightButton, 'active')) {
            clearAllHighlighting();
            reHighlightOptimizedWords();
            button.classList.remove('active');
        }
    }else{
        // button.removeAttribute("disabled");
    }
}
function toggleParagraphHighlightButton(activeStatus, skipClearHighlight) {
    const button = document.querySelector(HIGHLIGHT_BUTTON);
    // Button is not visible, remove paragraph highlight and exit
    if (!button) {
        vStore.longParClicked = false;
        if (vStore.totalOptimizeWordsToHighlight > 0)  {showRevertButton();}
        clearAllHighlighting();
        reHighlightOptimizedWords();
        arHighlightSGC(vStore.spellingGrammerFeedback);
        return;
    }
    if (activeStatus === true) {
        button.classList.add('active');
    } else if (activeStatus === false) {
        button.classList.remove('active');
    } else {
        button.classList.toggle('active');
    }
    if (hasClass(button, 'active')) {
        vStore.longParClicked = true;
        if (vStore.totalOptimizeWordsToHighlight > 0)  {hideRevertButton();}
        arParagraphLengtHighlight()
        showHighlighting();
    } else {
        vStore.longParClicked = false;
        if (vStore.totalOptimizeWordsToHighlight > 0)  {showRevertButton();}
        if (!skipClearHighlight) {
            clearAllHighlighting();
            reHighlightOptimizedWords();
            arHighlightSGC(vStore.spellingGrammerFeedback);
        }
    }
}

function showHighlighting(){
    vStore.showHighlighting = true;
    jQuery('#myonoffswitch').prop('checked', true);
}

function hasClass(elem, className){
    return elem.classList.contains(className);
}
