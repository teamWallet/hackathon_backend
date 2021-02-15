module.exports = {
  apps: [{
      name: "service",
      script: "./dist/main.js",
      ignore_watch: ["node_modules", "build", "logs"],
      node_args: "--max_old_space_size=8192",
      log_date_format: "YYYY-MM-DD_HH:mm:ss Z",
      max_restart: 3,
      env: {
        NODE_ENV: "dev",
      },
      env_dev: {
        NODE_ENV: "dev",
      },
      env_qa: {
        NODE_ENV: "qa",
      },
      env_prod: {
        NODE_ENV: "prod",
      },
    }]
};
