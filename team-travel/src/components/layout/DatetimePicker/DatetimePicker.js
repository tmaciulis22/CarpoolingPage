import React, { Component } from 'react';
import Datetime from 'react-datetime';
import PropTypes from 'prop-types';
import '../input/styles/input.scss'
import '../tooltip/styles/tooltip.scss'
import '../../../styles/icons.css'
import '../input/styles/checkbox.scss'
import './react-datetime.css'

export default class DatetimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: !!this.props.checkboxChecked
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.setState({isChecked: !(this.state.isChecked)}, () => {!!this.props.onCheck && this.props.onCheck()})
    }

    render() {
        return (
            <div className={Object.values(this.props.errorList).includes(false) ? "input -warn" : "input"}>
                <div className="input__label">
                    <div className="input__label-left">
                        { this.props.title && <span className="title">{this.props.title}</span> }
                        { this.props.checkbox &&
                            <label className="checkbox">
                                <input
                                    className="checkbox__input"
                                    type="checkbox"
                                    onChange={this.handleChange}
                                    disabled={this.props.checkboxDisabled}
                                    checked={this.state.isChecked}
                                />
                                <span className="checkbox__checkmark icon checkmark-white"/>
                            </label>
                        }
                    </div>
                    {this.props.tooltipText &&
                    <div className="tooltip">
                        <span className="tooltip__launcher icon info"/>
                        <div className="tooltip__content">
                            {this.props.tooltipText}
                        </div>
                    </div>
                    }
                </div>
                <div className="input__field">
                        <Datetime 
                            closeOnSelect={this.props.closeOnSelect}
                            inputProps={{...this.props.input, disabled: this.props.checkbox && !this.state.isChecked}}
                            isValidDate={this.props.isValidDate}
                            onChange={this.props.onChange}
                            value={this.props.value}
                            timeFormat={this.props.timeFormat}
                        />
                    <span className="icon calendar" onClick={ this.props.onClickIcon }/>
                </div>
            </div>
        )
    }
}

DatetimePicker.propTypes = {
    errorList: PropTypes.object,
    title: PropTypes.string,
    checkbox: PropTypes.bool,
    tooltipText: PropTypes.string,
    name: PropTypes.string,
    defaultValue: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    checkboxDisabled: PropTypes.bool,
    checkboxChecked: PropTypes.bool,
    onCheck: PropTypes.func,
    closeOnSelect: PropTypes.bool
};