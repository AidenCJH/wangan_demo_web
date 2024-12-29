import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/chatbot/ChatView.vue')
  },
  {
    path: "/",
    redirect: "/chat",
  }
]

const router = new VueRouter({
  routes
})

export default router
