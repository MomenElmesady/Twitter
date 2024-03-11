let config = {
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  // ... (other configuration options)
};

function setConfig(options) {
  config = { ...config, ...options };
}

module.exports = {
  setConfig,
  getConfig: () => ({ ...config }),
};