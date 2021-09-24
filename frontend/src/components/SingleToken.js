import React, { Component} from 'react';

class Token extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            symbol: this.props.symbol,
            balance: this.props.balance
        }

    }
    render () {
        return (
            <div>
                <h4>{this.props.balance} {this.props.symbol}</h4>
                <p>${this.props.usd}</p>
            </div>
        )
    }
}

export default Token;