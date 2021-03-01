import { forOwn, isEmpty } from "lodash";
import { ATOMICREACH_VALID_BLOCK_NAMES_ARRAY } from "../constants";
import { getHTMLFromBlock } from "./utils";

/**
 * Receives a block html (as paragraph) and a feedback item (feedbackItem),
 * verifies if all the words defined in item belong to the block at the idx
 * defined. Updates and returns a new feedbackItem adding "start", "length" on
 * success, null if paragraph doesn't contain all the words.
 * @param {String} paragraph - Block html content as string.
 * @param {Object} feedbackItem - A feedback array item.
 * @param {Number} deltaIndex - Used for UL lists "start" value
 * @returns {Object|null} - Improved feedbackItem on success
 */
export const evalParagraph = (paragraph, feedbackItem, deltaIndex = 0) => {
  if (!paragraph) {
    return null; // empty paragraph, abort
  }
  const ranges = [];
  forOwn(feedbackItem, (item, key) => {
    // ranges array. Each range contains a single word data.
    ranges.push({ ...item, key });
  });
  if (ranges.length === 0) {
    // feedbackItem contains no word data
    return null;
  }
  const len = paragraph.length;
  let inTag = false; // flag, TRUE if we are inside HTML tag
  let noTagCharCount = 0; // counts chars on cleaned string
  let curRangeIndex = 0; // index for ranges array
  let foundWords = 0; // counts words successfully found
  for (let i = 0; i < len; i += 1) {
    // search words evaluating each char in paragraph
    const char = paragraph[i];
    if (ranges[curRangeIndex].idx > len) {
      /* current range index is bigger than whole paragraph. Word can't be found, abort. */
      return null;
    }
    if (char === "<") {
      inTag = true; // html tag starts
    } else if (char === ">") {
      inTag = false; // html tag ends
    } else if (!inTag) {
      // not inside an html tag, check word index
      noTagCharCount += 1;
      if (ranges[curRangeIndex].idx === noTagCharCount) {
        // we are at the string position defined by idx, check word
        if (paragraph.indexOf(ranges[curRangeIndex].text, i + 1) === i + 1) {
          /* cur range found in current index, store additional data on range and start searching next one */
          ranges[curRangeIndex].start = ranges[curRangeIndex].idx + deltaIndex;
          ranges[curRangeIndex].length = ranges[curRangeIndex].text.length;
          foundWords += 1;
          if (curRangeIndex + 1 < ranges.length) {
            // word is solved, verify next word (range)
            curRangeIndex += 1;
          } else {
            break; // no more ranges to search
          }
        } else {
          /* word wasn't found at this index position, abort. There is no need to check other words, paragraph rejected. */
          return null;
        }
      }
    }
  }
  if (foundWords === ranges.length) {
    // return new feedbackItem only if all words were found
    const resp = {};
    ranges.forEach(range => {
      resp[range.key] = range;
    });
    return resp;
  }
  return null;
};

/**
 * Returns paragraph length skipping all HTML tags.
 * @param {String} paragraph - Block html as a string
 * @returns {Number} - String length after removing HTML tags
 */
export const getCleanParagraphCount = paragraph => {
  let resp = 0;
  let inTag = false;
  for (let i = 0; i < paragraph.length; i += 1) {
    const char = paragraph[i];
    if (char === "<") {
      inTag = true; // html tag starts
    } else if (char === ">") {
      inTag = false; // html tag ends
    } else if (!inTag) {
      // not inside an html tag, check word
      resp += 1;
    }
  }
  return resp;
}

/**
 * Receives a block html (as paragraph) and a feedback item (feedbackItem),
 * verifies if all the words defined in item belong to the block at the idx
 * defined. This function evaluates List blocks defined with "<ul>", the API
 * receives the whole <ul> html, but evaluates each <li> contain as a separate
 * paragraph. This method handles it and sends a deltaIndex to evalParagraph()
 * to fix the index issue if the highlighted word is, as an example, at the
 * second <li>. Updates and returns a new feedbackItem adding "start", "length"
 * on success, null if list doesn't contain all the words.
 * @param {String} paragraph - Block html as string
 * @param {Object} feedbackItem - A feedback array item.
 * @returns {Object|null} - Improved feedbackItem on success
 */
export const evalList = (paragraph, feedbackItem) => {
  // TODO: Doesnt support OL or nested lists
  let str = paragraph.replace(/(<ul.*?>|<\/ul>)/gi, '');
  let arr = str.split(/<\/li>/i);
  let deltaIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    const liParagraph = arr[i];
    const resp = evalParagraph(liParagraph, feedbackItem, deltaIndex);
    if (resp === null) {
      deltaIndex += getCleanParagraphCount(liParagraph);
    } else {
      return resp;
    }
  }
  return null;
};

/**
 * Expects a paragraph feedback array as received from an optimization API
 * request and the Gutenberg editor blocks. Function matches which paragraph is
 * linked to which block, if a paragraph doesn't match with a Block the related
 * index in the result array will be null. Function returns an object with the
 * block indexes array and total of words to be highlighted.
 * @param {Array} feedback - Paragraphs feedback array
 * @param {Array} blocks - Gutenberg editor blocks array
 * @returns {Object} - blockIndexes: (Block indexes array, one for each feedback item), totalHighlightWords: (Total number of words that will actually be highlighted)
 */
export const getFeedbackBlockData = (feedback, blocks) => {
  let totalHighlightWords = 0;
  const blockIndexes = []; // block index array, one for each feedback item
  // current lowest block index that still has no feedback linked
  let curBlockIdx = 0;
  feedback.forEach((feedbackItem, key) => {
    let foundBlock = null;
    if (!isEmpty(feedbackItem)) {
      for (let i = curBlockIdx; i < blocks.length; i += 1) {
        if (
          ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(blocks[i].name) &&
          blocks[i].attributes.level !== 6
        ) {
          const paragraph = getHTMLFromBlock(blocks[i], true);
          const resp = blocks[i].name === "core/list" ?
            evalList(paragraph, feedbackItem)
            : evalParagraph(paragraph, feedbackItem);
          if (resp !== null) {
            foundBlock = i;
            feedback[key] = resp;
            // Block was linked to feedback item (that is, to a paragraph).
            // Following iterations start from the next block index EXCEPT
            // if current block is a list. Yes, confusing, horrible, a single
            // block can be used on multiple feedback paragraphs... this should
            // require a refactor.
            if (blocks[i].name !== "core/list") {
              curBlockIdx += 1;
            }
            // ranges (that is, words) will be highlighted, add to counter
            forOwn(feedbackItem, () => totalHighlightWords += 1);
            break;
          }
        }
      }
      if (foundBlock === null) {
        console.log("CRITICAL ERROR: paragraph ranges not found on any block", {
          key,
          feedbackItem
        });
      }
    }
    blockIndexes.push(foundBlock);
  });
  return { blockIndexes, totalHighlightWords };
};
