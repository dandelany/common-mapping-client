import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as appConfig from '../../constants/appConfig';
import * as appStrings from '../../constants/appStrings';
import * as DateSliderActions from '../../actions/DateSliderActions';
import TimeAxisD3 from '../../utils/TimeAxisD3';
import MiscUtil from '../../utils/MiscUtil';
import SingleDate from './SingleDate';

export class TimeAxis extends Component {
    componentDidMount() {
        let sizes = this.getSizes();

        // get D3 wrapper
        this.timeAxisD3 = new TimeAxisD3({
            selectNode: ReactDOM.findDOMNode(this),
            minDt: appConfig.MIN_DATE,
            maxDt: appConfig.MAX_DATE,
            elementWidth: sizes.elementWidth,
            elementHeight: sizes.elementHeight,
            margin: sizes.margin,
            symbolWidth: 0,
            onClick: (value) => { this.handleSingleDateDragEnd(value); },
            onHover: (value) => { this.handleTimelineHover(value); },
            onMouseOut: () => { this.handleTimeLineMouseOut(); }
        });

        // get it going
        this.timeAxisD3.enter();

        window.addEventListener("resize", () => {
            let options = this.getSizes();
            options.date = this.props.date;
            this.timeAxisD3.resize(options);
        });
    }
    componentWillUpdate() {
        // track the resolution changes because changing the date also triggers and update
        // but we don't want to change the resolution for that
        this.cachedResolutionHack = this.props.resolutionHack;
    }
    componentDidUpdate() {
        let options = { date: this.props.date };
        if (this.props.resolutionHack !== this.cachedResolutionHack) {
            let scale = 1;
            if (this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.DAYS) {
                scale = 256;
            } else if (this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS) {
                scale = 16;
            } else if (this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.YEARS) {
                scale = 1;
            }
            options.scale = scale;
        }
        this.timeAxisD3.update(options);
    }
    handleTimeLineMouseOut() {
        this.props.actions.timelineMouseOut();
    }
    handleTimelineHover(xValue) {
        let date = this.timeAxisD3.getDateFromX(xValue);
        this.props.actions.hoverDate(date, xValue);
    }
    handleSingleDateDragStart() {
        this.props.actions.beginDragging();

        this.scrubUpdateInterval = setInterval(() => {
            if (typeof this.lastDrag !== "undefined") {
                let newDate = this.timeAxisD3.getDateFromX(this.lastDrag);
                this.props.actions.setDate(newDate);
            }
        }, 250);
    }
    handleSingleDateDragEnd(value) {
        if(typeof this.scrubUpdateInterval !== "undefined") {
            clearInterval(this.scrubUpdateInterval);
        }

        let newDate = this.timeAxisD3.getDateFromX(value);
        this.props.actions.dragEnd(newDate);
    }
    handleSingleDateDragUpdate(value) {
        // let newDate = this.timeAxisD3.getDateFromX(value);
        // this.props.actions.setDate(newDate);
        this.lastDrag = value;
    }
    autoScroll(toLeft) {
        this.timeAxisD3.autoScroll(toLeft);
    }
    getSizes() {
        // IMPORTANT: these sizes seem to have to be hardcoded
        // cannot pull from CSS as components are not mounted yet
        let elementWidth = window.innerWidth;
        let elementHeight = 50;
        let margin = {
            top: 0,
            right: 60,
            bottom: 18,
            left: 200 // there is a bug where auto-scrolling breaks to the left with left == 0, so keep it >= 1
        };

        let width = elementWidth - (margin.left + margin.right);
        let height = elementHeight - (margin.top + margin.bottom);

        return {
            elementWidth,
            elementHeight,
            width,
            height,
            margin
        };
    }
    render() {
        let autoScrollInterval = null;
        let sizes = this.getSizes();
        let axisClassNames = MiscUtil.generateStringFromSet({
            timeAxis: true,
            dragging: this.props.isDragging
        });
        return (
            <g className={axisClassNames}>
                <clipPath id="chart-content">
                    <rect></rect>
                </clipPath>
                <rect id="chart-bounds"></rect>
                <g id="x-axis"></g>
                <defs>
                    <filter id="dropshadowFilter" x="-10%" y="-10%" height="150%" width="150%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                        <feOffset dx="0" dy="1" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path className="timeline-horiz-axis" />
                <SingleDate
                    date={this.props.date}
                    isDragging={this.props.isDragging}
                    beforeDrag={() => {
                        clearInterval(autoScrollInterval);
                        this.handleSingleDateDragStart();
                    }} 
                    onDrag={(x, scrollFlag) => {
                        clearInterval(autoScrollInterval);

                        // let distFromBucket = (x - sizes.margin.left) % 5;
                        // this.handleSingleDateDragUpdate(x - distFromBucket);
                        this.handleSingleDateDragUpdate(x);

                        if(scrollFlag > 0) {
                            autoScrollInterval = setInterval(() => {
                                this.autoScroll(true);
                            }, 50);
                        } else if(scrollFlag < 0) {
                            autoScrollInterval = setInterval(() => {
                                this.autoScroll(false);
                            }, 50);
                        }
                    }}
                    afterDrag={(value) => {
                        clearInterval(autoScrollInterval);
                        this.handleSingleDateDragEnd(value);
                    }}
                    maxX={sizes.margin.left + sizes.width}
                    minX={sizes.margin.left}
                />
            </g>
        );
    }
}
TimeAxis.propTypes = {
    date: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired,
    resolution: PropTypes.string.isRequired,
    resolutionHack: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date"),
        isDragging: state.dateSlider.get("isDragging"),
        resolution: state.dateSlider.get("resolution"),
        resolutionHack: state.dateSlider.get("resolutionHack")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(DateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeAxis);
