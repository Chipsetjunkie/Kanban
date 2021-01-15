import React, { Component } from 'react'

//icon
import down from "../../media/down.png"

//css
import "../../styles/input.css";



export default class Input extends Component {
    

    render() {
        let {show, input, changeHandlerTask ,toggle, change} = this.props.data
        return (
            <div className="container-create">
            <div className="input-section">
                <div className="input-dropdown">
                    <div className="input-title" onClick={toggle}>
                        <img src={down} width="12px" height="12px" alt="down"></img>
                        <p>{input.active}</p>
                    </div>
                    {show?
                    <div className="input-options">
                        {input.options.map((i,id)=>(
                            <p key={id+i+id} onClick={()=>change(i)}>{i}</p>
                        ))}
                    </div>:""}
                </div>
                <input id="create-input" type="text" value={input.search} onChange={changeHandlerTask}></input>
            </div>
        </div>
        )
    }
}
