import {
    JsonHubProtocol,
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel
} from '@aspnet/signalr/dist/esm/index';
import { NOTIFY_UPDATE_TRIP, FETCH_TRIPS_SUCCESS, NOTIFY_CANCEL_TRIP, NOTIFY_DECLINE_TRIP, NOTIFY_JOIN_TRIP } from "../actions/actionTypes";
import { loadJwt } from "../components/services/localStorage";
import {
    getNotificationUpdateTrip,
    getNotificationCancelTrip,
    getNotificationCompleteTrip,
    getNotificationDeclineTrip,
    getNotificationJoinTrip
} from "../actions/notificationsActions";

const createWebSocket = () => {
    const connectionHub = process.env.REACT_APP_BE_BASE_URL + "notifications";
    const protocol = new JsonHubProtocol();
    const transport = HttpTransportType.WebSockets | HttpTransportType.LongPolling; // let transport to fall back to to LongPolling if it needs to
    const options = {
        transport,
        logMessageContent: true,
        logger: LogLevel.Information, // NOTE: This needs to be changed in production
        accessTokenFactory: () => loadJwt()
    };

    // create the connection instance
    let connection = new HubConnectionBuilder()
        .withUrl(connectionHub, options)
        .withHubProtocol(protocol)
        .build();
    return connection;
};

const signalRMiddleware = store => {
    let connection = createWebSocket();

    connection.start()
        .then(() => console.info('SignalR Connected'))
        .catch(err => console.error('SignalR Connection Error: ', err));

    connection.onclose(error => {console.log(error); console.log(connection)});

    connection.on('joinTrip', payload => { if(connection.state === 1) store.dispatch(getNotificationJoinTrip(payload)); });
    connection.on('declineTrip', payload => { if(connection.state === 1) store.dispatch(getNotificationDeclineTrip(payload));});
    connection.on('cancelTrip', payload => { if(connection.state === 1) store.dispatch(getNotificationCancelTrip(payload));});
    connection.on('updateTrip', payload => { if(connection.state === 1) store.dispatch(getNotificationUpdateTrip(payload));});
    connection.on('completeTrip', payload => { if(connection.state === 1) store.dispatch(getNotificationCompleteTrip(payload));});

    return next => async action => {
        switch (action.type) {
            case FETCH_TRIPS_SUCCESS:
                if(connection.state === 1)
                    await connection.send('CompleteTripNotif');
                break;
            case NOTIFY_JOIN_TRIP:
                if(connection.state === 1)
                    await connection.send('JoinTripNotif', action.tripId);
                break;
            case NOTIFY_DECLINE_TRIP:
                if(connection.state === 1)
                    await connection.send('DeclineTripNotif', action.tripId);
                break;
            case NOTIFY_CANCEL_TRIP:
                if(connection.state === 1)
                    await connection.send('CancelTripNotif', action.tripId);
                break;
            case NOTIFY_UPDATE_TRIP:
                if(connection.state === 1)
                    await connection.send('UpdateTripNotif', action.tripId);
                break;
            default: {

            }
        }
        return next(action);
    }
};
export default signalRMiddleware;
