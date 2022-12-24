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
    - [`User Schema`](#user-schema)
    - [`POST` /users](#post-users)
    - [`GET` /users/:id](#get-usersid)
    - [`PATCH` /users/:id](#patch-usersid)
  - [Events(등산이벤트)](#events등산이벤트)
    - [`Schema`](#schema)
    - [`POST` /events](#post-events)
    - [`GET` /events](#get-events)
    - [`GET` /events/:id](#get-eventsid)
    - [`PATCH` /events/:id](#patch-eventsid)
    - [`DELETE` /events/:id](#delete-eventsid)
  - [Reservations(예약)](#reservations예약)
    - [`Schema`](#schema-1)
  - [Trails(등산로)](#trails등산로)
    - [`Schema`](#schema-2)
    - [`POST` /trails](#post-trails)
    - [`GET` /trails](#get-trails)
    - [`GET` /trails/:id](#get-trailsid)
    - [`PATCH` /trails/:id](#patch-trailsid)
    - [`DELETE` /trails/:id](#delete-trailsid)
- [개발자 소개](#개발자-소개)

</br>
</br>

# 프로젝트 개요
많은 사람들의 취미가 등산으로 자리 매김하고있는 요즈음 다양한 등산로와 모임을 찾아 매 번 다양한 사람들과 함께 등산을 즐길 수 있도록 등산모임, 등산로정보, 등산모임 참여 및 예약, 회원들끼리 소통을 할 수 있는 웹 어플리케이션용 API입니다.


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

*간단한 환경설정을 위해 Docker(도커)를 설치하고 도커 내 실행 가이드를 참고해 mysql을 설치하고 실행하는 방법을 추천드립니다.*

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
$ docker run mysql -p
```

npm을 이용해 해당 프로젝트 실행 :

```
$ cd ../hikers
$ npm install
$ npm start
```

</br>
</br>

# Usage

## 로컬 서버 실행
```
$ cd ../hikers
$ npm run start
```

## E2E 테스트 실행
```
$ cd ../hikers
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

`Response`
```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImhhbmVsbGVqIiwidXNlcklkIjoiNzJmMjVmZWYtNjA5Ny00YzI1LWI1YjYtYWEyM2YzNmE3YmM1IiwiaWF0IjoxNjcxOTAxNDEwLCJleHAiOjE2NzE5MDUwMTB9.-R2d2vXOykXBB7l6UAlsGEvFT6kyM5rq4sv8sY8mvd8"
}
```

</br>

## Users(사용자)
### `User Schema`
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
*입력된 id에 해당하는 회원의 정보를 반환합니다.*
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

###  `PATCH` /users/:id
`Request`
*입력된 id에 해당하는 회원의 정보를 수정합니다.*
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

## Events(등산이벤트)
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
*새 이벤트를 등록합니다.*

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
*등록된 모든 이벤트 목록을 반환합니다.*

`Response 200(OK)`

```
[
  {
    ...event
  },
  {
    ...event
  }
]
```




### `GET` /events/:id
*입력된 id에 해당하는 이벤트 정보를 반환합니다.*

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
*입력된 id에 해당하는 이벤트 정보와 등록된 예약목록을 삭제합니다.*

`Respose 204 No Content`

</br>

## Reservations(예약)
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

*입력된 eventId에 해당하는 예약을 등록합니다.*
```
```

`GET` /events/:eventId/reservation/:id

*입력된 eventId에 해당하는 예약목록을 반환합니다.*
```
```

`PATCH` /events/:eventId/reservation/:id

*입력된 eventId에 해당하는 예약정보를 수정합니다.*
```
```

</br>


## Trails(등산로)
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
    ...trail
  },
  {
    ...trail
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
`Response 200 OK`
```
1 resource deleted successfully.
```

</br>




# 개발자 소개
저는 약 1년간 자바 기반의 마케팅 솔루션을 개발한 경험이 있는 주니어 웹 개발자입니다.
최근 많은 기업과 스타트업에서 최신 자바스크립트 기술을 사용한다는 점을 참고해 해당 스택들을 배움으로써 더욱 다양하고 폭넓은 기회를 얻고자 본 프로젝트를 진행하게 되었으며 앞으로도 Swagger와 유닛테스트 코드를 추가함으로써 업데이트 할 예정입니다.








