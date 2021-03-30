# bionic.js tool

![Build bionic.js Tool](https://github.com/Forge-Srl/bionic-js/workflows/Build%20bionic.js%20Tool/badge.svg?branch=main)

This is the cli tool of bionic.js. For more information about bionic.js see the [main documentation](https://github.com/Forge-Srl/bionic-js)

## Installation

Install with npm:
```shell
npm install -g bionic-js-tool
```

## Usage

### New configuration file

To create a new bionic.js configuration file interactively you can use:
```shell
bionicjs init [config_file]
```

### Code generation

To generate JS bundles and native bridging code you can call:
```shell
bionicjs sync <config_file>
```
Subsequent calls will only regenerate changed files. If you want to regenerate all the files, you can use the `-f`
(or `--force`) option:
```shell
bionicjs sync -f <config_file>
```

### Clean up

To remove all generated files you can call:
```shell
bionicjs clean <config_file>
```

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).