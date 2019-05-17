import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/btn-styles.scss';

class Button extends Component {
  render() {
    return (
      <button 
        className = {this.props.styleName}
        onClick = {this.props.onClick}
        onSubmit = { this.props.onSubmit}
        disabled = {this.props.isDisabled}
        type={this.props.setType}
      >
        {this.props.value}
      </button>
    );
  }
}

Button.propTypes = {
    styleName: PropTypes.string,
    onClick: PropTypes.func,
    onSubmit: PropTypes.func,
    isDisabled: PropTypes.bool, 
    value: PropTypes.string,
    
}

Button.defaultProps ={
  styleName: "btn-bordered"
}

export default Button;
