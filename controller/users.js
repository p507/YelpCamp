const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {                                     //  Logging in the user after successfully registration through #passport
            if (err) return next();
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLogIn = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome Back');
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged you Out');
    res.redirect('/campgrounds');
}