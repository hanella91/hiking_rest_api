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
    - [`GET` /users/:id](#get-usersid)
  - [Events](#events)
    - [`Schema`](#schema-1)
    - [`POST` /events](#post-events)
    - [`GET` /events](#get-events)
    - [`GET` /events/:id](#get-eventsid)
    - [`PATCH` /events/:id](#patch-eventsid)
    - [`DELETE` /events/:id](#delete-eventsid)
  - [Reservations](#reservations)
    - [`Schema`](#schema-2)
    - [`POST` /events/:eventId/reservation](#post-eventseventidreservation)
    - [`GET` /events/:eventId/reservation/:id](#get-eventseventidreservationid)
    - [`PATCH` /events/:eventId/reservation/:id](#patch-eventseventidreservationid)
  - [Trails](#trails)
    - [`Schema`](#schema-3)
    - [`POST` /trails](#post-trails)
    - [`GET` /trails](#get-trails)
    - [`GET` /trails/:id](#get-trailsid)
    - [`PATCH` /trails/:id](#patch-trailsid)
    - [`DELETE` /trails/:id](#delete-trailsid)
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
`Request`
*Create new user*
```
{
  "username" : "hanellej",
  "password" : "abcd1234",
  "name" : "Hanelle Jeong",
  "email": "hanelle@gmail.com",
  "avatarUrl" : "https://gravatar.com/avatar/22f8eec523f818e55f9536b8c10b503c?s=200&d=robohash&r=x"
}
```
`Response 201 Created`
```
{
  "username": "hanellej",
  "password": "$2b$10$NLXMDFqnmRy1pDZvAGqE7eJHBlyUmYNMlafObs21W6PHUxgNbEFNi",
  "name": "Hanelle Jeong",
  "email": "hanelle@gmail.com",
  "avatarUrl": "https://gravatar.com/avatar/22f8eec523f818e55f9536b8c10b503c?s=200&d=robohash&r=x",
  "createdAt": "2022-12-24T17:02:25.048Z",
  "id": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5"
}
```

### `GET` /users/:id
`Response 200 OK`
*Return an user that correspond to an id.*
```
{
    "id": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
    "username": "hanellej",
    "name": "Hanelle Jeong",
    "avatarUrl": "https://gravatar.com/avatar/22f8eec523f818e55f9536b8c10b503c?s=200&d=robohash&r=x",
    "createdAt": "2022-12-24T08:02:25.048Z",
    "email": "hanelle@gmail.com"
}
```

`PATCH` /users/:id
`Request`
*Update an user that correspond to an id.*
```
{
  "username" : "hanellej",
  "name" : "Changed Name",
  "avatarUrl" : null
}
```

`Response 200 OK`
```
{
    "id": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
    "username": "hanellej",
    "password": "$2b$10$1ZGIImpVuh5LTkO4r2kINO09oUH4EV8B.aUqXSrEMuWGUPQLnPsY6",
    "name": "Changed Name",
    "email": "hanelle@gmail.com",
    "avatarUrl": null,
    "createdAt": "2022-12-24T17:02:25.048Z",
}
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

### `POST` /events
*Creat an event.*

`Request`
```
{
  "trailId" : "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "maxPersons": 10,
  "date" : "20230101",
  "description" : "Let's hike together on the first day of 2023!",
  "reservationType" : "auto",
  "reservationUntill" : "20221230"
}
```
`Response 201 Created`
```
{
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "maxPersons": 10,
  "date": "20230101",
  "description": "Let's hike together on the first day of 2023!",
  "reservationType": "auto",
  "reservationUntill": "20221230",
  "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "updatedAt": "2022-12-24T10:02:18.384Z",
  "id": "122335e7-cd6f-458a-8a04-16bd33ab76a7",
  "createdAt": "2022-12-24T10:02:18.384Z"
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
{
  "id": "122335e7-cd6f-458a-8a04-16bd33ab76a7",
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "maxPersons": 10,
  "date": "2022-12-31T15:00:00.000Z",
  "description": "Let's hike together on the first day of 2023!",
  "createdAt": "2022-12-24T10:02:18.384Z",
  "updatedAt": "2022-12-24T10:02:18.384Z",
  "reservationType": "auto",
  "reservationUntill": "2022-12-29T15:00:00.000Z"
}
```


### `PATCH` /events/:id
*Update an event that correspond to an id.*

`Request`
```
{
  "maxPersons": 12,
  "description" : "Hiking Event description updated!",
  "reservationType" : "manual"
}
```
`Response 200 OK`

```
{
  "id": "122335e7-cd6f-458a-8a04-16bd33ab76a7",
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "maxPersons": 12,
  "date": "2022-12-31T15:00:00.000Z",
  "description": "Hiking Event description updated!",
  "createdAt": "2022-12-24T10:02:18.384Z",
  "updatedAt": "2022-12-24T10:11:23.000Z",
  "reservationType": "manual",
  "reservationUntill": "2022-12-29T15:00:00.000Z"
}
```


### `DELETE` /events/:id
*Delete an event and realational reservations that correspond to an id.*

```
1 resource deleted successfully.
```

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

### `POST` /events/:eventId/reservation

*Create a reservation that correspond to an eventId.*


### `GET` /events/:eventId/reservation/:id

*Return a reservation that correspond to an eventId and id.*


### `PATCH` /events/:eventId/reservation/:id

*Update the status of reservation that correspond to an eventId and id.*


</br>


## Trails
### `Schema`
```
{
  id: string,
  mountainName: string,
  trail_name: string,
  user_id : string,
  distance : int,
  duration: int,
  difficulty: DifficultyType // (easiest/moderate/strenous),
  startPoint: string,
  endPoint: string,
  createdAt: Date,
  updatedAt: Date
}
```

### `POST` /trails

*Create a trail*

`Reqeust`
```
{
  "mountainName": "Hallasan Mountain",
  "trailName": "Seongpanak Trail",
  "distance":  18.5,
  "duration":  435,
  "difficulty": "hard",
  "startPoint": "Seongpanak",
  "endPoint": "Summit"
}
```

`Response 201 Created`
```
{

  "mountainName": "Hallasan Mountain",
  "trailName": "Seongpanak Trail",
  "distance": 18.5,
  "duration": 435,
  "difficulty": "hard",
  "startPoint": "Seongpanak",
  "endPoint": "Summit",
  "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "updatedAt": "2022-12-24T09:12:27.957Z",
  "id": "aa86f939-e82b-4dd3-9d84-ae7bf79aebbe",
  "createdAt": "2022-12-24T09:12:27.957Z"
}
```


### `GET` /trails

*Get All Trails*
```
[
  {
    ...trail
  },
  {
    ...trail
  }
]
```
### `GET` /trails/:id

*Return a trail that correspond to an id.*
```
{
  "id": "aa86f939-e82b-4dd3-9d84-ae7bf79aebbe",
  "mountainName": "Hallasan Mountain",
  "trailName": "Seongpanak Trail",
  "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "distance": 18,
  "duration": 435,
  "difficulty": "hard",
  "startPoint": "Seongpanak",
  "endPoint": "Summit",
  "createdAt": "2022-12-24T09:12:27.957Z",
  "updatedAt": "2022-12-24T09:12:27.957Z"
}
```

### `PATCH` /trails/:id

*Update a trail that correspond to an id.*

`Request`
```
{
  "mountainName": "Updated Hallasan Mountain",
  "trailName": "Updated Seongpanak Trail",
  "startPoint": "Updated Seongpanak"
}
```

`Response 200 OK`
```
{
  "id": "aa86f939-e82b-4dd3-9d84-ae7bf79aebbe",
  "mountainName": "Updated Hallasan Mountain",
  "trailName": "Updated Seongpanak Trail",
  "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "distance": 18,
  "duration": 435,
  "difficulty": "hard",
  "startPoint": "Updated Seongpanak",
  "endPoint": "Summit",
  "createdAt": "2022-12-24T09:12:27.957Z",
  "updatedAt": "2022-12-24T09:44:37.000Z"
}
```

### `DELETE` /trails/:id
*Delete a trail that correspond to an id.*
`Response 200 OK`
```
1 resource deleted successfully.
```

</br>


# About me
I'm a junior web developer with 1 year experience in Marketing solution company based on Java and Spring framework. I did this project in order to apprehend modern javascript backend skills to get wider and many different apportunity in my career by referring to the fact that many companies and startups provide services using the latest JavaScript technology. I will continue to update by adding Swagger and Unit Test codes.





