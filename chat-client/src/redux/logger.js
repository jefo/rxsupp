import Immutable from 'immutable';
import { createLogger } from 'redux-logger';

export default createLogger({
    stateTransformer: (state) => {
        let newState = {};
        for (var i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }
        return newState;
    }
});
