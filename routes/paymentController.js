import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { instance } from '../server.js'
import stripe from 'stripe'
import crypto from 'crypto'
import { Payment } from "../models/Payment.js";
export const buySubscription = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user.role === "admin") return next(new ErrorHandler("Admin Cant buy Subscription", 400));
    // =plan_JuJevKAcuZdtRO
    const plan_id = process.env.PLAN_ID || "plan_JuJevKAcuZdtRO";
    const subscription = await instance.subscriptions.create({
        plan_id: plan_id,
        customer_notify: 1,
        total_count: 12,
    })



    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
    await user.save();
    res.status(201).json({
        success: true,
        subscriptionId: subscription.id
    })
})
export const paymentverification = catchAsyncError(async (req, res, next) => {
    const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } = req.body;
    const user = await User.findById(req.user._id);
    const subscription_id = user.subscription.id;
    // =plan_JuJevKAcuZdtRO
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET).update(razorpay_payment_id + '|' + subscription_id, "utf-8").digest('hex');

    const isAuthentic = generated_signature === razorpay_signature;
    if (!isAuthentic) return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`)

    //database comes here
    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id
    })

    user.subscription.status = 'active';

    await user.save();


    res.redirect(`${process.env.FRONTEND_URL}/paymentsucess?reference=${razorpay_payment_id}`);


})

export const getRazorPayKey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_APT_KEY
    })
})
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const subscriptionId = user.subscription.id;
    let refund = false;
    await instance.subscriptions.cancel(subscriptionId);
    const payment = await Payment.findOne({
        razorpay_subscription_id:subscriptionId
    })
    const gap = Date.now() - payment.createdAt;
    const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000

    if(refundTime > gap){
        await instance.payment.refund(payment.razorpay_payment_id);
        refund=!refund;
    }
    await payment.remove();
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        // key: process.env.RAZORPAY_APT_KEY
        message:refund?"Subscription Cancelled, You will Recieve full refund within 7 Days.":"Subscription Cancelled, Now refund initiated as subscription was cancelled after 7 Days."
    })
})