/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   missingSuspenseWithCSRBailout: false
  // },
  env: {
    WEB3_PROJECT_ID: "3a04d38134c46085917b81c1494b1716",
    ALCHEMY_API_KEY: "hntMXgOHf-CwMij-j6_pxYHble56eXxm",
    ALCHEMY_GAS_POLICY_ID: "be956f70-1c84-4b5f-a089-7040e2b165b5",
  },
  webpack: config => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
