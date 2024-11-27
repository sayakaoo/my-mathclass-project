// next.config.js
module.exports = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' https://vercel.live;"
          },
        ],
      },
    ]
  },
}
