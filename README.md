# Setup

* npm i
* PostgresSQL binded to ip "0.0.0.0" on port 5432 with no password
* events.jsonl file in the project's root level that holds the events data for example:
  <br/>
  { "userId": "user1", "name": "add_revenue", "value": 98 }
  <br/>
  { "userId": "user1", "name": "subtract_revenue", "value": 72 }
  <br/>
  { "userId": "user2", "name": "add_revenue", "value": 70 }
  <br/>
  { "userId": "user1", "name": "add_revenue", "value": 1 }
  <br/>
  { "userId": "user2", "name": "subtract_revenue", "value": 12 }

# Run
* npm run start <-- will start the server  
* npm run client <-- will execute the client
* npm run data_proc <-- will execute the data_processor


