import * as types from "./actionTypes";
import axios from 'axios';
import {loaderOff, loaderOn} from "./loaderActions";
import {loadJwt} from "./../components/services/localStorage";

const tripsUrl = process.env.REACT_APP_BE_BASE_URL + 'trips';

export const fetchListRequest = () => ({
    type: types.FETCH_TRIPS_REQUEST,
});

export const fetchListSuccess = items => ({
    type: types.FETCH_TRIPS_SUCCESS,
    items
});

export const fetchListFailure = (errorFetch) => ({
    type: types.FETCH_TRIPS_FAILURE,
    errorFetch
});

export const fetchTrips = items => dispatch => {
    dispatch(loaderOn());
    dispatch(fetchListRequest(items));
    let tripsUrlQuery = tripsUrl + (items == null ? "" : ("?" +
        (items.origin == null ? "" : "origin=" + items.origin) +
        (items.destination == null ? "" : "destination=" + items.destination) +
        (items.date == null ? "" : "date=" + items.date) +
        (items.driverId == null ? "" : "driverId=" + items.driverId) +
        (items.maxSeats == null ? "" : "maxSeats=" + items.maxSeats) +
        (items.carType == null ? "" : "carType=" + items.carType)));

    let filterByDate = !!items.filterByDate && convertDate(items.filterByDate);
    let filterOutCanceled = !!items.filterOutCanceledTrips && items.filterOutCanceledTrips;

    let config = {
        headers: {
            'Authorization': 'Bearer ' + loadJwt()
        }
    };

    axios
        .get(tripsUrlQuery, config)
        .then((response) => {
            let items = response.data;
            items.map(item => item = prepareTrips(item));
            dispatch(clearFilters());
            dispatch(fetchListSuccess(items));
            dispatch(loaderOff());
        })
        .then(() => {
            filterByDate && dispatch(filterTripsByDate(filterByDate));
            filterOutCanceled && dispatch(filterOutCanceledTrips(true));
        })
        .catch((error) => {
            let errorMessage = "There was a problem while loading the trips... Please try again later";
            dispatch(fetchListFailure(errorMessage));
            dispatch(loaderOff());
        });
};

const prepareTrips = (item) => {

    let date = new Date(Date.parse(item.leavingDate));
    let returnDate = new Date(Date.parse(item.returnDate));
    item.date = convertDate(date);
    item.time = date.toLocaleTimeString('UTC', { hour12: false });
    if (!!item.returnDate) {
        item.dateOfReturn = convertDate(returnDate);
        item.timeOfReturn = returnDate.toLocaleTimeString('UTC', { hour12: false });
    }
    else
        item.dateOfReturn = item.timeOfReturn = '';
    item.availableSeats = item.maxSeats - item.passengers.length;

    return item;
};

const convertDate = (dateObj) => {
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return year + '-' + month + '-' + day;
}


export const filterTripsByCity = (origin) => ({
    type: types.FILTER_TRIPS_BY_CITY,
    origin
});

export const filterTripsByDate = (date) => ({
    type: types.FILTER_TRIPS_BY_DATE,
    date
});

export const filterTripsByDateFrom = (dateFrom) => ({
    type: types.FILTER_TRIPS_BY_DATE_FROM,
    dateFrom
});

export const filterTripsByDateTo = (dateTo) => ({
    type: types.FILTER_TRIPS_BY_DATE_TO,
    dateTo
});

export const filterTripsByDriver = (driver) => ({
    type: types.FILTER_TRIPS_BY_DRIVER,
    driver
});

export const filterTripsByCar = (carType) => ({
    type: types.FILTER_TRIPS_BY_CAR,
    carType
});

export const filterTripsByStatus = (status) => ({
    type: types.FILTER_TRIPS_BY_STATUS,
    status
});

export const filterOutCanceledTrips = (filterOutCanceled) => ({
    type: types.FILTER_OUT_CANCELED_TRIPS,
    filterOutCanceled
});

export const clearFilters = () => ({
    type: types.CLEAR_FILTERS
});

export const updateTripsRequest = () => ({
    type: types.UPDATE_TRIPS_REQUEST,
});

export const updateTripsSuccess = trip => ({
    type: types.UPDATE_TRIPS_SUCCESS,
    trip
});

export const updateTripsFailure = errorUpdate => ({
    type: types.UPDATE_TRIPS_FAILURE,
    errorUpdate
});

export const updateTrips = item => dispatch => {
    let queryToAdd = '';
    if(!!item.passenger)
        queryToAdd = "?passengerId=" + item.passenger.userId + "&isLeaving=" + !!item.isLeaving;
    
    let config = {
        headers: {
            'Authorization': 'Bearer ' + loadJwt()
        }
    };

    dispatch(loaderOn());
    dispatch(updateTripsRequest());

    return axios
        .put(tripsUrl + queryToAdd, item.trip, config)
        .then((response) => {
            let trip = response.data;
            trip = prepareTrips(trip);
            dispatch(updateTripsSuccess(trip));
            dispatch(filterTripsByCity());
            dispatch(loaderOff());
            return true;
        })
        .catch(error => {
            let errorMessage;
            if (!!error.response)
                errorMessage = error.response.data.Message;
            else {
                if (!!queryToAdd)
                    errorMessage = "There was a problem while joining the trip... Please try again later";
                else if (!!item.isLeaving)
                    errorMessage = "There was a problem while leaving the trip... Please try again later";
                else
                    errorMessage = "There was a problem while updating the trip... Please try again later";
            }
            dispatch(updateTripsFailure(errorMessage));
            dispatch(loaderOff());
            return false;
        });
};

export const addTripRequest = () => ({
    type: types.TRIP_ADD_REQUEST,
});

export const addTripSuccess = items => ({
    type: types.TRIP_ADD_SUCCESS,
    items
});

export const addTripFailure = errorAddTrip => ({
    type: types.TRIP_ADD_FAILURE,
    errorAddTrip
});

export const addTrip = trip => dispatch => {
    dispatch(loaderOn());
    dispatch(addTripRequest());
    let config = {
        headers: {
            'Authorization': 'Bearer ' + loadJwt()
        }
    };

    axios
        .post(tripsUrl, trip, config)
        .then((response) => {
            let addedTrip = response.data;
            addedTrip = prepareTrips(addedTrip);
            dispatch(addTripSuccess(addedTrip));
            dispatch(filterTripsByCity(undefined));
            dispatch(loaderOff());
        })
        .catch((error) => {
            let errorMessage, errorField;
            if (!!error.response) {
                errorField = Object.keys(error.response.data)[0];
                if(error.response.data[errorField][0] !== "Error!"){
                    errorMessage = error.response.data[errorField][0];
                }else{
                    errorMessage = "There was a problem while creating your trip... Please try again later";
                }
            }
            else {
                errorMessage = "There was a problem while creating your trip... Please try again later";
            }
            dispatch(addTripFailure(errorMessage));
            dispatch(loaderOff());
        });
};

export const deleteTripsRequest = () => ({
    type: types.DELETE_TRIPS_REQUEST,
});

export const deleteTripsSuccess = id => ({
    type: types.DELETE_TRIPS_SUCCESS,
    id
});

export const deleteTripsFailure = errorUpdate => ({
    type: types.DELETE_TRIPS_FAILURE,
    errorUpdate
});

export const deleteTrip = item => dispatch => {
    let id = item.ID;
    let queryTodelete = "/" + id;

    dispatch(loaderOn());
    dispatch(deleteTripsRequest());

    axios
        .delete(tripsUrl + queryTodelete, id)
        .then((response) => {
            dispatch(deleteTripsSuccess(id));
            dispatch(filterTripsByCity());
            dispatch(loaderOff());
        })
        .catch(error => {
            let errorMessage = "There was a problem while deleting the trip... Please try again later";
            dispatch(deleteTripsFailure(errorMessage));
            dispatch(loaderOff());
        });
};

export const confirmTripRequest = () => ({
    type: types.CONFIRM_TRIP_REQUEST,
});

export const confirmTripSuccess = () => ({
    type: types.CONFIRM_TRIP_SUCCESS,
});

export const confirmTripFailure = error => ({
    type: types.CONFIRM_TRIP_FAILURE,
    error
});

export const confirmTrip = url => dispatch => {
    let config = {
        headers: {
            'Authorization': 'Bearer ' + loadJwt()
        }
    };
    dispatch(loaderOn());
    dispatch(confirmTripRequest());
    return axios
        .put(url, null, config)
        .then( response => {
            dispatch(confirmTripSuccess());
            dispatch(loaderOff());
            return true;
        })
        .catch((error) => {
            dispatch(confirmTripFailure(error));
            dispatch(loaderOff());
            return false;
        });
};
