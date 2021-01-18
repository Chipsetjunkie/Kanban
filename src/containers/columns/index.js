import React, { Component, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Card from "../../components/cards";
import Header from "../../components/header";
import LaneModal from "../../components/lanemodal";
import TaskModal from "../../components/taskmodal";


import Modal from "../modal";
import DropDown from "../dropdown";

//css
import "../../styles/main.css"
import "../../styles/dropdown.css"

export default class Columns extends Component {
    state = {
        tasks: {},
        columns: {},
        newTask: { date: "", title: "", image: "", edit: false, id: null },
        order: [],
        drop: { search: "", active: [] },
        show: false,
        showModal: false,
        activeModal: null,
        sort: true,
        progress: 0
    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem("tasks"))
        const ord = data ? Object.keys(data.columns) : []
        let params = new URLSearchParams(window.location.search.slice(1));
        let search = params.get('q')
        const keys = { "todo": 0, "progress": 1, "done": 2, "fixed": 3 }
        let active = params.get('selected')
        if (search || active) {
            active = active ? JSON.parse(active).map(i => keys[i]) : []
            if (data) {
                this.setState({ tasks: data.tasks, columns: data.columns, drop: { search, active }, order: data.order ? data.order : ord }, () => this.calcProgress())
            }
        } else {
            if (data) {
                this.setState({ tasks: data.tasks, columns: data.columns, order: data.order ? data.order : ord }, () => this.calcProgress())
            }
        }
    }

    componentDidUpdate() {
        const data = { tasks: this.state.tasks, columns: this.state.columns, order: this.state.order }
        localStorage.setItem("tasks", JSON.stringify(data));

    }

    reset = () => {
        this.setState({
            show: false,
        })
    }

    // **************  Helpers
    calcProgress = () => {
        let total_tasks = Object.keys(this.state.tasks).length
        let total_columns = this.state.order.length
        var n = 0;
        this.state.order.forEach((i, id) => {
            let c = this.state.columns[i]
            n += (c.contents.length) * ((id) / (total_columns - 1))
        })
        this.setState({ progress: Math.round(100 * (n / total_tasks)) })

    }



    sortTasks = col => {
        let contents = [...this.state.columns[col].contents]
        let tasks = contents.map(i => this.state.tasks['task_' + i])
        if (this.state.sort) {
            tasks.sort((a, b) => (a.date > b.date) ? 1 : -1)//asc 
        }
        else {
            tasks.sort((a, b) => (a.date > b.date) ? -1 : 1)//desc
        }
        contents = tasks.map(i => i.id)
        this.setState({
            columns: {
                ...this.state.columns,
                [col]: {
                    contents
                }
            },
            sort: !this.state.sort
        })
    }

    // **************  Change Listener

    changeTask = data => {
        this.setState({ newTask: data })
    }



    // **************   Modal Controls
    open = name => {
            this.setState({
                showModal: true,
                activeModal: name,
            })
    }

    close = () => {
        this.setState({ 
            showModal: false, 
            activeModal: null,
            newTask: { date: "", title: "", image: "", edit: false, id: null }
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
        this.setState({ showOptions: !this.state.showOptions })
    }




    // ***************   Create

    TaskCreator = (data) => {
        if (!data.edit) {
            this.createTask(data)
        } else {
            this.editTaskContent(data)
        }
    }

    // **************   Column creation



    createColumn = (columns, order) => {
        this.setState({ columns, order, showModal: false, activeModal: null }, () => this.calcProgress())
    }

    // ************** Task creations



    createTask = (data) => {
        const col = this.state.order[0]
        const id = uuidv4()
        const i = data.title
        this.setState({
            tasks: {
                ...this.state.tasks,
                ["task_" + id]: {
                    id,
                    text: i,
                    date: data.date,
                    modify: false,
                    active: col,
                    image: data.image
                }
            },
            columns: {
                ...this.state.columns,
                [col]: {
                    contents: [
                        ...this.state.columns[col].contents,
                        id
                    ]
                }
            },
            dropCreate: {
                ...this.state.dropCreate,
                search: ""
            },
            showOptions: false,
            showModal: false,
            activeModal: null
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
        let newTask = { title: task.text, image: task.image, date: task.date, edit: true, id }
        task.modify = !task.modify
        updateTasks['task_' + id] = task
        this.setState({ tasks: updateTasks, newTask }, () => this.open('tsk'))
    }

    editTaskContent = (data) => {
        const updateTasks = { ...this.state.tasks }
        const task = updateTasks['task_' + data.id]
        task.text = data.title
        task.date = data.date
        task.image = data.image
        updateTasks['task_' + data.id] = task
        this.setState({ tasks: updateTasks, showModal: false, newTask: { title: "", image: "", date: "", edit: false, id: null } })
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
            },
        }, () => this.calcProgress())
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
        let col = [...this.state.order]
        return col.map((i, id) => (
            <Fragment key={i + "div"}>
                {this.state.drop.active.length === 0 || this.state.drop.active.includes(id) ?
                    <div className="swimlane">
                        <p className="title">{i} {this.state.columns[i].contents.length} <span onClick={() => this.sortTasks(i)}>sort</span></p>
                        {
                            this.state.columns[i].contents.map(j => {
                                if (cleanedData.includes('task_' + j)) {
                                    const data = this.state.tasks['task_' + j]
                                    return <Card
                                        key={j}
                                        data={data}
                                        helper={{ purge: this.deleteTask, statusChange: this.statusChange, editTask: this.editTask, editContent: this.editTaskContent }}
                                        col={col}
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
        let { columns, drop, showOptions, showModal, order, newTask, activeModal, progress } = this.state
        return (
            <div className="main-container">
                <Modal
                    showModal={showModal}
                    active={activeModal}
                >
                    <LaneModal
                        closeModal={this.close}
                        data={{
                            order: [...order],
                            cols: columns
                        }}
                        createColumn={this.createColumn}
                    />
                    <TaskModal
                        closeModal={this.close}
                        changeHandler={this.changeTask}
                        newTask={{ ...newTask }}
                        createTask={this.TaskCreator}
                    />
                </Modal>
                <div style={{ filter: "" }}>
                    <Header
                        percentage={progress}
                        data={{
                            createTask: this.create,
                            showOptions,
                            toggle: this.toggleDropdown,
                            modalOpen: this.open,
                            length: this.state.order.length
                        }}
                    >
                        <DropDown
                            data={this.state.order}
                            submitHandler={this.layoutSubmitHandler}
                            inputData={Object.assign(drop, {})}
                            toggle={this.toggleDropdown}

                        />
                    </Header>
                </div>
                <div className="container" onClick={this.reset} style={{ filter: "" }}>
                    {this.displayTasks()}
                </div>
            </div>
        )
    }
}
