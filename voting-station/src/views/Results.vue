<script setup>
import { ref, onMounted } from 'vue'
const BASE_URL = "http://localhost:5000/api"
const poll = ref(null)

onMounted(async () => {
	const res = await fetch(`${BASE_URL}/poll/active`)
		.then(res => res.json())
	
	if (res.poll != null) {
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
	}
})
</script>

<template>
	<main v-if="poll" class="bg-white bg-opacity-50 min-h-screen p-4">
		<h3 class="text-4xl font-bold mb-4 text-gray-800">{{ poll.title }}</h3>
		<div v-for="(vote, index) in poll.votes">
			<div 
				class="bg-gray-800 p-4 text-xl text-white rounded mb-2 flex justify-between"
				:style="`width: ${Math.round((vote / poll.votes.reduce((partialSum, a) => partialSum + a, 0)) * 100) + '%'}`">
				<span class="mr-4">{{ poll.options[index] }}</span>
				<span>{{ Math.round((vote / poll.votes.reduce((partialSum, a) => partialSum + a, 0)) * 100) + "%" }}</span>
			</div>
		</div>
	</main>
</template>