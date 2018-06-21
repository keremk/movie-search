# Movie Search service

A sample service intended to demonstrate a microservices environment. This service allows one to search for movies with a specified genre and revenues higher than the provided number. The results are provided as movie ids only.

## REST Endpoint
This service exposes a REST endpoint:

For batched support:

``` 
  GET /movies?genre=Drama&revenue=1000000&limit=5&offset=1
```

Here the query params are:

`genre`: Matches the genre of the movie. Only single genre is allowed.

`revenue`: Matches revenues greater than what is specified here.

And the response is: (where the data is an array of movie ids)

``` javascript
{
    "metadata": {
        "offset": 1,
        "limit": 5,
        "total": 54
    },
    "data": [
        194662,
        449176,
        13,
        301337,
        273481
    ]
}
```

To get a full list of genres:

```
    GET /genres
```

which will return:

``` javascript
[
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]
```

## Docker
Following ENV variables are available:

`SERVICE_NAME`: movie-search (Default)

`FAIL_PERCENT`: 0.3 (Default) - Indicates the percent of time this service will simulate a failure (500 response). This is used to simulate failures so that you can test retries, circuit breakers etc.

