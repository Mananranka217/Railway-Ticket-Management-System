const db = require("../config/dbconfig");
const Train = require("../models/Train");
const Booking = require("../models/Booking");

const max_no_of_retries = 3;
const retry_delay = 1000;

//An endpoint for the users where they can enter the source and destination and
//fetch all the trains between that route with their availabilities

exports.getSeatAvailability = async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res
      .status(400)
      .json({ message: "Source and destination are required" });
  }

  try {
    const trains = await Train.getTrainsByRoute(source, destination);

    if (trains.length === 0) {
      return res
        .status(404)
        .json({ message: "No trains available for the specified route" });
    }

    const availableTrains = trains.map((train) => ({
      trainNumber: train.train_number,
      availableSeats: train.available_seats,
    }));

    const trainsWithSeats = availableTrains.filter(
      (train) => train.availableSeats > 0
    );

    res.status(200).json({
      available: trainsWithSeats.length > 0,
      availableTrainCount: trainsWithSeats.length,
      trains: availableTrains,
    });
  } catch (err) {
    console.error("Error fetching seat availability:", err);
    res.status(500).json({
      message: "Error fetching seat availability",
      error: err.message,
    });
  }
};

//An endpoint for the users to book a seat on a particular train

exports.bookSeat = async (req, res) => {
  const { trainId, seatsToBook } = req.body;
  const userId = req.user.id;

  const connection = await db.getConnection();

  let no_of_attempts = 0;

  while (no_of_attempts < max_no_of_retries) {
    try {
      console.log("Booking started", no_of_attempts + 1);

      await connection.beginTransaction();
      console.log("Transaction started");

      const [train] = await connection.query(
        "SELECT total_seats, available_seats FROM trains WHERE id = ? FOR UPDATE",
        [trainId]
      );
      console.log("Train fetched:", train);

      if (!train.length) {
        console.log("Train not found");
        await connection.rollback();
        if (!res.headersSent) {
          return res.status(404).json({ message: "Train not found" });
        }
      }

      const availableSeats = train[0].available_seats;
      console.log("Available seats:", availableSeats);

      if (availableSeats < seatsToBook) {
        console.log("Not enough seats available");
        await connection.rollback();
        if (!res.headersSent) {
          return res
            .status(400)
            .json({ message: "Not enough seats available" });
        }
      }

      await connection.query(
        "UPDATE trains SET available_seats = available_seats - ? WHERE id = ?",
        [seatsToBook, trainId]
      );
      console.log("Seats updated");

      await Booking.create(userId, trainId, seatsToBook, connection);
      console.log("Booking Done");

      await connection.commit();
      if (!res.headersSent) {
        return res.json({ message: "Seats booked successfully" });
      }
    } catch (err) {
      console.error("Error during booking!", err.message); // Log error message

      //Preventing Deadlock
      if (err.code === "ER_LOCK_DEADLOCK" || err.code === "ER_QUERY_TIMEOUT") {
        console.log(
          `We're experiencing a delay. Please hold on while we try again... (Attempt ${
            no_of_attempts + 1
          })`
        );
        no_of_attempts += 1;

        if (no_of_attempts >= max_no_of_retries) {
          await connection.rollback();
          if (!res.headersSent) {
            return res.status(500).json({
              message:
                "We couldn't book your seats due to a server issue. Please try again later.",
            });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, retry_delay));

        await connection.rollback();
      } else {
        await connection.rollback();
        
        if (!res.headersSent) {
          return res
            .status(500)
            .json({ message: "Couldn't book seats", error: err.message });
        }
      }
    } finally {
      connection.release();
    }
  }
};

//An endpoint for the users to get specific booking details
exports.getBookingDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
        SELECT 
          b.id AS booking_id,
          b.seats AS number_of_seats,
          t.train_number,
          t.source,
          t.destination
        FROM bookings b
        JOIN trains t ON b.train_id = t.id
        WHERE b.user_id = ?
      `;

    const [rows] = await db.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch booking details:", err.message);
    res.status(500).json({ message: "Failed to fetch booking details:" });
  }
};
