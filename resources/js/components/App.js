import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import moment from "moment";

import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
import FullCalendar from "fullcalendar-reactwrapper";
import "tippy.js/dist/tippy.css";
import tippy from "tippy.js";
import "rc-switch/assets/index.css";
import Switch from "rc-switch";

class App extends Component {
    constructor(props) {
        super(props);
        this.onSwitchChange = this.onSwitchChange.bind(this);
        const eventsMapping = event => {
            return {
                title: event.room,
                start: event.start_date,
                end: event.end_date,
                description: event.full_name,
                rendering: "background"
            };
        };
        this.state = {
            defaultDate: "2025-08-01",
            active: true,
            activeEvents: events
                .filter(e => e.room_id === 6 && e.status === "reserved")
                .map(eventsMapping),
            inactiveEvents: events
                .filter(e => e.room_id === 6 && e.status !== "reserved")
                .map(eventsMapping)
        };
    }

    onSwitchChange(value) {
        this.setState({
            active: value
        });
    }

    render() {
        const events = this.state.active
            ? this.state.activeEvents
            : this.state.inactiveEvents;
        console.log(events);
        const daysInMonth = moment(this.state.defaultDate).daysInMonth();
        let eventDays = 0;
        events.forEach(v => {
            eventDays += moment
                .duration(moment(v.end).diff(moment(v.start)))
                .asDays();
        });
        return (
            <div style={styles.container}>
                <div style={styles.alignLeft}>
                    <Switch
                        onChange={this.onSwitchChange}
                        checked={this.state.active}
                        checkedChildren={"R"}
                        unCheckedChildren={"P"}
                    />{" "}
                    Shows all pending registration
                </div>
                <FullCalendar
                    id="calendar"
                    defaultDate={this.state.defaultDate}
                    events={
                        this.state.active
                            ? this.state.activeEvents
                            : this.state.inactiveEvents
                    }
                    header={{
                        left: "",
                        center: "title",
                        right: ""
                    }}
                    eventRender={(event, element) => {
                        console.log(event);
                        tippy($(element).get(), { content: event.description });
                        return true;
                    }}
                />
                <div style={styles.alignLeft}>
                    Available Days: {daysInMonth - eventDays}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "60%"
    },
    calendar: {
        height: "80%"
    },
    alignLeft: {
        alignSelf: "flex-start",
        justifySelf: "flex-start"
    }
};

ReactDOM.render(<App />, document.getElementById("app"));
