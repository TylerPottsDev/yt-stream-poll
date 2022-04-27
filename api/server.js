import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Poll from './models/Poll.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const host = process.env.HOST || 'http://localhost'

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))

app.use(express.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

/**
 * Create a new poll endpoint
 * @param {string} title - The title of the poll
 * @param {string[]} options - An array of strings representing the options
 * @returns {object} - The created poll id
 */
app.post('/api/poll/new', async (req, res) => {
	const { title, options } = req.body
	
	const poll = new Poll({
		title,
		options,
		votes: new Array(options.length).fill(0)
	})

	try {
		await poll.save()

		res.json({
			success: true,
			message: 'Poll Created',
			id: poll._id
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			error: err
		})
	}
})

/**
 * Vote on a poll
 * @param {string} id - The id of the poll
 * @param {number} option - The index of the option to vote on
 * @returns {void}
 */
app.post('/api/poll/vote', async (req, res) => {
	const { id, option } = req.body

	try {
		const poll = await Poll.findById(id)
		poll.votes[option]++
		await poll.save()

		res.json({
			success: true,
			message: 'Vote Recorded'
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			error: err
		})
	}
})

/**
 * Toggles a poll as active or inactive
 * @param {string} id - The id of the poll
 * @returns {boolean} status - The new status of the poll
 */
app.post('/api/poll/toggle-active', async (req, res) => {
	const { id } = req.body

	try {
		const poll = await Poll.findById(id)
		poll.active = !poll.active
		await poll.save()

		res.json({
			success: true,
			message: `Poll ${poll.active ? 'Activated' : 'Deactivated'}`,
			status: poll.active
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			error: err
		})
	}
})

/**
 * Get poll by id
 * @param {string} id - The id of the poll
 * @returns {object} - The poll
 */
app.get('/api/poll/:id', async (req, res) => {
	const { id } = req.params

	try {
		const poll = await Poll.findById(id)

		res.json({
			success: true,
			message: "Poll Found",
			poll
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			error: err
		})
	}
})

/**
 * Get the poll results by id
 * @param {string} id - The id of the poll
 * @returns {object} - The poll results
 */
app.get('/api/poll/results/:id', async (req, res) => {
	const { id } = req.params

	try {
		const { votes } = await Poll.findById(id)

		res.json({
			success: true,
			message: "Poll Found",
			votes: votes
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			error: err
		})
	}
})

/**
 * Get the active poll
 * @returns {object} - The active poll
 * NOTE: This endpoint is not working, we'll come back to this
 */
app.get('/api/poll/active', async (req, res) => {
	try {
		const poll = await Poll.findOne({ active: true })
		console.log(poll);

		res.json({
			success: true,
			message: "Poll Found",
			poll
		})

	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
			error: err
		})
	}
})

app.listen(port, () => console.log(`Server is running on ${host}:${port}`))