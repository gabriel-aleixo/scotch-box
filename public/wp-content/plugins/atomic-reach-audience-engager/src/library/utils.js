import {
    ATOMICREACH_VALID_BLOCK_NAMES_ARRAY,
    ATOMICREACH_PARAGRAPH_BREAK,
    SPELLING_GRAMMAR_CLASS,
    COMPLIANCE_CLASS,
    OPTIMIZED_WORD_CLASS,
    MARK_TAG_NAME,
    STORED_UNIQID,
    ATOMICREACH_API_NAMESPACE,
    ATOMICREACH_API_CREATE_UNIQUE_ID,
    ATOMICREACH_API_LOG,
} from '../constants';

import {dispatch, select} from "@wordpress/data";
import {createElement} from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";


export function filterHtml(html){
    const filteredHTML = html.replace(/\n/g,"")
        .match(/(?:<!--\s?wp:(paragraph|list|heading).+?-->)(.+?)(?:<!--\s?\/wp:(paragraph|list|heading).+?-->)/g);

    let finalHTML = '';
    for(let i = 0; i < filteredHTML.length ; i ++){
        finalHTML += filteredHTML[i].replace(/^<!--.+?-->(.*?)<!--\s\/.+?-->$/,"$1")
    }

    return finalHTML;

}

/*
* @param: block: a block element
* @param: returnAsIs: if content needs to be wrapped in HTML tag.
* */
export function getHTMLFromBlock(block, returnAsIs = false){

    let exportHtml = '';

    if (block === null) {
      return true;
    }


    if(block.innerBlocks.length > 0){
        exportHtml += getContentFromInnerBlocks(block.innerBlocks, returnAsIs);
    }
    if(ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(block.name))
        exportHtml += extractHTMLFromBlock(block, returnAsIs);

    return exportHtml;

}


function getContentFromInnerBlocks(innerBlock, returnAsIs = false){

    let exportHtml = '';
    for(const block of innerBlock){
        if(block.innerBlocks.length > 0){
            exportHtml += getContentFromInnerBlocks(block.innerBlocks, returnAsIs);
            continue;
        }
        if(!ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(block.name)) continue;
        exportHtml += extractHTMLFromBlock(block, returnAsIs);
    }

    return exportHtml;
}


export function addParamToUrl(url, params) {

    const esc = encodeURIComponent;
    return url+"?"+ Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

}

export function extractHTMLFromBlock(block, returnAsIs = false) {
    const content = block.attributes.content || "";
    const values = block.attributes.values || "";
    if (returnAsIs) {
      return content || values || "";
    }
    switch (block.name) {
      case "core/list": {
        const listTypeOpenTag = block.attributes.ordered ? "<ol>" : "<ul>";
        const listTypeCloseTag = block.attributes.ordered ? "</ol>" : "</ul>";
        return (
          listTypeOpenTag +
          removeARMarkerTags(values) +
          listTypeCloseTag +
          ATOMICREACH_PARAGRAPH_BREAK
        );
      }
      case "core/paragraph": {
        return `<p>${removeARMarkerTags(
          content
        )}</p>${ATOMICREACH_PARAGRAPH_BREAK}`;
      }
      case "core/heading": {
        const n = block.attributes.level;
        return `<h${n}>${removeARMarkerTags(
          content
        )}</h${n}>${ATOMICREACH_PARAGRAPH_BREAK}`;
      }
      case "core/freeform": {
        const str = removeARMarkerTags(content);
        return checkIfTagExists(str)
          ? str
          : `<p>${str}</p>${ATOMICREACH_PARAGRAPH_BREAK}`;
      }
      default:
        return (
          removeARMarkerTags(content) ||
          removeARMarkerTags(values) + ATOMICREACH_PARAGRAPH_BREAK
        );
    }
}

export function cleanARHighlightingFromBlock(block){
    if(block.innerBlocks.length > 0){
        cleanARHighlightingFromInnerBlocks(block.innerBlocks);
    }
    if(ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(block.name)){
        updateBlockContent(block, removeARMarkerTags(getHTMLFromBlock(block,true)));
        /*if(className === null){
        }else{
            updateBlockContent(block, removeARMarkerTagsByClassName(getHTMLFromBlock(block,true), className));
        }*/
    }
}

function cleanARHighlightingFromInnerBlocks(innerBlock) {

    for(const block of innerBlock){
        if(block.innerBlocks.length > 0){
            cleanARHighlightingFromInnerBlocks(block.innerBlocks);
            continue;
        }
        if(!ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(block.name)) continue;
        if(ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(block.name)){
            updateBlockContent(block, removeARMarkerTags(getHTMLFromBlock(block,true)));
            /*if(className === null){
            }else{
                updateBlockContent(block, removeARMarkerTagsByClassName(getHTMLFromBlock(block,true), className));
            }*/
        }
    }
}

export function removeARMarkerTags(str) {
    return str.replace(/<\/?armarker(.*?)>/g,'');
}

export function debugCountHighlightedWords(blocks){

    let totalCount = 0;
    for(const block of blocks){
        const html = extractHTMLFromBlock(block, true);
        const DOM_nodes = jQuery('<div></div>').html( html );
        totalCount += DOM_nodes.find("armarker.optimizedWord").length;
    }

    // console.log("Debug: ",totalCount, " Words Highlighted");
}
/* @param: String can contains HTML tags.
* */
export function replaceByIndex(string,token){
    const replacement = `*[${token.replacement}]*`;

    let arr = string.split("");
    arr.splice(token.idx,token.text.length, replacement );
    return  arr.join("");
}

export function removeARMarkerTagsByClassName(block, classNames) {

    let content = getHTMLFromBlock(block, true);
    const node = document.createElement('div');
    node.innerHTML = content.trim();
    const instance = new Mark(node);

    instance.unmark({
        "element": MARK_TAG_NAME,
        "className":classNames,
        "debug": false,
        "log": window.console
    });

    updateBlockContent(block, node.innerHTML);

}

export function revertParagraphOptimizeWords(str){

    var newDiv = document.createElement("div");
    newDiv.innerHTML = str;

}

export function updateBlockContent(block, newContent){

    switch(block.name) {
        case "core/list":
            dispatch('core/editor').updateBlockAttributes(block.clientId, {values: newContent});
            break;
        /*case "core/paragraph":
        case "core/heading":
            dispatch('core/editor').updateBlockAttributes(block.clientId, {content: newContent});
            break;*/
        default:
            dispatch('core/editor').updateBlockAttributes(block.clientId, {content: newContent});
            break;
    }
}


export function highlightSpellingGrammar(apiFeedback){

    let spellIssue = {};
    let counter = 0;
    let totalMatches = 0;

    for(const feedback of apiFeedback){
        if(feedback.status !== 10){
            continue;
        }
        let block = select("core/editor").getBlock(feedback.blockClientId);
        if (block === null) {
            continue;
        }
        removeARMarkerTagsByClassName(block,SPELLING_GRAMMAR_CLASS);
        if(!feedback.data.rtSpellingGrammar.state){

            for(const data of feedback.data.rtSpellingGrammar.detail){
                block = select("core/editor").getBlock(feedback.blockClientId);
                let content = getHTMLFromBlock(block, true);
                const word  = data.string;
                const precontext  = data.precontext;
                const postcontext  = data.postcontext;

                // Create a node element for Mark Js to work with.
                const node = document.createElement('div');
                node.innerHTML = content.trim();
                const wordBoundary = (word.match(/(\.|\?|\!)/) == null ? '\\b' : '');

                let regex = `${escapeCharForRegex(word)}${wordBoundary}`;
                if (precontext !== '') {
                    regex = wordBoundary + escapeCharForRegex(word) + wordBoundary;
                }

                const regexp = new RegExp(regex, 'g');
                const instance = new Mark(node);


                instance.markRegExp(regexp, {
                    "element": MARK_TAG_NAME,
                    "exclude": ['.'+COMPLIANCE_CLASS,'.'+OPTIMIZED_WORD_CLASS,'.'+SPELLING_GRAMMAR_CLASS],
                    accuracy: {
                        value: 'exactly',
                        limiters: [',', '.', ';', ':', '?', '!', ')', '(', '{', '}', '\'', '“', '”', '-'],
                    },
                    "className": SPELLING_GRAMMAR_CLASS,
                    diacritics: true,
                    caseSensitive :true,
                    separateWordSearch: false,
                    acrossElements: false,
                    debug: false,
                    log: window.console,
                    filter: (node, term) => {
                        if (word === term) {
                            const dot = (term[0].match(/(\.|\?|\!)/) != null ? '' : '.');
                            let r = escapeCharForRegex(precontext) + dot + escapeCharForRegex(term);
                            r = new RegExp(r, 'i');
                            const postPreContextPattern = `${escapeCharForRegex(term)}.${escapeCharForRegex(postcontext)}`;
                            const postPreContextRegex = new RegExp(postPreContextPattern, 'i');

                            if (precontext === '') {
                                totalMatches = ++totalMatches || 0;
                                return true;
                            }
                            if (precontext !== '' && node.textContent.match(r) != null) {
                                totalMatches = ++totalMatches || 0;
                                return true;
                            } else if (precontext !== '' && node.textContent.match(postPreContextRegex) !== null) {
                                totalMatches = ++totalMatches || 0;
                                return true;
                            }
                            totalMatches = ++totalMatches || 0;
                            return true;
                        }
                        return false;
                    },
                    each: (node) => {
                        node.setAttribute("id", "spelling_id_"+totalMatches);
                        node.dataset.spellingIssueId = totalMatches;
                        spellIssue[totalMatches] = {
                            data,
                            originalWord:data.string
                        };
                    },
                });


                updateBlockContent(block, node.innerHTML);
                counter++;

            }
        }
    }

    return spellIssue;
}

export function highlightComplianceList(apiFeedback){

    let complianceList = {};
    let counter = 0;
    let totalMatches = 0;

    for(const feedback of apiFeedback){
        if(feedback.status !== 10){
            continue;
        }
        const blockId = feedback.blockClientId;
        let block = select("core/editor").getBlock(blockId);
        if (block === null) {
          continue;
        }
        removeARMarkerTagsByClassName(block,COMPLIANCE_CLASS);



        if(!feedback.data.rtComplianceList.state){
            for(const data of feedback.data.rtComplianceList.detail){

                block = select("core/editor").getBlock(blockId);
                let content = getHTMLFromBlock(block, true);

                counter++;

                // Create a node element for Mark Js to work with.
                const node = document.createElement('div');
                node.innerHTML = content.trim();

                const pattern = "\\b("+escapeCharForRegex(data)+")\\b";
                const regex = new RegExp(pattern,"g");

                const instance = new Mark(node);

                instance.markRegExp(regex, {
                    "element": MARK_TAG_NAME,
                    "exclude": ['.'+COMPLIANCE_CLASS,'.'+OPTIMIZED_WORD_CLASS,'.'+SPELLING_GRAMMAR_CLASS],
                    accuracy: {
                        value: 'exactly',
                        limiters: [',', '.', ';', ':', '?', '!', ')', '(', '{', '}', '\'', '“', '”', '-'],
                    },
                    "className": COMPLIANCE_CLASS,
                    diacritics: true,
                    caseSensitive :true,
                    separateWordSearch: false,
                    acrossElements: false,
                    debug: false,
                    log: window.console,
                    filter: (node, term) =>{
                        if(term === data){
                            totalMatches++;
                            return true;
                        }
                    },
                    each: (node) => {
                        node.setAttribute("id", "compliance_id_"+totalMatches);
                        node.dataset.complianceId = totalMatches;
                        complianceList[data] = complianceList ;
                    },
                });

                updateBlockContent(block, node.innerHTML);



            }
        }
    }

    return complianceList;
}

export function highlightParagraphLength(apiFeedback) {

    for(const feedback of apiFeedback) {
        if(feedback.status !== 10){
            continue;
        }
        const maxCharsPerParagraph = feedback.data.rtParagraphLength.detail.maxCharsPerParagraph;
        const block = select("core/editor").getBlock(feedback.blockClientId);

        if (block === null) {
            continue;
        }

        if (!maxCharsPerParagraph.passed) {
            const content = removeARMarkerTags(getHTMLFromBlock(block, true));

            const stringToHighlight = content.substr(
                maxCharsPerParagraph.maximum,
                content.length);

            const newContent = content.replace(stringToHighlight, "<armarker data-markjs='true' class='arParagraphLength'>"+stringToHighlight+"</armarker>");

            updateBlockContent(block, newContent);
        }else{
            removeARMarkerTagsByClassName(block, 'arParagraphLength');
        }

    }
}

export function doMarkWord(block, search, replace, className, isRegex = false) {

    let newContent = '';
    if(isRegex){
        newContent = search.replace(replace,"<armarker class='"+className+"'>$1</armarker>");
    }else{
        newContent = search.replace(replace,"<armarker class='"+className+"'>"+replace+"</armarker>");
    }
    updateBlockContent(block,newContent);
}


/**
 * Logs to DB custom events around Classic editor.
 * @param {Object} params - Parameters to store on DB log.
 */
export function trackingEvent(params) {

    const uniqueId = window.localStorage.getItem(STORED_UNIQID);

    if (!uniqueId) {
        let url = ATOMICREACH_API_NAMESPACE + ATOMICREACH_API_CREATE_UNIQUE_ID;
        if (window.loadingUniqueId) {
            return; // already creating uniqueId, abort
        }
        window.loadingUniqueId = true;


        apiFetch({
            path: url,
            method: 'GET'
        }).then((resp) =>{
            window.localStorage.setItem(STORED_UNIQID, resp.uniqueId);
            window.loadingUniqueId = false;
            params.uniqueId = resp.uniqueId;
            let url = ATOMICREACH_API_NAMESPACE + ATOMICREACH_API_LOG;
            apiFetch({
                    path: url,
                    method: "POST",
                    data:params
                }
            );
        }).catch((error) =>{
            console.log("Error loading uniqueId:", error);
            window.loadingUniqueId = false;
        });
    } else {
        params.uniqueId = uniqueId;
        let url = ATOMICREACH_API_NAMESPACE + ATOMICREACH_API_LOG;
        apiFetch({
                path: url,
                method: "POST",
                data:params
            }
        );
    }
}


export function escapeCharForRegex(word) {
    if (word) {
        return word.replace(/(\.|\"|\'|\?|\/|\)|\(|\[|\]|\$|\+|\*)/g, '\\$1');
    }
    return '';
}

export function getOptimizeWord(key, instance, className, wordToReplace) {
    return '<armarker id="optmize_id_'+key +'" data-instance="'+instance+'" data-optimize-id="'+key +'" class="atomicreachHighlighting '+className+'">' + wordToReplace + '</armarker>'
}

export const atomicReachIcon = createElement('svg', { width: 24, height: 24, viewBox: '0 0 620 620' },
    createElement('path', { d: "M558 207.3c-8.3-6.1-17.3-11.9-27-17.5-18.6-10.5-39.1-19.5-61.2-27 6.9 23.3 12.2 48.3 15.7 74.5 16.1 21 30 42.4 41.6 63.7 10.3-20.8 18.5-41.7 24.2-62.3 2.9-10.8 5.2-21.3 6.7-31.4zM522.5 310c-10-19-21.7-37.8-35.1-56.2 1.8 18.3 2.8 37 2.8 56.2s-1 38-2.8 56.2c13.4-18.4 25.1-37.2 35.1-56.2zm-47.3 85.7c-11.6 14.2-24.2 28.2-37.8 41.7-13.6 13.6-27.5 26.2-41.7 37.8 22.5-3.6 44.1-8.6 64.6-15 6.3-20.4 11.3-42 14.9-64.5zM381.3 68.8C360.7 74.5 339.8 82.6 319 93c21.3 11.6 42.7 25.5 63.7 41.6 26.2 3.5 51.2 8.8 74.5 15.7-7.4-22-16.5-42.6-27-61.2a251.32 251.32 0 0 0-17.5-27c-10.1 1.4-20.6 3.7-31.4 6.7zm-6.1-45.4C354.4 7.9 332.5 0 310 0s-44.4 7.9-65.2 23.4C233.6 31.8 223 42.2 213 54.5c30.7 5.2 63.6 16.6 96.9 33.7 33.3-17.1 66.2-28.5 96.9-33.7-9.8-12.3-20.4-22.8-31.6-31.1zm183.6 130c-3.7-25.6-13.7-46.7-29.6-62.6s-37-25.9-62.6-29.6c-13.9-2-28.7-2.1-44.5-.5 18.1 25.4 33.3 56.7 44.7 92.4 35.6 11.5 67 26.7 92.4 44.7 1.7-15.7 1.6-30.5-.4-44.4zm-83.6 70.9c-3.6-22.5-8.6-44.1-15-64.6-20.5-6.3-42.1-11.4-64.6-15 14.2 11.6 28.2 24.2 41.7 37.8 13.7 13.6 26.3 27.6 37.9 41.8zm-250.9-79.5c-22.5 3.6-44.1 8.6-64.6 15-6.3 20.5-11.4 42.1-15 64.6 11.6-14.2 24.2-28.2 37.8-41.7 13.6-13.7 27.6-26.3 41.8-37.9zm141.9-12.2c-18.4-13.4-37.3-25.1-56.2-35.1-19 10-37.8 21.7-56.2 35.1 18.3-1.8 37-2.8 56.2-2.8s38 .9 56.2 2.8zM189.8 89c-10.5 18.6-19.5 39.1-27 61.2 23.3-6.9 48.3-12.2 74.5-15.7 21-16.1 42.4-30 63.7-41.6-20.8-10.3-41.7-18.5-62.3-24.2-10.8-3-21.3-5.2-31.4-6.8-6.1 8.4-12 17.4-17.5 27.1zM62 207.3c1.5 10.2 3.8 20.6 6.8 31.4 5.7 20.6 13.8 41.5 24.2 62.3 11.6-21.3 25.5-42.7 41.6-63.7 3.5-26.2 8.8-51.2 15.7-74.5-22 7.4-42.6 16.5-61.2 27-9.8 5.5-18.8 11.4-27.1 17.5zm191.8 280.1c18.4 13.4 37.3 25.1 56.2 35.1 19-10 37.8-21.7 56.2-35.1-18.3 1.8-37 2.8-56.2 2.8s-38-.9-56.2-2.8zm-29.5-12.2c-14.2-11.6-28.2-24.2-41.7-37.8-13.6-13.6-26.2-27.5-37.8-41.7 3.6 22.5 8.6 44.1 15 64.6 20.4 6.3 42 11.3 64.5 14.9zM62 412.7c8.3 6.1 17.3 11.9 27 17.5 18.6 10.5 39.1 19.5 61.2 27-6.9-23.3-12.2-48.3-15.7-74.5-16.1-21-30-42.4-41.6-63.7-10.3 20.8-18.5 41.7-24.2 62.3-2.9 10.8-5.2 21.3-6.7 31.4zM97.5 310c10 19 21.7 37.8 35.1 56.2-1.8-18.3-2.8-37-2.8-56.2s1-38 2.8-56.2c-13.4 18.4-25.1 37.2-35.1 56.2zM558 412.7c-1.5-10.2-3.8-20.6-6.8-31.4-5.7-20.6-13.8-41.5-24.2-62.3-11.6 21.3-25.5 42.7-41.6 63.7-3.5 26.2-8.8 51.2-15.7 74.5 22-7.4 42.6-16.5 61.2-27 9.8-5.5 18.8-11.4 27.1-17.5zM203.6 53.1c17.9-23.2 38.4-40.7 60.5-51-51.7 7.6-99.2 28-139.3 57.7 22.9-8.4 49.7-10.4 78.8-6.7zm363.3 150.5c23.2 17.9 40.7 38.4 51 60.5-7.6-51.7-28-99.2-57.7-139.3 8.4 22.9 10.4 49.7 6.7 78.8zM153.4 61.2c-25.6 3.7-46.7 13.7-62.6 29.6s-25.9 37-29.6 62.6c-2 13.9-2.1 28.7-.5 44.5 25.4-18.1 56.7-33.3 92.4-44.7 11.5-35.6 26.7-67 44.7-92.4-15.7-1.7-30.5-1.6-44.4.4zM53.1 416.4c-23.2-17.9-40.7-38.4-51-60.5 7.6 51.7 28 99.2 57.7 139.3-8.4-22.9-10.4-49.7-6.7-78.8zm0-212.8c-3.7-29.1-1.6-55.9 6.7-78.8C30 164.9 9.7 212.5 2.1 264.1c10.3-22.1 27.8-42.6 51-60.5zm513.8 212.8c3.7 29.1 1.6 55.9-6.7 78.8 29.8-40.1 50.1-87.7 57.7-139.3-10.3 22.1-27.8 42.6-51 60.5zM203.6 566.9c-29.1 3.7-55.9 1.6-78.8-6.7 40.1 29.8 87.7 50.1 139.3 57.7-22.1-10.3-42.6-27.8-60.5-51zm212.8 0c-17.9 23.2-38.4 40.7-60.5 51 51.7-7.6 99.2-28 139.3-57.7-22.9 8.4-49.7 10.4-78.8 6.7zm0-513.8c29.1-3.7 55.9-1.6 78.8 6.7C455.1 30 407.5 9.7 355.9 2.1c22.1 10.3 42.6 27.8 60.5 51zM90.8 529.2c15.9 15.9 37 25.9 62.6 29.6 13.9 2 28.8 2.1 44.5.5-18.1-25.4-33.3-56.7-44.7-92.4-35.6-11.5-67-26.7-92.4-44.7-1.7 15.7-1.6 30.6.5 44.5 3.6 25.5 13.6 46.6 29.5 62.5zM23.4 244.8C7.9 265.6 0 287.5 0 310s7.9 44.4 23.4 65.2c8.4 11.2 18.8 21.8 31.1 31.8 5.2-30.7 16.6-63.6 33.7-96.9-17.1-33.3-28.5-66.2-33.7-96.9-12.3 9.8-22.8 20.4-31.1 31.6zm215.3 306.4c20.6-5.7 41.5-13.8 62.3-24.2-21.3-11.6-42.7-25.5-63.7-41.6-26.2-3.5-51.2-8.8-74.5-15.7 7.4 22 16.5 42.6 27 61.2a251.32 251.32 0 0 0 17.5 27c10.1-1.4 20.6-3.7 31.4-6.7zM430.2 531c10.5-18.6 19.5-39.1 27-61.2-23.3 6.9-48.3 12.2-74.5 15.7-21 16.1-42.4 30-63.7 41.6 20.8 10.3 41.7 18.5 62.3 24.2 10.8 3 21.3 5.2 31.4 6.8 6.1-8.4 12-17.4 17.5-27.1zm36.4 27.8c25.6-3.7 46.7-13.7 62.6-29.6s25.9-37 29.6-62.6c2-13.9 2.1-28.8.5-44.5-25.4 18.1-56.7 33.3-92.4 44.7-11.5 35.6-26.7 67-44.7 92.4 15.7 1.7 30.5 1.6 44.4-.4zm-221.8 37.8c20.7 15.5 42.7 23.4 65.2 23.4s44.4-7.9 65.2-23.4c11.2-8.4 21.8-18.8 31.8-31.1-30.7-5.2-63.6-16.6-96.9-33.7-33.3 17.1-66.2 28.5-96.9 33.7 9.8 12.3 20.4 22.8 31.6 31.1zm351.8-221.4c15.5-20.7 23.4-42.7 23.4-65.2s-7.9-44.4-23.4-65.2c-8.4-11.2-18.8-21.8-31.1-31.8-5.2 30.7-16.6 63.6-33.7 96.9 17.1 33.3 28.5 66.2 33.7 96.9 12.3-9.8 22.8-20.4 31.1-31.6z" } )
);


export const highlightIcon = createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24' },
    createElement('path', {
        d: "M18.5,1.15C17.97,1.15 17.46,1.34 17.07,1.73L11.26,7.55L16.91,13.2L22.73,7.39C23.5,6.61 23.5,5.35 22.73,4.56L19.89,1.73C19.5,1.34 19,1.15 18.5,1.15M10.3,8.5L4.34,14.46C3.56,15.24 3.56,16.5 4.36,17.31C3.14,18.54 1.9,19.77 0.67,21H6.33L7.19,20.14C7.97,20.9 9.22,20.89 10,20.12L15.95,14.16",
        fill: "#555555"
    })
);


function checkIfTagExists(str) {
    return new RegExp('^<\s*(p|h[1-6]|ol|ul)[^>\/]*>').test(str);
}

/**
 * Removes long paragraph highlighting (yellow background on exceeding words in
 * a long paragraph).
 */
export function removeLongParagraphHighlight() {
    const { getBlocks } = select("core/editor");
    const allBlocks = getBlocks();
    for (let i = 0; i < allBlocks.length; i += 1) {
        if (allBlocks[i] !== null) {
            removeARMarkerTagsByClassName(allBlocks[i], 'arParagraphLength');
        }
    }
}
