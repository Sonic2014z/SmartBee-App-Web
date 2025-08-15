mysql =require('mysql');
oconexion =mysql.createConnection({
    host: 'localhost',
    database:'ejemplo',
    user: 'root',
    password:''
});
oconexion.connect(function (posibleError){
    if (posibleError){
        throw posibleError;
        oconexion.end();

    }
    else{
        console.log("Conexion correcta");
        oconexion.end();
    }
});
    
