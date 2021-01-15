import React, { Component, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Card from "../../components/cards";
import Header from "../../components/header";
import Input from "../../components/input";

import DropDown from "../dropdown";

//css
import "../../styles/main.css"
import "../../styles/dropdown.css"

export default class Columns extends Component {
    state = {
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
        dropCreate: { search: "", active: "Task", options: ['Task', 'Column'] },
        show: false,
        showCreate: false,

    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem("tasks"))
        let params = new URLSearchParams(window.location.search.slice(1));
        let search = params.get('q')
        const keys = { "todo": 0, "progress": 1, "done": 2, "fixed": 3 }
        let active = params.get('selected')

        if (search || active) {
            active = active ? JSON.parse(active).map(i => keys[i]) : []
            if (data) {
                this.setState({ tasks: data.tasks, columns: data.columns, drop: { search, active } })
            }
        } else {
            if (data) {
                this.setState({ tasks: data.tasks, columns: data.columns })
            }
        }
    }

    componentDidUpdate() {
        const data = { tasks: this.state.tasks, columns: this.state.columns }
        localStorage.setItem("tasks", JSON.stringify(data));
    }

    reset = () => {
        this.setState({
            show: false,
            showCreate: false
        })
    }


    // **************   Filter DropDown

    layoutSubmitHandler = data => {
        const keys = { 0: "todo", 1: "progress", 2: "done", 3: "fixed" }
        const active = data.active.map(i => keys[i])
        const q = "?q=" + data.search
        const selected = "selected=" + JSON.stringify(active)
        window.history.pushState(null, null, q + '&' + selected)
        this.setState(() => { return { drop: data } })
    }

    toggleDropdown = () => {
        this.setState({ show: !this.state.show })
    }


    // ***************   Input Dropdown
    changeHandlerTask = e => {
        this.setState({
            dropCreate: {
                ...this.state.dropCreate,
                search: e.target.value
            }
        })
    }

    toggleCreateDropdown = () => {
        this.setState({ showCreate: !this.state.showCreate })
    }

    changeCreateType = v => {
        this.setState({
            dropCreate: {
                ...this.state.dropCreate,
                active: v
            },
            showCreate: !this.state.showCreate
        })
    }


    // ***************   Create

    create = () => {
        const autoFunction = { 'Task': this.createTask, 'Column': this.createColumn }
        autoFunction[this.state.dropCreate.active]()
    }


    // **************   Column creation

    createColumn = () => {
        let title = this.state.dropCreate.search
        this.setState({
            columns: {
                ...this.state.columns,
                [title]:{
                    contents:[]
                }
            },
            dropCreate: {
                ...this.state.dropCreate,
                search:""
            }
        })
    }

    // ************** Task creations
    createTask = () => {
        const id = uuidv4()
        const i = this.state.dropCreate.search
        this.setState({
            tasks: {
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
            },
            dropCreate: {
                ...this.state.dropCreate,
                search: ""
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
        let col = Object.keys(this.state.columns) 
        return col.map((i, id) => (
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
                                        col = {col}
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
        let { dropCreate, columns, drop, show, showCreate } = this.state
        return (
            <div>
                <div>
                    <Header
                        data={{
                            createTask: this.create,
                            show,
                            toggle: this.toggleDropdown
                        }}
                    >
                        <Input
                            data={{
                                input: dropCreate,
                                changeHandlerTask: this.changeHandlerTask,
                                show: showCreate,
                                toggle: this.toggleCreateDropdown,
                                change: this.changeCreateType
                            }}
                        />
                        <DropDown
                            data={Object.keys(columns)}
                            submitHandler={this.layoutSubmitHandler}
                            inputData={Object.assign(drop, {})}
                            toggle={this.toggleDropdown}

                        />
                    </Header>
                </div>
                <div className="container" onClick={this.reset}>
                    {this.displayTasks()}
                </div>
            </div>
        )
    }
}
