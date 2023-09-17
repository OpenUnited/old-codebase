// lib/redux.js
import logger from 'redux-logger';
import {applyMiddleware, createStore} from 'redux';
import {MakeStore, createWrapper, Context, HYDRATE} from 'next-redux-wrapper';

import { rootReducers} from './reducers';
const SET_CLIENT_STATE = 'SET_CLIENT_STATE';

export const reducer = (state, {type, payload}) => {
    // Usual stuff with HYDRATE handler
    if (type === SET_CLIENT_STATE) {
        return {
            ...state,
            fromClient: payload
        };
    }
    return state;
};

const makeConfiguredStore = (reducer) =>
    // createStore(reducer, undefined, applyMiddleware(logger));
    createStore(reducer, undefined);

const makeStore = () => {

    const isServer = typeof window === 'undefined';

    if (isServer) {

        return makeConfiguredStore(rootReducers);

    } else {

        // we need it only on client side
        const {persistStore, persistReducer} = require('redux-persist');
        const storage = require('redux-persist/lib/storage').default;

        const persistConfig = {
            key: 'nextjs',
            whitelist: ['fromClient'], // make sure it does not clash with server keys
            storage
        };

        const persistedReducer = persistReducer(persistConfig, rootReducers);
        const store = makeConfiguredStore(persistedReducer);

        store.__persistor = persistStore(store); // Nasty hack

        return store;
    }
};

export const wrapper = createWrapper(makeStore);

export const AppDispatch = typeof makeStore().dispatch;