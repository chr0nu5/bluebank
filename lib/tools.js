var models = require('../models/base');

module.exports = {
    getAccounts: () => {
        return models.account.findAll({});
    },
    createAccount: (agency, number, balance) => {
        return new Promise((resolve, reject) => {
            if (agency && number && balance) {
                return models.account
                    .findOne({
                        where: {
                            agency: agency,
                            number: number
                        }
                    })
                    .then(account => {
                        if (account) {
                            return reject('Account already exists');
                        } else {
                            return models.account
                                .create({
                                    agency: parseInt(agency),
                                    number: parseInt(number),
                                    balance: parseFloat(balance).toFixed(2)
                                })
                                .then(() => {
                                    resolve('Account created successfuly');
                                });
                        }
                    })
                    .catch(err => {
                        ref('Error creating account');
                    })
            } else {
                reject('You need to fill all the required fields');
            }
        });
    },
    getTransactions: () => {
        return new Promise((resolve, reject) => {
            return models.transaction
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
                    return Promise.all(fa).then(values => {
                        transactions.forEach((t, i) => {
                            t.from = values[i];
                        })
                        return Promise.all(ta).then(values => {
                            transactions.forEach((t, i) => {
                                t.to = values[i];
                            })
                            return resolve(transactions);
                        });
                    });
                });
        })
    },
    createTransaction: (from, to, value) => {
        return new Promise((resolve, reject) => {
            if (from && to && value) {
                from = models.account.findOne({
                    where: {
                        id: from
                    }
                });
                to = models.account.findOne({
                    where: {
                        id: to
                    }
                });
                value = parseFloat(value).toFixed(2);
                return Promise.all([from, to]).then(values => {
                    from = values[0];
                    to = values[1];
                    if (from.balance >= value) {
                        models.transaction
                            .create({
                                value: value,
                                to: to.id,
                                accountId: from.id
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
                                                return resolve('Value successfully transfered');
                                            })
                                    })
                            });
                    } else {
                        return reject('The origin account does not have sufficient founds');
                    }
                });
            } else {
                return reject('You need to fill all the required fields');
            }
        })
    }
}
