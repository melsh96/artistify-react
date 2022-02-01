/*------------------------------------------
// ARTISTS ROUTING
------------------------------------------*/
const express = require("express");
const router = new express.Router();

const artistModel = require("../models/Artist");
const albumModel = require("../models/Album");

const getAverageRate = async (idArtist) => {
  // use agregate features @ mongo db to code this feature
  // https://docs.mongodb.com/manual/aggregation/
};

router.get("/artists", async (req, res, next) => {
  // let's determine the sort query object ()
  const sortQ = req.query.sort
    ? { [req.query.sort]: Number(req.query.order) }
    : {};
  // let's do the same with the limit query object
  const limitQ = req.query.limit ? Number(req.query.limit) : 10;

  // console.log("sort and limit artists ? > ", sortQ, limitQ);
  artistModel
    .find({})
    .populate("style")
    .sort(sortQ)
    .limit(limitQ)
    .then(async (artists) => {
      const artistsWithRatesAVG = await Promise.all(
        artists.map(async (res) => {
          // AVG : things are getting tricky here ! :)
          // the following map is async, updating each artist with an avg rate
          const copy = res.toJSON(); // copy the artist object (mongoose response are immutable)
          // copy.avg = await getAverageRate(res._id); // get the average rates fr this artist

          copy.isFavorite =
            req.user &&
            req.user.favorites.artists.includes(copy._id.toString());
          return copy; // return to the mapped result array
        })
      );

      res.json({ artists: artistsWithRatesAVG }); // send the augmented result back to client
    })
    .catch(next);
});

router.get("/artists/:id", async (req, res, next) => {
  try {
    const singleArtist = await artistModel.findById(req.params.id);
    res.status(200).json(singleArtist);
  } catch (e) {
    next(e);
  }
});

router.get("/filtered-artists", (req, res, next) => {
  res.status(200).json({ msg: "@todo" });
});

router.post("/artists", (req, res, next) => {
  artistModel
    .create(req.body)
    .then((newArtist) => res.status(200).json(newArtist))
    .catch(next);
});

router.patch("/artists/:id", async (req, res, next) => {
  artistModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updateArtist) => res.status(200).json(updateArtist))
    .catch(next);
});

router.delete("/artists/:id", (req, res, next) => {
  res.status(200).json({ msg: "@todo" });
});

module.exports = router;
