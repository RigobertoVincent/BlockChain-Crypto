const Store = require('electron-store');

const dataSchema = {
  wallet : {
    type: 'number',
    min: 0,
    default: 10000
  },

  coin : {
    type : []
  }
};

const dataStore = new Store({dataSchema});
module.exports = dataStore;