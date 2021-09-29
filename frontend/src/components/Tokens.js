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

    componentDidMount = async () => {
        if(window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
            this.setState({
                userAddress: accounts[0], 
                showAddressBar: !this.state.showAddressBar
            });

            this.getTokenBalances(accounts[0]);
        } else {
            this.getTokenBalances(this.state.userAddress)
        }
        
        
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
                'contract': newContract, 
                'id': this.state.userAddress
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
            console.error(err);
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
        let sum = 0;
        bals.forEach(token => {
            let bal = parseFloat(token.balance);
            bal = bal / Math.pow(10, token.decimals);
            let usd_price = parseFloat(token.usd_price) * bal;
            usd_price = usd_price.toFixed(2);      
            bal = bal.toFixed(4);                  
            sum += parseFloat(usd_price);
        });

        let address_bar;
        if (this.state.showAddressBar) {
            address_bar = <AddAddress submitAddress={this.submitAddress} />
        } else {
            address_bar = (
            <div>
                <h4>{this.state.userAddress}</h4>
                <h2> Total USD Value: ${sum}</h2>
                <h2>Tokens: </h2>
                {
                bals.map((token) => {                            
                    let bal = parseFloat(token.balance);
                    bal = bal / Math.pow(10, token.decimals);
                    let usd_price = parseFloat(token.usd_price) * bal;
                    usd_price = usd_price.toFixed(2);      
                    bal = bal.toFixed(4);   
                    return <SingleToken name={token.name} symbol={token.symbol} balance={bal} usd={usd_price}/>                                                                                                         
                })}
                
                <EnterToken postNewContract={this.postNewContract}/>
                <br/>
                <form onSubmit={this.onCheckBoxChange}>                    
                    <input type="submit" name="hidezero" value={this.state.hideZeroBals ? "Unhide Zero Balances" : "Hide Zero Balances"}  />
                </form>
            </div>                
            )
        }
        return (
            <div>
                {address_bar}
                
            </div>
        )
    }
}

export default Tokens;