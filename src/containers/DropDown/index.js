import React, { Component } from 'react'

export default class DropDown extends Component {

    state = {
        data: [],
        inputData: { search: "", active: [] }
    }


    componentDidMount() {
        const { data, submitHandler, inputData, toggle } = this.props
        this.setState({ data, submitHandler, inputData, toggle })
    }


    submitHandler = e => {
        e.preventDefault()
        this.state.toggle()
        this.props.submitHandler(this.state.inputData)
    }

    changeHandlerSearch = e => {
        this.setState({
            ...this.state,
            inputData: {
                ...this.state.inputData,
                search: e.target.value
            }
        }
        )

    }

    changeHandlerActive = id => {
        let { active } = this.state.inputData
        if (active.includes(id)) {
            active = active.filter(i => i !== id)
        }
        else {
            active.push(id)
        }
        this.setState({
            ...this.state,
            inputData: {
                ...this.state.inputData,
                active
            }
        }
        )
    }


    displayDropItems = () => {
        return this.state.data.map((i, id) => {
            return (
                <div className="dropdown-items" key={id}>
                    <input type="checkbox" checked={this.state.inputData.active.includes(id)} onChange={() => this.changeHandlerActive(id)}></input>
                    <label> {i}</label>
                </div>
            )
        }
        )
    }


    render() {

        return (
            <div className="dropdown-options">
                <form onSubmit={this.submitHandler}>
                    <div className="container-drop">
                        <div className="dropdown">
                            <div className="search-bar">
                                <input id="dropdown-input" placeholder="search" value={this.state.inputData.search} onChange={this.changeHandlerSearch}></input>
                            </div>
                            <div>
                                {this.displayDropItems()}
                            </div>
                            <div className="final-options">
                                <p onClick={this.state.toggle}>Cancel</p>
                                <button type="submit">Done</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
