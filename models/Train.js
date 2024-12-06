const db = require("../config/dbconfig");

exports.addTrain = async (trainNumber, source, destination, totalSeats) => {
  const availableSeats = totalSeats;
  try {
    const [result] = await db.query(
      "INSERT INTO trains (train_number, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)",
      [trainNumber, source, destination, totalSeats, availableSeats]
    );
    return result.insertId;
  } catch (err) {
    throw new Error("Error adding train", err.message);
  }
};

exports.getTrainById = async (trainId) => {
  try {
    const [rows] = await db.query("SELECT * FROM trains WHERE id = ?", [
      trainId,
    ]);
    return rows[0];
  } catch (err) {
    throw new Error("Error fetching train", err.message);
  }
};

exports.getTrainsByRoute = async (source, destination) => {
  try {
    const sourceFormatted = source.trim().toLowerCase();
    const destinationFormatted = destination.trim().toLowerCase();

    const [rows] = await db.query(
      `
             SELECT train_number, source, destination, total_seats, available_seats
             FROM trains
             WHERE TRIM(LOWER(source)) = ? AND TRIM(LOWER(destination)) = ?
           `,
      [sourceFormatted, destinationFormatted]
    );

    return rows;
  } catch (err) {
    throw new Error("Failed to update available seats", err.message);
  }
};

exports.updateAvailableSeats = async (trainId, seatsToBook) => {
  try {
    const [result] = await db.query(
      "UPDATE trains SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?",
      [seatsToBook, trainId, seatsToBook]
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("Failed to update available seats", err.message);
  }
};

exports.updateSeats = async (trainId, totalSeats, availableSeats) => {
  try {
    const [result] = await db.query(
      "UPDATE trains SET total_seats = ?, available_seats = ? WHERE id = ?",
      [totalSeats, availableSeats, trainId]
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("Error updating seats in the database: " + err.message);
  }
};
