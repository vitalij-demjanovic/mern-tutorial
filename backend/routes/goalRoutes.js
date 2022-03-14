const express = require('express')
const router = express.Router()
const { getGoals, updateGoals, deleteGoals, setGoals } = require('../controllers/goalController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getGoals).post(protect, setGoals)
router.route('/:id').put(protect, updateGoals).delete(protect, deleteGoals)

module.exports = router