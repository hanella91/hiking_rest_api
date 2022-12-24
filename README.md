# Hiking REST API
Hiking group matching website API application

## Overview
- [Hiking REST API](#hiking-rest-api)
  - [Overview](#overview)
- [General description](#general-description)
  - [Technologies](#technologies)
- [Setup](#setup)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Usage](#usage)
  - [Start local server](#start-local-server)
  - [Run functional Tests.](#run-functional-tests)
- [REST API Documentation](#rest-api-documentation)
  - [Auth](#auth)
  - [Users](#users)
    - [`Schema`](#schema)
  - [Events](#events)
    - [`Schema`](#schema-1)
    - [`GET` /events](#get-events)
    - [`GET` /events/:id](#get-eventsid)
    - [`POST` /events](#post-events)
    - [`PATCH` /events/:id](#patch-eventsid)
    - [`DELETE` /events/:id](#delete-eventsid)
  - [Reservations](#reservations)
    - [`Schema`](#schema-2)
  - [Trails](#trails)
- [About me](#about-me)

# General description
Rest API server for a web site where members can communicate with each other, find various hiking trails and meetings, and enjoy hiking with other users.

</br>

## Technologies

* Node.js
* TypeScript
* Nest.js
* Jest
* TypeORM
* MySQL

# Setup

## Requirements

- Mysql server

to not have to install mysql on your local machine, i recommend to install docker and lunch mysql with the command given in the setup.

## Installation

Database info:
```
port: 3304
host : root
password : 1234
Database : hikers
```

docker run command:
```
$ docker run mysql -p
```

To run this project, install it locally using npm:

```
$ cd ../hikers
$ npm install
$ npm start
```

# Usage
## Start local server
```
$ cd ../hikers
$ npm run start
```


## Run functional Tests.
```
$ cd ../hikers
$ npm run test:e2e
```

# REST API Documentation
## Auth


## Users
### `Schema`
```
{
  id: string,
  user_name: string,
  password : string,
  name: string,
  email: string,
  avatar_url: string,
  created_at: string
}
```

`POST` /users
```
```

`GET` /users/:id
```
```

`PATCH` /users/:id
```
```

</br>

## Events
### `Schema`

```
{
  id: string,
  trail_id: string
  user_id: Date,
  max_persons: string,
  date: string,
  description: string,
  created_at: string,
  reservation_type: string,
  reservation_untill: string,
}
```


### `GET` /events
*Get all Events.*

`Response 200(OK)`

```
{
    [event, event ....]
}
```




### `GET` /events/:id
*Get an event that correspond to an id.*

`Response 200 OK`

```
event
```


### `POST` /events
*Creat an event.*

`Request`
```
{
  trail_name : I don't know how I should do with the data structure on here ...
  location,
  duration,
  difficulty,
  start_point,
  end_point,
  user_id,
  max_persons,
  date,
  description,
  reservation_type,
  reservation_untill,
}
```
`Response 201 Created`
```
{
    event : EventDto
}
```

### `PATCH` /events/:id
*Update an event that correspond to an id.*

`Request`
```
{
  trail_name,
  location,
  duration,
  difficulty,
  start_point,
  end_point,
  user_id,
  max_persons,
  date,
  description,
  reservation_type,
  reservation_untill,
}
```
`Response 200 OK`

```
{
    event : EventDto
}
```


### `DELETE` /events/:id
*Delete an event and realational reservations that correspond to an id.*

`Respose 204 No Content`

</br>

## Reservations
### `Schema`
```
{
  id: string,
  user_name: string,
  password : string,
  name: string,
  email: string,
  avatar_url: string,
  created_at: string
}
```

`POST` /events/:eventId/reservation

*Create a reservation that correspond to an eventId.*

```
```

`GET` /events/:eventId/reservation/:id

*Return a reservation that correspond to an eventId and id.*
```
```

`PATCH` /events/:eventId/reservation/:id

*Update the status of reservation that correspond to an eventId and id.*
```
```

</br>


## Trails



# About me
I'm a junior web developer with 1 year experience in Marketing solution company based on Java and Spring framework. I did this project in order to apprehend modern javascript backend skills to get wider and many different apportunity in my career by referring to the fact that many companies and startups provide services using the latest JavaScript technology. I will continue to update by adding Swagger and Unit Test codes.





