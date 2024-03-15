const appError = require("../utils/appError");

module.exports = async function findTweetById(Model,id) {
  const doc = await Model.findById(id);
  if (!doc) {
    throw new appError("Cannot find element with this ID", 404);
  }
  return doc;
}