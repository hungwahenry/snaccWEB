import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/@:username", destination: "/profile/:username" }],
    }
  },
}

export default nextConfig
