// https://developer.wordpress.org/block-editor/packages/packages-data/#selectors
export const selectors = {
    getProfiles(state) {
        const {profiles} = state;
        return profiles;
    },
    getTaskListFeedback(state) {
        // console.log("selectors getTaskList", state);
        const {taskListFeedback} = state;
        return taskListFeedback;
    },
    getOptimizeFeedback(state) {
        // console.log("selector: ",state);
        const {optimizeFeedback} = state;
        return optimizeFeedback;
    },
    getOptimizeFeedbackReHighlighting(state) {
        // console.log("selector: ",state);
        const {optimizeFeedbackReHighlighting} = state;
        return optimizeFeedbackReHighlighting;
    },
    getParagraphSnapShots(state) {
        // console.log("selector: ",state);
        const {paragraphSnapShot} = state;
        return paragraphSnapShot;
    },
    getOptimizedParagraphs(state) {
        // console.log("selector: ",state);
        const {optimizedParagraphs} = state;
        return optimizedParagraphs;
    },
    getWordCount(state) {
        // console.log("selector: ",state);
        const {wordCount} = state;
        return wordCount;
    },
    getSelectedProfile(state) {
        // console.log("selector: ",state);
        const {selectedProfile} = state;
        return selectedProfile;
    },
    getOptimizeStatus(state) {
        // console.log("selector: ",state);
        const {optimizeButtonStatus} = state;
        return optimizeButtonStatus;
    },
    getRevertStatus(state) {
        // console.log("selector: ",state);
        const {revertButtonStatus} = state;
        return revertButtonStatus;
    },
    getTooltipMessage(state) {
        // console.log("selector: ",state);
        const {tooltipMessage} = state;
        return tooltipMessage;
    }

};
