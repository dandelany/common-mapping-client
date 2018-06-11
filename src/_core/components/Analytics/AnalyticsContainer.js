/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactGA from "react-ga";
import appConfig from "constants/appConfig";
import { AnalyticsAction } from "actions";
import MiscUtil from "_core/utils/MiscUtil";
import displayStyles from "_core/styles/display.scss";

export class AnalyticsContainer extends Component {
    componentDidMount() {
        this.batchInterval = null;
        this.checkInterval();
        if (appConfig.GOOGLE_ANALYTICS_ENABLED) {
            // Initialize basic google analytics tracking
            ReactGA.initialize(appConfig.GOOGLE_ANALYTICS_ID);
            // Initialize root page view to start collecting data
            ReactGA.pageview("/");
            // Can also use ReactGA.pageview elsewhere to note view changes
            // Can also use ReactGA.event to log custom events if desired
        }
    }

    componentDidUpdate() {
        this.checkInterval();
    }

    checkInterval() {
        if (this.props.isEnabled) {
            if (this.batchInterval === null) {
                // every 5 seconds, check to see if it's been more than 5 seconds since
                // the last analytics batch was sent. If it has, send out the current batch
                this.batchInterval = setInterval(() => {
                    if (
                        new Date() - this.props.timeLastSent >=
                        appConfig.ANALYTICS_BATCH_WAIT_TIME_MS
                    ) {
                        this.props.sendAnalyticsBatch();
                    }
                }, appConfig.ANALYTICS_BATCH_WAIT_TIME_MS);
            }
        } else {
            if (this.batchInterval !== null) {
                clearInterval(this.batchInterval);
                this.batchInterval = null;
            }
        }
    }

    render() {
        return <div className={displayStyles.hidden} />;
    }
}

AnalyticsContainer.propTypes = {
    timeLastSent: PropTypes.object.isRequired,
    isEnabled: PropTypes.bool.isRequired,
    sendAnalyticsBatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        timeLastSent: state.analytics.get("timeLastSent"),
        isEnabled: state.analytics.get("isEnabled")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        sendAnalyticsBatch: MiscUtil.bindActionCreators(
            AnalyticsAction.sendAnalyticsBatch,
            dispatch,
            AnalyticsAction
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsContainer);
