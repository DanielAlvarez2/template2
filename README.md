create .env file
PORT=9992  
MONGODB_URI=mongodb+srv://danielalvarez:<db_password>@cluster0.4bkm3yq.mongodb.net/template1?retryWrites=true&w=majority&appName=Cluster0
db name: template1  

DEVELOPMENT:  
$ cd server
express/server$ node --watch --env-file=../.env server.js (start express before react)  

react$ npm run dev  
click link to open browser  











"powered by Toggle Software"