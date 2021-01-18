import React, { Component } from 'react';

//media
import Close from "../../media/close.png";

//css
import "../../styles/lanemodal.css";

export default class TaskModal extends Component {
    state = {
        title: "",
        degree: 1,
        order: [],
        cols:{},
        edit: false,
        old: null
    }

    componentDidMount() {
        let { order,cols } = this.props.data
        this.setState({ order, cols })
    }


  
    editContent = (i, deg) => {
        this.setState({ title: i, degree: deg, edit: true, old: deg-1 })

    }

    cancelEdit = () => {
        this.setState({ title: "", degree: 1, edit: false, old: null })
    }

    changeDegree = e => {
        let value = e.target.value
        let { degree, edit } = this.state
        let length = this.state.order.length
        if (value > degree) {
            if (value > (edit ? length : length + 1)) {
                console.log("not possible")
            }
            else {
                this.setState({ degree: value })
            }

        }
        else {
            if (value < 1) {
                console.log("not possible")
            }
            else {
                this.setState({ degree: value })
            }

        }
    }

    changeText = e => {
        this.setState({ title: e.target.value })

    }

    addColumn = () => {
        let ord = [...this.state.order]
        let degree = this.state.degree
        let title = this.state.title

        if (!this.state.edit){
            ord.splice(degree-1,0,title)
            this.setState({
                order:ord,
                cols:{
                    ...this.state.cols,
                    [title]:{
                        contents:[]
                    }
                }
            })
        }
        else{
            let oldKey= ord.splice(this.state.old,1)
            let cols = {...this.state.cols}
            let copyOld = cols[oldKey]
            delete cols[oldKey]
            cols[title] = copyOld
            ord.splice(degree-1,0,title)
            this.setState({
                order:ord,
                cols,
                edit:false
            })
        }
        
    }

    deleteColumn = id =>{
        let ord = [...this.state.order]
        let cols = {...this.state.cols} 
        delete cols[ord[id]]
        ord.splice(id,1)
        this.setState({
            order:ord,
            cols
        })
    }

    displayTasks = () => {
        return this.state.order.map((i, id) => {
            return (
                <div className="lane-main" key={"task" + id}>
                    <div className="lane-options">
                        <p onClick={() => this.editContent(i, id + 1)}>{id + 1}</p>
                        <img src={Close} alt="..." width="8px" height="8px" onClick={()=>this.deleteColumn(id)}></img>
                    </div>
                    <p>{i}</p>
                </div >)
        }
        )
    }


    render() {
        const { degree, title, order, cols } = this.state
        return (
            <div className="lane-manager">
                <p onClick={this.props.closeModal}>x</p>
                <div className="lane-fill">
                    <div>
                        <input placeholder="title" value={title} onChange={this.changeText}></input>
                        <input type="number" value={degree} onChange={this.changeDegree} />

                    </div>
                </div>
                <div className="lane-date">
                    <div>
                        {this.state.edit ? <><button onClick={this.cancelEdit}>Cancel</button><button onClick={this.addColumn}>Modify</button></> :
                            <><button>Cancel</button>
                            <button onClick={this.addColumn}>Add</button>
                            <button onClick={() => this.props.createColumn(cols,order)}>Apply</button>
                            </>
                        }
                    </div>
                </div>
                <div className="lane-preview">
                    {this.displayTasks()}
                </div>
            </div>
        )
    }
}
