import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator';
import crypto from 'crypto'
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],

    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: validator.isEmail, // if the email is not good in condition or format then it throws an error
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [6, "Password must be atleast 6 characters"],
        select: false // this line is for not taking a user password to the admin that means admin cannot see the user password
    },
    role: {
        type: String,
        enum: ["admin", "user"], // enum is there only two options available to the users for choosing
        default: "user", // whenever you create an account so your account type is user that means of default value
    },
    subscription: {
        // we are getting below thing from razorpay
        id: String,
        status: String,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    playlist: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            },
            poster: String,
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
    // below two things is for making the password reset basically it helps us to reset the individual users password
    resetPasswordToken: String,
    ResetPasswordExpire: String,

})

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword;
    next();
})



schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
}

schema.methods.comparePassword = async function (password) {
    console.log(this.password);
    return await bcrypt.compare(password, this.password);
}
schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // digest = tostring
    this.ResetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15mins
    return resetToken;
}
export const User = mongoose.model("User", schema);