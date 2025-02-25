const { NODE_ENV } = process.env
const isDevMode = NODE_ENV === 'development'
const apiConfig = {
  production: {
    FE: 'https://rymcu.com',
    BASE: 'https://rymcu.com/api',
    AUTH: '/api/auth',
    CDN: 'https://static.rymcu.com',
    PROXY: 'https://static.rymcu.com/proxy',
    SOCKET: 'https://rymcu.com/wss',
    GRAVATAR: 'https://static.rymcu.com/avatar',
    VDITOR: 'https://static.rymcu.com/vditor@3.10.3/',
    VDITOR_CSS: 'https://static.rymcu.com/vditor@3.10.3/dist/css/content-theme'
  },
  development: {
    FE: 'http://localhost:3000',
    BASE: 'http://localhost:8080/mortise/api/v1',
    AUTH: '/api/auth',
    CDN: '',
    PROXY: '/proxy',
    SOCKET: 'http://localhost:3000/ws',
    GRAVATAR: 'https://static.rymcu.com/avatar',
    VDITOR: 'https://static.rymcu.com/vditor@3.10.3/',
    VDITOR_CSS: 'https://static.rymcu.com/vditor@3.10.3/dist/css/content-theme'
  }
}
export default apiConfig[isDevMode ? 'development' : 'production']
