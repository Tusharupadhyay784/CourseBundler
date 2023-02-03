import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { buySubscription, cancelSubscription, getRazorPayKey, paymentverification } from './paymentController.js';


const router = express.Router();


// Buy Subscription
router.route('/subscribe').get(isAuthenticated, buySubscription)
// verify the payments and save the reference the database
router.route('/paymentverification').post(isAuthenticated, paymentverification)
//get the razorpay key
router.route('/razorpaykey').get(getRazorPayKey)
export default router


// Cancel Subscription
router.route('/subscribe/cancel').delete(isAuthenticated,cancelSubscription)