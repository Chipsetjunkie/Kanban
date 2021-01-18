import React, { Component } from 'react'

//css
import "../../styles/header.css"

//icon
import down from "../../media/down.png"


export default class Header extends Component {
    render() {
        const { showModal, toggle, modalOpen, length } = this.props.data
        return (
            <div className="header">
                <div className="modal-buttons">
                    <button onClick={() => modalOpen("col")}>
                        Create Column
                    </button>
                    {length === 0 ? <button type="button" onClick={() => modalOpen("tsk")} disabled>Create Task</button>:
                        <button type="button" onClick={() => modalOpen("tsk")}>Create Task</button>
                    }
                </div>
                <div>
                    <div className="dropdown-header">
                        <p style={showModal ? { "opacity": 0.5 } : {}}>Search and filter</p>
                        <img src={down} alt='arrow-down' width="12px" height="12px" onClick={toggle}></img>
                    </div>
                    {showModal ? this.props.children[1] : ""}
                </div>
            </div>
        )
    }
}
