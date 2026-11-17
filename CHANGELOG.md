# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-11-17

### Added

- Accordion block, powered by the Interactivity API, with item, header, panel and icon blocks that follow the WAI-ARIA accordion pattern.
- Closed panels stay searchable: find-in-page and links to an element inside a panel open its item.
- Icon styles from the WordPress icon registry, filterable with `outstand_accordion_icons`.
- An icon style and size on the accordion apply to every item, and each item can override them.
- Editor transform and `wp outstand-accordion migrate` command to convert Accordion Block (`pixelalbatross/accordion`) accordions in posts, templates, synced patterns and block widgets. See [MIGRATING.md](MIGRATING.md).
- Accordion Block accordions show on the front end as Outstand Accordion accordions while Accordion Block is inactive.

[Unreleased]: https://github.com/pixelalbatross/outstand-accordion/compare/1.0.0...HEAD
[1.0.0]: https://github.com/pixelalbatross/outstand-accordion/releases/tag/1.0.0
