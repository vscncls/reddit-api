## How to run

### DEV

* Start Postgres Databse using docker-compose

```bash
docker-compose up -d
```

* Copy the example environment file

```bash
cp .env.example .env
```
* Install dependencies

```bash
npm i
```

* Run migrations

```bash
node migrate up
```

* Fetch data from reddit to local DB

```
npx tsc
npm run fetch-posts
```

* Start the API

```
npm run server:dev
```

#### With docker

```bash
docker build . -t reddit-api
docker run reddit-api --env-file=.env
```

## Routine

Ideally data should be fetched from reddit on a daily basis, to do that you have a couple of options

### Crontab

read: https://wiki.archlinux.org/title/Cron#Basic_commands

```
# crontab -e
0 0 * * * cd /PROJECT/DIR && npm i && npx tsc && npm run fetch-posts
```

### K8S cronjob using the dockerfile

read: https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/

### Systemd Timer

read: https://fedoramagazine.org/systemd-timers-for-scheduling-tasks/

## Endpoints

### /posts

Returns all posts withing specified time range and sorted by Upvotes or Comments

Example request:

```
http://localhost:8080/posts?startDate=2010-01-01&endDate=2030-01-01&sortBy=COMMENTS
```

Example response:

```json
[
  {
    "title": "My artificial intelligence undergraduate degree has c++ as the main programming language. Is this a good thing?",
    "author": "t2_39rtbz22",
    "createdAt": "2021-07-10T23:03:15.000Z",
    "upvotes": 36,
    "commentsCount": 57
  },
  ...
]
```

### /users

Returns all recorded users sorted by total number of Upvotes or Comments

Example:

```
http://localhost:8080/users?sortBy=COMMENTS
```

Example response:

```json
[
  "t2_39rtbz22",
  "t2_1m7ig4ff",
  "t2_3dncp",
  ...
]
```

## Tests

Tests are located uneder src/__tests__/ and are classified as: unit, integration or e2e

To run the tests run `npm run tests:unit`, `npm run tests:integration`, `npm run tests:e2e`

Note: to run integration or e2e tests the databse needs to be running
