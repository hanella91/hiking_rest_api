# 등산 모임 REST API

## 목록
- [등산 모임 REST API](#등산-모임-rest-api)
  - [목록](#목록)
- [프로젝트 개요](#프로젝트-개요)
  - [기술 스택](#기술-스택)
- [셋업](#셋업)
  - [필수 설치 및 정보](#필수-설치-및-정보)
  - [프로젝트 실행](#프로젝트-실행)
- [Usage](#usage)
  - [로컬 서버 실행](#로컬-서버-실행)
  - [E2E 테스트 실행](#e2e-테스트-실행)
- [REST API 문서](#rest-api-문서)
  - [Auth(인증)](#auth인증)
    - [`POST` /auth/login](#post-authlogin)
  - [Users(사용자)](#users사용자)
    - [`Schema`](#schema)
    - [`POST` /users](#post-users)
    - [`GET` /users/:id](#get-usersid)
    - [`PATCH` /users/:id](#patch-usersid)
  - [Events(등산이벤트)](#events등산이벤트)
    - [`Schema`](#schema-1)
    - [`POST` /events](#post-events)
    - [`GET` /events](#get-events)
    - [`GET` /events/:id](#get-eventsid)
    - [`PATCH` /events/:id](#patch-eventsid)
    - [`DELETE` /events/:id](#delete-eventsid)
  - [Reservations(예약)](#reservations예약)
    - [`Schema`](#schema-2)
    - [`POST` /events/:eventId/reservation](#post-eventseventidreservation)
    - [`GET` /events/:eventId/reservation/:id](#get-eventseventidreservationid)
    - [`PATCH` /events/:eventId/reservation/:id](#patch-eventseventidreservationid)
  - [Trails(등산로)](#trails등산로)
    - [`Schema`](#schema-3)
    - [`POST` /trails](#post-trails)
    - [`GET` /trails](#get-trails)
    - [`GET` /trails/:id](#get-trailsid)
    - [`PATCH` /trails/:id](#patch-trailsid)
    - [`DELETE` /trails/:id](#delete-trailsid)
- [개발자 소개](#개발자-소개)

</br>
</br>

# 프로젝트 개요
* 최신 자바스크립트 기술 스택들을 배우고 학습하기 위해 진행한 개인 프로젝트입니다.

* 이 프로젝트는 사용자들의 계정 생성 / 사용자 프로필 보기 / 등산로 정보 등록 및 공유 / 등산로 정보를 활용한 이벤트 생성 / 생성된 이벤트에 대한 참여 신청 및 예약 수락 혹은 거절의 기능을 하는 REST API 서버입니다.

* 해당 프로젝트에서 발생되는 버그는 계속해서 수정되고 있습니다.

* UPCOMMING : Swagger와 유닛테스트가 업데이트 될 예정입니다.

</br>

## 기술 스택
* Node.js
* TypeScript
* Nest.js
* Jest
* TypeORM
* MySQL

</br>
</br>


# 셋업

## 필수 설치 및 정보

Mysql 데이터베이스 서버
</br>

  *현재 사용중인 운영체제에 Mysql을 설치하고 싶지 않다면 Docker(도커)를 설치하고 도커 내 실행 가이드를 참고해 mysql을 설치하고 실행하는 방법을 추천드립니다.*

</br>

DB 정보
```
port: 3304
host : root
password : 1234
Database : hikers
```

</br>

## 프로젝트 실행



docker를 이용해 mysql 실행 :
```
$ docker pull mysql
$ docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=<password> -d -p 3306:3306 mysql:latest
$ docker start mysql-container
```

npm을 이용해 해당 프로젝트 실행 :

```
$ git clone https://github.com/hanella91/hiking_rest_api.git
$ npm install
$ npm start
```

</br>
</br>

# Usage

## 로컬 서버 실행
```
$ cd <workspace name>
$ npm run start
```

## E2E 테스트 실행
```
$ cd <workspace name>
$ npm run test:e2e
```

</br>
</br>

# REST API 문서
## Auth(인증)
### `POST` /auth/login
`Request`

*ID와 PW가 일치한 유저에 한해 토큰을 반환합니다.*
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

</br>

## Users(사용자)
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
`Request`
*새 회원을 등록합니다.*
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

*입력된 id에 해당하는 회원의 정보를 반환합니다.*

- 본인의 프로필 조회
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

- 타인의 프로필 조회
```
{
  "id": "01f4499f-c49a-4185-9ff4-76b263d66d5b",
  "username": "abcde",
  "name": "ABCDE",
  "avatarUrl": "https://gravatar.com/avatar/22f8eec523f818e55f9536b8c10b503c?s=200&d=robohash&r=x",
  "createdAt": "2022-12-25T14:13:43.395Z"
}
```

###  `PATCH` /users/:id
`Request`
*입력된 id에 해당하는 회원의 정보를 수정합니다.*
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

## Events(등산이벤트)
### `Schema`

```
{
  id: string,
  trailId: string
  userId: string,
  maxReservation: string,
  date: Date,
  description: string,
  created_at: Date,
  reservationType: Enum,    //ReservationType(manual, automatic)
  reservationtill: Date,
}
```

### `POST` /events
*새 이벤트를 등록합니다.*

`Request`
```
{
  "trailId" : "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "maxPersons": 10,
  "date" : "202301010600",
  "description" : "Let's hike together on the first day of 2023!",
  "reservationType" : "auto",
  "reservationUntill" : "202212302200"
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
*등록된 모든 이벤트 목록을 반환합니다.*

`Response 200(OK)`

```
[
  {
    "id": "320340a9-f7f4-446f-965a-2fab9a2c4adc",
    "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
    "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
    "maxReservation": 10,
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
*입력된 id에 해당하는 이벤트 정보를 반환합니다.*

`Response 200 OK`

```
{
  "id": "320340a9-f7f4-446f-965a-2fab9a2c4adc",
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
  "maxReservation": 10,
  "date": "2022-12-31T15:00:00.000Z",
  "description": "Let's hike together on the first day of 2023!",
  "createdAt": "2022-12-25T16:00:19.381Z",
  "updatedAt": "2022-12-25T16:00:19.381Z",
  "reservationType": "automatic",
  "reservationUntill": "2022-12-29T15:00:00.000Z"
}
```



### `PATCH` /events/:id
*입력된 id에 해당하는 이벤트 정보를 수정합니다.*

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
  "id": "320340a9-f7f4-446f-965a-2fab9a2c4adc",
  "trailId": "ac9bbac3-ba4a-4ca0-859b-d300ecd7d8d5",
  "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
  "maxReservation": 10,
  "date": "2022-12-31T15:00:00.000Z",
  "description": "Hiking Event description updated!",
  "createdAt": "2022-12-25T16:00:19.381Z",
  "updatedAt": "2022-12-25T16:59:05.000Z",
  "reservationType": "manual",
  "reservationUntill": "2022-12-29T15:00:00.000Z",
  "maxPersons": 12
}
```

### `DELETE` /events/:id
*입력된 id에 해당하는 이벤트 정보와 등록된 예약목록을 삭제합니다.*

`Respose 204 No Content`

</br>

## Reservations(예약)
### `Schema`
```
{
  id: string,
  eventId: string,
  userId : string,
  createdAt: Date,
  updatedAt: Date,
  status: Enum,     // StatusType(requested, accepted, refused, canceled)
  queue: number
}
```

### `POST` /events/:eventId/reservation

*입력된 eventId에 해당하는 예약을 등록합니다.*

`Response 201 Created`
```
{
  "eventId": "122335e7-cd6f-458a-8a04-16bd33ab76a7",
  "userId": "ae314e83-aa93-4022-8b19-936c920d5442",
  "updatedAt": "2022-12-25T17:16:17.100Z",
  "queue": null,
  "id": "18ec5cfe-3a62-46e3-b583-f1ae46aa4665",
  "createdAt": "2022-12-25T17:16:17.100Z",
  "status": "requested"
}
```

### `GET` /events/:eventId/reservation/:id

*입력된 eventId에 해당하는 예약목록을 반환합니다.*

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

*입력된 eventId에 해당하는 예약정보를 수정합니다.*

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


## Trails(등산로)
### `Schema`
```
{
  id: string,
  mountainName: string,
  trailName: string,
  userId : string,
  distance : number,
  duration: number,
  difficulty: Enum,   // DifficultyType(easy/moderate/hard),
  startPoint: string,
  endPoint: string,
  createdAt: Date,
  updatedAt: Date
}
```

### `POST` /trails

*등산로 정보를 등록합니다.*

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

*모든 트레일 목록을 반환합니다.*
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

*입력된 id에 해당하는 트레일 정보를 반환합니다.*
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

*입력된 id에 해당하는 트레일 정보를 수정합니다.*

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

*입력된 id에 해당하는 트레일 정보를 삭제합니다.*

`Response 204 No Content`


</br>




# 개발자 소개
2년차 개발자로 데이터를 활용한 마케팅 솔루션 기업에서 1년간 재직하였습니다. 주로  이미 서비스를 이용하고 있는 다양한 기업의 고도화 프로젝트에 투입되어 개발을 했으며 자바 REST API 서버를 개발한 경험이 있습니다.

새로운 기술과 비즈니스에 호기심이 많으며 스스로 학습하면서 동료들과 협업하며 지식을 공유하고 함께 성장하는 것에 큰 기쁨을 느끼고 비즈니스의 가치를 구현하고 기업의 성장에 기여하는 데서 저의 가치가 실현된다고 믿기에 비즈니스의 목적과 가치를 제대로 파악하면서 자기 주도적으로 일 하는 것을 좋아합니다.








