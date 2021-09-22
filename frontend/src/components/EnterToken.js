import React, { Component} from 'react';

class EnterToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addNew: false, 
            contract:''
        }
        this.onChangeAddNew = this.onChangeAddNew.bind(this);
        this.submitNewContract = this.submitNewContract.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChangeAddNew = (event) => {
        event.preventDefault();
        this.setState({
            addNew: !this.state.addNew
        });
    }

    onChange = (event) => {
        event.preventDefault();
        this.setState({
            contract: event.target.value
        })
    }

    submitNewContract = (event) => {
        event.preventDefault();        
        let addedContract = this.state.contract;        
        this.props.postNewContract(addedContract);
        this.setState({
            addNew: !this.state.addNew,
            contract: ''
        });
    }
    
    render () {
        let enter;
        if (this.state.addNew) {
            enter = (
                <div>                    
                    <form onSubmit={this.submitNewContract}>
                        <input type="text" name="contract" value={this.state.contract} 
                        placeholder="Enter Contract Address" onChange={this.onChange} />
                        <br/>
                        <input type="submit" value="Submit" />                    
                    </form>
                </div>
            )
        } else {
            enter = (
            <div>
                <form onSubmit={this.onChangeAddNew}>
                    <input type="submit" value="Add New Contract" />
                </form>
            </div>
            )
        }
        return enter;
    
    }
}

export default EnterToken;