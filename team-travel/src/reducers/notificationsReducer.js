import * as types from "../actions/actionTypes";

const initialState = {
    notifications: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_NOTIFICATION_JOIN_TRIP:
            return {
                ...state,
                notifications: [...state.notifications, {
                    "id": action.payload.id,
                    "isActionable": false,
                    "text": `${action.payload.fullName}:has joined your trip to:${action.payload.destination}`,
                    "seen": false
                }],
            };
        case types.GET_NOTIFICATION_DECLINE_TRIP:
            return {
                ...state,
                notifications: [...state.notifications, {
                    "id": action.payload.id,
                    "isActionable": false,
                    "text": `${action.payload.fullName}:has declined your trip to:${action.payload.destination}`,
                    "seen": false
                }],
            };
        case types.GET_NOTIFICATION_CANCEL_TRIP:
            return {
                ...state,
                notifications: [...state.notifications, {
                    "id": action.payload.id,
                    "isActionable": false,
                    "text": `${action.payload.fullName}:has canceled the trip to:${action.payload.destination}`,
                    "seen": false
                }],
            };
        case types.GET_NOTIFICATION_UPDATE_TRIP:
            return {
                ...state,
                notifications: [...state.notifications, {
                    "id": action.payload.id,
                    "isActionable": false,
                    "text": `${action.payload.fullName}:has updated his/her trip to:${action.payload.destination}`,
                    "seen": false
                }]
            };
        case types.GET_NOTIFICATION_COMPLETE_TRIP:
            return {
                ...state,
                notifications: [...state.notifications, {
                    "id": action.payload.id,
                    "isActionable": true,
                    "text": `Have you completed the trip to:${action.payload.destination}`,
                    "url": action.payload.url,
                    "seen": false
                }],
            };
        default:
            return state;
    }
};
