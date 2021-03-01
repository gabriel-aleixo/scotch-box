// Wordpress Packages @ https://developer.wordpress.org/block-editor/packages/
import {registerPlugin} from "@wordpress/plugins";
import {registerStore, withSelect} from "@wordpress/data";
import {PluginSidebar, PluginSidebarMoreMenuItem} from "@wordpress/edit-post";
import {compose} from "@wordpress/compose";
import {__} from "@wordpress/i18n";
import {registerFormatType} from "@wordpress/rich-text";

//import Const
import {ATOMICREACH_STORE, MARK_TAG_NAME} from "./constants";

// Import Store Options
import {actions} from "./store/actions";
import {reducer} from "./store/reducers";
import {selectors} from "./store/selectors";
import {controls} from "./store/controls";
import {resolvers} from "./store/resolvers";
// Import Atomic Reach components.

import SidebarWrapper from './components/SidebarWrapper';
import {removeARMarkerTags, atomicReachIcon} from './library/utils';
import {ATOMICREACH_VALID_BLOCK_NAMES_ARRAY} from './constants';


// Local Var
const prefix = __('atomicreach-');
const sidebarName = __(prefix + 'sidebar');
const title = __('Atomic Reach');


//https://developer.wordpress.org/block-editor/packages/packages-data/#registering-a-store
registerStore(ATOMICREACH_STORE, {
    reducer,
    actions,
    selectors,
    controls,
    resolvers,
});

/*
* Adds Atomic Reach Link to the side bar menu
* https://developer.wordpress.org/block-editor/packages/packages-edit-post/
* */
const atomicreachSidebarMenuItem = () => (
    <PluginSidebarMoreMenuItem target={sidebarName}>
        {title}
    </PluginSidebarMoreMenuItem>
);

registerPlugin('atomicreach-sidebar-menu-item', {render: atomicreachSidebarMenuItem, icon: atomicReachIcon});


//@todo: Only make this API call when user clicks on the AR sidebar icon.
//@Known-bug: if user enables the AR sidebar before API returns the response they will never see the profile dropdown. Maybe make the call from the SidebarWrapper component.
const applyWithSelect = withSelect((select) => {

    const {
        getProfiles,
        getTaskListFeedback,
        getOptimizeFeedback,
        getSelectedProfile,
        getOptimizedParagraphs,
        getParagraphSnapShots,
        getWordCount,
        getOptimizeFeedbackReHighlighting,
        getOptimizeStatus,
        getRevertStatus,
        getTooltipMessage,
    } = select(ATOMICREACH_STORE);

    return {
        profiles: getProfiles(),
        taskListFeedback: getTaskListFeedback(),
        optimizeFeedback: getOptimizeFeedback(),
        selectedProfile: getSelectedProfile(),
        optimizedParagraphs: getOptimizedParagraphs(),
        paragraphSnapShot: getParagraphSnapShots(),
        wordCount: getWordCount(),
        optimizeFeedbackReHighlighting: getOptimizeFeedbackReHighlighting(),
        optimizeButtonStatus: getOptimizeStatus(),
        revertButtonStatus: getRevertStatus(),
        tooltipMessage: getTooltipMessage(),
    };
});

const atomicreachSidebar = (data) => {
    return (
        <PluginSidebar name={sidebarName} title={title} className={'ar-plugin-container'}>
            <SidebarWrapper
                profiles={data.profiles}
                selectedProfile={data.selectedProfile}
                taskListFeedback={data.taskListFeedback}
                optimizeFeedback={data.optimizeFeedback}
                optimizedParagraphs={data.optimizedParagraphs}
                paragraphSnapShot={data.paragraphSnapShot}
                wordCount={data.wordCount}
                optimizeFeedbackReHighlighting={data.optimizeFeedbackReHighlighting}
                optimizeButtonStatus={data.optimizeButtonStatus}
                revertButtonStatus={data.revertButtonStatus}
                tooltipMessage={data.tooltipMessage}
            />
        </PluginSidebar>
    );
};

const atomicreachSidebarRender = compose([
    applyWithSelect,
])(atomicreachSidebar);

registerPlugin(sidebarName, {render: atomicreachSidebarRender, icon: atomicReachIcon});


registerFormatType(
    'atomicreach/marker', {
        title: 'AtomicReach Highlighting Marker',
        tagName: MARK_TAG_NAME,
        className: 'atomicreachHighlighting',
    }
);

function clearARMarkerTags(element, blockType, attributes){

    if(ATOMICREACH_VALID_BLOCK_NAMES_ARRAY.includes(blockType.name)){
        if(element.props.value) {
            element.props.value = removeARMarkerTags(element.props.value);
        }else if(typeof element.props.children === "string") {
            element.props.children = removeARMarkerTags(element.props.children);
        }else if(element.props.children.props.value) {
            element.props.children = removeARMarkerTags(element.props.children.props.value);
        }
    }
    return element;
}

wp.hooks.addFilter(
    // 'blocks.getSaveContent.extraProps',
    'blocks.getSaveElement',
    'atomicreach/clear-armarker-tags',
    clearARMarkerTags
);
