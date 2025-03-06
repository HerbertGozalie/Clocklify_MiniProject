module.exports = (func) => {
  return(req, res ,next) => {
    func(req, res, next).catch(err => next(err));
  }
}

/*
  Promise.resolve to ensures both asyn and sync errors are caught
*/