import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

//css
import "../../styles/header.css"

//icon
import down from "../../media/down.png"


export default class Header extends Component {
   
    render() {
        const {percentage} = this.props
        const { showOptions, toggle, modalOpen, length } = this.props.data
        return (
            <div className="header">
                <div className="modal-buttons">
                    <button onClick={() => modalOpen("col")}>
                        Create Column
                    </button>
                    {length === 0 ? <button type="button" onClick={() => modalOpen("tsk")} disabled>Create Task</button> :
                        <button type="button" onClick={() => modalOpen("tsk")}>Create Task</button>
                    }
                </div>
                <div>
                    <div>
                        <div className="dropdown-header">
                            <p style={showOptions ? { "opacity": 0.5 } : {}}>Search and filter</p>
                            <img src={down} alt='arrow-down' width="12px" height="12px" onClick={toggle}></img>
                        </div>
                        {showOptions ? this.props.children : ""}
                    </div>
                    <div>
                        <div className="header-progress">
                            <CircularProgressbar
                                value={percentage}
                                text={`${percentage}%`}
                                styles={buildStyles({
                                    rotation: 1,
                                    textColor: 'black',
                                    pathColor: `rgba(103, 25, 148, ${percentage / 100})`,
                                    trailColor: 'rgb(220,220,230)'
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
