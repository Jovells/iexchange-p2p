/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEB3_PROJECT_ID: "311d8d8a121061b635da77b11957caa8",
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
