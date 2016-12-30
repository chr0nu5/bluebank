var models = require('../models/base');
var expect = require('chai').expect;
var tools = require('../lib/tools');

describe("Account", () => {
    describe("Creation", () => {
        before(() => {
            return models.transaction.destroy({ where: {} }).then(() => {
                return models.account.destroy({ where: {} });
            });
        });
        after(() => {
            return models.transaction.destroy({ where: {} }).then(() => {
                return models.account.destroy({ where: {} });
            });
        });
        it("should not fail", () => {
            return tools.createAccount(1, 1, 1)
                .then(msg => {
                    expect(msg).to.equal('Account created successfuly');
                })
        });
        it("should fail", () => {
            return tools.createAccount(1, 1, 1)
                .catch(msg => {
                    expect(msg).to.equal('Account already exists');
                })
        });
    });
    describe("Retrieval", () => {
        before(() => {
            return models.transaction.destroy({ where: {} }).then(() => {
                return models.account.destroy({ where: {} });
            });
        });
        after(() => {
            return models.transaction.destroy({ where: {} }).then(() => {
                return models.account.destroy({ where: {} });
            });
        });
        it("should return 0", () => {
            return tools.getAccounts()
                .then(accounts => {
                    expect(accounts.length).to.equal(0);
                })
        });
        it("should return 1", () => {
            return tools.createAccount(1, 1, 1)
                .then(msg => {
                    return tools.getAccounts()
                        .then(accounts => {
                            expect(accounts.length).to.equal(1);
                        })
                })
        });
    });
});

describe("Transaction", () => {
    describe("Create", () => {
        before(() => {
            return models.transaction.destroy({ where: {} }).then(() => {
                return models.account.destroy({ where: {} });
            });
        });
        after(() => {
            return models.transaction.destroy({ where: {} }).then(() => {
                return models.account.destroy({ where: {} });
            });
        });
        it("should return 0", () => {
            return tools.getTransactions()
                .then(accounts => {
                    expect(accounts.length).to.equal(0);
                })
        });
        it("should not fail", () => {
            var a = models.account.create({ agency: 1, number: 1, balance: 1 });
            var b = models.account.create({ agency: 2, number: 2, balance: 1 });
            return Promise.all([a, b])
                .then(accounts => {
                    a = accounts[0];
                    b = accounts[1];
                    return tools.createTransaction(a.id, b.id, 1)
                        .then(msg => {
                            expect(msg).to.equal('Value successfully transfered');
                        });
                });
        });
        it("should fail", () => {
            var a = models.account.create({ agency: 1, number: 1, balance: 1 });
            var b = models.account.create({ agency: 2, number: 2, balance: 1 });
            return Promise.all([a, b])
                .then(accounts => {
                    a = accounts[0];
                    b = accounts[1];
                    return tools.createTransaction(a.id, b.id, 1)
                        .catch(msg => {
                            expect(msg).to.equal('The origin account does not have sufficient founds');
                        });
                });
        });
        it("should fail", () => {
            var a = models.account.create({ agency: 1, number: 1, balance: 1 });
            var b = models.account.create({ agency: 2, number: 2, balance: 1 });
            return Promise.all([a, b])
                .then(accounts => {
                    a = accounts[0];
                    b = accounts[1];
                    return tools.createTransaction('', '', '')
                        .catch(msg => {
                            expect(msg).to.equal('You need to fill all the required fields');
                        });
                });
        });
    });
});
