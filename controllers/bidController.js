const Bid = require("../models/bid");
const Offer = require("../models/offer");

module.exports = {
  index(req, res) {
    res.render("index");
  },
  listActive(req, res) {
    Bid.getAllActive((err, bids) => {
      if (err || !bids.length) {
        return res.render("activeBids", {
          bids: [],
          message: "Brak aktywnych przetargów",
        });
      }
      res.render("activeBids", { bids });
    });
  },
  listClosed(req, res) {
    Bid.getAllClosed((err, bids) => {
      if (err || !bids.length) {
        return res.render("closedBids", {
          bids: [],
          message: "Brak zakończonych przetargów",
        });
      }

      const bidsWithWinners = bids.map((bid) => {
        return new Promise((resolve) => {
          Offer.getForBid(bid.id, (err, offers) => {
            const validOffers = offers
              .filter((o) => o.amount <= bid.max_budget)
              .sort((a, b) => a.amount - b.amount);

            bid.winner =
              validOffers.length > 0
                ? {
                    bidder: validOffers[0].bidder,
                    amount: validOffers[0].amount,
                  }
                : null;

            bid.unsuccessful = validOffers.length === 0 && offers.length > 0;
            resolve(bid);
          });
        });
      });

      Promise.all(bidsWithWinners).then((processedBids) => {
        res.render("closedBids", { bids: processedBids });
      });
    });
  },
  showBid(req, res) {
    const id = req.params.id;
    Bid.getById(id, (err, bid) => {
      if (!bid) return res.sendStatus(404);

      Offer.getForBid(id, (err, offers) => {
        const now = new Date();
        const endDate = new Date(bid.local_end || bid.end);
        const startDate = new Date(bid.local_start || bid.start);

        const isActive = now > startDate && now < endDate;
        let validOffers = offers ? [...offers] : [];
        let winner = null;
        let unsuccessful = false;

        if (!isActive) {
          const eligibleOffers = offers
            .filter((o) => o.amount <= bid.max_budget)
            .sort((a, b) => a.amount - b.amount);

          if (eligibleOffers.length > 0) {
            winner = eligibleOffers[0];
          } else if (offers.length > 0) {
            unsuccessful = true;
          }
        }

        const formatForDisplay = (date) => {
          if (!date) return "";
          const d = new Date(date);
          return d.toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        const bidWithFormattedDates = {
          ...bid,
          display_start: formatForDisplay(bid.local_start || bid.start),
          display_end: formatForDisplay(bid.local_end || bid.end),
        };

        const formattedOffers = validOffers.map((offer) => ({
          ...offer,
          display_created_at: formatForDisplay(offer.created_at),
        }));

        res.render("bidDetails", {
          bid: bidWithFormattedDates,
          offers: offers && offers.length ? offers : null,
          isActive,
          hasWinner: !!winner,
          winner: winner
            ? {
                ...winner,
                display_created_at: formatForDisplay(winner.created_at),
              }
            : null,
          unsuccessful,
          currentTime: formatForDisplay(now),
        });
      });
    });
  },
  showOfferForm(req, res) {
    Bid.getById(req.params.id, (err, bid) => {
      if (err || !bid) return res.status(404).send("Przetarg nie znaleziony");

      const now = new Date();
      const startDate = new Date(bid.start);
      const endDate = new Date(bid.end);

      if (now < startDate || now > endDate) {
        return res.redirect(`/bids/${req.params.id}`);
      }

      res.render("offerForm", { bid });
    });
  },
  submitOffer(req, res) {
    const { bidder, amount } = req.body;
    const bidId = req.params.id;

    Bid.getById(bidId, (err, bid) => {
      if (err || !bid) {
        return res.status(404).send("Przetarg nie znaleziony");
      }

      const now = new Date();
      const startDate = new Date(bid.start);
      const endDate = new Date(bid.end);

      if (now < startDate) {
        return res.status(400).render("error", {
          message: `Przetarg nie został jeszcze otwarty. Data rozpoczęcia: ${startDate.toLocaleString(
            "pl-PL"
          )}`,
        });
      }

      if (now > endDate) {
        return res.status(400).render("error", {
          message: `Przetarg został już zamknięty. Data zakończenia: ${endDate.toLocaleString(
            "pl-PL"
          )}`,
        });
      }

      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).render("error", {
          message: "Nieprawidłowa kwota oferty",
        });
      }

      Offer.add(
        {
          bidder,
          amount: parseFloat(amount),
          bid_id: bidId,
        },
        (err) => {
          if (err) {
            return res.status(500).render("error", {
              message: "Błąd podczas składania oferty",
            });
          }
          res.redirect(`/bids/${bidId}`);
        }
      );
    });
  },
  showAddBid(req, res) {
    res.render("addBid");
  },
  addBid(req, res) {
    const { start, end, ...rest } = req.body;

    const bid = {
      ...rest,
      start: start.replace("T", " "),
      end: end.replace("T", " "),
    };

    Bid.add(bid, () => res.redirect("/bids"));
  },
};
