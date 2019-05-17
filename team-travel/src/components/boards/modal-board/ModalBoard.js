import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from "../../layout/Button/Button";

import './modal-board.scss';
import '../styles/board-container.scss';

class ModalBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleModal: props.isVisible,
        };
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({isVisibleModal: nextProps.isVisible});
    }

    handleChange() {
        this.setState({isVisibleModal: false})
    }

    render() {
        return (
            <div id="modal" className={ this.state.isVisibleModal ? "modal-board -active" : "modal-board"}>
            <div className= "modal_width">
                <div className="board-container modal-board__container">
                    <div className="board-header">
                        <span className="board-header__title">
                            {this.props.headerTitle}
                        </span>
                        {this.props.headerButton &&
                            <Button
                            {... this.props.headerButton}
                            styleName ={"btn-bordered -light"} />
                        }
                    </div>
                    <div className="modal-board__content">
                        <div className="container--inner">
                            {this.props.innerSection}
                            <div className="modal-board__footer">
                                <div className="modal-board__footer-left"/> {/* Left side is left for now */}
                                <div className="modal-board__footer-right">
                                    
                                    <Button
                                        value={"Cancel"}
                                        id={"modal-close"}
                                        onClick={this.props.cancelOnClick}
                                        styleName={"btn-bordered -transparent"}
                                    />
                                    {!!this.props.disableActionButton || 
                                        <Button
                                            value={this.props.footerButtonValue}
                                            onClick={this.props.footerButtonOnClick}
                                            styleName={"btn-bordered"}
                                        />
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </div>
            </div>
    );
    }
}
export default ModalBoard;

ModalBoard.propTypes = {
    isVisible: PropTypes.bool,
    headerTitle: PropTypes.string,
    headerButton: PropTypes.object,
    innerSection: PropTypes.object,
    footerButtonValue: PropTypes.string,
    footerButtonOnClick: PropTypes.func,
    cancelOnClick: PropTypes.func,
};