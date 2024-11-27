module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',  // すべてのページに適用
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' https://vercel.live; img-src 'self' data:;"
          },
        ],
      },
    ]
  },
}
module.exports = {
  experimental: {
    disableOptimizedLoading: true,
  },
}

