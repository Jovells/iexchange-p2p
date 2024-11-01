/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   missingSuspenseWithCSRBailout: false
  // },
  env: {
    WEB3_PROJECT_ID: "3a04d38134c46085917b81c1494b1716",
  },
  webpack: config => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
