module.exports = {
    preset: "jest-puppeteer",
    setupFilesAfterEnv: ["./setup.js"],
    transform: {
      "\\.[jt]sx?$": "babel-jest",
    },
  };
  