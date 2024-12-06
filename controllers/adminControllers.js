const db = require("../config/dbconfig");

//An endpoint for the admin to create a new train with a source and destination
exports.addNewTrain = async (req, res) => {
  let trains = req.body;

  if (!Array.isArray(trains)) {
    trains = [trains];
  }

  if (trains.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide train data to add." });
  }

  try {
    const trainIds = [];

    for (const train of trains) {
      const { trainNumber, source, destination, totalSeats } = train;

      if (!trainNumber || !source || !destination || !totalSeats) {
        return res
          .status(400)
          .json({
            message:
              "Train number, source, destination, and total seats are required for each train.",
          });
      }

      const availableSeats = totalSeats;

      const [result] = await db.query(
        "INSERT INTO trains (train_number, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)",
        [trainNumber, source, destination, totalSeats, availableSeats]
      );

      trainIds.push({ trainNumber, trainId: result.insertId });
    }
    res.json({ message: "Trains added successfully", trainIds });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding trains", error: err.message });
  }
};



