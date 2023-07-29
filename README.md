1. To run the project type "npm i", "tsc"(optional), then "npm run start".
2. There are 2 endpoints in the project: 

    to create a timer use this:

    curl --location --request POST 'http://localhost:3000/timers' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "hours": 0,
    "minutes": 0,
    "seconds": 15,
    "url": "http://localhost:3000/test"
    }'

    to get timer info use this:

    curl --location --request GET 'http://localhost:3000/timers/6250' \
    --data-raw ''

3. There is an additional endpoint for testing webhooks:
   POST "http://localhost:3000/test"

4. Dockerfile wasn't tested - i'm working on a Windows machine.

5. Please contact me if you get a mongo error - i had to add my ip to the mongo server.