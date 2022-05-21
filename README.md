# IMS G2 Backend

## Building development environment

This command launches a real-time updating typescript compiler inside a docker container, the server is ran at port 8080.
`docker-compose up`

## Running tests

- cd into rest_api
- run `npm run test`

# REST API

REST API request documentations for backend communication

## Server base URL

`http://ims.matteobernardi.fr`

## PUT request for object collision

### Request

`PUT /object-collision`

### Example Request

    {
        "x": "43"
        "y": "23"
        "photo": <file upload>
    }

### Response

    {
        "object": "Dog"
    }

Responds with a 201 Created status code.

## PUT request for boundary collision

### Request

`PUT /boundary-collision`

### Example Body

    {
        "x": "43"
        "y": "23"
    }

Responds with a 201 Created status code.
    
## GET request for object collisions

### Request

`GET /object-collision`
 
### Response
```json
{
    "01-12-2022": [
        {
            "time": "4:12:00",
            "x": "43",
            "y": "23",
            "object": "Dog"
        },
    ],
    "01-13-2022": [{...}]
}
```

## GET request for boundary collisions 

### Request

`GET /boundary-collision`
    
### Response
```json
{
    "01-12-2022": [
        {
            "time": "4:12:00",
            "x": "43",
            "y": "23"
        },
    ],
    "01-13-2022": [{...}]
}
```

Notes regarding both GET /boundary-collision and GET /object-collision

Optional query parameter: `date` will return all the collisions within that date. Also adding `time` will return the collisions the last 5 minutes from before that time. The time interval is configurable in the server.

Example for that is `GET /boundary-collision?date=01-12-2022&time=4:12:00`

Both GET requests respond with a 200 OK status code, even if the database is empty or the date does not contain any collisions.
