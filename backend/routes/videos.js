const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const Course = require('../models/Course');

// Upload video to a course
router.post('/:courseId', auth, upload.single('video'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        course.videos.push(req.file.path);
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
