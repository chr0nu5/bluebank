var Sequelize = require('sequelize');

var models = new Sequelize(process.env.DB ? process.env.DB : 'bluebank', 'postgres', '', {
    host: 'db',
    dialect: 'postgres',
    logging: (log) => {

    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var Account = models.define('account', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    agency: {
        field: 'agency',
        type: Sequelize.INTEGER,
    },
    number: {
        field: 'number',
        type: Sequelize.INTEGER,
    },
    balance: {
        field: 'balance',
        type: Sequelize.DOUBLE,
    }
});

var Transaction = models.define('transaction', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    value: {
        field: 'value',
        type: Sequelize.DOUBLE
    },
    to: {
        type: Sequelize.INTEGER,
        references: {
            model: Account,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    }
});

Account.hasMany(Transaction);
Transaction.belongsTo(Account);

models.sync({
    force: process.env.DB_FORCE ? process.env.DB_FORCE : false
});

module.exports = {
    account: Account,
    transaction: Transaction
}
