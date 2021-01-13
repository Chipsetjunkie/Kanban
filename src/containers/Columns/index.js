import React, { Component } from 'react';
import Card from "../../components/Cards";
import { v4 as uuidv4 } from 'uuid';

//css
import "../../styles/main.css"

const COLUMNS = ["todo", "progress", "done", "fixed"]

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
        active: "all",
        search: ""
    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem("tasks"))
        if (data) {
            this.setState({ tasks: data.tasks, columns: data.columns })
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

    layoutChange = e => {
        this.setState({ active: e.target.value })
    }

    statusChange = (e, id) => {
        console.log(this.state.columns)
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
        let options = ['all'].concat(COLUMNS)
        let keypair = { "all": "All", "todo": "Todo", "progress": "In Progress", "done": "Done", "fixed": "Fixed" }
        return options.map(i => {
            if (keypair[i]) {
                return <option key={i} value={i}>{keypair[i]}</option>
            } else {
                return <option key={i} value={i}>{i}</option>
            }
        })
    }

    displayTasks = n => {
        let cleanedData = Object.entries(this.state.tasks).filter(i => i[1].text.includes(this.state.search))
        cleanedData = cleanedData.map(i => i[0])

        return COLUMNS.map(i => (
            <>{this.state.active === 'all' || this.state.active === i ?
                <div key={i}>
                    <p class="title">{i}</p>
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
            </>
        ))
    }


    render() {
        return (
            <div>
                <div className="header">
                    <div>
                        <input type="text" placeholder="Add a todo..." value={this.state.inputAdd} onChange={this.clickHandlerTask}></input>
                        <button onClick={this.createTask}>Create!!</button>
                    </div>
                    <div>
                        <input type="search" placeholder="Search for tasks" value={this.state.search} onChange={this.changeHandlerSearch}></input>
                        <select className="select-layout" name="cars" id="cars" value={this.state.active} onChange={this.layoutChange}>
                            {this.showOptions()}
                        </select>
                    </div>
                </div>
                <div className="container">
                    {this.displayTasks()}
                </div>
            </div>
        )
    }
}
