const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  clients: [],
  lastPostId: 0,
  lastSpoluId: 0
})
.write();

module.exports.getClients = () => {
  return db.get('clients').value();
}

module.exports.addClient = (chatId) => {
  const record = db.get('clients')
    .find(chatId)
    .value();

  if (!record) {
    db.get('clients')
    .push(chatId)
    .write();  
  }
}

module.exports.getLastPostId = () => {
  return db.get('lastPostId').value() || 0;
}

module.exports.setLastPostId = (lastPostId) => {
  db.set('lastPostId', lastPostId)
  .write();
}

module.exports.getLastSpoluId = () => {
  return db.get('lastSpoluId').value() || 0;
}

module.exports.setLlastSpoluId = (lastSpoluId) => {
  db.set('lastSpoluId', lastSpoluId)
  .write();
}
