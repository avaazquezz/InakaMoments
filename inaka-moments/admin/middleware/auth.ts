export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check on login page
  if (to.path === '/admin') return

  const token = typeof window !== 'undefined' ? localStorage.getItem('inaka_token') : null
  if (!token) {
    return navigateTo('/admin')
  }
})