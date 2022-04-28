import mongoose from "mongoose"
const Schema = mongoose.Schema

const PollSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	options: {
		type: [String],
		required: true
	},
	votes: {
		type: [Number]
	},
	is_active: {
		type: Boolean,
		default: false
	}
})

export default mongoose.model("Poll", PollSchema)