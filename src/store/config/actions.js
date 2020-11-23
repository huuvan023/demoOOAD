export async function LoginSuccess ({commit}, data) {
  await commit('setUser', {...data.data})
  await commit('setLog', true)
  await commit('setRole', data.role)
  localStorage.setItem('role', data.role)
  localStorage.setItem('user', JSON.stringify({...data.data}))
}
export async function logOut({commit}) {
  await commit('setUser', {})
  await commit('setLog', false)
  await commit('setRole', '')
  localStorage.setItem('role', null)
  localStorage.setItem('user', {})
  this.$router.replace('/')
}
