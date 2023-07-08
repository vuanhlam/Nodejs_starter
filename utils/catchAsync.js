// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next).catch((error) => next(error)); 
    fn(req, res, next).catch(next); // the same as above
  };
};
