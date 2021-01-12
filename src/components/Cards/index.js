import React, { Component } from 'react';
import Moment from 'react-moment';

//icons
import edit from "../../media/edit2.png"
import trash from "../../media/trash.png"
import check from "../../media/check.png"
//css
import "../../styles/card.css";

export default class Card extends Component {




    render() {
        const { id, text, modify, completed, date, active } = this.props.data
        const {purge, editTask, editContent, statusChange} = this.props.helper

        return (
            <div className="cardDiv">
                <div className="card">
                    <div className="options">
                        <div>
                            <select className="select-card" name="cars" id="cars" value={active} onChange={e=>statusChange(e,id)}>
                                <option value="todo" >Todo</option>
                                <option value="progress" >In Progress</option>
                                <option value="done" >Done</option>
                                <option value="fixed" >Fixed</option>
                            </select>
                        </div>
                        <div>
                            {modify?<img src={check} alt="trash..." width="16px" height="16px" onClick={() => editTask(id)}/>:
                            <img src={edit} alt="edit..." width="16px" height="16px" onClick={()=> editTask(id)}/>
                            }
                            <img src={trash} alt="trash..." width="16px" height="16px" onClick={() => purge(id)}/>
                        </div>
                    </div>
                    <div className="content">
                        {modify?<textarea value={text} onChange={e => editContent(e, id)}></textarea>:
                        <p id="text">{text}</p>
                        }
                        <p id="date">Created on <Moment format="YYYY.MM.DD">{date}</Moment> at <Moment format="HH:mm">{date}</Moment></p>
                    </div>
                </div>
            </div>
        )
    }
}
