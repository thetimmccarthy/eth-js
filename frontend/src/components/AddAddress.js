import React, { Component} from 'react';

class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addNew: true, 
            address:''
        }
        this.onChangeAddNew = this.onChangeAddNew.bind(this);
        this.submitNewAddress = this.submitNewAddress.bind(this);
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
            address: event.target.value
        })
    }

    submitNewAddress= (event) => {
        event.preventDefault();        
        let addedAddress = this.state.address;        
        this.props.submitAddress(addedAddress);
        this.setState({
            addNew: !this.state.addNew,
            address: ''
        });
    }
    
    render () {
        return (
                <div>                    
                    <form onSubmit={this.submitNewAddress}>
                        <input type="text" name="address" value={this.state.address} 
                        placeholder="Enter Ethereum Address" onChange={this.onChange} />
                        <br/>
                        <input type="submit" value="Submit" />                    
                    </form>
                </div>
            )        
    }
}

export default AddAddress;