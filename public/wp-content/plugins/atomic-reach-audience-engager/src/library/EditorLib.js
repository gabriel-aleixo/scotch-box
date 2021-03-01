import {GRAMMAR_POPOVER, OPTIMIZE_API_POPOVER, ADD_DICTIONARY, ATOMICREACH_API_NAMESPACE} from "../constants"
import apiFetch from "@wordpress/api-fetch";


export function getPopoverState(mark) {
    const className = mark.getAttribute('class');
    const feedback = mark.arSuggestions;
    const popoverState = {
        popoverOriginalWord: '',
        popoverFeedback: feedback,
        popoverId: mark.id,
        showPopover: true,
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

export function getActiveDomByParagraphIndexNumber(paragraphIndex) {
    const iframe = document.getElementById('editor_ifr');
    if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const id = `arIndex_${paragraphIndex}`;
        return iframeDoc.getElementById(id);
    }
}



/*
* @paragraphIndex: Send the current active paragraph index number. Where the active highlighted word is.
* @$replacementWordDom: Must be jQuery object of what just clicked on. Replacement word dom.
* */
export function replaceActiveWord($replacementWordDom,$wordToReplaceDom) {

    let replacementWordString = $replacementWordDom.innerHTML;
    const wordToReplaceString = $wordToReplaceDom.innerHTML;

//     // // if the original word's first letter is uppercase
    if (wordToReplaceString[0] === wordToReplaceString[0].toUpperCase()) {
        // replacement words's first letter should also be uppercase
        replacementWordString = capitalizeFirstLetter(replacementWordString);
    }
    $wordToReplaceDom.innerHTML = replacementWordString;
    $replacementWordDom.innerHTML = wordToReplaceString;
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
export function isEmpty(variable) {
    try {
        return !variable || Object.keys(variable).length === 0;
    } catch (i) {
        console.log('--- isEmpty:', variable);
    }
}

export function addToDictionary(element) {

    const url = ATOMICREACH_API_NAMESPACE +  ADD_DICTIONARY;
    return new Promise((resolve) =>{
        apiFetch({
            path: url,
            method: 'POST',
            data: {
                word: element.innerText
            }
        }).then(() => {
                resolve();
        });
    });


}

export function getEditorWrapperDOM() {
    return  document.querySelector('div[aria-label="Editor content"]');
}

export function getEditorWritingDOM() {
    return document.querySelector('.editor-writing-flow') || document.querySelector('.block-editor-writing-flow');
}
