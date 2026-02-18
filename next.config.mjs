/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  experimental: {
    appDir: true,
  },

  output: "standalone",   // 🔥 เพิ่มบรรทัดนี้
};

export default nextConfig;
