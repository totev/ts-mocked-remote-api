const deepmerge = require("deepmerge");
const defaultPreset = require("@vue/cli-plugin-unit-jest/presets/typescript/jest-preset");

module.exports = deepmerge(defaultPreset, {
  moduleNameMapper: {
    "^@remote-api/(.*)$": "<rootDir>/mock/services/remote-api/$1",
  },
});
