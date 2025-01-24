const router = require('express').Router();

router.use('/auth', require('./admin.route'));
router.use('/petani', require('./petani.route'));
router.use('/produksi', require('./produksi.route'));
router.use('/produk', require('./produk.route'));
router.use('/dashboard', require('./dashboard.route'));
router.use('/cocoblog', require('./cocoblog.route'));
router.use('/pembeli', require('./pembeli.route'));

module.exports = router;
