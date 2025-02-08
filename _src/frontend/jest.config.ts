import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

// module.exports = {
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1", // エイリアスを設定
//   },
// };

const config: Config = {
  moduleDirectories: ["node_modules", "src"], // 追加
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      useESM: true,
    },
  },
  // transformIgnorePatterns: ["/node_modules/(?!react-markdown|rehype-raw)"],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  //setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
