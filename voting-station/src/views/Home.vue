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
	const res = await fetch(`${BASE_URL}/poll/active`)
		.then(res => res.json())
	
	poll.value = {
		title: res.poll.title,
		options: res.poll.options,
		votes: res.poll.votes
	}

	// TODO: Convert to a websocket connection
	setInterval(async () => {
		const res = await fetch(`${BASE_URL}/poll/results`)
			.then(res => res.json())

		if (res.success) {
			poll.value.votes = res.votes 
		}
	}, 1000)
})
</script>

<template>
	<main class="min-h-screen bg-gray-700 text-white py-8 text-center">
		<h1 class="text-4xl font-black uppercase mb-8">Voting Station</h1>
		<div v-if="poll">
			<h3 class="text-2xl font-bold mb-4">{{ poll.title }}</h3>
			<div v-if="!hasVoted">
				<button 
					v-for="(option, index) in poll.options" 
					@click="() => vote(index)"
					class="block w-full max-w-sm mx-auto bg-gray-800 p-4 rounded mb-2 hover:bg-gray-600">
					<span>{{ option }}</span>
				</button>
			</div>
			<div v-else>
				<p class="text-lg mb-4">You have voted!</p>
				<!-- Show results -->
				<div 
					v-for="(vote, index) in poll.votes" 
					class="w-full max-w-sm mx-auto">
					<div 
						class="bg-gray-800 p-4 rounded mb-2 flex justify-between"
						:style="`width: ${Math.round((vote / poll.votes.reduce((partialSum, a) => partialSum + a, 0)) * 100) + '%'}`">
						<span class="mr-4">{{ poll.options[index] }}</span>
						<span>{{ Math.round((vote / poll.votes.reduce((partialSum, a) => partialSum + a, 0)) * 100) + "%" }}</span>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>