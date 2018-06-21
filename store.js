const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  lastPostId: 0,
  clients: []
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
  return db.get('lastPostId').value();
}

module.exports.setLlastPostId = (lastPostId) => {
  db.update('lastPostId', lastPostId)
  .write();
}
