# Dockerise NodeJs + ReactJs + Postgres

### Development

- Requirement: `docker` & `docker-compose`
- Go to root folder and run: `docker-compose up -d`
- Exec to server container, cd to server then run `node create-lb-tables.js`
- React app run in http://localhost:3000
- CRUD API explorer: http://localhost:3001/explorer

### Sample Data

- Create users: support 2 types of roles - admin & staff

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "email": "test1%40xyz.com", \ 
   "password": "123456", \ 
   "role": "admin", \ 
   "username": "test1", \ 
 }' 'http://localhost:3001/api/users'
 ```

 - Create message (authentication required):

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse rutrum sollicitudin luctus", \ 
   "version": "1.0" \ 
 }' 'http://localhost:3001/api/messages?access_token=ACCESS_TOKEN'
 ```
