function baseUrl () {
    //Insert backend condition and client side condition URLs here

    //base URL for testing on local machine
    return 'http://localhost:3000'
}

export default {
base: baseUrl(),
  pages: {
    index: '/',
    login: '/login'
  }
}