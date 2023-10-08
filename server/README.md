### Steps to setup and start the server application

### create .env file setup below variables appropriate

### mention below port number

```
PORT=3000
```
### change the below url with appropriate the postgresql username & password

```
DATABASE_URL="postgresql://postgres:admin@123@localhost:5432/mydb?schema=public"

```
### put any random string for secret key as below

```
SECRET_KEY="commonUniqueStringText" 
```
### Install typescript globally in the system
```
npm install -g typescript

```
### install postgresql database in the system
### Run the below commands in the project directory to migrate the model in postgresql using the defined model
### In the project directory, you can run:
### Prisma reference - https://www.prisma.io/docs/getting-started/quickstart
```
npx prisma migrate dev
```
### Run below command Install all the dependancy packages

```
npm install

```
### Run below command to compile and start the server

```
npm run dev

```
