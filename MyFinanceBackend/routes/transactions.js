const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Получить все транзакции пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.send(transactions);
  } catch (error) {
    res.status(400).send({ error: 'Error fetching transactions' });
  }
});

// Добавить транзакцию
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, amount } = req.body;
    const transaction = new Transaction({ userId: req.user._id, type, amount });
    await transaction.save();
    res.status(201).send(transaction);
  } catch (error) {
    res.status(400).send({ error: 'Error adding transaction' });
  }
});

module.exports = router;
