# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]
### Changed
- Nothing.

## [v1.0.0] - 2015-09-29

### Changed
- Major refactoring of the package structure.
- Pulled most of the code into the base package, *alon:lag-base*.
- The API is different now. Most of it is coming from the base package.
- The readme file.

### Removed
- Some API methods.

## [v0.4.0] - 2015-09-20
### Added
- The forceBlock config option.

### Fixed
- A bug that prevented user change (login/logout) when the relevant method is unblocked.
- Several typos in the README file.

## [0.3.0] - 2015-09-13
### Added
- Several API methods and some undocumented methods for the console package that accompanies this one.
- Several config options. Notably:
    - logging
    - unblock
    - persist
- Caching for simple configuration options.
### Changed
- Major refactoring, broke code into modules.

## [v0.2.0] - 2015-09-09
### Added
- 2 API methods - `getDefaultDelay()` and `getDelayForMethod(methodName)`.

## [v0.1.1] - 2015-09-08
### Added
- Fixed typos and repository links.

## v0.1.0 - 2015-09-08
### Added
- Initial release.

[unreleased]: https://github.com/MasterAM/meteor-lag-methods/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.4.0...v1.0.0
[v0.4.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.1.0...v0.2.0
[v0.1.1]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.1.0...v0.1.1
