module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'log in please');
        res.redirect('/users/login');
    },
    ensureGuest: function(req,res,next){
        if(req.isAuthenticated()){
            req.flash('error_msg', 'you are log in');
            res.redirect('/dashboard');
        }
        return next();
    }
}