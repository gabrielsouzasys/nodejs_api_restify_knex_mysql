const restify = require('restify');
// const express = require('express');
const errs = require('restify-errors');

//npm i cors
// var cors = require('cors');
// const app = express();

// app.use(cors())


//CRIAR SERVER RESTIFY
const server = restify.createServer({
    name: 'myapp',
    version: '1.0.3'
});
var vl_url = 'http://127.0.0.1:9090/Produtos';



//CRIAR CONEXAO COM O BANCO
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'my_database'
    }
});

var corsOptions = {
    origin: 'http://127.0.0.1:5501',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//CONFIGURACAOES RESTIFY 
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//SERVER LISTEN
server.listen(9090, function() {
    console.log("name: " + server.name);
    console.log("url: " + vl_url);
    console.log('nomde do servidor: ( %s ) listening at ( %s )', server.name,vl_url);//passando os paramentros para o console.log
});

//Configure Express
// app.get('/gabriel', function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for all origins!'})
//   })


//   app.get('/products/:id', function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for all origins!'})
//   })



/*ROTAS - CRUD*/
// const rotas = require('./Routes/Rotas.js');

//SELECT QUERY 
server.get('/Produtos', function(req, res, next) {

    knex('registros_de_compras')
        .then(function(dados) {

            if (!dados) {
                return res.send(new errs.BadRequestError('Nenhum Registro encontrado!'));
            } else {
                
                console.log(dados);
                res.send(transform_json(dados));
                
                // res.send(dados);
                // res.send(JSON.stringify(dados));
            }
        }, next);
});

//CREATE
server.post('/create', function(req, res, next) {
    console.log('request POST ' + req.body);
    knex('registros_de_compras')
        .insert(req.body)
        .then(function(dados) {
            console.log('Post Then!' + dados);
         
            res.send(dados);
        }, next);

});

//SELECT READ
server.get('/show/:cod_reg', function(req, res, next) {

    const { cod_reg } = req.params;

    if (!cod_reg) {
        return res.send(new errs.BadRequestError('Nenhum Parametro Informado!'));
    } else {

        knex('registros_de_compras')
            .where(`cod_reg`, cod_reg)
            .first()
            .then(function(dados) {

                if (!dados) {
                    return res.send(new errs.BadRequestError('Nenhum Registro encontrado!'));
                } else {
                    res.send(dados);
                }
            }, next);
    }


});

//UPDATE
server.put('/update/:cod_reg', function(req, res, next) {

    const { cod_reg } = req.params;

    if (!cod_reg) {
        return res.send(new errs.BadRequestError('Nenhum Parametro Informado!'));
    } else {

        knex('registros_de_compras')

        .where(`cod_reg`, cod_reg)
            .update(req.body)
            .then(function(dados) {

                if (!dados) {
                    return res.send(new errs.BadRequestError('Nenhum Registro encontrado!'));
                } else {
                    res.send('dados atualizados com sucesso!');
                }


            }, next);

    }

});


//DELETE
server.del('/delete/:cod_reg', function(req, res, next) {

    const { cod_reg } = req.params;

    if (!cod_reg) {
        return res.send(new errs.BadRequestError('Nenhum Parametro Informado!'));
    } else {

        knex('registros_de_compras')

        .where(`cod_reg`, cod_reg)
            .delete()
            .then(function(dados) {


                if (!dados) {
                    return res.send(new errs.BadRequestError('Nenhum Registro encontrado!'));
                } else {
                    res.send('dados removidos com sucesso!');
                }

            }, next);

    }

});



function transform_json (obj_response){
    var new_obj = {'pessoas' : []};
 
    // obj_response = JSON.parse(obj_response);
       
    for (var i=0; i < obj_response.length; i++){
        new_obj.pessoas[i] = obj_response[i];
    }
   
    obj_response = JSON.stringify(new_obj);
    console.log(obj_response);
    return obj_response;
}