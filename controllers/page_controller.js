var models = require('../models/base');
var tools = require('../lib/tools');

module.exports = {
    index: (req, res) => {
        tools
            .getAccounts()
            .then((result) => {
                res.render('accounts.html', {
                    accounts: result,
                    msg: req.query.msg
                });
            });
    },
    account_create: (req, res) => {
        tools.createAccount(req.body.agency, req.body.number, req.body.balance)
            .then(msg => {
                res.redirect(`/?msg=${msg}`);
            })
            .catch(err => {
                res.redirect(`/?msg=${err}`);
            });
    },
    transactions: (req, res) => {
        tools.getTransactions()
            .then(transactions => {
                tools
                    .getAccounts()
                    .then(accounts => {
                        res.render('transactions.html', {
                            transactions: transactions,
                            accounts: accounts,
                            msg: req.query.msg
                        });
                    });
            })
    },
    transaction_create: (req, res) => {
        tools.createTransaction(req.body.from, req.body.to, req.body.value)
            .then(msg => {
                res.redirect(`/transactions?msg=${msg}`);
            })
            .catch(err => {
                res.redirect(`/transactions?msg=${err}`);
            });
    }
};
