const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("bidportal.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    institution TEXT,
    start DATETIME,
    end DATETIME,
    max_budget REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bidder TEXT,
    amount REAL,
    bid_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(bid_id) REFERENCES bids(id)
  )`);

  db.run("CREATE INDEX IF NOT EXISTS idx_bids_end ON bids(end)");
  db.run("CREATE INDEX IF NOT EXISTS idx_offers_bid_id ON offers(bid_id)");
});

module.exports = db;
