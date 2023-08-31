require("dotenv").config()
/*oferece soluções para: Gerenciar requisições de diferentes verbos HTTP em diferentes URLs. Integrar "view engines" para inserir dados nos templates*/
const express = require('express');
const app = express();
/*imnportando mongoose
//mongose é uma biblioteca, para modelar os dados, Inclui conversão de tipo integrada, validação, construção de consulta, ganchos de lógica de negócios e muito mais, prontos para uso.*/
const mongoose = require('mongoose')
//fazendo conecção com mongodb(token,configuração)
mongoose.connect(process.env.CONNECTIONSTRING,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {

  app.emit('pronto');
})
.catch(e => console.log(e));
//importando session 
/* Cria middleware(dados processados antes da requisição)
armazena os dados da sessão no servidor
*/
const session =  require("express-session");

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

/*O Helmet pode ajudar a proteger o seu aplicativo de algumas vulnerabilidades da web bastante conhecidas configurando os cabeçalhos HTTP adequadamente

OBS:
O Helmet é para segurança da aplicação, portanto, caso você esteja com um sistema ainda em desenvolvimento, usando urls como "127.0.0.1", "localhost" ou até um servidor com IP externo, sem usar SSL (https), é recomendável desativá-lo. Ele pode bloquear importação de scripts e arquivos de CSS.
*/


const helmet = require("helmet")

/*(CSRF) é uma técnica hacker que visa se passar por um usuário autenticado para enviar requisições, enquanto o usuário original não tem conhecimento dessa ação.
é usado para criar middleware validando do token no formulario
*/
const csrf =  require("csurf");


app.use(helmet())

const routes = require('./routes');
const path = require('path');
const { middlewareGlobal,chechCsrfError,csrfMiddleware } = require('./src/middlewares/middleware');
// pode postar formulario para endtro da aplicação
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//arquivos staticos , devem ser acessados diretamete js, css, imagem
app.use(express.static(path.resolve(__dirname, 'public')));



app.use(
  //cria sessao
  session({
  secret: 'jwçljdlçwjldajdjawj asdjçlkas jsdklsaj adju()',
  store: MongoStore.create({mongoUrl:process.env.CONNECTIONSTRING}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    //session que dura 7 dias em ms
    maxAge:  1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}))
app.use(flash())
//arquivos que é renderezado na tela/ pasta que ta localizado
app.set('views', path.resolve(__dirname, 'src', 'views'));

//view, e a ejs que sera utilizado
app.set('view engine', 'ejs');
app.use(csrf());

// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(chechCsrfError)
app.use(csrfMiddleware)

app.use(routes);
app.on('pronto', ()=>{
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
  
})

