import React, { Component } from 'react';
import DatePicker from "react-datepicker";

import Input from "../input"

//media
import Default from "../../media/default.jpeg";
import Button from "../../media/check.png";

//css
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/taskmodal.css";


export default class index extends Component {

    state = {
        date: new Date(),
        title: "",
        image: "",
        edit: false,
        id: null
    }

    componentDidMount() {
        this.setState({ ...this.props.newTask })
    }


    changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value })
    }


    setStartDate = date => {
        this.setState({ date: date })
    }

    render() {
        const { date, title, image } = this.state
        return (
            <div className="task-modal">
                <div className="task-close">
                    <p onClick={this.props.closeModal}>x</p>
                </div>
                <div className="task-main">
                    <div>
                        <img src={Default} alt="..." width="128px" height="128px" />
                    </div>
                    <div>
                        <Input type={"text"} title={"Title"} value={title} name={"title"} onChange={this.changeHandler} />
                        <Input type={"text"} title={"Image"} value={image} name={"image"} onChange={this.changeHandler} /> 
                        {date?<DatePicker selected={typeof(date)==="object"?date:new Date(date)} onChange={date => this.setStartDate(date)} />: 
                            <DatePicker selected={new Date()} onChange={date => this.setStartDate(date)} />
                        }
                    </div>
                </div>
                <div>
                    <img src={Button} alt="..." onClick={() => this.props.createTask(this.state)} width="48px" height="48px" />
                </div>
            </div>
        )
    }
}
