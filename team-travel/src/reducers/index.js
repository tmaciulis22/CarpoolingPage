import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import listItemsFetch from './listItemsReducer';
import reportsListReducer from './reportsListReducer';
import loginReducer from './loginReducer';
import registrationReducer from './registrationReducer';
import loaderReducer from './loaderReducer'
import userSettings from './userSettings';
import adminPanelUsers from './adminPanelReducer';
import notifications from './notificationsReducer';

const appReducer = combineReducers({
    listItemsFetch,
    reportsListReducer,
    loginReducer,
    registrationReducer,
    loaderReducer,
    userSettings,
    notifications,
    adminPanelUsers,
    routing: routerReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
      const { routing } = state;
      state = { routing } ;
    }
    return appReducer(state, action);
}

export default rootReducer;