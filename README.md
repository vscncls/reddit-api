# reddit api

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

* Fetch data from reddit to local DB

```
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
