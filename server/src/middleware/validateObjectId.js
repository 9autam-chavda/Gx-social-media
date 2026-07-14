const mongoose = require('mongoose');
const ApiResponse = require('../utils/ApiResponse');

const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return ApiResponse.error('Invalid identifier provided', 400).send(res);
  }

  next();
};

module.exports = validateObjectId;