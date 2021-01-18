import React, { Component } from 'react';
import Moment from 'react-moment';

//icons
import edit from "../../media/edit2.png"
import trash from "../../media/trash.png"
import Default from "../../media/default.jpeg"
//css
import "../../styles/card.css";

export default class Card extends Component {

    render() {
        const { id, text, date, active } = this.props.data
        const { purge, editTask, statusChange } = this.props.helper
        const col = this.props.col
        return (
            <div className="cardDiv">
                <div className="card">
                    <div className="options">
                        <div>
                            <img src={Default} width="128px" height="128px"/>
                        </div>
                            <div>
                                <img src={edit} alt="edit..." width="16px" height="16px" onClick={() => editTask(id)} />
                                <img src={trash} alt="trash..." width="16px" height="16px" onClick={() => purge(id)} />
                            </div>
                        </div>
                        <div className="content">
                            <p id="text">{text}</p>
                            <p id="date">Deadline: <Moment format="YYYY.MM.DD">{date}</Moment></p>
                        </div>
                    </div>
                </div>
        )
    }
}
