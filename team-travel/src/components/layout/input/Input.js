import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/input.scss';
import '../tooltip/styles/tooltip.scss'
import '../../../styles/icons.css'
import './styles/checkbox.scss'

export default class Input extends Component {
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
                    <input
                        disabled={this.props.checkbox && !this.state.isChecked}
                        { ...this.props.input }
                     />
                    { this.props.icon &&
                    <span className={this.props.icon} onClick={ this.props.onClickIcon }/>
                    }
                </div>
            </div>
        )
    }
}

Input.propTypes = {
    errorList: PropTypes.object,
    title: PropTypes.string,
    checkbox: PropTypes.bool,
    tooltipText: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    defaultValue: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    minLength: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    maxLength: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    min: PropTypes.string,
    max: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    icon: PropTypes.oneOf([
        'icon arrow-blue',
        'icon skip-blue',
        'icon arrow-gray',
        'icon skip-gray',
        'icon arrow-down',
        'icon search',
        'icon bell',
        'icon bell-warn',
        'icon calendar',
        'icon clock',
        'icon info',
        'icon plus',
        'icon cross'
    ]),
    checkboxDisabled: PropTypes.bool,
    checkboxChecked: PropTypes.bool,
    onClickIcon: PropTypes.func,
    onCheck: PropTypes.func
};