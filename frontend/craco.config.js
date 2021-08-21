const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@characters": path.resolve(__dirname, "src/images/characters/"),
      "@backgrounds": path.resolve(__dirname, "src/images/backgrounds/"),
      "@styles": path.resolve(__dirname, "src/styles"),
      // "@machines": path.resolve(__dirname, "src/machines"),
      // "@utils": path.resolve(__dirname, "src/utils"),
      // "@icons": path.resolve(__dirname, "src/icons"),
      // "@tests": path.resolve(__dirname, "src/tests"),
      "@root": path.resolve(__dirname, "src/"),
      // "@quests": path.resolve(__dirname, "src/systems/quests"),
      "@ctypes": path.resolve(__dirname, "src/commonTypes"),
    },
  },
};
