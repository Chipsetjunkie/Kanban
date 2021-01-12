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
        },
        active: "all",
        search: ""
    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem("tasks"))
        if (data) {
          this.setState({ tasks: data.tasks, columns: data.columns})
        }

    }

    componentDidUpdate() {
        const data = {tasks:this.state.tasks, columns:this.state.columns}
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
        const task= updateTasks['task_'+id]
        task.modify = !task.modify
        updateTasks['task_'+id] = task
        this.setState({ tasks: updateTasks })
    }

    editTaskContent = (e, id) => {
        const updateTasks = Object.assign(this.state.tasks, {})
        const task= updateTasks['task_'+id]
        task.text = e.target.value
        updateTasks['task_'+id] = task
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

    displayTasks = n => {
        let cleanedData = Object.entries(this.state.tasks).filter(i => i[1].text.includes(this.state.search))
        cleanedData = cleanedData.map(i => {
            return i[0]
        })
        switch (n) {
            case 1:
                return this.state.columns.todo.contents.map(i => {
                    if (cleanedData.includes('task_' + i)) {

                        const data = this.state.tasks['task_' + i]
                        return <Card
                            key={i}
                            data={data}
                            helper={{ purge: this.deleteTask, statusChange: this.statusChange, editTask:this.editTask, editContent:this.editTaskContent }}
                        />
                    }
                    else{
                        return ""
                    }
                })

            case 2:
                return this.state.columns.progress.contents.map(i => {
                    if (cleanedData.includes('task_' + i)) {

                        const data = this.state.tasks['task_' + i]
                        return <Card
                            key={i}
                            data={data}
                            helper={{ purge: this.deleteTask, statusChange: this.statusChange, editTask:this.editTask, editContent:this.editTaskContent }}
                        />
                    }else{
                        return ""
                    }
                })
            case 3:
                return this.state.columns.done.contents.map(i => {
                    if (cleanedData.includes('task_' + i)) {

                        const data = this.state.tasks['task_' + i]
                        return <Card
                            key={i}
                            data={data}
                            helper={{ purge: this.deleteTask, statusChange: this.statusChange, editTask:this.editTask, editContent:this.editTaskContent }}
                        />
                    }else{
                        return ""
                    }
                })
            case 4:
                return this.state.columns.fixed.contents.map(i => {
                    if (cleanedData.includes('task_' + i)) {

                        const data = this.state.tasks['task_' + i]
                        return <Card
                            key={i}
                            data={data}
                            helper={{ purge: this.deleteTask, statusChange: this.statusChange, editTask:this.editTask, editContent:this.editTaskContent }}
                        />
                    }else{
                        return ""
                    }
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
                        <input type="search" placeholder="Search for tasks" value={this.state.search} onChange={this.changeHandlerSearch}></input>
                        <select className="select-layout" name="cars" id="cars" value={this.state.active} onChange={this.layoutChange}>
                            <option value="all" >All</option>
                            <option value="todo" >Todo</option>
                            <option value="progress" >In Progress</option>
                            <option value="done" >Done</option>
                            <option value="fixed" >Fixed</option>
                        </select>
                    </div>
                </div>
                <div className="container">
                    {this.state.active === 'all' || this.state.active === 'todo' ?
                        <div className="ToDo">
                            <p class="title">To Do</p>
                            {this.displayTasks(1)}
                        </div> : ''
                    }
                    {this.state.active === 'all' || this.state.active === 'progress' ?
                        <div className="InProgress">
                            <p class="title">In Progress</p>
                            {this.displayTasks(2)}
                        </div> : ''
                    }
                    {this.state.active === 'all' || this.state.active === 'done' ?

                        <div className="Done">
                            <p class="title">Done</p>
                            {this.displayTasks(3)}
                        </div> : ''
                    }
                    {
                        this.state.active === 'all' || this.state.active === 'fixed' ?
                            <div className="Fixed">
                                <p class="title">Fixed</p>
                                {this.displayTasks(4)}
                            </div> : ''
                    }
                </div>
            </div>
        )
    }
}
