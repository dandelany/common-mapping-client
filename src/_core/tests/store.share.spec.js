/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { AppAction } from "_core/actions";
import { createStore } from "redux";
import { expect } from "chai";
import rootReducer from "_core/reducers";
import { mapState, layerModel, paletteModel } from "_core/reducers/models/map";
import { asyncState } from "_core/reducers/models/async";
import { helpState } from "_core/reducers/models/help";
import { shareState } from "_core/reducers/models/share";
import { settingsState } from "_core/reducers/models/settings";
import { dateSliderState } from "_core/reducers/models/dateSlider";
import { analyticsState } from "_core/reducers/models/analytics";
import { viewState } from "_core/reducers/models/view";
import { layerInfoState } from "_core/reducers/models/layerInfo";
import { webWorkerState } from "_core/reducers/models/webWorker";
import TestUtil from "_core/tests/TestUtil";

const initialState = {
    map: mapState,
    view: viewState,
    asynchronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState,
    webWorker: webWorkerState
};

export const StoreShareSpec = {
    name: "StoreSharesSpec",
    tests: {
        default: {
            test1: () => {
                it("enables auto update url", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [AppAction.setAutoUpdateUrl(true)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.share = expected.share.set("autoUpdateUrl", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test2: () => {
                it("disables auto update url", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        AppAction.setAutoUpdateUrl(true),
                        AppAction.setAutoUpdateUrl(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.share = expected.share.set("autoUpdateUrl", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },
            test3: () => {
                it("can open the share container.", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [AppAction.setShareOpen(true)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.share = expected.share.set("isOpen", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },
            test4: () => {
                it("can close the share container.", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [AppAction.setShareOpen(false)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.share = expected.share.set("isOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test5: () => {
                it("can open and close the share container.", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [AppAction.setShareOpen(true), AppAction.setShareOpen(false)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.share = expected.share.set("isOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
