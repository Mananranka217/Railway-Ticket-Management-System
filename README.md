This project is a **Railway Ticket Management System** that is designed to mimic the key functions of the IRCTC system. The system allows for the booking of train seats.

## Project Setup

### Prerequisites
To run this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [MySQL](https://www.mysql.com/) (Database setup)
- [Postman](https://www.postman.com/) (for API testing)

### Environment Variables

You need to create a `.env` file in the root of your project with the following environment variables:

``` bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=irctc_db
JWT_SECRET=b9a33fc10999b04cd7b1f88a219e04a4ee176da94c811e64ae0a5d62a9255066
API_KEY=adminKey
```

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone 
   cd irctc-railway-management
   ```
   
2. Install all necessary dependencies using npm:
   
   ```bash
    npm install
   ```
4. Set up your MySQL database:
  * Create a MySQL database named irctc_db.
  * Run the SQL scripts in database/schema.sql to create necessary tables.

### Starting the Server
Once the setup is complete, start the server using npm:

```bash
npm start

```
#### Note :- By default, the server will run on port 3000. You can access the API at http://localhost:3000.

### API Endpoints

#### Admin Routes

1.   Add a new train

       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/admin/add-new-train

       * Request Body:
  
    
```bash
{
    "message": "Trains added successfully",
    "trainIds": [
        {
            "trainNumber": "12341",
            "trainId": 1
        }
    ]
  }
```

         * Headers :
             * x-api-key: Your admin API key which is stored in .env


### Running Tests

You can test all the available APIs using Postman. The endpoints are well-structured and follow RESTful conventions.

```bash
[
  {
    "trainNumber": "12341",
    "source": "Delhi",
    "destination": "Mumbai",
    "totalSeats": 100
  },
  {
    "trainNumber": "123142",
    "source": "Delhi",
    "destination": "Indore",
    "totalSeats": 101
  },
  {
    "trainNumber": "123143",
    "source": "Chennai",
    "destination": "Vellore",
    "totalSeats": 99
  },
  {
    "trainNumber": "123144",
    "source": "Surat",
    "destination": "Rajpkot",
    "totalSeats": 105
  },
  {
    "trainNumber": "123145",
    "source": "Indore",
    "destination": "Delhi",
    "totalSeats": 103
  }
]

#### User Routes
    1. Register a new user
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/register
       * Body:
       
``` bash
       {
  "name": "Mark Zuckerberg",
  "email": "mark@example.com",
  "password": "password"
      }

```
#### User Routes
    1. Register a new user
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/register
       * Body:
       
``` bash
       {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
      }

```

  2. Login
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/login
       * Body:
       
``` bash
    {
  "email": "john@example.com",
  "password": "password"
    }
 ```


  3. Check train availability
   
       * HTTP Method :- GET
       * Endpoint :- http://localhost:3000/user/availability?source=Chennai&destination=Vellore
       * Query Parameters
          * source: Source station (e.g., "Chennai")
          * destination: Destination station (e.g., "Vellore")
       * Response:
``` bash
{
  "available": true,
  "availableTrainCount": 1,
  "trains": [
    {
      "trainNumber": "123143",
      "availableSeats": 99
    }
  ]
}

```

 4. Book Seats
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/book
       * Request Body:
       
``` bash
  {
  "trainId": 1,
  "seatsToBook": 5
}

```
 * Response:

```bash
{
  "message": "Seats booked successfully"
}
```

Note :- Requires JWT authentication.

5.  Booking Details

       * HTTP Method :- GET
       * Endpoint :- http://localhost:3000/user/get-all-booking-details

       * Response:
  
    
```bash
[
    {
        "booking_id": 1,
        "number_of_seats": 5,
        "train_number": "123143",
        "source": "Chennai",
        "destination": "Vellore"
    }
]


```


```

### Technologies Used

* Node.js: For backend logic
* Express.js: Web framework for building the RESTful API
* MySQL: Database for storing train, user, and booking data
* JWT: For authentication and authorization
* bcrypt: For hashing the passwords
* dotenv: For managing environment variables


      

      


      









   
   













