import './App.css';
import React, { Component} from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }
  componentDidMount = async (req, res) => {
    
    fetch('http://localhost:5000/api/eth')
      .then((res) => {      
      return res.json()            
    })
      .then((data) => {              
        return this.setState({
          value: data.value
        });
    })
      .catch(err => {
        console.error(err);
        this.setState({
          value: 1000000
        });
    });
  }

  render () {
    return (
      <div className="App">
        <h1> you own {this.state.value} ETH </h1>
      </div>
    );
  }

}

export default App;
