import {dispatch, select, subscribe} from "@wordpress/data";
import {Button, SelectControl} from '@wordpress/components';
import apiFetch from "@wordpress/api-fetch";
import {cloneDeep, isEmpty} from 'lodash'
import {Component} from "@wordpress/element";

import {
    ATOMICREACH_API_ANALYZE_ARTICLES,
    ATOMICREACH_API_NAMESPACE,
    ATOMICREACH_API_OPTIMIZE_ARTICLES,
    ATOMICREACH_API_PARAGRAPH_ANALYZE_ARTICLES,
    ATOMICREACH_SIDEBAR_NAME,
    ATOMICREACH_STORE,
    ATOMICREACH_VALID_BLOCK_NAMES_ARRAY,
    COMPLIANCE_CLASS,
    MARK_TAG_NAME,
    OPTIMIZED_WORD_CLASS,
    SPELLING_GRAMMAR_CLASS,
    UPDATE_PUBLISHED,
    SAVE_DRAFT,
    TRACK_OPTIMIZE,
    TRACK_SAVE_DRAFT,
    TRACK_OPEN_AR_TAB,
    TRACK_SAVE_PUBLISHED,
    TRACK_APP_GUTENBERG
} from "../constants";
import {
    cleanARHighlightingFromBlock,
    debugCountHighlightedWords,
    getHTMLFromBlock,
    highlightComplianceList,
    highlightParagraphLength,
    highlightSpellingGrammar,
    removeARMarkerTags,
    updateBlockContent,
    trackingEvent,
    removeLongParagraphHighlight
} from '../library/utils';
// import Tooltip from './Tooltip'
import {addToDictionary, getEditorWrapperDOM, getEditorWritingDOM, getPopoverState, replaceActiveWord} from '../library/EditorLib';
import {doRePositioningXYEditor, flagWordEditor} from '../library/popoverLib';
import GenericPopover from '../library/GenericPopover';
import SidebarTitleFeedback from "./SidebarTitleFeedback";
import TooltipContainer from './TooltipContainer'
import { getFeedbackBlockData } from "../library/highlight";
import SidebarParagraphHighlight from "./SidebarParagraphHighlight";

class SidebarWrapper extends Component {

    constructor() {
        super(...arguments);

        this.state = {
            profiles: {},
            selectedProfile: null,
            selectedProfileDetails: {},
            optimizeButton: {
                disabled: true,
                isBusy: false,
                hasClicked: false,
            },
            revertButton: {
                disabled: false,
                visible: false,
            },
            tooltipMessage: 'Select a profile before optimizing',
            tooltipVisibility: true,
            optimizeFeedback: null,
            paragraphsFeedback: null,
            hasChangedContent: false,
            isTyping: false,
            title: '',
            content: '',
            popoverState: {},
            visibility: {},
            optimizing:false,
            analyzing:false,
        };
        this.optimziedMeasures = [
            'Arousal',
            'Readability'
        ];
        this.spellingIssueFeedback = {};
        this.clearingHiglights = false;
        this.atomicReachApiCallInProgress = false;
        this.componentIsMounted = true;
        this.showNotice = false;
        this.unsubscribe = () => null;

        this.optimizeFeedbackForRehighlighting = {};
        this.totalOptimizeWordsToHighlight = 0;


        this.titleMeasures = [
            'TitleCharacterCount',
            'TitleWordsCount',
            'TitleContains5W1H',
            'TitleContainsNumbers',
            'TitlePolarity',
            'TitlePronounPerson',
            'TitleQuestion',
            'TitleSuperlatives',
            'TitleTopicsCount',
            'TitleTopicLocation',

        ];

        this.bodyMeasures = [
            'PercentageParagraphsIdealWordCount',
            'WordsCount',
        ];

        this.engagementNames = {
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

        this.cardSelectionCallback = this.cardSelectionCallback.bind(this);
        this.OptimizeButtonClickHandler = this.OptimizeButtonClickHandler.bind(this);
        this.callbackParagraphHighlight = this.callbackParagraphHighlight.bind(this);
        this.handleSaveEvent = this.handleSaveEvent.bind(this);
        this.handlePasteEvent = this.handlePasteEvent.bind(this);
        this.handleKeyDownEvent = this.handleKeyDownEvent.bind(this);
        this.handleKeyUpEvent = this.handleKeyUpEvent.bind(this);

    }


    componentDidMount() {
        // console.log("Sidebar::comp did mount!", this.props, this.state);

        trackingEvent({
            eventName: TRACK_OPEN_AR_TAB,
            appName: TRACK_APP_GUTENBERG,
            jsonData: {
                isOpened: true
            }
        });

        const {
            taskListFeedback,
            optimizeFeedback,
            selectedProfile,
            optimizeFeedbackReHighlighting,
            optimizeButtonStatus,
            revertButtonStatus,
            tooltipMessage
        } = this.props;


        this.updateProfileState();
        this.updateTitleContentState();

        //https://developer.wordpress.org/block-editor/packages/packages-data/#subscribe
        this.unsubscribe = subscribe(() => this.subscribeListener());
        const hasChanges = this.checkForChanges();
        this.removeNotice('warningContent');

        //use all stored data
        if(Object.entries(taskListFeedback).length > 0 && !hasChanges) {

            this.optimizeFeedbackForRehighlighting = optimizeFeedbackReHighlighting;
            for(const ind in this.optimizeFeedbackForRehighlighting) {
                this.totalOptimizeWordsToHighlight += Object.keys(this.optimizeFeedbackForRehighlighting).length;
            }
            this.updateSelectedProfile(selectedProfile.profile);
            this.reHighlightOptimizedWords(optimizeFeedback);

            this.setState({
                optimizeFeedback: optimizeFeedback,
                optimizeButton: {
                    ...this.state.optimizeButton,
                    hasClicked: true,
                    disabled: optimizeButtonStatus,

                },
                tooltipVisibility: (!!optimizeButtonStatus ),
                tooltipMessage: tooltipMessage,
                revertButton: {
                    disabled: false,
                    visible: revertButtonStatus,
                },
            });

        } else {
            dispatch(ATOMICREACH_STORE).clearStore();
            this.callParagraphFeedback();
        }

        const editorContainer = getEditorWritingDOM();
        if(editorContainer !== null) {
            editorContainer.addEventListener('click', (event) => {
                let mark = event.target;
                if (mark.classList.contains(SPELLING_GRAMMAR_CLASS)) {
                    mark.arSuggestions = this.spellingIssueFeedback[mark.getAttribute('data-spelling-issue-id')];
                } else if (mark.classList.contains(OPTIMIZED_WORD_CLASS)) {
                    mark.arSuggestions = this.state.optimizeFeedback[parseInt(mark.dataset.blockIndex)][parseInt(mark.dataset.optimizeId)];
                }
                if (mark.classList.contains(SPELLING_GRAMMAR_CLASS) || (mark.classList.contains(OPTIMIZED_WORD_CLASS) || (mark.classList.contains(COMPLIANCE_CLASS)))) {
                    const popoverState = getPopoverState(mark);
                    this.setState({popoverState});
                }
            });



            document.querySelector('.edit-post-header').addEventListener('click', this.handleSaveEvent, false);

            editorContainer.addEventListener('paste', this.handlePasteEvent,false);

            editorContainer.addEventListener('keydown', this.handleKeyDownEvent, false);

            editorContainer.addEventListener('keyup', this.handleKeyUpEvent, false);

        }
    }

    componentWillUnmount() {
        const {
            optimizeButton,
            revertButton,
            tooltipMessage,
        } =this.state;

        trackingEvent({
            eventName: TRACK_OPEN_AR_TAB,
            appName: TRACK_APP_GUTENBERG,
            jsonData: {
                isOpened: false
            }
        });
        const editorContainer = getEditorWritingDOM();

        document.querySelector('.edit-post-header').removeEventListener('click', this.handleSaveEvent, false);

        editorContainer.removeEventListener('paste', this.handlePasteEvent,false);

        editorContainer.removeEventListener('keydown', this.handleKeyDownEvent, false);

        editorContainer.removeEventListener('keyup', this.handleKeyUpEvent, false);


        dispatch(ATOMICREACH_STORE).setOptimizeFeedbackReHighlighting({
            optimizeFeedbackReHighlighting: this.optimizeFeedbackForRehighlighting
        });

        dispatch(ATOMICREACH_STORE).setOptimizeButtonStatus(optimizeButton.disabled);

        dispatch(ATOMICREACH_STORE).setRevertButtonStatus(revertButton.visible);

        dispatch(ATOMICREACH_STORE).setTooltipMessage(tooltipMessage);

        this.unsubscribe();
        this.removeARHighlighting();
        this.removeNotice('publishReadyNotice');
        this.removeNotice('warningContent');

        if(this.domHasOptimizedWords()!== 0) {

            dispatch("core/notices")
                .createWarningNotice(`Warning: Underlining of optimized words will be lost if article is changed outside of the Atomic Reach tab`, {
                    id: 'warningContent'
                })
        }else{
            dispatch(ATOMICREACH_STORE).setOptimizeFeedback({});
            dispatch(ATOMICREACH_STORE).setOptimizeFeedbackReHighlighting({optimizeFeedbackReHighlighting:{}});
        }

        this.takeSnapShop();
        this.componentIsMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {profiles, taskListFeedback} = this.props;

        if(profiles.length !== prevProps.profiles.length) {
            this.updateProfileState();
        }

        const {
            hasChangedContent,
            paragraphsFeedback,
            selectedProfile,
            optimizing,
            analyzing,
        } = this.state;




        if(hasChangedContent && !prevState.hasChangedContent) {

            const intervalToCallApi = setInterval(() => {
                if(!select('core/editor').isTyping() && !this.getAtomicReachApiCallInProgress()) {

                    this.updateTitleContentState();
                    clearInterval(intervalToCallApi);

                    if(selectedProfile === null) {
                        // even if no prof is select, still call the api to get spelling/grammar
                        this.callParagraphFeedback();
                    }
                }
            }, 500);
        }

        if(JSON.stringify(paragraphsFeedback) !== JSON.stringify(prevState.paragraphsFeedback)) {
            const {getBlocks} = select('core/editor');
            this.spellingIssueFeedback = highlightSpellingGrammar(paragraphsFeedback, getBlocks());
            this.complianceListFeedback = highlightComplianceList(paragraphsFeedback, getBlocks());
        }


        if(optimizing && analyzing){
            this.isPublishReadyNotice(taskListFeedback);
            this.setState({
                optimizing: false,
                analyzing: false
            });
        }
    }

    /**
     * Called on API request error from callOptimizeApi, shows error toast
     * message.
     */
    handleFetchError() {
        dispatch("core/notices").createErrorNotice(
          "An unexpected error has occurred. Please contact your Client Success Manager for support."
        );
    }

    handleSaveEvent(event){
        let element = event.target;
        if (element.classList.contains(SAVE_DRAFT)) {
            trackingEvent({
                eventName: TRACK_SAVE_DRAFT,
                appName: TRACK_APP_GUTENBERG
            });
        } else if (element.classList.contains(UPDATE_PUBLISHED)) {
            trackingEvent({
                eventName: TRACK_SAVE_PUBLISHED,
                appName: TRACK_APP_GUTENBERG
            });
        }
    }

    handlePasteEvent(){
        this.reEnableOptimizeButton()
    }

    handleKeyUpEvent(){
        const {content} = this.state;
        if(content !== select('core/editor').getEditedPostContent()){
            this.reEnableOptimizeButton()
        }
    }

    handleKeyDownEvent(){
        this.setState({
            content:select('core/editor').getEditedPostContent()
        });
    }

    callParagraphFeedback(paragraphHighlightOn) {

        const requestArray = [];

        const {selectedProfile} = this.state;
        const {taskListFeedback} = this.props;
        const {getBlocks} = select('core/editor');
        let paragraphFeedWithLength = false;
        for(const block of getBlocks()) {
            if(!ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(block.name))
                {continue};

            const paragraphArray = {};

            paragraphArray.contentTypeName = "Article";
            paragraphArray.environment = "PRODUCTION";
            paragraphArray.measureNamesArray = ["rtSpellingGrammar", "rtComplianceList"];
            paragraphArray.content = encodeURIComponent(getHTMLFromBlock(block));
            paragraphArray.blockId = block.clientId;
            paragraphArray.blockName = block.name;

            if(selectedProfile) {
                paragraphArray['profileId'] = selectedProfile;
            }

            if(!isEmpty(taskListFeedback)) {
                const paragraphLength = taskListFeedback.data.PercentageParagraphsIdealWordCount;
                if(!paragraphLength.state) {
                    paragraphArray.readabilityTargetBucket = taskListFeedback.data.Readability.target;
                    paragraphArray.measureNamesArray.push("rtParagraphLength");
                    paragraphFeedWithLength = true;
                }
            }
            paragraphArray.measureNamesArray = JSON.stringify(paragraphArray.measureNamesArray);
            requestArray.push(paragraphArray);
        }

        const url = ATOMICREACH_API_NAMESPACE + ATOMICREACH_API_PARAGRAPH_ANALYZE_ARTICLES;

        this.setAtomicReachApiCallInProgress(true);
        return apiFetch({
            path: url,
            method: 'POST',
            data: {
                requestArray: JSON.stringify(requestArray)
            }
        }).then((feedback) => {
            this.setAtomicReachApiCallInProgress(false);
            this.setState({
                paragraphsFeedback: feedback,
                paragraphFeedWithLength
            }, () => {
                // Long paragraphs option is available
                if (paragraphFeedWithLength) {
                    if (paragraphHighlightOn) {
                        // Long paragraph highlight button is active
                        this.cardSelectionCallback("PercentageParagraphsIdealWordCount", paragraphHighlightOn);
                    } else {
                        // Long paragraph button inactive, remove par highlight
                        removeLongParagraphHighlight();
                    }

                }
            });
        }).catch((error) => {
            // Error is detected and handled on WordPress, catch is not reached.
            console.log(error);
            this.setAtomicReachApiCallInProgress(false);
        })
    }

    /**
     * Sets state.popoverState.showPopover to FALSE to hide popover.
     */
    closePopover() {
        const {popoverState} = this.state;
        this.setState({
            popoverState: {
                ...popoverState,
                showPopover: false,
            },
        });
    };

    /**
     * Called from componentDidMount(), method is executed on any WP event
     * (including Redux store). Actions:
     * - Sets state.hasChangedContent to TRUE if editor title or content
     *   changed.
     * - Removes Marks from all editor content if editor is saving, publishing
     *   or autosaving.
     */
    subscribeListener() {
        if(!this.componentIsMounted) {return;}
        const {isSavingPost, isAutosavingPost, isPublishingPost} = select('core/editor');
        const {getActiveGeneralSidebarName} = select('core/edit-post');
        // Ensure Atomic Reach sidebar is active.
        if (
          getActiveGeneralSidebarName() === ATOMICREACH_SIDEBAR_NAME &&
          this.hasEditorContentUpdated()
        ) {
          this.setState({
            hasChangedContent: true
          });
        }
        // When post is saving remove the highlighting.
        if((isSavingPost() || isPublishingPost()) && !isAutosavingPost()) {
            this.removeARHighlighting();
        }
    }

    /**
     * Provides callOptimizeApi() all the editor blocks content as a single
     * string.
     * @returns {String}
     */
    getContent() {
        const {getBlocks} = select('core/editor');
        let content = '';
        for(const block of getBlocks()) {
            content += getHTMLFromBlock(block);
        }
        return content;
    }

    /**
     * Called when componet is mounted or updated, stores editor title and
     * content to state.title, state.content and sets state.hasChangedContent
     * to FALSE.
     */
    updateTitleContentState() {
        // set hasChangedContent to false every time update state with up to date content.
        this.setState({
            title: select('core/editor').getEditedPostAttribute('title'),
            content: removeARMarkerTags(select('core/editor').getEditedPostContent()),
            hasChangedContent: false,
        });
    }

    /**
     * Sets state.profiles with props.profiles.
     * WARNING: This is an antipattern, remove asap.
     */
    updateProfileState() {
        this.setState({
            profiles: this.props.profiles,
        });
    }

    updateSelectedProfile(value) {
        const {profiles} = this.props;
        let profileDetails = {};
        profiles.forEach((profile) => {
            if(value.profile == profile.value) {
                profileDetails = profile;
            }
        });
        dispatch(ATOMICREACH_STORE).setProfile({
            profile: value
        });
        this.setState({
            selectedProfile: value.profile,
            selectedProfileDetails: profileDetails,
            tooltipVisibility: false,
            optimizeButton: {
                ...this.state.optimizeButton,
                disabled: isNaN(value.profile)
            }
        });
    }

    ProfilesDropdownList() {
        const {selectedProfile} = this.state;
        const {profiles} = this.props;
        return (
            <SelectControl
                // label={"Select Profile"}
                value={selectedProfile}
                options={profiles}
                onChange={
                    (profile) => {
                        if(profile !== 'Select a profile')
                            {this.updateSelectedProfile({profile})}
                    }
                }
            />
        )
    }

    OptimizeButtonClickHandler() {
        this.removeNotice('publishReadyNotice');
        this.totalOptimizeWordsToHighlight = 0;

        trackingEvent({
            eventName: TRACK_OPTIMIZE,
            appName: TRACK_APP_GUTENBERG
        });


        // disable and show spinner in the button
        this.setState({
            optimizeButton: {
                disabled: true,
                isBusy: true,
                hasClicked: true,
            },
            tooltipMessage: 'Your language is optimized',
            tooltipVisibility: true,
            optimizing:false,
            analyzing:false,
        });
        this.removeARHighlighting();
        this.callOptimizeApi();
        /*this.callTitleDocumentForOriginalContentApi().then(()=>{
        });*/
    }

    callOptimizeApi() {
        const {selectedProfile} = this.state;

        if(selectedProfile === null)
            {return;}

        this.setAtomicReachApiCallInProgress(true);

        const url = ATOMICREACH_API_NAMESPACE + ATOMICREACH_API_OPTIMIZE_ARTICLES;

        this.showNotice = true;

        apiFetch({
            path: url,
            method: 'POST',
            data: {
                profileId: selectedProfile,
                content: this.getContent(),
            }
        }).then((feedback) => {


            this.totalOptimizeWordsToHighlight = 0; // resets
            for(const ind in feedback) {
                if (feedback[ind] !== null) {
                    this.totalOptimizeWordsToHighlight += Object.keys(feedback[ind]).length;
                }
            }
            // console.log("Debug: ", this.totalOptimizeWordsToHighlight, "words to highlight");
            dispatch(ATOMICREACH_STORE).setOptimizeFeedback(feedback);
            this.setAtomicReachApiCallInProgress(false);

            this.setState({
                optimizeFeedback: feedback,
                optimizing: true,
            });

            if(this.totalOptimizeWordsToHighlight > 0 ) {
                this.setState({
                    optimizeButton: {
                        ...this.state.optimizeButton,
                        disabled:true,
                        isBusy: false,
                    },
                    revertButton: {
                        visible: true,
                        disabled: false,
                    },
                });
            }else{
                this.setState({
                    optimizeButton: {
                        ...this.state.optimizeButton,
                        disabled:false,
                        isBusy: false,
                    },
                    revertButton: {
                        visible: false,
                        disabled: false,
                    },
                });
            }

            this.optimizeFeedbackForRehighlighting = cloneDeep(feedback);
            this.processOptimizeFeedback();
        }).catch((err) => {
            this.handleFetchError();
            console.error(err);
            this.reEnableOptimizeButton();
            this.setAtomicReachApiCallInProgress(false);
            this.totalOptimizeWordsToHighlight = 0;
            this.showNotice = false;
        });
    }

    /*
    * Until https://developer.wordpress.org/block-editor/developers/block-api/block-annotations/ apis are available
    * we have a custom method of doing highlighting.
    * */
    processOptimizeFeedback() {
        const {optimizeFeedback} = this.state;
        const {getBlocks} = select('core/editor');

        if(this.totalOptimizeWordsToHighlight === 0) {
            console.log("no word replacement to do..exiting", optimizeFeedback);
        } else {
        /*New Optimize Feedback*/
        this.highlightOptimizeWords();
        // debugCountHighlightedWords(getBlocks());
        }
        }

    /**
     * Applies highlight to all words defined in feedbackItem.
     * @param {Object} block - Gutenberg block
     * @param {Number} blockIndex - "block" index on all blocks array
     * @param {Number} paragraphIndex - feedbackItem index on paragraph array
     * @param {Object} feedbackItem - Object in feedback array, contains a paragraph highlighted words data.
     * @param {Boolean} isReHighlighting - Flag to rehighlight
     */
    highlightBlock(block, blockIndex, paragraphIndex, feedbackItem, isReHighlighting) {
      const that = this;
      const blockHTML = getHTMLFromBlock(block, true);
      // Create a node element for Mark Js to work with.
      const myNode = document.createElement("div");
      myNode.innerHTML = blockHTML.trim();
      // Initiate Mark Js
      const instance = new Mark(myNode);
      instance.markRanges(Object.values(feedbackItem), {
        element: MARK_TAG_NAME,
        className: OPTIMIZED_WORD_CLASS,
        filter: (textNode, range, term) => {
          if (term !== range.text) {
            console.log("Unable to Highlight [" + range.text + "]", {
              textNode,
              range,
              term
            });
            return false;
          }
          /*if (!isReHighlighting) {
            that.adjustReHighlightingFeedback(paragraphIndex, range.key);
          }*/
          return true;
        },
        each: (node, range) => {
          // node is the marked DOM element
          // range is the corresponding range
          node.setAttribute(
            "id",
            "optimize_id_" + paragraphIndex + "_" + range.key
          );
          /*if (!isReHighlighting) {
            node.innerText = range.replacement;
          }*/
          node.dataset.optimizeId = range.key;
          node.dataset.blockIndex = paragraphIndex;
          //@todo: add instance.
        },
        done: () => {
            // all marks were applied
            updateBlockContent(block, myNode.innerHTML);
        }
      });
    }

    highlightOptimizeWords(isReHighlighting = false) {
        if (
          Object.entries(this.optimizeFeedbackForRehighlighting).length === 0
        ) {
          return true;
        }
        const { optimizeFeedback } = this.state;
        const { getBlocks } = select("core/editor");
        // stores index in block array. Points to block we are working on
        let blockIndex = null;
        const that = this;
        const optimizeFeedbackDuplicate = cloneDeep(
          isReHighlighting
            ? this.optimizeFeedbackForRehighlighting
            : optimizeFeedback
        );
        const allBlocks = getBlocks();
        const mydata = getFeedbackBlockData(
          optimizeFeedbackDuplicate,
          allBlocks
        );
        this.totalOptimizeWordsToHighlight = mydata.totalHighlightWords;
        for (let i = 0; i < mydata.blockIndexes.length; i += 1) {
          blockIndex = mydata.blockIndexes[i];
          const feedbackItem = optimizeFeedbackDuplicate[i];
          // if blockIndex is null no highlighting applies to block
          if (blockIndex !== null && !isEmpty(feedbackItem)) {
            this.highlightBlock(allBlocks[blockIndex], blockIndex, i, feedbackItem, isReHighlighting);
          }
        }
    }

    adjustReHighlightingFeedback(blockIndex, tokenKey, replacement) {

        const text = this.optimizeFeedbackForRehighlighting[blockIndex][tokenKey]['text'];
        replacement = replacement || this.optimizeFeedbackForRehighlighting[blockIndex][tokenKey]['replacement'];
        this.optimizeFeedbackForRehighlighting[blockIndex][tokenKey]['text'] = replacement;
        this.optimizeFeedbackForRehighlighting[blockIndex][tokenKey]['replacement'] = text;
        if(replacement.length !== text.length) {
            const reHighlightingObjKeys = Object.keys(this.optimizeFeedbackForRehighlighting[blockIndex]);

            const startingIndex = reHighlightingObjKeys.indexOf(tokenKey);

            for(let i = (parseInt(startingIndex) + 1); i < reHighlightingObjKeys.length; i++) {
                const adjustment = (replacement.length - text.length);
                this.optimizeFeedbackForRehighlighting[blockIndex][reHighlightingObjKeys[i]]['idx'] += adjustment;
            }
        }

    }

    takeSnapShop() {
        const {getBlocks} = select('core/editor');
        let paragraphSnapShot = {};


        for(const block of getBlocks()) {
            let thisTextContent = removeARMarkerTags(getHTMLFromBlock(block, true)).trim();

            paragraphSnapShot[block.clientId] = thisTextContent;

        }

        dispatch(ATOMICREACH_STORE).setParagraphSnapShots(paragraphSnapShot);
    }

    checkForChanges() {
        const {getBlocks} = select('core/editor');
        const {paragraphSnapShot} = this.props;
        let hasChanges = false;

        if(Object.keys(paragraphSnapShot).length > 0) {

            for(const block of getBlocks()) {
                let thisTextContent = removeARMarkerTags(getHTMLFromBlock(block, true)).trim();

                if(paragraphSnapShot[block.clientId] !== thisTextContent) {
                    hasChanges = true;
                }

            }
        }


        return hasChanges;

    }

    reHighlightOptimizedWords() {
        this.highlightOptimizeWords(true);
    }

    /* Revert back to the original content.*/
    revertHighlightedWords() {
        const {getBlocks} = select('core/editor');
        const {optimizeFeedback} = this.state;

        for(const block of getBlocks()) {

            const blockHTML = getHTMLFromBlock(block, true);
            const DOM_nodes = jQuery('<div></div>').html(blockHTML);
            const optimizedWords = DOM_nodes.find('.optimizedWord');

            if(optimizedWords.length < 1)
                {continue;}

            for(const word of optimizedWords) {
                if (!optimizeFeedback[word.dataset.blockIndex] ||
                    !optimizeFeedback[word.dataset.blockIndex][word.dataset.optimizeId]) {
                    console.log('revertHighlightedWords() fail', optimizeFeedback);
                } else {
                    word.textContent = optimizeFeedback[word.dataset.blockIndex][word.dataset.optimizeId].text;
                    word.outerHTML = word.innerHTML.trim();
                }
            }

            updateBlockContent(block, DOM_nodes.html());

        }

        dispatch(ATOMICREACH_STORE).setOptimizeFeedback([]);
        dispatch(ATOMICREACH_STORE).setOptimizeParagraphs({optimizedParagraphs: {}});

        this.reEnableOptimizeButton();

    }

    domHasOptimizedWords(){
        const editor = getEditorWrapperDOM();
        let optimizedWords = jQuery(editor).find('.optimizedWord');

        return optimizedWords.length;
    }

    getEngagementStr() {
        const {selectedProfileDetails} = this.state;

        let titleEngagement = this.engagementNames[selectedProfileDetails.titleEngagement];
        let bodyEngagement = this.engagementNames[selectedProfileDetails.bodyEngagement];
        let engagementStr = '';

        if(titleEngagement === bodyEngagement)
            {engagementStr = titleEngagement;}
        else
            {engagementStr = `${titleEngagement} and ${bodyEngagement}`;}

        return engagementStr;
    }

    checkForOptimization(feedback){
        let optimized =  true;
        if(typeof feedback !== 'undefined') {
            this.optimziedMeasures.forEach((measure) => {
                if (feedback.data[measure].state === false) {
                    optimized = false;
                }
            });
        }else{
            optimized = false;
        }
        return optimized;
    }

    isPublishReadyNotice(feedback) {
        if (!this.showNotice || this.getAtomicReachApiCallInProgress()) {
          return;
        }
        const noticeId = "publishReadyNotice";
        this.removeNotice(noticeId);
        if (!feedback || !feedback.data) {
          dispatch("core/notices").createErrorNotice(
            "Your language cannot be optimized to hit the target readability and emotion for the profile. You can improve your content by applying feedback in the Improvements and Title Insights list.",
            {
              id: noticeId
            }
          );
          this.showNotice = false;
          return;
        }
        const hasWords = this.totalOptimizeWordsToHighlight > 0;
        const hasReadability =
          feedback.data.Readability && feedback.data.Readability.state === true;
        const hasEmotion =
          feedback.data.Arousal && feedback.data.Arousal.state === true;
        if (hasWords) {
          const tense =
            this.totalOptimizeWordsToHighlight !== 1
              ? "changes were"
              : "change was";
          dispatch("core/notices").createSuccessNotice(
            `Your language is now optimized for ${this.getEngagementStr()}. ${
              this.totalOptimizeWordsToHighlight
            } ${tense} made.`,
            {
              id: noticeId
            }
          );
        } else if (hasReadability && hasEmotion) {
          dispatch("core/notices").createSuccessNotice(
            `Your language is already optimized for ${this.getEngagementStr()}.`,
            {
              id: noticeId
            }
          );
        } else {
          this.setState({
            tooltipMessage: "Your language cannot be optimized",
            tooltipVisibility: true
          });

          if (!hasReadability && hasEmotion) {
            dispatch("core/notices").createWarningNotice(
              "Your language's emotion already hits the profile but its readability cannot be optimized. You can improve your content by applying feedback in the Improvements and Title Insights list.",
              {
                id: noticeId
              }
            );
          } else if (hasReadability && !hasEmotion) {
            dispatch("core/notices").createWarningNotice(
              "Your language's readability already hits the profile but its emotion cannot be optimized. You can improve your content by applying feedback in the Improvements and Title Insights list.",
              {
                id: noticeId
              }
            );
          } else if (!hasReadability && !hasEmotion) {
            dispatch("core/notices").createWarningNotice(
              "Your language cannot be optimized to hit the target readability and emotion for the profile. You can improve your content by applying feedback in the Improvements and Title Insights list.",
              {
                id: noticeId
              }
            );
          }
        }
        this.showNotice = false;
    }


    removeNotice(noticeId) {

        const notices = select("core/notices").getNotices();

        if(notices.length > 0) {
            for(const notice of notices) {
                if(notice.id === noticeId) {
                    dispatch("core/notices").removeNotice(noticeId);
                }
            }
        }
    }

    disableOptimizeButton() {
        this.setState({
            optimizeButton: {
                ...this.state.optimizeButton,
                disabled: true,
                isBusy: false,
            }
        })
    }

    reEnableOptimizeButton() {
        const {selectedProfile} = this.props;
        if(Object.keys(selectedProfile).length > 0) {
            this.setState({
                optimizeButton: {
                    ...this.state.optimizeButton,
                    disabled: false,
                    isBusy: false,
                },
                tooltipVisibility: false
            })
        }
    }


    cardSelectionCallback(measure, isHighlightOn) {
        const {paragraphsFeedback} = this.state;
        const {getBlocks} = select('core/editor');
        if(isHighlightOn) {
            highlightParagraphLength(paragraphsFeedback);
        } else {
            this.removeARHighlighting();
            this.reHighlightOptimizedWords();
            highlightSpellingGrammar(paragraphsFeedback);
            highlightComplianceList(paragraphsFeedback);
        }
    }

    getAtomicReachApiCallInProgress() {
        return this.atomicReachApiCallInProgress;
    }

    setAtomicReachApiCallInProgress(state) {
        this.atomicReachApiCallInProgress = state;
    }

    /**
     * Returns TRUE if state.title and state.content are equal to editor
     * current title and content.
     * WARNING: This is highly inefficient as content can be many kb length.
     * Improve using isTyping event, as example.
     */
    hasEditorContentUpdated() {
        const {title, content} = this.state;
        const {getEditedPostContent, getEditedPostAttribute} = select('core/editor');
        return (title !== getEditedPostAttribute('title') || content !== removeARMarkerTags(getEditedPostContent()))
    }

    /**
     * Remove all Marks on editor content.
     */
    removeARHighlighting() {
        if(this.clearingHiglights) {
            return; // clear highlights already in process
        }
        this.clearingHiglights = true;
        const {getBlocks} = select('core/editor');
        for(const block of getBlocks()) {
            cleanARHighlightingFromBlock(block);
        }
        this.clearingHiglights = false;
    }

    /**
     * Called from SidebarParagraphHighlight after an API request is completed
     * (on success or error).
     */
    callbackParagraphHighlight(paragraphHighlightOn) {
        this.setState({ analyzing: true });
        // this.reEnableOptimizeButton();
        return this.callParagraphFeedback(paragraphHighlightOn);
    }

    render() {
        const {
            optimizeButton,
            popoverState,
            revertButton,
            tooltipMessage,
            tooltipVisibility,
            paragraphFeedWithLength
        } = this.state;
        const {
            taskListFeedback,
            optimizeFeedback,
            optimizedParagraphs
        } = this.props;
        const editor = getEditorWrapperDOM();

        const {
            popoverFeedback,
            popoverOriginalWord,
            popoverId,
            showPopover,
            type,
            showAddToDictionary,
        } = popoverState;

        return (
            <div id={'atomicreach-sidebar-wrapper'}>
                <div className={'profile-button-wrapper'}>
                    <div id={'atomicreach-profile-wrapper'}>{this.ProfilesDropdownList()} </div>
                    <div id={'atomicreach-optimize-button-wrapper'}>
                        <TooltipContainer
                            optimizeButton={optimizeButton}
                            clickHandler={this.OptimizeButtonClickHandler}
                            text={tooltipMessage}
                            position={'top'}
                            visibility={tooltipVisibility}
                        />
                        {(revertButton.visible) ?
                            <Button
                                id={'atomicreach-revert-button'}
                                disabled={revertButton.disabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                        revertButton: {
                                            disabled: true,
                                            visible: false,
                                        }
                                    });
                                    this.revertHighlightedWords();
                                    this.removeNotice('publishReadyNotice');
                                    this.removeNotice('warningContent');
                                }
                            }
                                isLink

                            >Revert Optimized Words
                            </Button>
                            : null}
                    </div>
                </div>

                <hr className={`ar-line ${(Object.keys(taskListFeedback).length === 0 || optimizeButton.isBusy) ? '' : 'hide'}`}/>
                <SidebarParagraphHighlight
                    panelTitle={'Improvements'}
                    optimizeButton={optimizeButton}
                    callbackParagraphHighlight={this.callbackParagraphHighlight}
                    measures={this.bodyMeasures}
                    cardSelectionCallback={this.cardSelectionCallback}
                    paragraphFeedWithLength={paragraphFeedWithLength}
                />

                <SidebarTitleFeedback
                    titleMeasures={this.titleMeasures}
                    bodyMeasures={this.bodyMeasures}
                    feedback={taskListFeedback}
                    optimizeStatus={optimizeButton}
                />

                {ReactDOM.createPortal(
                    <GenericPopover
                        isOpen={showPopover}
                        type={type}
                        originalText={popoverOriginalWord}
                        popoverFeedback={popoverFeedback}
                        wordReplacedCallback={(e) => {

                            let target = document.getElementById(popoverId); // ensure that the document never losses the active element
                            replaceActiveWord(e.target, target);

                            /*if(target.classList.contains(OPTIMIZED_WORD_CLASS)) {
                                const optimizedId = target.getAttribute('data-optimize-id');
                                const blockIndex = target.dataset.blockIndex;
                                // this.adjustReHighlightingFeedback(blockIndex, optimizedId, target.innerHTML);
                            }*/

                            /* Find <P> parent, if not found target is a list,
                            find <UL> parent instead */
                            let blockParagraph = target.closest('p')
                              || target.closest('ul');
                            if (blockParagraph === null) {
                              console.log('parent not found');
                            } else {
                              const block = select("core/editor")
                                .getSelectedBlock();
                              updateBlockContent(
                                block,
                                blockParagraph.innerHTML
                              );
                            }
                            this.closePopover();
                        }}
                        close={() => {
                            this.closePopover();
                        }}
                        repositionPopover={doRePositioningXYEditor}
                        target={() => popoverId}
                        wordFlags
                        flagFunction={(replaceWord, feedbackType) => {
                            let target = document.getElementById(popoverId); // ensure that the document never losses the active element
                            let paragraphElement = target.closest('p');
                            flagWordEditor(replaceWord, target, feedbackType, paragraphElement, popoverOriginalWord);
                        }}
                        className="editor-popover"
                        message={''}
                        addToDictionary={showAddToDictionary && (() => {
                            this.closePopover();
                            let target = document.getElementById(popoverId);
                            addToDictionary(target).then(() => {
                                target.outerHTML = target.innerHTML
                            });


                        })}
                    />, editor)
                }
            </div>
        )
    }


}

export default SidebarWrapper;
