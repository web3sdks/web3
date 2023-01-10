#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
import { CREATE_MESSAGES } from "../../constants/constants";
import detect from "../core/detection/detect";
import { DownloadError, createApp } from "./helpers/create-app";
import { createContractProject } from "./helpers/create-contract";
import { getPkgManager } from "./helpers/get-pkg-manager";
import { validateNpmName } from "./helpers/validate-pkg";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import prompts from "prompts";

let contractName: string = "";
let projectPath: string = "";
let projectType: string = "";
let framework: string = "";
let language: string = "";
let baseContract: string = "";
let chain: string = "";
/* let createType: string = "app"; */

export async function twCreate(
  pType: string,
  pPath: string = "",
  options: any,
) {
  if (typeof pPath === "string") {
    projectPath = pPath;
  }

  if (typeof options.contractName === "string") {
    contractName = options.contractName;
  }

  if (pType === "app" || options.app) {
    projectType = "app";
  } else if (pType === "contract" || options.contract) {
    projectType = "contract";
  }

  if (projectType === "app") {
    if (options.typescript) {
      language = "typescript";
    }

    if (options.javascript) {
      language = "javascript";
    }

    if (options.next) {
      framework = "next";
    }

    if (options.cra) {
      framework = "cra";
    }

    if (options.vite) {
      framework = "vite";
    }

    if (options.solana) {
      chain = "solana";
    }

    if (options.evm) {
      chain = "evm";
    }
  }

  if (projectType === "contract") {
    if (options.forge) {
      framework = "forge";
    }

    if (options.hardhat) {
      framework = "hardhat";
    }
  }

  if (options.framework) {
    framework = options.framework;
  }

  if (!projectType && !options.template) {
    const res = await prompts({
      type: "select",
      name: "projectType",
      message: CREATE_MESSAGES.typeOfProject,
      choices: [
        { title: "App", value: "app" },
        { title: "Contract", value: "contract" },
      ],
    });

    if (typeof res.projectType === "string") {
      projectType = res.projectType.trim();
    }
  } else if (!projectType || options.template) {
    // If no project type is specified, but a template is, we assume the user wants to create an app.
    // We do this so old users can still use the --template flag to create an app.
    projectType = "app";
  }

  // Whether to only create a new contract without the project
  let onlyContract = false;
  if (projectType === "contract") {
    const resolvedProjectPath = path.resolve(projectPath);
    const contractProjectType = await detect(resolvedProjectPath, {});

    if (
      contractProjectType === "foundry" &&
      fs.existsSync(path.join(resolvedProjectPath, "src"))
    ) {
      onlyContract = true;
      projectPath = path.join(projectPath, "src");
    } else if (contractProjectType === "hardhat") {
      if (fs.existsSync(path.join(resolvedProjectPath, "contracts"))) {
        onlyContract = true;
        projectPath = path.join(projectPath, "contracts");
      } else {
        // If there's no expected contracts folder, check for a directory that has .sol files
        const directories = fs
          .readdirSync(resolvedProjectPath)
          .filter((file) =>
            fs.lstatSync(path.join(resolvedProjectPath, file)).isDirectory(),
          );
        for (const directory of directories) {
          const files = fs.readdirSync(path.join(projectPath, directory));
          if (files.some((file) => file.endsWith(".sol"))) {
            onlyContract = true;
            projectPath = path.join(projectPath, directory);
            break;
          }
        }
      }
    }
  }

  if (!onlyContract) {
    if (!projectPath) {
      const defaultName =
        projectType === "contract" ? "web3sdks-contracts" : "web3sdks-app";
      const res = await prompts({
        type: "text",
        name: "path",
        message: CREATE_MESSAGES.projectName,
        initial: options.template || defaultName,
        format: (name: string) => name.toLowerCase(),
        validate: (name: string) => {
          const validation = validateNpmName(
            path.basename(path.resolve(name.toLowerCase())),
          );
          if (validation.valid) {
            return true;
          }
          return "Invalid project name: " + validation.problems?.[0];
        },
      });

      if (typeof res.path === "string") {
        projectPath = path.join(projectPath, res.path.trim());
      }
    }

    if (!projectPath) {
      console.log(
        "\nPlease specify the project directory:\n" +
          `  ${chalk.cyan("npx web3sdks create")} ${chalk.green(
            "<project-directory>",
          )}\n` +
          "For example:\n" +
          `  ${chalk.cyan("npx web3sdks create")} ${chalk.green(
            "my-web3sdks-app",
          )}\n\n` +
          `Run ${chalk.cyan("npx web3sdks --help")} to see all options.`,
      );
      process.exit(1);
    }

    if (!options.template) {
      if (projectType === "app" && !chain) {
        const res = await prompts({
          type: "select",
          name: "chain",
          message: CREATE_MESSAGES.chain,
          choices: [
            { title: "EVM", value: "evm" },
            { title: "Solana", value: "solana" },
          ],
        });

        if (res.chain === "solana") {
          chain = "solana";
        } else {
          chain = "evm";
        }
      }

      if (projectType === "app" && !framework) {
        const res = await prompts({
          type: "select",
          name: "framework",
          message: CREATE_MESSAGES.framework,
          choices:
            // Solana doesn't support Vite just yet:
            chain === "solana"
              ? [
                  { title: "Next.js", value: "next" },
                  { title: "Create React App", value: "cra" },
                  // { title: "Vite", value: "vite" },
                ]
              : [
                  { title: "Next.js", value: "next" },
                  { title: "Create React App", value: "cra" },
                  { title: "Vite", value: "vite" },
                ],
        });

        if (typeof res.framework === "string") {
          framework = res.framework.trim();
        }
      }

      if (projectType === "app" && !language) {
        const res = await prompts({
          type: "select",
          name: "language",
          message: CREATE_MESSAGES.language,
          choices: [
            { title: "JavaScript", value: "javascript" },
            { title: "TypeScript", value: "typescript" },
          ],
        });

        if (typeof res.language === "string") {
          language = res.language.trim();
        }
      }

      if (
        projectType === "contract" &&
        framework !== "forge" &&
        framework !== "hardhat"
      ) {
        const res = await prompts({
          type: "select",
          name: "framework",
          message: CREATE_MESSAGES.framework,
          choices: [
            { title: "Hardhat", value: "hardhat" },
            { title: "Forge", value: "forge" },
          ],
        });

        if (typeof res.framework === "string") {
          framework = res.framework.trim();
        }
      }

      if (!framework) {
        console.log("Please specify a framework");
        process.exit(1);
      }

      if (!language) {
        // Default = JavaScript
        language = "javascript";
      }
    }
  }

  if (projectType === "contract") {
    // Select contract name
    if (!contractName) {
      const defaultName = "MyContract";
      const res = await prompts({
        type: "text",
        name: "path",
        message: CREATE_MESSAGES.contractName,
        initial: defaultName,
        validate: (name: string) => {
          const isValid = /(^[a-z0-9A-Z]+$)|(^[a-z0-9A-Z]+\.sol$)/.test(name);
          if (isValid) {
            return true;
          }

          return `Invalid contract name 'contractName' (only alphanumeric characters allowed)`;
        },
      });

      if (typeof res.path === "string") {
        contractName = res.path.trim();
      }

      if (!contractName) {
        console.log(
          "\nPlease specify the contract name:\n" +
            `  ${chalk.cyan(
              "npx web3sdks create --contract --name",
            )} ${chalk.green("<contract-name>")}\n` +
            "For example:\n" +
            `  ${chalk.cyan(
              "npx web3sdks create --contract --name",
            )} ${chalk.green("MyContract")}\n\n` +
            `Run ${chalk.cyan("npx web3sdks --help")} to see all options.`,
        );
        process.exit(1);
      }
    }

    // Select base contract
    if (projectType === "contract" && !baseContract) {
      let standard = "none";
      const standardPrompt = await prompts({
        type: "select",
        name: "standard",
        message: CREATE_MESSAGES.contract,
        choices: [
          ...(!onlyContract
            ? [{ title: "Empty Contract", value: "none" }]
            : []),
          { title: "ERC721", value: "erc721" },
          { title: "ERC20", value: "erc20" },
          { title: "ERC1155", value: "erc1155" },
        ],
      });

      if (typeof standardPrompt.standard === "string") {
        standard = standardPrompt.standard.trim();
      }

      if (standard === "none") {
        baseContract = "";
      } else {
        let choices: prompts.Choice[] = [];
        if (standard === "erc721") {
          choices = [
            { title: "None", value: "ERC721Base" },
            { title: "Signature Mint", value: "ERC721SignatureMint" },
            { title: "Lazy Mint", value: "ERC721LazyMint" },
            { title: "Delayed Reveal", value: "ERC721DelayedReveal" },
            { title: "Drop", value: "ERC721Drop" },
          ];
        } else if (standard === "erc20") {
          choices = [
            { title: "None", value: "ERC20Base" },
            { title: "Vote", value: "ERC20Vote" },
            { title: "Signature Mint", value: "ERC20SignatureMint" },
            { title: "Vote + Signature Mint", value: "ERC20SignatureMintVote" },
            { title: "Drop", value: "ERC20Drop" },
            { title: "Vote + Drop", value: "ERC20DropVote" },
          ];
        } else if (standard === "erc1155") {
          choices = [
            { title: "None", value: "ERC1155Base" },
            { title: "Signature Mint", value: "ERC1155SignatureMint" },
            { title: "Lazy Mint", value: "ERC1155LazyMint" },
            { title: "Delayed Reveal", value: "ERC1155DelayedReveal" },
            { title: "Drop", value: "ERC1155Drop" },
          ];
        }

        const res = await prompts({
          type: "select",
          name: "baseContract",
          message: CREATE_MESSAGES.extensions,
          choices: choices,
        });

        if (typeof res.baseContract === "string") {
          baseContract = res.baseContract.trim();
        }
      }
    }
  }

  // Resolve project path
  projectPath = path.resolve(projectPath);
  const projectName = path.basename(projectPath);

  const { valid, problems } = validateNpmName(projectName);
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`,
      )} because of npm naming restrictions:`,
    );

    problems?.forEach((p) => console.error(`    ${chalk.red.bold("*")} ${p}`));
    process.exit(1);
  }

  if (options.template === true) {
    console.error(
      "Please provide an template name, otherwise remove the template option. Checkout some templates you can use here: https://github.com/web3sdks-template/",
    );
    process.exit(1);
  }

  const packageManager = !!options.useNpm
    ? "npm"
    : !!options.usePnpm
    ? "pnpm"
    : getPkgManager();

  const template =
    typeof options.template === "string" && options.template.trim();
  try {
    if (projectType === "app") {
      await createApp({
        appPath: projectPath,
        packageManager,
        framework,
        language,
        template,
        chain,
      });
    } else {
      await createContractProject({
        contractPath: projectPath,
        packageManager,
        framework,
        contractName,
        baseContract,
        onlyContract,
      });
    }
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason;
    }
  }
}
