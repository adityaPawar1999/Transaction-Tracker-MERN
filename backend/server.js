const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Fetch JSON data and initialize the database
app.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany({});
        await Transaction.insertMany(response.data);
        res.send('Database initialized with seed data');
    } catch (error) {
        res.status(500).send(error);
    }
});

// List all transactions with search and pagination
app.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const regex = new RegExp(search, 'i');
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex }
            ]
        })
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
        
        res.json(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get statistics for a specific month
app.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);
        const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: true });
        const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: false });

        res.json({
            totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get price range statistics for a specific month
app.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: true
        });

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };

        transactions.forEach(transaction => {
            if (transaction.price <= 100) priceRanges['0-100']++;
            else if (transaction.price <= 200) priceRanges['101-200']++;
            else if (transaction.price <= 300) priceRanges['201-300']++;
            else if (transaction.price <= 400) priceRanges['301-400']++;
            else if (transaction.price <= 500) priceRanges['401-500']++;
            else if (transaction.price <= 600) priceRanges['501-600']++;
            else if (transaction.price <= 700) priceRanges['601-700']++;
            else if (transaction.price <= 800) priceRanges['701-800']++;
            else if (transaction.price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.json(priceRanges);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get pie chart statistics for a specific month
app.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.json(categories.map(category => ({
            category: category._id,
            count: category.count
        })));
    } catch (error) {
        res.status(500).send(error);
    }
});
// Combine all statistics into one response
app.get('/combined-statistics', async (req, res) => {
    const { month } = req.query;

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            Transaction.find({ dateOfSale: { $gte: new Date(`2021-${month}-01`), $lt: new Date(`2021-${month + 1}-01`) } }),
            getStatistics(month),
            getBarChart(month),
            getPieChart(month)
        ]);

        res.json({ transactions, statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).send(error);
    }
});
async function getStatistics(month) {
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const totalSaleAmount = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
        { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: false });

    return {
        totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
        totalSoldItems,
        totalNotSoldItems
    };
}
async function getBarChart(month) {
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const transactions = await Transaction.find({
        dateOfSale: { $gte: startDate, $lt: endDate },
        sold: true
    });

    const priceRanges = {
        '0-100': 0,
        '101-200': 0,
        '201-300': 0,
        '301-400': 0,
        '401-500': 0,
        '501-600': 0,
        '601-700': 0,
        '701-800': 0,
        '801-900': 0,
        '901-above': 0
    };

    transactions.forEach(transaction => {
        if (transaction.price <= 100) priceRanges['0-100']++;
        else if (transaction.price <= 200) priceRanges['101-200']++;
        else if (transaction.price <= 300) priceRanges['201-300']++;
        else if (transaction.price <= 400) priceRanges['301-400']++;
        else if (transaction.price <= 500) priceRanges['401-500']++;
        else if (transaction.price <= 600) priceRanges['501-600']++;
        else if (transaction.price <= 700) priceRanges['601-700']++;
        else if (transaction.price <= 800) priceRanges['701-800']++;
        else if (transaction.price <= 900) priceRanges['801-900']++;
        else priceRanges['901-above']++;
    });

    return priceRanges;
}

async function getPieChart(month) {
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const categories = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    return categories.map(category => ({
        category: category._id,
        count: category.count
    }));
}

app.get('/combined-statistics', async (req, res) => {
    const { month } = req.query;
    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            Transaction.find({ dateOfSale: { $gte: new Date(`2021-${month}-01`), $lt: new Date(`2021-${Number(month) + 1}-01`) } }),
            getStatistics(month),
            getBarChart(month),
            getPieChart(month)
        ]);

        res.json({ transactions, statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).send(error);
    }
});













// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const take = 0;
console.log(+take)

console.log('hello')