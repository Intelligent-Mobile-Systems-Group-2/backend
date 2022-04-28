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

REST API request dokumentations for backend communication

## Server base URL

`http://localhost:8080/`

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


## POST request for boundary collision

### Request

`POST /boundary-collision/`

### Example Body

    {
        "x": "43.765"
        "y": "23.845"
    }
    
