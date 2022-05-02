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

## POST request for object collision

### Request

`POST /object-collision/`

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
    
## GET request for object collisions at specific date 

### Request

`GET /object-collision/`

### Example Body

    {
        "date": "4/28/2022"
    }
 
### Response

    {
        "time": "4:12:48 PM",
        "x": "43.765",
        "y": "23.845",
        "object": "Dog"
    }
    
## GET request for all object collisions

### Request

`GET /object-collision/`
 
### Response

    {
        "time": "4:12:48 PM",
        "x": "43.765",
        "y": "23.845",
        "object": "Dog"
    }


## POST request for boundary collision

### Request

`POST /boundary-collision/`

### Example Body

    {
        "x": "43.765"
        "y": "23.845"
    }
    

## GET request for boundary collisions at specific date 

### Request

`GET /boundary-collision/`

### Example Body

    {
        "date": "4/28/2022"
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
        "time": "4:12:48 PM",
        "x": "43.765",
        "y": "23.845"
    }
