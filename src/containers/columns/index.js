import React, { Component, Fragment } from 'react';
import Card from "../../components/cards";
import Header from "../../components/header";
import DropDown from "../dropdown";
import { v4 as uuidv4 } from 'uuid';

//css
import "../../styles/main.css"
import "../../styles/dropdown.css"

export default class Columns extends Component {
    state = {
        inputAdd: '',
        tasks: {},
        columns: {
            "todo": {
                contents: []
            },
            "progress": {
                contents: []
            },
            "done": {
                contents: []
            },
            "fixed": {
                contents: []
            },
        },
        drop: { search: "", active: [] },
        show: false

    }

    componentDidMount() {
        // encodeURIComponent() 
        const data = JSON.parse(localStorage.getItem("tasks"))
        let params = new URLSearchParams(window.location.search.slice(1));
        let search = params.get('q')
        const keys = {"todo":0,"progress":1,"done":2,"fixed":3}
        let active = params.get('selected')
        
        if ( search || active) {
            active = active? JSON.parse(active).map(i=>keys[i]):[]
            if (data) {
                this.setState({ tasks: data.tasks, columns: data.columns, drop:{search, active}})
            }
        }else{
            if (data) {
                this.setState({ tasks: data.tasks, columns: data.columns })
            }
        }
    }

    componentDidUpdate() {
        const data = { tasks: this.state.tasks, columns: this.state.columns }
        localStorage.setItem("tasks", JSON.stringify(data));
    }


    clickHandlerTask = e => {
        this.setState({ inputAdd: e.target.value })
    }


    changeHandlerSearch = e => {
        this.setState({ search: e.target.value })
    }
    // *BUG anomalous state change
    layoutSubmitHandler = data => {
        const keys = {0:"todo",1:"progress",2:"done",3:"fixed"}
        const active = data.active.map(i=>keys[i])
        const q = "?q="+data.search
        const selected = "selected="+JSON.stringify(active)
        window.history.pushState(null, null, q+'&'+selected)
        this.setState({ drop: data })
    }

    toggleDropdown = () => {
        this.setState({ show: !this.state.show })
    }

    createTask = () => {
        const id = uuidv4()
        const i = this.state.inputAdd
        this.setState({
            inputAdd: '', tasks: {
                ...this.state.tasks,
                ["task_" + id]: {
                    id,
                    text: i,
                    date: Date(),
                    modify: false,
                    active: "todo"
                }
            },
            columns: {
                ...this.state.columns,
                "todo": {
                    contents: [
                        ...this.state.columns["todo"].contents,
                        id
                    ]
                }
            }
        })
    }

    deleteTask = id => {

        const active = this.state.tasks['task_' + id].active
        const updateTask = Object.assign(this.state.tasks, {})
        delete updateTask['task_' + id]
        const updated_content = this.state.columns[active].contents.filter(i => i !== id)
        this.setState({
            tasks: updateTask,
            columns: {
                ...this.state.columns,
                [active]: {
                    contents: updated_content
                }
            }
        })

    }

    editTask = id => {
        const updateTasks = Object.assign(this.state.tasks, {})
        const task = updateTasks['task_' + id]
        task.modify = !task.modify
        updateTasks['task_' + id] = task
        this.setState({ tasks: updateTasks })
    }

    editTaskContent = (e, id) => {
        const updateTasks = Object.assign(this.state.tasks, {})
        const task = updateTasks['task_' + id]
        task.text = e.target.value
        updateTasks['task_' + id] = task
        this.setState({ tasks: updateTasks })
    }

    statusChange = (e, id) => {
        const task = this.state.tasks['task_' + id]
        const prevActive = task.active
        const updatedContent = this.state.columns[prevActive].contents.filter(i => i !== id)
        task.active = e.target.value
        this.setState({
            tasks: {
                ...this.state.tasks,
                ['task_' + id]: task
            },
            columns: {
                ...this.state.columns,
                [prevActive]: {
                    contents: updatedContent
                },
                [e.target.value]: {
                    contents: [
                        ...this.state.columns[e.target.value].contents,
                        id
                    ]
                }
            }
        })
    }

    showOptions = () => {
        let options = ['all'].concat(Object.keys(this.state.columns))
        let keypair = { "all": "All", "todo": "Todo", "progress": "In Progress", "done": "Done", "fixed": "Fixed" }
        return options.map(i => {
            if (keypair[i]) {
                return <option key={i + "option"} value={i}>{keypair[i]}</option>
            } else {
                return <option key={i + "option"} value={i}>{i}</option>
            }
        })
    }

    displayTasks = () => {
        let cleanedData = Object.entries(this.state.tasks).filter(i => i[1].text.includes(this.state.drop.search))
        cleanedData = cleanedData.map(i => i[0])
        return Object.keys(this.state.columns).map((i, id) => (
            <Fragment key={i + "div"}>
                {this.state.drop.active.length === 0 || this.state.drop.active.includes(id) ?
                    <div>
                        <p className="title">{i}</p>
                        {
                            this.state.columns[i].contents.map(j => {
                                if (cleanedData.includes('task_' + j)) {
                                    const data = this.state.tasks['task_' + j]
                                    return <Card
                                        key={j}
                                        data={data}
                                        helper={{ purge: this.deleteTask, statusChange: this.statusChange, editTask: this.editTask, editContent: this.editTaskContent }}
                                    />
                                }
                                else {
                                    return ""
                                }
                            })}

                    </div> : ""}
            </Fragment>
        ))

    }


    render() {
        return (
            <div>
                <Header
                    data={{
                        inputAdd: this.inputAdd,
                        clickHandlerTask: this.clickHandlerTask,
                        createTask: this.createTask,
                        show: this.state.show,
                        toggle: this.toggleDropdown
                    }}
                >
                    <DropDown
                        data={Object.keys(this.state.columns)}
                        submitHandler={this.layoutSubmitHandler}
                        inputData={Object.assign(this.state.drop,{})}
                        toggle={this.toggleDropdown}
                    />
                </Header>
                <div className="container">
                    {this.displayTasks()}
                </div>
            </div>
        )
    }
}
