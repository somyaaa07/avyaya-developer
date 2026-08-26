/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'mysql2'],
    images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.externals.push({
      'pg-hstore':  'pg-hstore',
      'pg':         'pg',
      'tedious':    'tedious',
      'oracledb':   'oracledb',
      'sqlite3':    'sqlite3',
      'mariadb':    'mariadb',
    });
    return config;
  },
};

export default nextConfig;