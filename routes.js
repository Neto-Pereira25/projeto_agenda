const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const contatoController = require('./src/controllers/contatoController');

function meuMiddleware(req, res, next) {
    req.session = { nome: 'Neto', sobrenome: 'Pereira' };
    console.log();
    console.log('Passei no seu middleware.');
    console.log();
    next();
}

// a rota vai decidir qual controller vai contralar uma determinada
// rota.

// o trabalho do controller é decidir qual o model e qual o view vai ser usado


// Rotas da home 
route.get('/', homeController.paginaInicial);
route.post('/', homeController.trataPost);

// Rotas de contato
route.get('/contato', contatoController.paginaInicial);


module.exports = route;
