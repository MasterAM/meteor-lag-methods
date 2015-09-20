# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]
### Changed
- Nothing.

## [0.4.0] - 2015-09-20
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

## [0.2.0] - 2015-09-09
### Added
- 2 API methods - `getDefaultDelay()` and `getDelayForMethod(methodName)`.

## [0.1.1] - 2015-09-08
### Added
- Fixed typos and repository links.

## 0.1.0 - 2015-09-08
### Added
- Initial release.

[unreleased]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.4.0...HEAD
[0.3.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.1.0...v0.2.0
[0.1.1]: https://github.com/MasterAM/meteor-lag-methods/compare/v0.1.0...v0.1.1