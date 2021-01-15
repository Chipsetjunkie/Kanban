import React, { Component } from 'react'
//css
import "../../styles/header.css"

//icon
import down from "../../media/down.png"


export default class Header extends Component {
    render() {
        const { inputAdd, clickHandlerTask, createTask, show, toggle } = this.props.data

        return (
            <div className="header">
                <div>
                    <input id="task-input" type="text" placeholder="Add a todo..." value={inputAdd} onChange={clickHandlerTask}></input>
                    <button onClick={createTask}>Create!!</button>
                </div>
                <div>
                    <div className="dropdown-header">
                        <p style={show ? { "opacity": 0.5 } : {}}>Search and filter</p>
                        <img src={down} alt='arrow-down' width="12px" height="12px" onClick={toggle}></img>
                    </div>
                    {show?this.props.children:""}
                </div>
            </div>
        )
    }
}
