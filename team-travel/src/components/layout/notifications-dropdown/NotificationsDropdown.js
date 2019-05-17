import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './styles/dropdown-styles.scss';
import { confirmTrip } from "../../../actions/tripsListActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const DropdownSize = 3;
const MaxDropdownSize = 10;

class NotificationsDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: this.prepareNotifications(props.notifications),
            showNotifications: false
        };
        this.changeNotificationsState = this.changeNotificationsState.bind(this);
        this.onActionClick = this.onActionClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.renderNotifications = this.renderNotifications.bind(this);
        this.prepareNotifications = this.prepareNotifications.bind(this);
        this.getNotificationsToShow = this.getNotificationsToShow.bind(this);
    }

    filterNewNotifications(notification) {
        return this.state.notifications.some(oldNotification => oldNotification.id === notification.id)
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({notifications: [...this.prepareNotifications(
                this.props.notifications.filter( notification => !this.filterNewNotifications(notification))), ...this.state.notifications]
            })
        }
    }

    prepareNotifications(notifications) {
        return notifications.sort((a, b) => { return b.id - a.id });
    }

    getNotificationsToShow() {
        let notificationsToShow = this.state.notifications.filter(notification => !notification.seen).slice(0, MaxDropdownSize);
        if (notificationsToShow.length < DropdownSize)
            this.state.notifications.some(notification => {
                if (notification.seen)
                    notificationsToShow.push(notification);
                return notificationsToShow.length >= DropdownSize;
            });
        return notificationsToShow;
    }

    changeNotificationsState() {
        this.setState({
            showNotifications: !!this.state.notifications && this.state.notifications.length > 0 && !this.state.showNotifications
        });
    }

    async onActionClick(notificationUrl) {
        // update trip with url
        let succeeded = await this.props.confirmTrip(notificationUrl);

        let slicedUrl = notificationUrl.substring(0, notificationUrl.indexOf("response=")+9);
        if(succeeded)
            this.setState({
                notifications: this.state.notifications.filter(notification => notification.url !== slicedUrl)
            });
    }

    onMouseDown(e) {
        !this.dropDown.contains(e.target) &&
            this.setState({
                showNotifications: false
            });
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.onMouseDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.onMouseDown, false);
    }

    renderNotifications() {
        return this.getNotificationsToShow().map(notification => {
            let oldSeen = notification.seen;
            const textParts = notification.text.split(':');

            if (!notification.isActionable)
                notification.seen = true;

            return(
                <li className={oldSeen ? "drop-down__item_seen" : "drop-down__item"} key={notification.id}>
                    {!!notification.text &&
                        (notification.isActionable ?
                        <span className="drop-down__item__text">
                            {textParts[0] + ' '}
                            <span>{textParts[1]}</span>
                        </span>
                        :
                        <span className="drop-down__item__text">
                            <span>{textParts[0]}</span>
                            {' ' + textParts[1] + ' '}
                            <span>{textParts[2]}</span>
                        </span>)}
                    {notification.isActionable &&
                        <div className="item__buttons">
                            <Button
                                styleName="btn-action"
                                value="Yes"
                                onClick={() => this.onActionClick(notification.url + "yes")}
                            />
                            <Button
                                styleName="btn-action"
                                value="No"
                                onClick={() => this.onActionClick(notification.url + "no")}
                            />
                        </div>}
                </li>
            );
        });
    }

    render() {
        let unseenNotifications = this.state.notifications.filter(notif => !notif.seen);
        return (
            <div className="drop-down" ref={node => this.dropDown = node}>
                <Button
                    styleName={!this.state.showNotifications && (!this.state.notifications || unseenNotifications.length === 0) ? "drop-down__button icon bell" :
                        !this.state.showNotifications && unseenNotifications.length > 0 ? "drop-down__button icon bell-warn" :
                        this.state.showNotifications && unseenNotifications.length > 0 ? "drop-down__button__active icon bell-warn" : "drop-down__button__active icon bell"}
                    onClick={this.changeNotificationsState}
                />
                {this.state.showNotifications &&
                    <ul className="drop-down__list" >
                        {this.renderNotifications()}
                    </ul>}
            </div>
        );
    }
}

NotificationsDropdown.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            "id": PropTypes.number.isRequired,
            "isActionable": PropTypes.bool,
            "text": PropTypes.string
        })
    )
};

export default connect(
    null,
    dispatch =>
        bindActionCreators(
            {
                confirmTrip,
            },
            dispatch
        )
)(NotificationsDropdown);
