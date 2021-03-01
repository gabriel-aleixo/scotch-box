// https://developer.wordpress.org/block-editor/packages/packages-data/#actions


import {
    ATOMICREACH_STORE_FETCH_FROM_API,
    ATOMICREACH_STORE_TYPE_GET_PROFILES,
    ATOMICREACH_STORE_TYPE_SET_PROFILES,
    ATOMICREACH_STORE_TYPE_SET_SELECTED_PROFILE,
    ATOMICREACH_STORE_TYPE_TASK_LIST_FEEDBACK,
    ATOMICREACH_STORE_TYPE_SET_TASK_LIST_FEEDBACK,
    ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK,
    ATOMICREACH_STORE_TYPE_SET_PARAGRAPH_STORE,
    ATOMICREACH_STORE_TYPE_SET_WORDCOUNT_STORE,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZED_PARAGRAPH_STORE,
    ATOMICREACH_STORE_CLEAR,
    ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING,
    ATOMICREACH_STORE_OPTIMIZE_BUTTON_STATUS,
    ATOMICREACH_STORE_REVERT_BUTTON_STATUS,
    ATOMICREACH_STORE_TOOLTIP_MESSAGE,
} from "../constants";


export const actions = {
    getProfiles(path) {
        return {
            type: ATOMICREACH_STORE_TYPE_GET_PROFILES,
            path,
        };
    },
    setProfiles(profiles) {
        return {
            type: ATOMICREACH_STORE_TYPE_SET_PROFILES,
            profiles,
        };
    },
    getTaskListFeedback() {
        return {
            type: ATOMICREACH_STORE_TYPE_TASK_LIST_FEEDBACK,
        };
    },
    setTaskListFeedback(feedback){
        return {
            type: ATOMICREACH_STORE_TYPE_SET_TASK_LIST_FEEDBACK,
            taskListFeedback:feedback.taskListFeedback
        };
    },

    setProfile(profile){
        return {
            type: ATOMICREACH_STORE_TYPE_SET_SELECTED_PROFILE,
            selectedProfile:profile
        };
    },

    setParagraphSnapShots(paragraphs){
        return {
            type: ATOMICREACH_STORE_TYPE_SET_PARAGRAPH_STORE,
            paragraphSnapShot:paragraphs
        };
    },
    setOptimizeParagraphs(paragraphs){
        return {
            type: ATOMICREACH_STORE_TYPE_SET_OPTIMIZED_PARAGRAPH_STORE,
            optimizedParagraphs:paragraphs.optimizedParagraphs
        };
    },
    setWordCount(words){
        return {
            type: ATOMICREACH_STORE_TYPE_SET_WORDCOUNT_STORE,
            wordCount:words.wordCount
        };
    },
    getOptimizeFeedback() {
        return {
            type: ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK
        };
    },
    setOptimizeFeedback(optimizeFeedback) {
        return {
            type: ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK,
            optimizeFeedback,
        };
    },
    getOptimizeFeedbackReHighlighting() {
        return {
            type: ATOMICREACH_STORE_TYPE_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING
        };
    },
    setOptimizeFeedbackReHighlighting(feedback) {
        return {
            type: ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK_RE_HIGHLIGHTING,
            feedback,
        };
    },

    setOptimizeButtonStatus(status) {
        return {
            type: ATOMICREACH_STORE_OPTIMIZE_BUTTON_STATUS,
            status,
        };
    },

    setRevertButtonStatus(status) {
        return {
            type: ATOMICREACH_STORE_REVERT_BUTTON_STATUS,
            status,
        };
    },
    setTooltipMessage(message) {
        return {
            type: ATOMICREACH_STORE_TOOLTIP_MESSAGE,
            message,
        };
    },
    clearStore() {
        return {
            type: ATOMICREACH_STORE_CLEAR,
        };
    },
    fetchFromAPI(path) {
        return {
            type: ATOMICREACH_STORE_FETCH_FROM_API,
            path,
        };
    },
};
