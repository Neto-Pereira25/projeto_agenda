// referente as variáveis de ambientes presentes no arquivo .env
require('dotenv').config(); 

// importação do express e sua inicialização
const express = require('express');
const app = express();

// importação do moongose
// o mongoose é responsável por modelar a base de dados e
// garantir que os dados salvos são realmentes os dados na
// forma que queremos salvar
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, /*
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    }*/)
    .then(() => {
        // a função connect retorna uma promese, com isso, vamos emitir um
        // sinal(evento) para quando a conexão for feita
        app.emit('pronto');
    })
    .catch(e => console.log(e));

// sessões são para identificar o navegador do cliente com um cookie
// toda vez que o cliente acessar o servidor o cookie será checado
// e vai identificar o navegador do cliente
const session = require('express-session');

// O MongoStore é para falar que as sessões serão salvas
// na base de dados, pois, por padrão, elas são salvas em memória
const MongoStore = require('connect-mongo');

/* 
flash são mensagens auto destrutivas, são perfeitos para mandar um feedback 
para o usuário e são salvas em sessão, logo sem as sessões esse módulo não vai
funcioanr
*/
const flash = require('connect-flash');

/*
routes são as rotas da nossa aplicação
*/
const routes = require('./routes');

// path é para trabalhar com caminhos
const path = require('path');

/**
 * helmete é para segurança da aplicação
 */
const helmet = require('helmet');

/**
 * csrf são para criação de tokens na aplicação
 * isso faz com que nenhum site externo consiga
 * postar coisas para dentro da nossa aplicação
 */
const csrf = require('csurf');

/**
 * Nossos middlewares (funções que são executadas em alguma rota)
 */
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

/** uso do helmet */
app.use(helmet());

/** essa linha diz que podemos postar formulário para dentro da nossa aplicação */
app.use(express.urlencoded({ extended: true }));
/** essa linha serve para dizer que podemos fazer parse de json para dentro da aplicação*/
app.use(express.json());
/** essa linha diz que podemos fazer uso de arquivos estáticos */
app.use(express.static(path.resolve(__dirname, 'public')));

// express-session - configurando as sessões
const sessionOptions = session({
    secret: 'dasdsafagfsagafgHgjn jn lafnalk fnlkan fds',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

/** arquivos que renderizamos na tela */
app.set('views', path.resolve(__dirname, 'src', 'views'));
/** engine que utilizamos para renderizar as páginas */
app.set('view engine', 'ejs');


app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// uma vez que a conexão for feita, a função on vai capturar o sinal(evento)
// e vai executar a função;
app.on('pronto', () => {
    // escutando na porta 3000
    app.listen(3000, () => {
        console.log('Acessor http://localhost:3000');
        console.log('Servidor executando na porta 3000...');
    });
});


