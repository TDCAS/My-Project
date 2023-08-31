exports.middlewareGlobal = (req, res, next) => {
  //injentando em todas rotas
  res.locals.umaVariavelLocal = 'Este é o valor da variavel local'

  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};


exports.chechCsrfError = (err,req,res,next) =>{
  if(err && "EBADCSRFTOKEN" === err.code){
    return res.send('BAD Error')
  }
  
}


exports.csrfMiddleware = (req, res, next) =>{
  res.locals.csrfToken = req.csrfToken()
  next();
}
