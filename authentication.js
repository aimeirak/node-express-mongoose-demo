function authentication(req,res,next){
    console.log("Authentication");
    next();
}
module.exports = authentication;