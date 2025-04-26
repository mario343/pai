const db = require("../config/db");

module.exports = {
  getForBid(bidId, callback) {
    db.all(
      "SELECT *, datetime(created_at, 'localtime') as created_at FROM offers WHERE bid_id = ? ORDER BY amount ASC",
      [bidId],
      callback
    );
  },
  add(offer, callback) {
    const { bidder, amount, bid_id } = offer;
    db.run(
      "INSERT INTO offers (bidder, amount, bid_id) VALUES (?, ?, ?)",
      [bidder, amount, bid_id],
      callback
    );
  },
};
