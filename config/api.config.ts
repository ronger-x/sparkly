const { NODE_ENV } = process.env
const isDevMode = NODE_ENV === 'development'
const apiConfig = {
  production: {
    BASE: 'https://rymcu.com/api'
  },
  development: {
    BASE: 'http://192.168.31.70:8080/mortise/api/v1'
  }
}
export default apiConfig[isDevMode ? 'development' : 'production']
