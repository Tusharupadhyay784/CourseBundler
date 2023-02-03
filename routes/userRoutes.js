import express from 'express'
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, forgetPassword, getALlUsers, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateUser, updateprofilepicture } from '../controllers/userController.js';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js'
const router = express.Router();

// To Register a new User
router.route('/register').post(singleUpload, register)


//login
router.route('/login').post(login);
//logout
router.route('/logout').get(logout);
//Get my Profile
router.route('/me').get(isAuthenticated, getMyProfile);
// delete my Profile
router.route('/me').delete(isAuthenticated, deleteMyProfile);
//change Password
router.route('/changepassword').put(isAuthenticated, changePassword);
//upadteProfile
router.route('/updateprofile').put(isAuthenticated, updateProfile);
//updateProfilePicture
router.route('/updateprofilepicture').put(isAuthenticated, singleUpload, updateprofilepicture);
//ForgetPassword
router.route('/forgetpassword').post(forgetPassword);

//ResetPassword
router.route('/resetpsasword/:token').put(resetPassword);
//AddtoPlaylist

router.route('/addtoplaylist').post(isAuthenticated, addToPlaylist);
//RemoveFromPlaylist
router.route('/removefromplaylist').delete(isAuthenticated, removeFromPlaylist);

///Admin Routes

router.route('/admin/users').get(isAuthenticated, authorizeAdmin, getALlUsers)
router.route('/admin/user/:id').put(isAuthenticated, authorizeAdmin, updateUser).delete(isAuthenticated, authorizeAdmin, deleteUser)
export default router