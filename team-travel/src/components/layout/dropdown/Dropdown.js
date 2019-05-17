import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/select.scss';
import './styles/checkbox.scss'
import '../tooltip/styles/tooltip.scss'

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.checkboxChecked,
        };
        this.handleChange = this.handleChange.bind(this);
      }

    renderOptions(options){
        const renderedOptions = Array(options.length);

        for(let value of options){
            renderedOptions.push(
                <option 
                    value={value} 
                    key={value}
                > 
                    {value}
                </option>
            )
        }
        return renderedOptions;
    }

    handleChange(){ 
        this.setState({isChecked: !(this.state.isChecked)})
    }

    render() {
        return (
            <div className={this.props.warn ? "select -warn" : "select"} >
                <div className="select__label">
                    <div className="select__label-left">
                        { this.props.title && <span className="title">{this.props.title}</span> }
                        { this.props.checkbox &&
                            <label className="checkbox">
                                <input 
                                    className={"checkbox__input"} 
                                    type="checkbox" 
                                    onChange={this.handleChange}
                                    disabled={this.props.checkboxDisabled}
                                    checked={!!this.state.isChecked}
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
                <div className="select__field">
                    <select 
                        name={this.props.name} 
                        id={this.props.id} 
                        onChange={this.props.onChange} 
                        disabled={this.props.checkbox && !this.state.isChecked}
                        defaultValue={this.props.defaultValue}
                        value={this.props.value}
                    >
                        {this.renderOptions(this.props.options)}
                    </select>
                    <span className="icon arrow-down" />
                </div>
            </div>
        );
    }
}

Dropdown.propTypes = {
    title: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    checkbox: PropTypes.bool,
    checkboxChecked: PropTypes.bool,
    checkboxDisabled: PropTypes.bool,
    tooltipText: PropTypes.string,
    warn: PropTypes.bool,
}

export default Dropdown;