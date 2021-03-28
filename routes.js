const router = require("express").Router();
const connections = require("./models/connections");
const stations = require("./models/stations");

router
  .route("/")
  .post(async (req, res) => {
    try {
      const COnnections = await Promise.all(
        req.body.Connections.map(async (obje) => {
          const connection = await connections.create({
            ConnectionTypeID: obje.ConnectionTypeID,
            CurrentTypeID: obje.CurrentTypeID,
            LevelID: obje.LevelID,
            Quantity: obje.Quantity,
          });
          return connection;
        })
      );

      await stations.create({
        Title: req.body.Station.Title,
        Town: req.body.Station.Town,
        AddressLine1: req.body.Station.AddressLine1,
        StateOrProvince: req.body.Station.StateOrProvince,
        Postcode: req.body.Station.Postcode,
        Location: req.body.Station.Location,
        Connections: COnnections.map((single) => single._id),
      });
      res.send(`station created successfuly!`);
    } catch (err) {
      res.send(`failed to create station ${err.message}`);
    }
  })
  .get(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      res.send(
        await stations
          .find()
          .populate({
            path: "Connections",
            populate: [
              { path: "ConnectionTypeID" },
              { path: "CurrentTypeID" },
              { path: "LevelID" },
            ],
          })
          .limit(10)
      );
    } else {
      console.log("yes here");
      const frameofSearch = await rectangleBounds(
        req.body.topRight,
        req.body.bottomLeft
      );

      res.send(
        await stations
          .find({
            Location: {
              $geoWithin: {
                $geometry: {
                  type: frameofSearch.type,
                  coordinates: frameofSearch.coordinates,
                },
              },
            },
          })
          .populate({
            path: "Connections",
            populate: [
              { path: "ConnectionTypeID" },
              { path: "CurrentTypeID" },
              { path: "LevelID" },
            ],
          })
          .limit(10)
      );
    }
  })
  .put(async (req, res) => {
    try {
      await Promise.all(
        req.body.Connections.map(async (obj) => {
          const connection = await connections.updateOne(
            { _id: obj._id },
            {
              ConnectionTypeID: obj.ConnectionTypeID,
              LevelID: obj.LevelID,
              CurrentTypeID: obj.CurrentTypeID,
              Quantity: obj.Quantity,
            }
          );
          return connection;
        })
      );
      await stations.updateOne(
        { _id: req.body.Station._id },
        {
          Location: {
            coordinates: req.body.Station.Location.coordinates,
            type: req.body.Station.Location.type,
          },
          Connections: req.body.Connections.map((a) => a._id),
          Title: req.body.Station.Title,
          AddressLine1: req.body.Station.AddressLine1,
          Town: req.body.Station.Town,
          StateOrProvince: req.body.Station.StateOrProvince,
          Postcode: req.body.Station.Postcode,
        }
      );
      res.send(`station successfuly updated!`);
    } catch (e) {
      console.error("station_put_error", e);
      res.status(500).json({ message: e.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    res.send(
      await stations.findById(req.params.id).populate({
        path: "Connections",
        populate: [
          { path: "ConnectionTypeID" },
          { path: "CurrentTypeID" },
          { path: "LevelID" },
        ],
      })
    );
  })
  .patch(async (req, res) => {
    const mod = await stations.updateOne(
      { _id: req.params.id },
      { title: req.body.title }
    );
    res.status(200).send(`updated sucessfully ${mod.nModified} stations post`);
  })
  .delete(async (req, res) => {
    try {
      const del = await stations.deleteOne({ _id: req.params.id });
      res.send(`deleted  station successfuly`);
    } catch (err) {
      res.send(`Failed to delete station`);
    }
  });

const rectangleBounds = (topRight, bottomLeft) => ({
  type: "Polygon",
  coordinates: [
    [
      [bottomLeft.lng, bottomLeft.lat],
      [bottomLeft.lng, topRight.lat],
      [topRight.lng, topRight.lat],
      [topRight.lng, bottomLeft.lat],
      [bottomLeft.lng, bottomLeft.lat],
    ],
  ],
});

module.exports = router;
