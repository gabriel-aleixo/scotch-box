//https://developer.wordpress.org/block-editor/packages/packages-data/#controls
import apiFetch from "@wordpress/api-fetch";
import {addParamToUrl} from "../library/utils";

export const controls = {
    FETCH_FROM_API(action) {
        return apiFetch({
            path: action.path,
            method: (action.method) ? action.method : 'GET',
            data: action.data,

        }).catch(err => console.error(err));
    },
};
