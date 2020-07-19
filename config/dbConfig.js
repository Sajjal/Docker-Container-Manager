const db = require("monk")("localhost/dockerOrc");
const expiredTokens = db.get("expiredTokens");

//Add data in Collection
async function addData(collectionName, data) {
  const collection = db.get(collectionName);
  await collection.insert(data);
}

//Get all data in Collection
async function getData(collectionName) {
  const collection = db.get(collectionName);
  let data = await collection.find();
  return data;
}

//Search on Collection
async function searchData(collectionName, data) {
  const collection = db.get(collectionName);
  let result = await collection.find(data);
  return result;
}

//Remove data from Collection
async function removeData(collectionName, id) {
  const collection = db.get(collectionName);
  collection.remove({ _id: id });
}

//Expire a document after some time
expiredTokens.createIndex({ createdAt: 1 }, { expireAfterSeconds: 43210 });
async function expiredToken(token) {
  await expiredTokens.insert({
    createdAt: new Date(),
    token: token,
  });
}

module.exports = { addData, getData, searchData, removeData, expiredToken };
