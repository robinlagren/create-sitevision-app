const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const properties = require('../util/properties');
const templatifyFile = require('../util/templatify').templatifyFile;
const walkFiles = require('../util/walkFiles').walkFiles;
const { questions } = require('../config/setup-questions');
const spawn = require('cross-spawn');

const copyTemplateFiles = (type, options) => {
  console.log('Copying template files');
  fs.copySync(path.resolve(__dirname, '..', 'template', type), '.');

  // Can be used to replace stuff in the templates,
  // one option would be to gather info for the manifest and populate it
  walkFiles('.', (filePath) => templatifyFile(filePath, options), [
    'node_modules',
  ]);

  // Can't name the file .gitignore https://github.com/npm/npm/issues/1862
  fs.moveSync('gitignore', '.gitignore');
};

const writePackageJson = (content) => {
  fs.writeFileSync(
    properties.PACKAGE_JSON_PATH,
    JSON.stringify(content, null, 2)
  );
};

const getCommonPackageProperties = () => {
  const appPackage = properties.getPackageJSON();
  appPackage.scripts = {
    build: 'sitevision-scripts build',
    'create-addon': 'sitevision-scripts create-addon',
    'deploy-prod': 'sitevision-scripts deploy-prod',
    sign: 'sitevision-scripts sign',
    dev: 'sitevision-scripts dev',
    'setup-dev-properties': 'sitevision-scripts setup-dev-properties',
  };

  return appPackage;
};

const updatePackageJsonReact = () => {
  const appPackage = getCommonPackageProperties();

  appPackage.eslintConfig = {
    extends: [
      '@sitevision/eslint-config-recommended',
      '@sitevision/eslint-config-webapp-react',
    ],
  };

  appPackage.prettier = {};
  appPackage.postcss = {
    plugins: ['autoprefixer'],
  };

  writePackageJson(appPackage);
};

const updatePackageJsonBundledRest = () => {
  const appPackage = getCommonPackageProperties();

  appPackage.eslintConfig = {
    extends: ['@sitevision/eslint-config-recommended'],
  };

  appPackage.prettier = {};

  writePackageJson(appPackage);
};

const installWebAppDependencies = (appPath) => {
  spawn.sync('npm', ['install', 'react', 'react-dom', '@sitevision/api'], {
    stdio: 'inherit',
    cwd: appPath,
  });
};

const installRestAppDependencies = (appPath) => {
  spawn.sync('npm', ['install', '@sitevision/api'], {
    stdio: 'inherit',
    cwd: appPath,
  });
};

const updatePackageJsonLegacy = (transpile) => {
  const appPackage = getCommonPackageProperties();

  appPackage.sitevision_scripts_properties = {
    transpile,
  };

  writePackageJson(appPackage);
};

const simplifyVersionNumber = (rawVersion) =>
  rawVersion
    .match(/(\d+)\.(\d+)\.(\d+)-?([a-zA-Z-\d.]*)\+?([a-zA-Z-\d.]*)/)
    .splice(1, 3)
    .join('.');

module.exports = async ({ appPath, appName }) => {
  console.clear();

  inquirer
    .prompt(questions)
    .then(
      ({
        type,
        transpile,
        domain,
        siteName,
        addonName,
        username,
        password,
      }) => {
        console.clear();

        fs.writeFileSync(
          path.resolve(appPath, properties.DEV_PROPERTIES_PATH),
          JSON.stringify(
            { domain, siteName, addonName, username, password },
            null,
            2
          )
        );

        console.log(`Initializing Sitevision ${type} app`, appName);
        const templateOptions = {
          appName,
        };

        switch (type) {
          case 'web-react': {
            updatePackageJsonReact();
            installWebAppDependencies(appPath);
            templateOptions.reactVersion = simplifyVersionNumber(
              properties.getPackageJSON().dependencies.react
            );
            break;
          }
          case 'rest-bundled': {
            updatePackageJsonBundledRest();
            installRestAppDependencies(appPath);
            break;
          }
          default:
            updatePackageJsonLegacy(transpile);
        }

        copyTemplateFiles(type, templateOptions);

        console.log(
          'Your app has been created just',
          chalk.blue(`cd ${appName}`)
        );
      }
    );
};
