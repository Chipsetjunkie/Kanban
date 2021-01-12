import React, { Component } from 'react';
import Card from "../../components/Cards";
import { v4 as uuidv4 } from 'uuid';

//css
import "../../styles/main.css"

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
        }

    }

    clickHandlerTask = e => {
        this.setState({ inputAdd: e.target.value })
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
                    completed: false,
                    date: Date(),
                    modify: false,
                    active: "todo"
                }
            },
            columns: {
                ...this.state.columns,
                "todo": {
                    contents: [
                        ...this.state.columns.todo.contents,
                        id
                    ]
                }
            }
        })
    }

    deleteTask = id => {

        const active = this.state.tasks['task_' + id].active
        const update_task = Object.assign(this.state.tasks, {})
        delete update_task['task_' + id]
        const updated_content = this.state.columns[active].contents.filter(i => i !== id)
        this.setState({
            tasks: update_task,
            columns: {
                ...this.state.columns,
                [active]: {
                    contents: updated_content
                }
            }
        })

    }

    editTask = id => {
        const updated = this.state.list.map(i => {
            if (i.id === id) {
                i.modify = !i.modify
            }
            return i
        })
        this.setState({ list: updated })
    }

    editTaskContent = (e, id) => {
        const updated = this.state.list.map(i => {
            if (i.id === id) {
                i.text = e.target.value
            }
            return i
        })
        this.setState({ list: updated })
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

    displayTasks = n => {
        switch (n) {
            case 1:
                return this.state.columns.todo.contents.map(i => {
                    const data = this.state.tasks['task_' + i]
                    console.log(i,"todo")
                    return <Card
                        key={i}
                        data={data}
                        helper={
                            { purge: this.deleteTask },
                            { statusChange: this.statusChange }}
                    />
                })

            case 2:
                return this.state.columns.progress.contents.map(i => {
                    const data = this.state.tasks['task_' + i]
                    console.log(i,"p")
                   
                    return <Card
                        key={i}
                        data={data}
                        helper={
                            { purge: this.deleteTask },
                            { statusChange: this.statusChange }}
                    />
                })
            case 3:
                return this.state.columns.done.contents.map(i => {
                    const data = this.state.tasks['task_' + i]
                    return <Card
                        key={i}
                        data={data}
                        helper={
                            { purge: this.deleteTask },
                            { statusChange: this.statusChange }}
                    />
                })
            case 4:
                return this.state.columns.fixed.contents.map(i => {
                    const data = this.state.tasks['task_' + i]
                    return <Card
                        key={i}
                        data={data}
                        helper={
                            { purge: this.deleteTask },
                            { statusChange: this.statusChange }}
                    />
                })
            default:
                return
        }
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
                        <select></select>
                    </div>
                </div>
                <div className="container">
                    <div className="ToDo">
                        {this.displayTasks(1)}
                    </div>
                    <div className="InProgress">
                        {this.displayTasks(2)}
                    </div>
                    <div className="Done">
                        {this.displayTasks(3)}
                    </div>
                    <div className="Fixed">
                        {this.displayTasks(4)}
                    </div>
                </div>
            </div>
        )
    }
}
