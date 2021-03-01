

const GRAMMAR_POPOVER = 'GRAMMAR_POPOVER';
const OPTIMIZE_API_POPOVER = 'OPTIMIZE_API_POPOVER';





function getPopoverState(mark) {

    const parentNodeText = mark.parentElement.textContent;
    const className = mark.getAttribute('class');
    const feedback = mark.arSuggestions;

    const popoverState = {
        popoverOriginalWord: '',
        popoverFeedback: feedback,
        popoverId: mark.id,
        mark:mark,
        showPopover: true,
        parentNodeText: parentNodeText,
    };

    if (className.includes('arSpellingGrammar')) {
        popoverState.popoverFeedback = feedback.data;
        popoverState.popoverOriginalWord = feedback.originalWord;
        popoverState.type = GRAMMAR_POPOVER;
        popoverState.showAddToDictionary = feedback.data.type === 'spelling';
    } else if (className.includes('optimizedWord')) {
        popoverState.popoverOriginalWord = feedback.text;
        popoverState.popoverFeedback = feedback;
        popoverState.showAddToDictionary = false;
        popoverState.type = OPTIMIZE_API_POPOVER;
    } else if (className.includes('complianceWord')) {
        popoverState.type = GRAMMAR_POPOVER;
        popoverState.popoverOriginalWord = mark.innerHTML;
        popoverState.popoverFeedback = { message: 'This word is part of your compliance list. Consider replacing it.' };
    }

    return popoverState;
}

function renderPopover(popoverDetails){
    closePopover();
    vStore.popoverShow = true;
    let popover = document.createElement('div');
    popover.className = 'ar-popover popover show editor-popover';

    let popoverHeader = document.createElement('div');
    popoverHeader.className = 'ar-popover-header';


    if(popoverDetails.type === OPTIMIZE_API_POPOVER) {
        popoverHeader.innerHTML = 'Original: ';
        let originalWordElement = document.createElement('span');
        originalWordElement.role = 'button';
        originalWordElement.className = 'replacement-word arPopoveReplacementWordItem';
        originalWordElement.innerHTML = popoverDetails.popoverOriginalWord;

        originalWordElement.onclick = (e) => {
            wordReplacedCallback(e, popoverDetails)
        };

        popoverHeader.appendChild(originalWordElement);
    }else{
        popoverHeader.innerHTML = popoverDetails.popoverOriginalWord;
    }
    popover.appendChild(popoverHeader);
    let popoverBody = document.createElement('div');
    popoverBody.className = 'ar-popover-body';
    popoverBody.appendChild(getContent(popoverDetails));
    popover.appendChild(popoverBody);

    document.querySelector('.mce-edit-area').appendChild(popover);
}

function closePopover(){

    if(document.querySelector('.ar-popover') !== null)
        document.querySelector('.ar-popover').remove();

    vStore.popoverShow = false;
}

function getContent (popoverDetails) {

    switch (popoverDetails.type) {
        case GRAMMAR_POPOVER:
            return getGrammarContent(popoverDetails,true);
        case OPTIMIZE_API_POPOVER:
            return getOptimizeContent(popoverDetails, true);
        default:
            return null;
    }
}

function getGrammarContent(popoverDetails , dictionary = false){

    const {popoverFeedback} = popoverDetails;
    const {suggestions} = popoverFeedback;


    if(popoverFeedback.url){
        let atdResponse = '<div id="atdWrapper"><p>Loading data... Please wait!</p></div>';
       getAtdResponse(popoverFeedback.string).then((data)=>{
           setAtd(data);
       });

        return convertToHTML(atdResponse);
    }

    if ('message' in popoverFeedback) {
        return convertToHTML(`<div id="complianceWrapper">${popoverFeedback.message}</div>`);
    }

    if (!suggestions[0]) {
        return null;
    }


    let suggestionList = generateSuggestionList();
    if(dictionary){
        let dictionaryElement = document.createElement('div');
        dictionaryElement.className = 'flex-fill';
        let dictionaryButton = document.createElement('button');
        dictionaryButton.type = 'button';
        dictionaryButton.className = 'btn btn-link text-sm-left arPopoverAddToDictionary';
        dictionaryButton.innerHTML = 'Add to dictionary';
        dictionaryButton.onclick = ()=>{addToDictionary(popoverDetails);}
        dictionaryElement.appendChild(dictionaryButton);
        suggestionList.append(dictionaryElement)
    }


    return suggestionList;

    function setAtd(data = ''){
        if(document.querySelector('#atdWrapper') !== null){
            document.querySelector('#atdWrapper').innerHTML = data
        }

    }

    function generateSuggestionList(){
        let suggestionContainer = document.createElement('div');
        let spellingSummary = document.createElement('p');
        spellingSummary.className = 'spellingPopoverSummary';
        spellingSummary.innerHTML = suggestions[0][0];

        let spellList = document.createElement('ul');
        spellList.className = 'list-group pre-scrollable';

        suggestions[0][1].map((str) => {
            let listItem = document.createElement('li');
            listItem.className = 'list-group-item spellingGrammarReplacementWord arPopoveReplacementWordItem';
            let listItemWord = document.createElement('span');
            listItemWord.onclick = (e)=>{
                wordReplacedCallback(e , popoverDetails)
            };
            listItemWord.className = 'replacement-word arPopoveReplacementWordItem';
            listItemWord.role = 'button';
            listItemWord.innerHTML = str;
            listItem.appendChild(listItemWord);
            spellList.appendChild(listItem);
        });

        suggestionContainer.appendChild(spellingSummary);
        suggestionContainer.appendChild(spellList);

        return suggestionContainer;

    }

    function getAtdResponse(originalText){
        const data ={
            text: originalText,
        };

        return new Promise((resolve) => {
            const url = '/grammar/atd-info/';
            arAjaxCallHandler(url, data,'POST').then((response) =>{
                resolve(response);
            });

        });
    };
}

function getOptimizeContent(popoverDetails, flag = false) {
  const { popoverFeedback } = popoverDetails;
  const { alternatives, replacement, powerWords } = popoverFeedback;
    let synonyms = alternatives.slice();
  if ( replacement !== null && !synonyms.includes(replacement)) {
      synonyms.unshift(replacement);
    }
  if(powerWords.length > 0){
      synonyms.unshift(powerWords);
  }
  let alternativesContainer = document.createElement("ul");
  alternativesContainer.className = "list-group pre-scrollable";
  synonyms.map(synonym => {
    let listItem = document.createElement("li");
    listItem.className = "list-group-item synonymsReplacementWord";

    let listItemWord = document.createElement("span");
    let listFlag = document.createElement("span");

    listItemWord.onclick = e => {
      wordReplacedCallback(e, popoverDetails);
    };
    listFlag.onclick = e => {
      badWordFlagCallback(e, popoverDetails);
    };
    // check if word is a bad replacement
    const flaggedWordIndex = vStore.popoverWordsFlagged.map((el) => el.id).indexOf(`${popoverDetails.popoverId}`);
    // index found

    listItemWord.className = "replacement-word arPopoveReplacementWordItem";
    if (flaggedWordIndex >= 0 && vStore.popoverWordsFlagged[flaggedWordIndex].words.indexOf(synonym) >= 0) {
        listItemWord.classList.add("disabledWord");
    }

    listItemWord.role = "button";
    listItemWord.innerHTML = synonym;


    listFlag.className = "bad-word-flag arBadWord";
    listFlag.role = "button";
    listFlag.innerHTML =
      ' <span class="dashicons dashicons-flag redColour"/>';

    listItem.appendChild(listItemWord);
    listItem.appendChild(listFlag);

    alternativesContainer.appendChild(listItem);
  });
  return alternativesContainer;
}

function wordReplacedCallback(e,popoverDetails){

    const {
        popoverId,
    } = popoverDetails;

    let activeWord = findElementInIframe('#'+popoverId);
    const destructedId = popoverId.split('_');
    const paragraphId = Number(destructedId[2]);
    let updateVStoreFlag = false;

    vStore.paragraphTextContent.forEach(function(data){
        if (data.index === paragraphId) {
            if (popoverDetails.parentNodeText === data.text) {
                updateVStoreFlag = true;
            }
        }
    });

    try {
            replaceActiveWord(e.target, activeWord, updateVStoreFlag, paragraphId);
            callParagraphFeedback();
            //@todo: We need to keep track of all the changes done so when we relight we keep track of everything


        }catch(e){
            console.log(e,'Error has occurred')
        }

        closePopover();
}

function badWordFlagCallback(e, popoverDetails) {
    let target = jQuery(e.target).parent();

    if (vStore.popoverWordsFlagged.length > 0) {
        //check if is in the store
        let idExists = false;
        vStore.popoverWordsFlagged.forEach((item) => {
            if (item.id === popoverDetails.popoverId ) {
                idExists = true;
                if (item.words.indexOf(target.prev().text()) === -1) {
                    //add word to existing id
                    item.words.push(target.prev().text())
                }
            }
        });

        if (!idExists) {
           // store the word flagged as bad replacement
           vStore.popoverWordsFlagged.push({ 'id': popoverDetails.popoverId, 'words': [target.prev().text()]});
        }

    } else {
        // store the word flagged as bad replacement
        vStore.popoverWordsFlagged.push({ 'id': popoverDetails.popoverId, 'words': [target.prev().text()]});
    }

    const popoverFeedback = popoverDetails.popoverFeedback;
    const data = {
        originalWord: popoverDetails.popoverOriginalWord,
        replaceWord: target.prev().text(),
        paragraphText: popoverDetails.parentNodeText,
        charIndex: popoverFeedback.idx,
        feedBackType: '-'
    };

    arAjaxCallHandler("/optimize/flag/", data, "POST",function(resp){
        // disable word
        const listItem = target.prev();
        listItem.addClass("disabledWord");
    });
}

function getPositionYEditor(target) {

    const markRect = target.getBoundingClientRect();

    return sum(
        document.querySelector('.mce-toolbar-grp').offsetHeight,
        markRect.height,
        markRect.top,
    );
}

function getPositionXEditor(target, popover) {
    const markRect = target.getBoundingClientRect();
    const left = markRect.left - (popover.offsetWidth / 2) + (markRect.width / 2);

    if (left < 0) return 0;
    return left;
}

function doRePositioningXYEditor(target) {


    const popover = document.querySelector('.popover.show.editor-popover');

    popover.style.top = `${getPositionYEditor(target)}px`;
    popover.style.left = `${getPositionXEditor(target, popover)}px`;

}

function convertToHTML(string){
    let wrapper= document.createElement('div');
    wrapper.innerHTML= string;

    return wrapper;
}

function findElementInIframe(selector){
     let element = jQuery('#content_ifr').contents().find(selector);
    if(element.length > 0){
        return element[0]
    }

}

/*
* @paragraphIndex: Send the current active paragraph index number. Where the active highlighted word is.
* @$replacementWordDom: Must be jQuery object of what just clicked on. Replacement word dom.
* */
function replaceActiveWord($replacementWordDom,$wordToReplaceDom, updateVStoreFlag, paragraphId) {

    let replacementWordString = $replacementWordDom.innerHTML;
    const wordToReplaceString = $wordToReplaceDom.innerHTML;

//     // // if the original word's first letter is uppercase
    if (wordToReplaceString[0] === wordToReplaceString[0].toUpperCase()) {
        // replacement words's first letter should also be uppercase
        replacementWordString = capitalizeFirstLetter(replacementWordString);
    }
    $wordToReplaceDom.innerHTML = replacementWordString;
    $replacementWordDom.innerHTML = wordToReplaceString;

    if (updateVStoreFlag) {
        vStore.paragraphTextContent.forEach(function(data, index){
            if (data.index === paragraphId) {
                vStore.paragraphTextContent[index] = {'index': data.index, 'text': $wordToReplaceDom.parentNode.textContent };
            }
        });
    }
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function isEmpty(variable) {
    try {
        return !variable || Object.keys(variable).length === 0;
    } catch (i) {
        console.log('--- isEmpty:', variable);
    }
}

function addToDictionary(popoverDetails) {

    closePopover();

    const {
        popoverOriginalWord,
        mark
    } = popoverDetails;
    let data = {
        word:popoverOriginalWord
    };

    arAjaxCallHandler("/dictionary/add/", data, "POST",function(){
        mark.outerHTML = mark.innerHTML;
    });
}

function sum(...args) {
    return [...args].reduce((a, b) => a + b, 0);
}
