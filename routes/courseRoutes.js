import express from 'express'
import { addLecture, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from '../controllers/courseController.js';
import { createCourse } from '../controllers/courseController.js';
import singleUpload from '../middlewares/multer.js';
import { authorizeAdmin, authorizeSubscribers, isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Get ALl courses without lectures
router.route('/courses').get(getAllCourses) // this function is written in coursecontroller file and getAllCourses is a handler

// create new course only admin
router.route('/createcourse').post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);


//Add Lectures,Delete Course, Get Course Details
router.route('/course/:id').get(isAuthenticated, authorizeSubscribers,getCourseLectures).post(singleUpload, authorizeAdmin, addLecture).delete(isAuthenticated, authorizeAdmin, deleteCourse) 


// Delete Lectures
router.route('/lecture').delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router