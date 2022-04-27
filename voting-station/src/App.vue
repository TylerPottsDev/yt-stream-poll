<script setup>
import { ref, onMounted } from 'vue'
const BASE_URL = "http://localhost:5000/api"
const poll = ref(null)
const hasVoted = ref(false)

const vote = async (option) => {
	try {
		const result = await fetch(`${BASE_URL}/poll/vote`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: "62698e399011ccd631b07baf",
				option
			})
		}).then(res => res.json())

		if (result.success) {
			hasVoted.value = true
		}
	} catch (err) {
		console.log(err);
	}
}

onMounted(async () => {
	const res = await fetch(`${BASE_URL}/poll/62698e399011ccd631b07baf`)
		.then(res => res.json())
	
	poll.value = {
		title: res.poll.title,
		options: res.poll.options,
		votes: res.poll.votes
	}

	setInterval(async () => {
		const res = await fetch(`${BASE_URL}/poll/results/62698e399011ccd631b07baf`)
			.then(res => res.json())

		if (res.success) {
			poll.value.votes = res.votes 
		}
	}, 1000)
})
</script>

<template>
	<main>
		<h1>Voting Station</h1>
		<div v-if="poll">
			<h3>{{ poll.title }}</h3>
			<div v-if="!hasVoted">
				<button v-for="(option, index) in poll.options" @click="() => vote(index)">
					{{index}} {{ option }}
				</button>
			</div>
			<div v-else>
				<p>You have voted!</p>
				<!-- Show results -->
				<div v-for="(vote, index) in poll.votes">{{ poll.options[index] }} {{ vote }}</div>
			</div>
		</div>
	</main>
</template>

<style>
body {
	text-align: center;
}
</style>