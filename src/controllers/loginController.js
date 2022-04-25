const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    return res.render('login');
};

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body); 
        await login.register();
        // checar se existem erros
        if (login.errors.length > 0) {
            req.flash('errors', login.errors); // exibir msgs erros
            req.session.save(function () {       // salva a sessao, p garantir q foi salva
                return res.redirect('/login/index');    // redireciona de volta pagina login
            });
            return;
        }
        req.flash('success', 'Seu usuario foi criado com sucesso.');
        req.session.save(function () {
            return res.redirect('/login/index');
        });

        //return res.send(login.errors);
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.login = async function (req, res) {
    try {
        const login = new Login(req.body); 
        await login.login();
        
        if (login.errors.length > 0) {
            req.flash('errors', login.errors); 
            req.session.save(function () {       // salva a sessao, p garantir q foi salva
                return res.redirect('/login/index');    // redireciona de volta pagina login
            });
            return;
        }

        req.flash('success', 'Você entrou no Sistema.');
        req.session.user = login.user; // usuario p dentro da sessao
        req.session.save(function () {
            return res.redirect('/login/index');
        });

        //return res.send(login.errors);
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
}