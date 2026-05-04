import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // `next build` typecheck spawn can fail with EPERM on some Windows setups.
    // We run `npx tsc --noEmit` separately when needed.
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: true,
  },
  webpack: (config) => {
    // Workaround: on some Windows Node builds, fs.readlinkSync() can return EISDIR for normal files,
    // which breaks webpack's default symlink resolution during `next build`.
    if (config?.resolve) config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
