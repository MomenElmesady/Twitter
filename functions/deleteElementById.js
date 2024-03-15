const appError = require("../utils/appError");

module.exports = async function deleteElemntById(Model,id) {
  const doc = await Model.findByIdAndDelete(id);
  if (!doc) {
    throw new appError("Cannot find element with this ID", 404);
  }
  return doc;
}