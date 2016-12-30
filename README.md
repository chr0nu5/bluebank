# Blue Bank

Node.js implementation


# SETUP

```docker-compose build web```
```docker-compose start db```
```docker exec -it bluebank_db_1 psql -U postgres```
```create database bluebank;```
```create database bluebank_tests;```

# RUN

```docker-compose up web```

# TESTS

```docker-compose start db```
```docker-compose run web sh tests```
