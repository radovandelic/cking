import { combineReducers } from "redux";
import base64 from "base-64";

let lang = navigator.language.substring(0, 2);
lang = ["fr", "nl", "en"].indexOf(lang) !== -1 ? lang : "en";

const kitchenReducer = (state = {}, action) => {
    switch (action.type) {
        case "UPDATE_KITCHEN":
            if (!action.kitchen.id) {
                localStorage.removeItem("mykitchen");
            } else if (typeof (Storage) !== undefined && window.localStorage.getItem("mykitchen")) {
                window.localStorage.setItem("mykitchen", base64.encode(JSON.stringify(action.kitchen)));
            }
            return action.kitchen;
        default:
            return state;
    }
};

const userReducer = (state = { lang: lang }, action) => {
    switch (action.type) {
        case "UPDATE_USER":
            if (typeof (Storage) !== undefined && window.localStorage.getItem("user")) {
                window.localStorage.setItem("user", base64.encode(JSON.stringify(action.user)));
            }
            return action.user;
        case "UPDATE_LANGUAGE":
            return { ...state, lang: action.lang };
        default:
            return state;
    }
};
const rootReducer = combineReducers({
    user: userReducer,
    kitchen: kitchenReducer,
});

export default rootReducer;