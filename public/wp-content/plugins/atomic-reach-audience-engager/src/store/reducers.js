// https://redux.js.org/basics/reducers
// https://developer.wordpress.org/block-editor/packages/packages-data/#reducer

import {
    ATOMICREACH_STORE_TYPE_GET_PROFILES,
    ATOMICREACH_STORE_TYPE_SET_PROFILES,
    ATOMICREACH_STORE_TYPE_TASK_LIST_FEEDBACK,
    ATOMICREACH_STORE_TYPE_SET_TASK_LIST_FEEDBACK,
    ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK,
    ATOMICREACH_STORE_TYPE_SET_SELECTED_PROFILE,
    ATOMICREACH_STORE_TYPE_SET_PARAGRAPH_STORE,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZED_PARAGRAPH_STORE,
    ATOMICREACH_STORE_TYPE_SET_WORDCOUNT_STORE,
    ATOMICREACH_STORE_CLEAR,
    ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING,
    ATOMICREACH_STORE_OPTIMIZE_BUTTON_STATUS,
    ATOMICREACH_STORE_REVERT_BUTTON_STATUS,
    ATOMICREACH_STORE_TOOLTIP_MESSAGE,
} from "../constants";

const initialState = {
    userRoles: {},
    profiles: {},
    selectedProfile: {},
    optimizedParagraphs: {},
    paragraphSnapShot: {},
    taskListFeedback: {},
    optimizeFeedback: {},
    optimizeFeedbackReHighlighting: {},
    wordCount: {},
    optimizeButtonStatus: false,
    revertButtonStatus: false,
    tooltipMessage:'',
};

export const reducer = (state = initialState, action) => {

    // console.log("== Reducer: ", state, action);

    switch(action.type) {
        case ATOMICREACH_STORE_TYPE_GET_PROFILES:
            return {
                ...state,
                profiles: action.profiles,
            };
        case ATOMICREACH_STORE_TYPE_SET_PROFILES:
            return {
                ...state,
                profiles: action.profiles,
            };
        case ATOMICREACH_STORE_TYPE_TASK_LIST_FEEDBACK:
            return {
                ...state,
                taskListFeedback: action.taskListFeedback,
            };
        case ATOMICREACH_STORE_TYPE_SET_TASK_LIST_FEEDBACK:
            return {
                ...state,
                taskListFeedback: action.taskListFeedback,
            };
        case  ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK:
            return {
                ...state,
                optimizeFeedback: action.optimizeFeedback,
            };
        case ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK:
            return {
                ...state,
                optimizeFeedback: action.optimizeFeedback,
            };
            case  ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING:
            return {
                ...state,
                optimizeFeedbackReHighlighting: action.optimizeFeedbackReHighlighting,
            };
        case ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING:
            return {
                ...state,
                optimizeFeedbackReHighlighting: action.feedback.optimizeFeedbackReHighlighting,
            };
        case ATOMICREACH_STORE_TYPE_SET_PARAGRAPH_STORE:
            return {
                ...state,
                paragraphSnapShot: action.paragraphSnapShot,
            };
        case ATOMICREACH_STORE_TYPE_SET_OPTIMIZED_PARAGRAPH_STORE:
            return {
                ...state,
                optimizedParagraphs: action.optimizedParagraphs,
            };
        case ATOMICREACH_STORE_TYPE_SET_SELECTED_PROFILE:
            return {
                ...state,
                selectedProfile: action.selectedProfile,
            };
        case ATOMICREACH_STORE_TYPE_SET_WORDCOUNT_STORE:
            return {
                ...state,
                wordCount: action.wordCount,
            };
        case ATOMICREACH_STORE_OPTIMIZE_BUTTON_STATUS:
            return {
                ...state,
                optimizeButtonStatus: action.status,
            };
        case ATOMICREACH_STORE_REVERT_BUTTON_STATUS:
            return {
                ...state,
                revertButtonStatus: action.status,
            };
        case ATOMICREACH_STORE_TOOLTIP_MESSAGE:
            return {
                ...state,
                tooltipMessage: action.message,
            };
        case ATOMICREACH_STORE_CLEAR:
            return {
                ...state,
                wordCount: {},
                selectedProfile: {},
                optimizedParagraphs: {},
                taskListFeedback: {},
                optimizeFeedback: {},
            };

    }

    return state;
}
