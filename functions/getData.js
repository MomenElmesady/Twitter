module.exports = async function getData(Model,obj) {
  const data = await Model.find(obj);
  return data;
}
