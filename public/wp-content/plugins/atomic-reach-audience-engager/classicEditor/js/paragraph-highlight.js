var bodyMeasures = ["PercentageParagraphsIdealWordCount", "WordsCount"];
var titleMeasures = [
  "TitleCharacterCount",
  "TitleWordsCount",
  "TitleContains5W1H",
  "TitleContainsNumbers",
  "TitlePolarity",
  "TitlePronounPerson",
  "TitleQuestion",
  "TitleSuperlatives",
  "TitleTopicsCount",
  "TitleTopicLocation"
];
var countableCategoriesKeys = {
  TitleWordsCount: "wordCount",
  WordsCount: "wordCount",
  TitleCharacterCount: "characterCount"
};
var titleCategories = {
  TitleWordsCount: "Character and Word Count",
  TitleCharacterCount: "Character and Word Count",
  TitleContains5W1H: "Style",
  TitleContainsNumbers: "Style",
  TitlePolarity: "Style",
  TitlePronounPerson: "Style",
  TitleQuestion: "Style",
  TitleSuperlatives: "Style",
  TitleTopicLocation: "Topics",
  TitleTopicsCount: "Topics"
};

var countableCategoriesMessage = {
  TitleWordsCount: "Word Count",
  TitleCharacterCount: "Character Count",
  WordsCount: "Word Count"
};

var bodyMeasures = ["PercentageParagraphsIdealWordCount", "WordsCount"];

const highlightIcon =
  '<svg width="15" height="15" viewBox="0 0 24 24"><path d="M18.5,1.15C17.97,1.15 17.46,1.34 17.07,1.73L11.26,7.55L16.91,13.2L22.73,7.39C23.5,6.61 23.5,5.35 22.73,4.56L19.89,1.73C19.5,1.34 19,1.15 18.5,1.15M10.3,8.5L4.34,14.46C3.56,15.24 3.56,16.5 4.36,17.31C3.14,18.54 1.9,19.77 0.67,21H6.33L7.19,20.14C7.97,20.9 9.22,20.89 10,20.12L15.95,14.16" fill="#555555"></path></svg>';

/**
 * Check if feedback.data contains any of the properties defined in
 * "bodyMeasures" and value is FALSE. In that case return true to show the
 * Improvements section.
 * @param {Object} feedback - API response feedback object
 * @returns {Boolean} - TRUE if we are about to show Improvements section
 */
function checkForBodyFeedback(feedback) {
  var showBodyFeedBack = false;
  bodyMeasures.map(function(measure) {
    if (feedback.data[measure] && feedback.data[measure].state === false) {
      showBodyFeedBack = true;
    }
  });
  if (!showBodyFeedBack) {
    // TODO (Hector): what is the purpose of this checkbox?
    jQuery("#titlePanel").checked = true;
  }
  return showBodyFeedBack;
}

/**
 * Return "shorten your paragraphs" section.
 * @param {Object} data - feedback.data.PercentageParagraphsIdealWordCount
 * @returns {String} - LI html or "" if no message or state != TRUE
 */
function getDetailsWithButtonsHTML(data) {
  if (!data.message || data.state) {
    // long paragraphs button not visible, set flag to not clicked
    vStore.longParClicked = false;
    return "";
  }
  var icon = data.state
    ? "blueColour dashicons-yes-alt"
    : "orangeColour  dashicons-dismiss";
  var isActive = vStore.longParClicked ? "active" : "";
  return (
    "<li class='list-group-item improvementBlock'>" +
    "<div class='dashicons " + icon + "'></div>" +
    "<p>" +
    "<span>" + data.message + "</span>" +
    "<button id='atomicreach-highlight-paragraph' class='" +
    isActive +
    "' onclick='highlightHandler(event)'>" +
    highlightIcon +
    "</button>" +
    "</p>" +
    "</li>"
  );
}

/**
 * Return a LI node under "shorten your paragraphs" like "Word Count".
 * @param {String} measure - item defined in bodyMeasures but not PercentageParagraphsIdealWordCount
 * @param {Object} data - feedback.data[measure]
 * @returns {String} - LI html or "" if no message or state != TRUE
 */
function getDetailsHTML(measure, data) {
  if (!data.message || data.state) {
    return "";
  }
  var countMessage = "";
  if (measure in countableCategoriesKeys) {
    countMessage =
      countableCategoriesMessage[measure] +
      ": " +
      data[countableCategoriesKeys[measure]] +
      "<br/>";
  }
  return (
    "<li class='list-group-item improvementBlock'> " +
    "<div class='dashicons orangeColour dashicons-dismiss'></div>" +
    "<div>" +
    "<p>" + countMessage +
    data.message + "</p>" +
    "</div>" +
    "</li>"
  );
}

/**
 * Returns "Have N topics in title" and tags list below. Return empty if no
 * tags defined.
 * @param {Object} data - feedback.data[measure]
 * @param {Object} topics - feedback.data["Topics"]
 * @returns {String} LI html or "" if conditions fail
 */
function getDetailsWithTagsHTML(data, topics) {
  var tags = "";
  if (topics.detail && topics.detail.length > 0) {
    topics.detail.map(function(tag) {
      tags += "<span class='badge badge-blue mr-1'>" + tag + "</span>";
    });
  } else {
    return "";
  }
  var icon = data.state
    ? "blueColour dashicons-yes-alt"
    : "orangeColour  dashicons-warning";
  return (
    "<li class='list-group-item tags improvementBlock'> " +
    "<div class='dashicons " + icon + "'></div>" +
    "<div>" +
    "<p>" + data.message +
    tags + "</p>" +
    "</div>" +
    "</li>"
  );
}

/**
 * Returns LI html showing a measure in the Title Insights section, under
 * "Style" or "Topics".
 * @param {String} measure - One of ids defined in titleMeasures
 * @param {Object} data - feedback.data[measure]
 * @returns {String} - LI html or ""
 */
function getTitleDetailsHTML(measure, data) {
  var icon = data.state
    ? "blueColour dashicons-yes-alt"
    : "orangeColour  dashicons-warning";
  var countMessage = "";
  if (measure in countableCategoriesKeys) {
    countMessage =
      countableCategoriesMessage[measure] +
      ": " +
      data[countableCategoriesKeys[measure]] +
      "<br/>";
  }
  return (
    "<li class='list-group-item improvementBlock'>" +
    "<div class='dashicons " + icon + "'  /></div>" +
    "<div>" +
    "<p>" + countMessage +
     data.message + "</p>" +
    "</div>" +
    "</li>"
  );
}

/**
 * Show "Title insights" panel.
 * @param {Object} feedback - API response feedback object
 */
function setTitlePanel(feedback) {
  var categoryList = {};
  var itemList = "";
  titleMeasures.map(function(measure) {
    if (feedback.data.hasOwnProperty(measure)) {
      var categoryId = titleCategories[measure];
      if (typeof categoryList[categoryId] === "undefined") {
        categoryList[categoryId] = "";
      }
      if (measure === "TitleTopicsCount") {
        categoryList[categoryId] += getDetailsWithTagsHTML(
          feedback.data[measure],
          feedback.data["Topics"]
        );
      } else {
        categoryList[categoryId] += getTitleDetailsHTML(
          measure,
          feedback.data[measure]
        );
      }
    }
  });
  Object.keys(categoryList).forEach(function(category) {
    itemList +=
      "<div>" +
      "<h3> " +
      category +
      " </h3>" +
      categoryList[category] +
      "</div>";
  });
  jQuery(".body-feedback-container .title-feedback").html(itemList);
  jQuery(".body-feedback-container .title-container").removeClass("hide");
}

/**
 * Called from titleDocumentFeedback after a successful API request, builds the
 * whole Measure section under the Optimize button (Improvements, Title
 * Insights).
 * @param {*} data - Response from "/titleDocumentAnalyze/article/" API request
 */
function buildDocumentFeedback(data) {
  var showShortenParagraph = false;
  var hasLongPar = document.querySelector("#atomicreach-highlight-paragraph") !== null;
  var longParAppears = false;
  // Verifies if Measure HTML section should be visible (paragraph highlight, word count)
  if (checkForBodyFeedback(data)) {
    var body = "";
    bodyMeasures.map(function(measure) {
      if (data.data.hasOwnProperty(measure)) {
        if (measure === "PercentageParagraphsIdealWordCount") {
          var txt = getDetailsWithButtonsHTML(data.data[measure]);
          // Show "shorten your paragraphs" section
          showShortenParagraph = txt !== "";
          if (txt !== "" && hasLongPar)  {

          }
          body += txt;
        } else {
          // Show Word count section
          body += getDetailsHTML(measure, data.data[measure]);
        }
      }
    });
    jQuery(".body-feedback-container .document-feedback").html(body);
    jQuery(".body-feedback-container .body-container").removeClass("hide");
  }

  // Apply long paragraph highlight if section is visible and flag is TRUE
  toggleParagraphHighlightButton(showShortenParagraph && vStore.longParClicked, true);
  setTitlePanel(data);

  // Long paragraphs button will be rendered as clicked, reapply paragraphs highlighting.
  if (vStore.longParClicked) {
    toggleParagraphHighlightButton(true, true);
  }
  jQuery(".document-feedback-container").removeClass("hide");

  // Return TRUE if "shorten paragraph" section was not initially visible and just appeared. This flag is used to call callParagraphFeedback() on caller to allow paragraph highlight.
  return showShortenParagraph && !hasLongPar;
}

function hideFeedback() {
  jQuery(".document-feedback-container").addClass("hide");
  // long paragraphs button shown not clicked
  vStore.longParClicked = false;
}
