import { Component } from "@wordpress/element";
import { dispatch, select, subscribe, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { DELETE } from "@wordpress/keycodes";
import apiFetch from "@wordpress/api-fetch";
import { debounce, noop, isEmpty, get } from "lodash";
import { Panel, PanelBody, PanelRow } from "@wordpress/components";
import {
  ATOMICREACH_SIDEBAR_NAME,
  ATOMICREACH_STORE,
  ATOMICREACH_API_NAMESPACE,
  ATOMICREACH_API_ANALYZE_ARTICLES
} from "../constants";
import { removeARMarkerTags, getHTMLFromBlock, removeLongParagraphHighlight } from "../library/utils";
import { highlightIcon } from "../library/utils";
import {getEditorWritingDOM} from "../library/EditorLib";

/**
 * Component shows Long Paragraphs text from API request, button to turn on/off
 * paragraph highlighting. Props are:
 * - selectedProfile: Profile selected in dropdown. Provided from Redux store.
 * - taskListFeedback: API response. Provided from Redux store.
 * - optimizeButton: Object with Optimize button status data.
 * - callbackParagraphHighlight: Callback executed after API request call.
 * - panelTitle: Panel title.
 * - paragraphFeedWithLength: Flag to activate Paragraph length button.
 * - cardSelectionCallback: Callback to turn on/off paragraph highlight.
 */
class SidebarParagraphHighlightContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHighlightOn: false // Flag to turn on/off long paragraph highlight
    };
    this.unsubscribe = noop; // Used to unsubscribe from WP subscribe()
    /* Flag avoids async execution of debounced() if component was already
    unmounted, causing error. */
    this.componentIsMounted = false;
    this.isSendingRequest = false; // Flag, API request in progress
    // Debounced call, assures API request called once
    this.debounced = debounce(this.sendAPIRequest, 1300, {
      maxWait: 2600,
      trailing: true
    });
    // DELETE key event listener, also calls API request
    this.handleDeleteKey = this.handleDeleteKey.bind(this);
    // Listens click on paragraph button
    this.handleLongParagraphClick = this.handleLongParagraphClick.bind(this);
  }

  componentDidMount() {
    this.componentIsMounted = true;
    // Start DELETE key listener

    getEditorWritingDOM().addEventListener("keydown", this.handleDeleteKey);
    // Subscribe to WP listener. All WP events will trigger subscribeListener()
    this.unsubscribe = subscribe(() => this.subscribeListener());
  }

  componentWillUnmount() {
    this.debounced.cancel(); // kill any queued debounce calls
    this.unsubscribe(); // stop WP listener
    this.componentIsMounted = false;
    // stop DELETE key listener
    getEditorWritingDOM().removeEventListener("keydown", this.handleDeleteKey);
    // Remove taskListFeedback from Redux store
    dispatch(ATOMICREACH_STORE).setTaskListFeedback({
      taskListFeedback: {}
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { optimizeButton } = this.props;
    if (
      this.componentIsMounted &&
      !optimizeButton.isBusy &&
      prevProps.optimizeButton.isBusy
    ) {
      /* Optimize button flag was TRUE and now is FALSE, it means optimization API request on parent component is completed. Call this component API request to store taskListFeedback in Redux  */
      this.sendAPIRequest();
    }
  }

  /**
   * Executed on keydown events, detect if DELETE key was pressed to
   * execute debounced()
   * @param {Object} event - key event
   */
  handleDeleteKey(event) {
    const { keyCode } = event;
    // User pressed DELETE key
    if (this.componentIsMounted && keyCode === DELETE) {
      const { getActiveGeneralSidebarName } = select("core/edit-post");
      // Execute if sidebar is active
      if (getActiveGeneralSidebarName() === ATOMICREACH_SIDEBAR_NAME) {
        this.debounced();
      }
    }
  }

  /**
   * Sends API request to get paragraph length, word count. If highlight is
   * active, disables highlight before sending request and reapplies it
   * afterwards. Stores response as "taskListFeedback" in Redux, it's also used
   * on parent component.
   */
  sendAPIRequest() {
    if (!this.componentIsMounted) {
      return; // abort, component is not mounted anymore
    }
    if (this.isSendingRequest) {
      return; // abort, flag says request is in progress
    }
    this.isSendingRequest = true; // flag to assure only one request
    const {
      selectedProfile,
      callbackParagraphHighlight
    } = this.props;
    const { isHighlightOn } = this.state;
    const coreEditor = select("core/editor");
    // load article title from WP
    const title = coreEditor.getEditedPostAttribute("title");
    const url = ATOMICREACH_API_NAMESPACE + ATOMICREACH_API_ANALYZE_ARTICLES;
    // load article content from WP
    const contentHtml = coreEditor
      .getBlocks()
      .map(block => getHTMLFromBlock(block))
      .join("");

    const setAPIRequestFlagOff = () => {
      this.isSendingRequest = false;
    };

    /**
     * Callback called if API request is successful
     * @param {Object} feedback - API request response
     */
    const onRequestSuccess = feedback => {
      if (this.componentIsMounted) {
        dispatch(ATOMICREACH_STORE).setTaskListFeedback({
          taskListFeedback: feedback
        });

        // isHighlightOn is false, turn off paragraph highlight. If isHighlightOn is true callbackParagraphHighlight() flow will eventually call cardSelectionCallback() and turn it on.
        if (!isHighlightOn) {
          removeLongParagraphHighlight();
        }
        /* if highlight button was previously active, call paragraph feedback and reapply paragraph highlight afterwards */
        callbackParagraphHighlight(isHighlightOn).then(
          setAPIRequestFlagOff,
          setAPIRequestFlagOff
        );
      }
    };

    /**
     * Callback called on request error
     * @param {Object} err - Error object sent in request
     */
    const onRequestError = err => {
      if (this.componentIsMounted) {
        // Error, turn off flag and show toast
        dispatch("core/notices").createErrorNotice(
          "An unexpected error has occurred. Please contact your Client Success Manager for support."
        );
        console.log("sendAPIRequest() error:", err);
        callbackParagraphHighlight(isHighlightOn).then(
          setAPIRequestFlagOff,
          setAPIRequestFlagOff
        );
      }
    };

    apiFetch({
      path: url,
      method: "POST",
      data: {
        profileId: get(selectedProfile, "profile.profile"),
        title,
        contentHtml
      }
    })
      .then(onRequestSuccess)
      .catch(onRequestError);
  }

  /**
   * Called from componentWillUnmount(), executes debounced() if sidebar
   * is active, user is typing on editor (Typing WP event) and there is a
   * profile selected.
   */
  subscribeListener() {
    const { getActiveGeneralSidebarName } = select("core/edit-post");
    const { selectedProfile } = this.props;
    // Execute if sidebar is active and there is Typing event
    if (
      getActiveGeneralSidebarName() === ATOMICREACH_SIDEBAR_NAME &&
      select("core/editor").isTyping() &&
      !isEmpty(selectedProfile)
    ) {
      this.debounced();
    }
  }

  /**
   * Executed on paragraph length button click, turns on/off paragraph highlighting.
   */
  handleLongParagraphClick() {
    const { cardSelectionCallback, paragraphFeedWithLength } = this.props;
    if (!paragraphFeedWithLength) {
      return;
    }
    const { isHighlightOn } = this.state;
    const newHighlightState = !isHighlightOn;
    this.setState({ isHighlightOn: newHighlightState }, () =>
      cardSelectionCallback(
        "PercentageParagraphsIdealWordCount",
        newHighlightState
      )
    );
  }

  /**
   * Returns Paragraph length section if taskListFeedback data available, null otherwise.
   * @returns {Object} - Component or null
   */
  getLongParagraphSection() {
    const {
      taskListFeedback,
      paragraphFeedWithLength
    } = this.props;
    const data = get(
      taskListFeedback,
      `data.PercentageParagraphsIdealWordCount`,
      {}
    );
    if (!data.message || data.state) {
      // Long paragraph section not visible. Turn off highlight in case editor content changed and there already was highlighted text.
      removeLongParagraphHighlight();
      return null;
    }
    const { isHighlightOn } = this.state;

    return (
      <li className="list-group-item improvementBlock">
        <div
          style={{ marginRight: "5px" }}
          className="dashicons orangeColour dashicons-dismiss"
        />
        <div>
          <span>{data.message}</span>
          <button
            className={`components-button ar-center is-default is-button ${
              isHighlightOn ? "highlighting" : ""
            }`}
            onClick={this.handleLongParagraphClick}
            disabled={!paragraphFeedWithLength}
          >
            {highlightIcon}
          </button>
        </div>
      </li>
    );
  }

  /**
   * Returns word count section if taskListFeedback data available, null otherwise.
   * @returns {Object} - Component or null
   */
  getWordCountSection() {
    const data = get(this.props, `taskListFeedback.data.WordsCount`, {});
    if (!data.message || data.state) {
      return null;
    }
    return (
      <li className="list-group-item improvementBlock">
        <div
          style={{ marginRight: "5px" }}
          className="dashicons countIcon orangeColour dashicons-dismiss"
        />
        <div>
          <div>Word Count: {data.wordCount}</div>
          <div>{data.message}</div>
        </div>
      </li>
    );
  }

  render() {
    const { optimizeButton, taskListFeedback, panelTitle } = this.props;
    /* Don't render if Optimize button was not cliked yet or an optimze API
    request is in progress on parent component */
    if (!optimizeButton.hasClicked || optimizeButton.isBusy) {
      return null;
    }
    // Long paragraphs section component
    const longParagraphPanel = this.getLongParagraphSection();
    // Word count section component
    const wordCountPanel = this.getWordCountSection();

    // Do not render if there are no sections available
    if (!longParagraphPanel && !wordCountPanel) {
      return null;
    }

    return (
      <Panel>
        <PanelBody
          title={panelTitle}
          initialOpen={true}
          className={"sidebar-title-header"}
        >
          <PanelRow>
            <ul className="collapse">
              {longParagraphPanel}
              {wordCountPanel}
            </ul>
          </PanelRow>
        </PanelBody>
      </Panel>
    );
  }
}

/**
 * Returns object containing objects from Redux store: "taskListFeedback",
 * "selectedProfile".
 */
const applyWithSelect = withSelect(select => {
  const { getTaskListFeedback, getSelectedProfile } = select(ATOMICREACH_STORE);
  return {
    taskListFeedback: getTaskListFeedback(),
    selectedProfile: getSelectedProfile()
  };
});

/**
 * Adds "taskListFeedback", "selectedProfile" to component props.
 */
const SidebarParagraphHighlight = compose([applyWithSelect])(
  SidebarParagraphHighlightContent
);

export default SidebarParagraphHighlight;
