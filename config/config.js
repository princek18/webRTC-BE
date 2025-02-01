const stage = require('./config-stage');
const prod = require('./config-prod');
const { model } = require('mongoose');

const env = process.env.NODE_ENV;

if (env === 'development') {
    module.exports = stage;
} else if (env === 'production') {
    module.exports = prod;
} else {
    module.exports = stage;
}