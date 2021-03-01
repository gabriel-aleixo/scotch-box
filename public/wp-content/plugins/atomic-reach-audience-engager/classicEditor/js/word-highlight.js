// This file is a modified version of src/src/library/highlight.js adapted to work on classic Editor pure JS.

/**
 * Reaplcement for Lodash forOwn. USed to naviagete an object own properties.
 * @param {Object} obj
 * @param {Function} callback
 */
function forOwn(obj, callback) {
  const myKeys = Object.keys(obj);
  for (let i = 0; i < myKeys.length; i += 1) {
    callback(obj[myKeys[i]], myKeys[i]);
  }
}

/**
 * Receives a block html (as paragraph) and a feedback item (feedbackItem),
 * verifies if all the words defined in item belong to the block at the idx
 * defined. Updates and returns a new feedbackItem, null if paragraph doesn't
 * contain all the words.
 * @param {String} paragraph - Block html content as string.
 * @param {Object} feedbackItem - A feedback array item.
 * @param {Number} deltaIndex - Used for UL lists "start" value
 * @returns {Object|null} - Improved feedbackItem on success
 */
function evalParagraph(paragraph, feedbackItem, deltaIndex = 0) {
  if (!paragraph) {
    return null; // empty paragraph, abort
  }
  const ranges = [];
  forOwn(feedbackItem, function(item, key) {
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
          /* cur range found in current index, start searching next one */
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
    ranges.forEach(function(range) {
      resp[range.key] = range;
    });
    return resp;
  }
  return null;
}

/**
 * Returns paragraph length skipping all HTML tags.
 * @param {String} paragraph - Block html as a string
 * @returns {Number} - String length after removing HTML tags
 */
function getCleanParagraphCount(paragraph) {
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
 * Reorders received feedback array, response has the same size of nodes array,
 * each feedback item is repositioned to the same index for the related node.
 * @param {Array} feedback - API response for '/optimize/article/' request
 * @param {Array} nodes - Editor content nodes
 */
function reorderParagraphsResponse(feedback, nodes) {
  // Assume that each node inside editor has no feedback by default
  const newFeedback = [];
  for (let i = 0; i < nodes.length; i += 1) {
    newFeedback.push({});
  }
  // current lowest node index that still has no feedback linked
  let curNodeIdx = 0;
  // loop feedback, find linked node, set newFeedback item in the same index than node as expected by old code in library.js
  feedback.forEach(function(feedbackItem, key) {
    // Eval only feedback items with content
    if (!_.isEmpty(feedbackItem)) {
      let foundNode = false;

      // Search feedback item in nodes
      for (let nodeIdx = curNodeIdx; nodeIdx < nodes.length; nodeIdx += 1) {
        const paragraph = nodes[nodeIdx].outerHTML;
        const resp = evalParagraph(paragraph, feedbackItem);
        if (resp !== null) {
          foundNode = true;
          newFeedback[nodeIdx] = feedbackItem;
          // Node was linked to feedback item (that is, to a paragraph).
          // Following iterations start from the next node index.
          curNodeIdx += 1;
          break;
        }
      }

      // feedback item has no node linked, dismiss
      if (!foundNode) {
        console.log(
          "CRITICAL ERROR: feedback item ranges not found on any node.",
          { key, feedbackItem }
        );
      }
    }
  });

  return newFeedback;
}
