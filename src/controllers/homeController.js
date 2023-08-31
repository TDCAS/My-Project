

exports.paginaInicial = (req, res) => {
  console.log(req.flash('info'))
  
  res.render('index',{
    //injetando dados no ejs
    titulo:'Esse sera o titulo da pagina',
    numero:[1,2,3,5,6,7,]
});
  return;
};

exports.trataPost = (req, res) => {
  res.send(req.body);
  return;
};
