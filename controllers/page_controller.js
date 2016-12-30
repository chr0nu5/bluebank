var models = require('../models/base');

module.exports = {
    index: (req, res) => {
        models.account
            .findAll({})
            .then((result) => {
                res.render('accounts.html', {
                    accounts: result,
                    error: req.query.error
                });
            });
    },
    account_create: (req, res) => {
        if (req.body.agency && req.body.number && req.body.balance) {
            models.account
                .findOne({
                    where: {
                        agency: req.body.agency,
                        number: req.body.number
                    }
                })
                .then(account => {
                    if (account) {
                        res.redirect('/?error=Account already exists');
                    } else {
                        models.account
                            .create({
                                agency: parseInt(req.body.agency),
                                number: parseInt(req.body.number),
                                balance: parseFloat(req.body.balance).toFixed(2)
                            })
                            .then(() => {
                                res.redirect('/');
                            });
                    }
                })
        } else {
            res.redirect('/?error=You need to fill all the required fields');
        }
    },
    transactions: (req, res) => {
        models.transaction
            .findAll({})
            .then((transactions) => {
                var fa = [];
                var ta = [];
                transactions.forEach((t) => {
                    fa.push(t.getAccount())
                    ta.push(models.account.findOne({
                        where: {
                            id: t.to
                        }

                    }));
                });
                Promise.all(fa).then(values => {
                    transactions.forEach((t, i) => {
                        t.from = values[i];
                    })
                    Promise.all(ta).then(values => {
                        transactions.forEach((t, i) => {
                            t.to = values[i];
                        })
                        models.account
                            .findAll({})
                            .then(accounts => {
                                res.render('transactions.html', {
                                    transactions: transactions,
                                    accounts: accounts,
                                    error: req.query.error
                                });
                            });
                    });
                });
            });
    },
    transaction_create: (req, res) => {
        if (req.body.from && req.body.to && req.body.value) {
            var from = models.account.findOne({
                where: {
                    id: req.body.from
                }
            });
            var to = models.account.findOne({
                where: {
                    id: req.body.to
                }
            });
            var value = parseFloat(req.body.value).toFixed(2);
            Promise.all([from, to]).then(values => {
                from = values[0];
                to = values[1];
                if (from.balance >= value) {
                    models.transaction
                        .create({
                            value: value,
                            to: to.id
                        })
                        .then(t => {
                            from.updateAttributes({
                                    balance: from.balance - parseFloat(value)
                                })
                                .then(f => {
                                    to.updateAttributes({
                                            balance: to.balance + parseFloat(value)
                                        })
                                        .then(t => {
                                            res.redirect('/transactions?error=Value successfully transfered');
                                        })
                                })
                        });
                } else {
                    res.redirect('/transactions?error=The origin account does not have sufficient founds');
                }
            });
        } else {
            res.redirect('/transactions?error=You need to fill all the required fields');
        }
    }
};
