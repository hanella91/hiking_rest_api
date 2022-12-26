# Hiking REST API
[README(KR) </br>
*README 한글 버전은 여기를 클릭해주세요.*](https://github.com/hanella91/hiking_rest_api/blob/master/README.ko-KO.md)

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
    - [`POST` /auth/login](#post-authlogin)
  - [Users](#users)
    - [`Schema`](#schema)
    - [`POST` /users](#post-users)
    - [`GET` /users/:id](#get-usersid)
    - [`PATCH` /users/:id](#patch-usersid)
  - [Events](#events)
    - [`Schema`](#schema-1)
    - [`POST` /events](#post-events)
    - [`GET` /events](#get-events)
    - [`GET` /events/:id](#get-eventsid)
    - [`PATCH` /events/:id](#patch-eventsid)
    - [`DELETE` /events/:id](#delete-eventsid)
  - [Reservations](#reservations)
    - [**Reservation status workflow**](#reservation-status-workflow)
    - [- manual reservation ](#--manual-reservation-)
    - [- automatic reservation](#--automatic-reservation)
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
* This is a personal project in order to learn modern javascript technologies.

* This project is a REST API server that functions to create user accounts / view user profiles / register and share hiking trail information / create events using hiking trail information / apply for participation in created events and accept or reject reservations.

* Bugs occurring in the project are continuously being fixed

* UPCOMMING: Swagger and unit tests will be updated.

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

If you wouldn't like to install mysql on your local machine, I recommend to install docker and lunch mysql with the command given in the setup.

## Installation

Database info:
```
port: 3306
host : root
password : 1234
Database : hikers
```

mysql start command on docker:
```
$ docker run -e MYSQL_ROOT_PASSWORD=<password> -d -p 3306:3306 mysql:latest
```

To run this project, install it locally using npm:

```
$ git clone https://github.com/hanella91/hiking_rest_api.git
$ cd hiking_rest_api
$ npm install
```

# Usage
## Start local server
```
$ npm run start
```


## Run functional Tests.
```
$ npm run test:e2e
```

# REST API Documentation
## Auth
### `POST` /auth/login

*Return access token for a logged-in user.*

`Request`

```
{
  "username" : "hanellej",
  "password" : "abcd1234"
}
```

`Response 201 Created`

```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImhhbmVsbGVqIiwidXNlcklkIjoiNzJmMjVmZWYtNjA5Ny00YzI1LWI1YjYtYWEyM2YzNmE3YmM1IiwiaWF0IjoxNjcxOTAxNDEwLCJleHAiOjE2NzE5MDUwMTB9.-R2d2vXOykXBB7l6UAlsGEvFT6kyM5rq4sv8sY8mvd8"
}
```

## Users
### `Schema`
```
{
  id: string,
  username: string,
  password : string,
  name: string,
  email: string,
  avatarUrl: string,
  createdAt: Date
}
```

### `POST` /users

*Create new user*

`Request`
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
  "id": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
  "username": "hanellej",
  "name": "Hanelle Jeong",
  "email": "hanelle@gmail.com",
  "avatarUrl": "https://gravatar.com/avatar/22f8eec523f818e55f9536b8c10b503c?s=200&d=robohash&r=x",
  "createdAt": "2022-12-24T17:02:25.048Z"
}
```

### `GET` /users/:id

*Return an user for a given id.*


`Response 200 OK`
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

*when the logged-in user is not the owner of given id, 'email' will not be returned.*

 </br>

### `PATCH` /users/:id

*Update an user for a given id.*

`Request`
```
{
  "name" : "New Name",
  "avatarUrl" : null
}
```

`Response 200 OK`
```
{
  "id": "ae314e83-aa93-4022-8b19-936c920d5442",
  "username": "hanellej",
  "name": "New Name",
  "email": "hanelle@gmail.com",
  "avatarUrl": null,
  "createdAt": "2022-12-25T19:22:21.529Z"
}
```

</br>

## Events

### `Schema`

```
{
  id: string,
  trailId: string
  userId: string,
  maxReservations: number,
  date: Date,
  description: string,
  created_at: Date,
  reservationType: Enum,    // manual, automatic
  reservationtill: Date,
}
```

### `POST` /events

*Creat new event.*

`Request`

```
{
  "trailId" : "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "maxReservations": 10,
  "date" : "2023-01-01T06:00:00.000Z",
  "description" : "Let's hike together on the first day of 2023!",
  "reservationType" : "automatic",
  "reservationUntill" : "2023-01-01T00:00:00.000Z"
}
```

`Response 201 Created`

```
{
    "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
    "maxReservations": 10,
    "date": "2023-01-01T06:00:00.000Z",
    "description": "Let's hike together on the first day of 2023!",
    "reservationType": "automatic",
    "reservationUntill": "2023-01-01T00:00:00.000Z",
    "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
    "updatedAt": "2022-12-25T23:22:01.013Z",
    "id": "0c4aae99-ccac-4d69-bb4b-13e146da6c8b",
    "createdAt": "2022-12-25T23:22:01.013Z"
}
```

### `GET` /events

*Get all Events.*

`Response 200 OK `

```
[
  {
    "id": "320340a9-f7f4-446f-965a-2fab9a2c4adc",
    "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
    "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
    "maxReservations": 10,
    "date": "2022-12-31T15:00:00.000Z",
    "description": "Let's hike together on the first day of 2023!",
    "createdAt": "2022-12-25T16:00:19.381Z",
    "updatedAt": "2022-12-25T16:00:19.381Z",
    "reservationType": "automatic",
    "reservationUntill": "2022-12-29T15:00:00.000Z"
  },
  {
    ...
  }
]
```




### `GET` /events/:id

*Get an event for given id*

`Response 200 OK`

```
{
  "id": "320340a9-f7f4-446f-965a-2fab9a2c4adc",
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
  "maxReservations": 10,
  "date": "2022-12-31T15:00:00.000Z",
  "description": "Let's hike together on the first day of 2023!",
  "reservationType": "automatic",
  "reservationUntill": "2022-12-29T15:00:00.000Z"
  "createdAt": "2022-12-25T16:00:19.381Z",
  "updatedAt": "2022-12-25T16:00:19.381Z",
}
```


### `PATCH` /events/:id

*Update an event for given id.*

`Request`
```
{
  "maxReservations": 12,
  "description" : "Hiking Event description updated!",
  "reservationType" : "manual"
}
```
`Response 200 OK`

```
{
  "id": "320340a9-f7f4-446f-965a-2fab9a2c4adc",
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
  "maxReservations": 10,
  "date": "2022-12-31T06:00:00.000Z",
  "description": "Hiking Event description updated!",
  "createdAt": "2022-12-25T16:00:19.381Z",
  "updatedAt": "2022-12-25T16:59:05.000Z",
  "reservationType": "manual",
  "reservationUntill": "2023-01-01T15:00:00.000Z",
}
```


### `DELETE` /events/:id

*Delete an event and realational reservations for given id.*

`Respose 204 No Content`

</br>

## Reservations

### **Reservation status workflow**

  ### - manual reservation </br>

  default  : requested </br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | -> accepted </br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | -> refused </br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | -> canceled </br>

  ### - automatic reservation</br>
  default : accepted


### `Schema`
```
{
  id: string,
  eventId: string,
  userId : string,
  createdAt: Date,
  updatedAt: Date,
  status: Enum,     // requested, accepted, refused, canceled
  queue: number
}
```
*-queue will be created aumatically when the created reservation count is bigger than maxReservation of event.*

</br>

### `POST` /events/:eventId/reservation

*Create a reservation for given eventId.*

`Reqest`

*- This request doesn't require any Request body.*

`Response 201 Created`
```
{
  "id": "18ec5cfe-3a62-46e3-b583-f1ae46aa4665",
  "eventId": "122335e7-cd6f-458a-8a04-16bd33ab76a7",
  "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
  "updatedAt": "2022-12-25T17:16:17.100Z",
  "createdAt": "2022-12-25T17:16:17.100Z",
  "status": "requested"
  "queue": null,
}
```


### `GET` /events/:eventId/reservation/:id

*Return a reservation for given eventId.*

`Response 200 OK`
```
[
  {
      "id": "18ec5cfe-3a62-46e3-b583-f1ae46aa4665",
      "eventId": "122335e7-cd6f-458a-8a04-16bd33ab76a7",
      "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
      "createdAt": "2022-12-25T17:16:17.100Z",
      "updatedAt": "2022-12-25T17:16:17.100Z",
      "status": "requested",
      "queue": null
  },
  { ... }
]
```


### `PATCH` /events/:eventId/reservation/:id

*Update the status of reservation for given eventId and id.*

`Reqeust`
```
{
  "status" : "accepted"
}
```

`Reseponse 200 OK`
```
{
  "status": "accepted",
  "id": "18ec5cfe-3a62-46e3-b583-f1ae46aa4665"
}
```

</br>


## Trails

### `Schema`
```
{
  id: string,
  mountainName: string,
  trailName: string,
  userId : string,
  distance : number,  // km
  duration: number,   // minutes
  difficulty: Enum,   // easy, moderate, hard
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

*Return All Trails*

```
[
  {
    "id": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
    "mountainName": "Hallasan Mountain",
    "trailName": "Seongpanak Trail",
    "userId": "72f25fef-6097-4c25-b5b6-aa23f36a7bc5",
    "distance": 18,
    "duration": 435,
    "difficulty": "hard",
    "startPoint": "Seongpanak",
    "endPoint": "Summit",
    "createdAt": "2022-12-24T10:01:23.392Z",
    "updatedAt": "2022-12-24T10:01:23.392Z"
  },
  {
    ...
  }
]
```

### `GET` /trails/:id

*Return a trail for given id.*
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

*Update a trail for given id.*

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

`Respose 204 No Content`

</br>


# About me
I'm a junior web developer with 1 year experience in Marketing solution company based on Java and Spring framework.

My core values as a developer are meticulousness, proactive attitude, positive mindset, ability to collaborate, challenging spirit, and willingness to achieve and learn.





