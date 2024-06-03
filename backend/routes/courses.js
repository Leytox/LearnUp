const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Course = require('../models/Course');

// Create a new course
router.post('/', auth, async (req, res) => {
    const { title, description, price } = req.body;
    try {
        const course = new Course({ title, description, instructor: req.user.id, price });
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', ['name', 'email']);
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a specific course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', ['name', 'email']);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a course
router.put('/:id', auth, async (req, res) => {
    const { title, description, price } = req.body;
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price || course.price;
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a course
router.delete('/:id', auth, async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await course.remove();
        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
