# IMS G2 Backend

## Building development environment

This command launches a real-time updating typescript compiler inside a docker container, the server is ran at port 8080.
```
docker-compose up (windows)
docker compose up (unix)
```

## Running tests

- cd into rest_api
- run 
```
npm run test
```

# REST API

REST API request documentations for backend communication

## Server base URL

`http://ims.matteobernardi.fr/`

## PUT request for object collision

### Request

`PUT /object-collision/`

### Example Body

    {
        "x": "43.765"
        "y": "23.845"
        "photo": dogImage.jpg 
    }

### Response

    {
        object: "Dog"
    }
    
## GET request for object collisions at specific date & time

### Request

`GET /object-collision/`

### Example Body

    {
        "date": "4/28/2022",
        "time": "14:12:00"
    }
 
### Response

    {
        "time": "14:12:00",
        "x": "43.765",
        "y": "23.845",
        "object": "Dog"
    }
    
## GET request for all object collisions

### Request

`GET /object-collision/`
 
### Response

    {
        "time": "14:12:00",
        "x": "43.765",
        "y": "23.845",
        "object": "Dog"
    }


## PUT request for boundary collision

### Request

`PUT /boundary-collision/`

### Example Body

    {
        "x": "43.765"
        "y": "23.845"
    }
    

## GET request for boundary collisions at specific date & time

### Request

`GET /boundary-collision/`

### Example Body

    {
       "date": "4/28/2022",
       "time": "14:12:00"
    }
    
### Response

    {
        "time": "4:12:48 PM",
        "x": "43.765",
        "y": "23.845"
    }
    
## GET request for all boundary collisions 

### Request

`GET /boundary-collision/`
    
### Response

    {
        "time": "4:12:00",
        "x": "43.765",
        "y": "23.845"
    }
