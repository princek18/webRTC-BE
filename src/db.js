const mongoose = require("mongoose");
const config = require('../config/config');

mongoose.connect(config.MONGOOSE_URL);
