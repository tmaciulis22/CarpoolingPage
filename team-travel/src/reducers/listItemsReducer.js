import * as types from "../actions/actionTypes";
import TRIP_STATUS from '../constants/TripStatus'
import moment from 'moment';

const initialState = {
    trips: [],
    isFetchInProgress: false,
    errorFetch: '',
    errorUpdate: '',
    errorAddTrip: '',
    filters: {
        origin: '',
        date: '',
        dateFrom: '',
        dateTo: '',
        driver: '',
        carType: '',
        status: '',
        filterOutCanceled: false,
    },
    partiallyFilteredTrips: [],
    fullyFilteredTrips: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_TRIPS_REQUEST:
            return {
                ...state,
                isFetchInProgress: true,
                errorFetch: '', // resetting error state
                errorAddTrip: '',
                errorUpdate: '',
            };
        case types.FETCH_TRIPS_SUCCESS:
            return {
                ...state,
                trips: action.items,
                partiallyFilteredTrips: action.items,
                fullyFilteredTrips: action.items,
                isFetchInProgress: false,
            };
        case types.FETCH_TRIPS_FAILURE:
            return {
                ...state,
                isFetchInProgress: false,
                errorFetch: action.errorFetch
            };
        case types.UPDATE_TRIPS_REQUEST:
            return {
                ...state,
                isFetchInProgress: true,
                errorFetch: '', // resetting error state
                errorAddTrip: '',
                errorUpdate: '',
            };
        case types.UPDATE_TRIPS_SUCCESS:
            const index = state.trips.findIndex(item => item.id === action.trip.id);
            let newTrips = state.trips;
            newTrips[index] = action.trip;

            return {
                ...state,
                trips: newTrips,
                isFetchInProgress: false,
            };
        case types.UPDATE_TRIPS_FAILURE:
            return {
                ...state,
                isFetchInProgress: false,
                errorUpdate: action.errorUpdate
            };
        case types.FILTER_OUT_CANCELED_TRIPS:
        case types.FILTER_TRIPS_BY_CITY:
        case types.FILTER_TRIPS_BY_DATE:
        case types.FILTER_TRIPS_BY_DATE_FROM:
        case types.FILTER_TRIPS_BY_DATE_TO:
        case types.FILTER_TRIPS_BY_DRIVER:
        case types.FILTER_TRIPS_BY_CAR:
        case types.FILTER_TRIPS_BY_STATUS:
            let tripsAfterPartialFiltering = state.trips;
            let tripsAfterFullFiltering = state.trips;
            let filtersTemp = state.filters;
            let filters = ['origin', 'date', 'dateFrom', 'dateTo', 'driver', 'carType', 'status', 'filterOutCanceled'];

            filters.forEach(filter => {
                let value;

                if (action[filter] || action[filter] === '') {
                    value = action[filter];
                } else {
                    value = filtersTemp[filter];
                }
                if(value || value === '') {
                    filtersTemp[filter] = value;
                }
            });

            filters.forEach(filter => {
                if (filtersTemp[filter]) {
                    switch(filter) {
                        case 'dateFrom':
                            tripsAfterFullFiltering = tripsAfterFullFiltering.filter((trip) => {
                                return moment(trip['date']).isSameOrAfter(moment(filtersTemp[filter]), 'day')
                            });
                            break;
                        case 'dateTo':
                            tripsAfterFullFiltering = tripsAfterFullFiltering.filter((trip) => {
                                return moment(trip['date']).isSameOrBefore(moment(filtersTemp[filter]), 'day')
                            });
                            break;
                        case 'date':
                            tripsAfterFullFiltering = tripsAfterFullFiltering.filter((trip) => {
                                return trip[filter] === filtersTemp[filter]
                            });
                            break;
                        case 'driver':
                            tripsAfterPartialFiltering = tripsAfterPartialFiltering.filter((trip) => {
                                return trip['driver'].toLocaleLowerCase().includes(filtersTemp[filter].toLocaleLowerCase());
                            });
                            tripsAfterFullFiltering = tripsAfterFullFiltering.filter((trip) => {
                                return trip['driver'].toLocaleLowerCase().includes(filtersTemp[filter].toLocaleLowerCase());
                            });
                            break;
                        case 'filterOutCanceled':
                            tripsAfterPartialFiltering = tripsAfterPartialFiltering.filter((trip) => {
                                return trip.status === TRIP_STATUS.COMPLETED || trip.status === TRIP_STATUS.ACTIVE
                            });
                            tripsAfterFullFiltering = tripsAfterFullFiltering.filter((trip) => {
                                return trip.status === TRIP_STATUS.COMPLETED || trip.status === TRIP_STATUS.ACTIVE
                            });
                            break;
                        default:
                            tripsAfterPartialFiltering = tripsAfterPartialFiltering.filter((trip) => {
                                return trip[filter] === filtersTemp[filter]
                            });
                            tripsAfterFullFiltering = tripsAfterFullFiltering.filter((trip) => {
                                return trip[filter] === filtersTemp[filter]
                            });
                            break;
                    }
                }
            });

            return {
                ...state,
                filters: filtersTemp,
                partiallyFilteredTrips: tripsAfterPartialFiltering,
                fullyFilteredTrips: tripsAfterFullFiltering,
            };
        case types.CLEAR_FILTERS:
            return {
                ...state,
                filters: {
                    origin: '',
                    date: '',
                    dateFrom: '',
                    dateTo: '',
                    driver: '',
                    carType: '',
                    status: '',
                    passengers: '',
                    type: '',
                    filterOutCanceled: false,
                },
                partiallyFilteredTrips: state.trips,
                fullyFilteredTrips: state.trips,
            };

        case types.TRIP_ADD_REQUEST:
            return {
                ...state,
                isAddingInProgress: true,
                errorFetch: '', // resetting error state
                errorAddTrip: '',
                errorUpdate: '',
            };
        case types.TRIP_ADD_SUCCESS:
            state.trips.push(action.items);
            return {
                ...state,
                isAddingInProgress: false,
            };
        case types.TRIP_ADD_FAILURE:
            return {
                ...state,
                isAddingInProgress: false,
                errorAddTrip: action.errorAddTrip
            };

        case types.DELETE_TRIPS_REQUEST:
            return {
                ...state,
                isFetchInProgress: true,
                errorFetch: '', // resetting error state
                errorAddTrip: '',
                errorUpdate: ''
            };
        case types.DELETE_TRIPS_SUCCESS:

        return  {
            ...state,
            trips: state.trips.filter(trip => trip.id !== action.id),
            isFetchInProgress: false
        };

        case types.DELETE_TRIPS_FAILURE:
            return {
                ...state,
                isFetchInProgress: false,
                error: action.error
            };
        case types.CONFIRM_TRIP_REQUEST:
            return {
                ...state,
                error: ''
            };
        case types.CONFIRM_TRIP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
};
