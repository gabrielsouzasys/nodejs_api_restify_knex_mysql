const restify = require('restify');

const errs = require('restify-errors');


//CRIAR SERVER RESTIFY
const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});


//CONFIGURACAOES RESTIFY 
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


console.log('ROTAS_CRUD');

//SELECT QUERY 
server.get('/Produtos', function(req, res, next) {

    knex('registros_de_compras')
        .then(function(dados) {

            if (!dados) {
                return res.send(new errs.BadRequestError('Nenhum Registro encontrado!'));
            } else {
                res.send(dados);
            }
        }, next);
});