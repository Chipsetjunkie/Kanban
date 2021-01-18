import React, { Component } from 'react';

//css
import "../../styles/modal.css"

export default class Modal extends Component {

    render() {
        let {active} = this.props
        return (
            <>
                {this.props.showModal ?
                    <div className="modal">
                        <div className="modal-background"></div>
                        <div className="modal-div">
                            <div className="modal-content">
                                {active === "tsk"?this.props.children[1]:this.props.children[0]}
                            </div>
                        </div>
                    </div> : ""
                }
            </>
        )
    }
}
