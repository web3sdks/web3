const fs = require("fs");

const existingPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const newPackageJson = { ...existingPackageJson, name: "web3sdks" };

fs.writeFileSync("package.json", JSON.stringify(newPackageJson, null, 2));

fs.writeFileSync(
  "README.md",
  `# web3sdks cli

  This is a proxied package of the \`@web3sdks/cli\` for convenient usage with \`npx web3sdks\`.
  
  You can find the actual package [here](https://www.npmjs.com/package/@web3sdks/cli).
  `
);
