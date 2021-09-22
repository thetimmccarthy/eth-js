import React, { Component} from 'react';
import EnterToken from './EnterToken';
import SingleToken from './SingleToken'
import AddAddress from './AddAddress'

class Tokens extends Component {
    constructor(props) {
        super(props);
        // Should have a state variable for handling errors
        this.state = {
            showAddressBar: true, 
            tokens: [],
            userAddress: '',
            hideZeroBals: false
        }
        this.getTokenBalances = this.getTokenBalances.bind(this);
        this.postNewContract = this.postNewContract.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.submitAddress = this.submitAddress.bind(this);        
    }

    componentDidMount = () => {
        this.getTokenBalances(this.state.userAddress);
    }

    getTokenBalances = (address) => {                
        let url = 'http://localhost:5000/api/' + address;        
        fetch(url)
          .then((res) => {      
          return res.json()            
        })
          .then((data) => {              
            return this.setState({
              tokens: data
            });
        })
          .catch(err => {
            console.error(err);
            this.setState({
              tokens: []
            });
        });
      }        

    postNewContract = (newContract) => {        
        const postOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'contract': newContract
            })
        }
        fetch('http://localhost:5000/api', postOptions)
        .then(res => res.json())
        .then((data) => {
            return this.setState({
                tokens: data
            });
        })
        .catch((err) => {
            this.setState({
                tokens: []
            })
        })
    }

    onCheckBoxChange = (event) => {
        event.preventDefault();
        this.setState({
            hideZeroBals: !this.state.hideZeroBals
        })        
    }

    submitAddress = (address) => {        
        this.setState({
            userAddress: address,
            showAddressBar: !this.state.showAddressBar
        });
        this.getTokenBalances(address)
    }        

    render () {        
        
        let bals;
        if (this.state.hideZeroBals) {
            bals = this.state.tokens.filter((token) => {
                return token.balance > 0;
            });
        } else {
            bals = this.state.tokens;
        }        

        let address_bar;
        if (this.state.showAddressBar) {
            address_bar = <AddAddress submitAddress={this.submitAddress} />
        } else {
            address_bar = <h4>{this.state.userAddress}</h4>
        }
        return (
            <div>
                {address_bar}
                <h2>You own: </h2>
                {bals.map((token) => {                                                
                    return <SingleToken name={token.name} symbol={token.symbol} balance={token.balance} />                                                                                                         
                })}
                
                <EnterToken postNewContract={this.postNewContract}/>
                <form onSubmit={this.onCheckBoxChange}>                    
                    <input type="submit" name="hidezero" value={this.state.hideZeroBals ? "Unhide Zero Balances" : "Hide Zero Balances"}  />
                </form>
            </div>
        )
    }
}

export default Tokens;