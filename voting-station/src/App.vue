<script setup>
import { ref, onMounted } from 'vue'
const poll = ref(null)

onMounted(() => {
	console.log("Get Poll")
})
</script>

<template>
	<main>
		<h1>Voting Station</h1>
	</main>
</template>
