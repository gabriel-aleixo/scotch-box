import {
  removeARMarkerTags,
} from './utils';

import apiFetch from "@wordpress/api-fetch";
import {ATOMICREACH_API_NAMESPACE, FLAG_WORD} from "../constants";
import {getEditorWrapperDOM} from "./EditorLib";
/**
 * This file contains functions that are required for positioning, mapping,
 * and formatting different inputs and outputs for generic popover component
 */

function sum(...args) {
  return [...args].reduce((a, b) => a + b, 0);
}

function subract(...args) {
  return [...args].reduce((a, b) => a - b, 0);
}

export function formatReadabilitySynonyms(feedback) {
  return feedback.map((entry) => {
    return entry.name;
  });
}

export function getPositionYEditor(target) {

  const mark = typeof target === 'function' ?  document.getElementById(target()) : target;
  if (!mark) {
    return null;
  }
  const markRect = mark.getBoundingClientRect();
  let keepTabsOnScrollering = getEditorWrapperDOM().scrollTop;
  return((markRect.top + markRect.height) - (document.querySelector('.edit-post-header').offsetHeight) + (keepTabsOnScrollering));
}

export function getPositionXEditor(target, popover) {
  const mark = typeof target === 'function' ? document.getElementById(target()) : target;
  if (!mark) {
    return null;
  }
  const markRect = mark.getBoundingClientRect();
  const left = markRect.left - (popover.offsetWidth / 2) + (markRect.width / 2);
  if (left < 0) {return 0;}
  return left;
}

export function doRePositioningXYEditor(target) {
    const popover = document.querySelector('.popover.show.editor-popover');
    const posY = getPositionYEditor(target);
    const posX = getPositionXEditor(target, popover);
    if (posY) {
      popover.style.top = `${posY}px`;
    }
    if (posX) {
      popover.style.left = `${posX}px`;
    }
}

export function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

export function flagWordEditor(replaceWord,activeWord,feedBackType,paragraphElement,originalWord) {

    const paragraphText = paragraphElement.innerHTML;
    const instance = activeWord.getAttribute('data-instance');
    const charIndex = getPosition(paragraphText, originalWord, instance);

     const url = ATOMICREACH_API_NAMESPACE + FLAG_WORD;

      return(
          new Promise((resolve)=>{
              apiFetch({
                  path: url,
                  method: 'POST',
                  data: {
                      originalWord:originalWord,
                      replaceWord: replaceWord,
                      paragraphText,
                      charIndex,
                      feedBackType,
                  }
              }).then(() => {
                  resolve();
              })
          })

      );
}

export function getPositionYTitle(target) {
  const mark = typeof target === 'function' ? target() : target;
  const markRect = mark.getBoundingClientRect();
  // console.log('--- getPositionYTitle', mark, markRect);

  return sum(
    markRect.height,
    markRect.top,
    window.scrollY,
  );
}

export function getPositionXTitle(target, popover) {
  const mark = typeof target === 'function' ? target() : target;
  const markRect = mark.getBoundingClientRect();
  const left = markRect.left - (popover.offsetWidth / 2) + (markRect.width / 2);
  if (left < 0) return 0;
  return left;
}

export function doRePositioningXYTitle(target) {
  const popover = document.querySelector('.popover.show.title-popover');
  popover.style.top = `${getPositionYTitle(target)}px`;
  popover.style.left = `${getPositionXTitle(target, popover)}px`;
}

export function doRePositioningXYAds(target) {
  const popover = document.querySelector('.popover.show.ar-popover');
  popover.style.top = `${getPositionYTitle(target)}px`;
  popover.style.left = `${getPositionXTitle(target, popover)}px`;
}

export const getViewport = () => {
  let viewPortWidth;
  let viewPortHeight;
  if (typeof window.innerWidth !== 'undefined') {
    viewPortWidth = window.innerWidth;
    viewPortHeight = window.innerHeight;
  } else if (typeof document.documentElement != 'undefined'
  && typeof document.documentElement.clientWidth !=
  'undefined' && document.documentElement.clientWidth != 0) {
     viewPortWidth = document.documentElement.clientWidth;
     viewPortHeight = document.documentElement.clientHeight;
  } else {
    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
  }
  return [viewPortWidth, viewPortHeight];
 };

export const scrollToPopover = () => {
  let viewPort = getViewport();
  let viewPortHeight = viewPort[1];
  let popover = document.querySelector('.ar-popover');
  if (popover !== null) {
    popover.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }
};
