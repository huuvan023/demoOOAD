var mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : "023023Hvan",
  database : 'qlthuvien'
});
connection.connect(function(err) {
  if(err){
    console.log(err.code);
  }
  console.log("connect sucess!");
});

export { connection }
