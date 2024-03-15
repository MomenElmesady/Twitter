const appError = require("../utils/appError");

module.exports = async function findTweetById(Model,obj) {
  const doc = await Model.findOneAndDelete(obj)
  if (!doc){
    throw new appError("Cannot find element with this data", 404);
  }
 return doc
}