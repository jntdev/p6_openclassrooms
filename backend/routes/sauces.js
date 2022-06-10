const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
const authVerify = require('../middleware/auth');

router.get('/', authVerify, saucesCtrl.getAllSauces);
router.get('/:id', authVerify, saucesCtrl.getSauce);
router.post('/', authVerify, multer, saucesCtrl.createSauce);
router.post('/:id/like', authVerify, saucesCtrl.like)
router.put('/:id', authVerify, multer, saucesCtrl.modifySauce);
router.delete('/:id', authVerify, saucesCtrl.deleteSauce);

module.exports = router;