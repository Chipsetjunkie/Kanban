import React, { Component } from 'react'

//css
import "../../styles/input.css";



export default class Input extends Component {

    render() {
        const { onChange, title, value, name } = this.props
        return (
            <div className="container-create">
                <div className="input-section">
                    <div className="input-dropdown">
                        <div className="input-title">
                            <p>{title}</p>
                        </div>
                    </div>
                    <input id="create-input" type="text" name={name} value={value} onChange={onChange}></input>
                </div>
            </div>
        )
    }
}
