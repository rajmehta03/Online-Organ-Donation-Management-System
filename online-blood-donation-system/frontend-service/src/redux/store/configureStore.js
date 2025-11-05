import { rootSaga } from '../sagas';
import { rootReducer } from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

export const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = applyMiddleware(sagaMiddleware);
    
    // Check if Redux DevTools Extension is available
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    
    const store = createStore(
        rootReducer,
        composeEnhancers(middlewares)
    );
    
    sagaMiddleware.run(rootSaga);
    return store;
}