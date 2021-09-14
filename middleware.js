//manages login status of user
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}