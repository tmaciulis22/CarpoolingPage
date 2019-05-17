import * as types from './actionTypes';

export const notifyJoinTrip = (tripId => {
    return {
        type: types.NOTIFY_JOIN_TRIP,
        tripId
    };
});

export const getNotificationJoinTrip = (payload => {
    return {
        type: types.GET_NOTIFICATION_JOIN_TRIP,
        payload
    };
});

export const notifyDeclineTrip = (tripId => {
    return {
        type: types.NOTIFY_DECLINE_TRIP,
        tripId
    };
});

export const getNotificationDeclineTrip = (payload => {
    return {
        type: types.GET_NOTIFICATION_DECLINE_TRIP,
        payload
    };
});

export const notifyCancelTrip = (tripId => {
    return {
        type: types.NOTIFY_CANCEL_TRIP,
        tripId
    };
});

export const getNotificationCancelTrip = (payload => {
    return {
        type: types.GET_NOTIFICATION_CANCEL_TRIP,
        payload
    };
});

export const notifyUpdateTrip = (tripId => {
    return {
        type: types.NOTIFY_UPDATE_TRIP,
        tripId
    };
});

export const getNotificationUpdateTrip = (payload => {
    return {
        type: types.GET_NOTIFICATION_UPDATE_TRIP,
        payload
    };
});

export const getNotificationCompleteTrip = (payload => {
    return {
        type: types.GET_NOTIFICATION_COMPLETE_TRIP,
        payload
    };
});
