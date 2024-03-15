module.exports = async function saveComment(Model,data) {
  const doc = await Model.create(data);
  return doc;
}
