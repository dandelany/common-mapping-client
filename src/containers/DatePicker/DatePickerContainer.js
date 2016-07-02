import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '../../actions/MapActions';
import * as appConfig from '../../constants/appConfig';
import MiscUtil from '../../utils/MiscUtil';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';

export class DatePickerContainer extends Component {
    incrementDate(resolution, increment = true) {
        let newDate = moment(this.props.date);
        if (increment) {
            newDate = newDate.add(1, resolution);
        } else {
            newDate = newDate.subtract(1, resolution);
        }

        let minDate = moment(appConfig.MIN_DATE);
        let maxDate = moment(appConfig.MAX_DATE);

        if (newDate.isBetween(minDate, maxDate)) {
            this.props.actions.setDate(newDate.toDate());
        }
    }
    updateDate(resolution, value) {
        let date = moment(this.props.date);
        let newDate = date.format("YYYY-MMM-DD");
        if (resolution === "days") {
            newDate = date.format("YYYY-MMM") + "-" + value;
        } else if (resolution === "months") {
            newDate = date.format("YYYY") + "-" + value + "-" + date.format("DD");
        } else if (resolution === "years") {
            newDate = value + "-" + date.format("MMM-DD");
        }
        newDate = moment(newDate, "YYYY-MMM-DD");

        let minDate = moment(appConfig.MIN_DATE);
        let maxDate = moment(appConfig.MAX_DATE);


        if (newDate.isBetween(minDate, maxDate)) {
            this.props.actions.setDate(newDate.toDate());
        } else {
            this.props.actions.setDate(date.toDate());
        }
    }
    render() {
        let date = moment(this.props.date);
        let year = date.format("YYYY");
        let month = date.format("MMM");
        let day = date.format("DD");

        // TODO - get this into a config or something somewhere
        let yearArr = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"];
        let monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let dayArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        return (
            <div id="datePickerContainer" className="row middle-xs">
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowLeft" onKeyHandle={() => {this.incrementDate("days",false)}} />
            <KeyHandler keyEventName={KEYUP} keyValue="ArrowRight" onKeyHandle={() => {this.incrementDate("days",true)}} />
                <div className="date-picker-selection col-xs-5">
                    <div className="date-picker-selection-increment">
                        <Button neutral inverse icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("years", true)}/>
                    </div>
                    <Autocomplete
                      direction="up"
                      onChange={(value) => this.updateDate("years", value)}
                      label=""
                      multiple={false}
                      source={yearArr}
                      value={year}
                    />
                    <div className="date-picker-selection-increment">
                        <Button neutral inverse icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("years", false)}/>
                    </div>
                </div>
                <div className="date-picker-selection col-xs-4">
                    <div className="date-picker-selection-increment">
                        <Button neutral inverse icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("months", true)}/>
                    </div>
                    <Autocomplete
                      direction="up"
                      onChange={(value) => this.updateDate("months", value)}
                      label=""
                      multiple={false}
                      source={monthArr}
                      value={month}
                    />
                    <div className="date-picker-selection-increment">
                        <Button neutral inverse icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("months", false)}/>
                    </div>
                </div>
                <div className="date-picker-selection col-xs-3">
                    <div className="date-picker-selection-increment">
                        <Button neutral inverse icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("days", true)}/>
                    </div>
                    <Autocomplete
                      direction="up"
                      onChange={(value) => this.updateDate("days", value)}
                      label=""
                      multiple={false}
                      source={dayArr}
                      value={day}
                    />
                    <div className="date-picker-selection-increment">
                        <Button neutral inverse icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("days", false)}/>
                    </div>
                </div>
            </div>
        );
    }
}

DatePickerContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatePickerContainer);