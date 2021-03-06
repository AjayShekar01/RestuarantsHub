import express from 'express';

const {
  getRestuarants,
  getRestuarant,
  createRestuarant,
  updateRestuarant,
  deleteRestuarant,
  getRestuarantsInRadius,
  restuarantPhotoUpload,
} = require('../controllers/restuarants');

const Restuarant = require('../models/Restuarant');

// Include other resource routers
const menuRouter = require("./menus");
const orderRouter = require('./orders');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Re-route into resource router
router.use("/:restuarantId/menus", menuRouter);
router.use('/:restuarantId/orders', orderRouter);

router.route('/radius/:zipcode/:distance').get(getRestuarantsInRadius);

router
  .route('/:restuarantId/photo')
  .put(protect, authorize('admin','owner'), restuarantPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Restuarant, {
      path: 'menus',
      select: 'favourites'
    }),
    getRestuarants
  )
  .post(protect, authorize('admin','owner'), createRestuarant);

router
  .route('/:restuarantId')
  .get(getRestuarant)
  .put(protect, authorize('admin','owner'), updateRestuarant)
  .delete(protect, authorize('admin','owner'), deleteRestuarant);

module.exports = router;