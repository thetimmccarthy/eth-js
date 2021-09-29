var mongoose = require('mongoose')

const Schema = mongoose.Schema;

const contractSchema = new Schema({
    userAddress: {type: String, required: true},
    contractAddress: {type: String, required: true}, 
});

const contractModel = mongoose.model('contract', contractSchema);

module.exports = contractModel;

