export default defineNuxtRouteMiddleware((to) => {
  // Only check on admin routes (not login)
  if (to.path === '/admin' || to.path === '/admin/') {
    return
  }
  if (!to.path.startsWith('/admin/')) return

  const token = process.client ? localStorage.getItem('inaka_admin_token') : null
  if (!token) {
    return navigateTo('/admin')
  }
})
