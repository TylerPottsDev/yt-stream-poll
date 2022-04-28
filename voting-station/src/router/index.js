import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('../views/Home.vue')
	},
	{
		path: '/results',
		name: 'results',
		component: () => import('../views/Results.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router