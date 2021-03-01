//https://developer.wordpress.org/block-editor/packages/packages-data/#resolvers

import {actions} from "./actions";

import {
    ATOMICREACH_API_NAMESPACE,
    ATOMICREACH_API_GET_PROFILES,
    ATOMICREACH_API_OPTIMIZE_ARTICLES,
    ATOMICREACH_API_ANALYZE_ARTICLES,
    ATOMICREACH_STORE_TYPE_SET_OPTIMIZE_FEEDBACK,

} from "../constants";

export const resolvers = {

    * getProfiles(state) {
        const profiles = yield actions.fetchFromAPI(ATOMICREACH_API_NAMESPACE+ATOMICREACH_API_GET_PROFILES);
        return actions.setProfiles(profiles);
    },


};
