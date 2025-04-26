const db = require("../config/db");

module.exports = {
  getAllActive(callback) {
    db.all(
      "SELECT *, start as local_start, end as local_end FROM bids WHERE end > datetime('now', 'localtime') AND start <= datetime('now', 'localtime') ORDER BY end ASC",
      callback
    );
  },
  getAllClosed(callback) {
    db.all(
      "SELECT *, start as local_start , end as local_end FROM bids WHERE end <= datetime('now', 'localtime') ORDER BY end DESC",
      callback
    );
  },
  getById(id, callback) {
    db.get(
      "SELECT *, start as local_start, end as local_end FROM bids WHERE id = ?",
      [id],
      callback
    );
  },
  add(bid, callback) {
    const { title, description, institution, start, end, max_budget } = bid;
    db.run(
      "INSERT INTO bids (title, description, institution, start, end, max_budget) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, institution, start, end, max_budget],
      callback
    );
  },
};
