# Migrating from Accordion Block

Outstand Accordion replaces [Accordion Block](https://github.com/pixelalbatross/accordion-block) (`pixelalbatross/accordion`), which no longer receives updates. The two plugins use different block names, so they can run side by side while you migrate.

## Before you start

1. Back up the site: files and database.
2. Check the requirements: WordPress 7.1 or higher and PHP 8.2 or higher.
3. Install and activate Outstand Accordion.
4. To convert accordions in the editor, keep Accordion Block active until you finish. Without it, the editor shows the old accordions as unsupported blocks and can't convert them. The WP-CLI command works without it.

While Accordion Block is inactive, Outstand Accordion shows the old accordions on the front end as its own accordions. The stored content does not change until you convert it.

## Option 1: in the editor

No terminal needed. Repeat for every accordion:

1. Open the content that holds the accordion.
2. Select the old **Accordion** block. The list view (the icon with three lines at the top left) helps with nested blocks.
3. In the block toolbar, open the block type menu and choose **Transform to** > **Accordion** (the Outstand Accordion block).
4. Save.

Accordions can live in any of these places. Check each one:

- posts and pages;
- custom post types;
- templates and template parts, under Appearance > Editor;
- synced patterns, under Appearance > Editor > Patterns;
- widget areas, on classic themes.

Templates and patterns shipped inside a theme's files can't be edited here. Ask the theme developer to update them.

## Option 2: WP-CLI

For sites with many accordions. Accordion Block does not need to be active. The command checks:

- posts of every post type and status, including templates, template parts and synced patterns;
- block widgets.

It does not check revisions or templates stored in theme files.

```bash
# List what would change.
wp outstand-accordion migrate --dry-run

# Convert everything.
wp outstand-accordion migrate

# Limit the migration to some post types or posts.
wp outstand-accordion migrate --post_type=page,wp_block
wp outstand-accordion migrate --include=12,34
```

- `--post_type` and `--include` limit the posts only. Block widgets are always checked.
- WordPress saves a revision of each changed post when its post type supports revisions and revisions are enabled.
- A scheduled post whose date has passed is skipped, because saving it would publish it. Publish it or change its date, then run the command again.
- If a save fails, the table shows the error and the command exits with an error.
- Restoring a revision from before the migration brings back the old accordion. The front end still shows it as an accordion. Run the command again to convert it.

On multisite, Outstand Accordion must be active on each site. Run the command once for each site:

```bash
wp site list --field=url | xargs -I % wp outstand-accordion migrate --url=%
```

## What changes

| Accordion Block | Outstand Accordion |
| --- | --- |
| `pixelalbatross/accordion` | `outstand/accordion` |
| `pixelalbatross/accordion-item` | `outstand/accordion-item` |
| Item title | `outstand/accordion-header`, with a chevron `outstand/accordion-icon` |
| Item content | `outstand/accordion-panel` |
| Expand by default | Open by default |

The content and the block settings stay. Headers use heading level 2, the `h2` tag Accordion Block printed.

Items without a title are removed. Accordion Block did not display them.

Blocks placed inside an accordion but outside an item are removed. The Accordion Block editor allowed only items there.

Outstand Accordion supports layout and block spacing. The theme's block gap now adds space between items. To change it, set the accordion's block spacing.

### Code

- The markup changes. Update custom CSS that targets `wp-block-pixelalbatross-accordion*`, `accordion-header`, `accordion-heading`, `accordion-button`, `accordion-title` or `accordion-panel` to target the new blocks, such as `.wp-block-outstand-accordion-header__toggle`, `.wp-block-outstand-accordion-header__title` and `.wp-block-outstand-accordion-panel`.
- The ids change. Accordion Block's script gave each item an id such as `accordion-0-item-1`, counted from 0 on the page, and gave its button and panel the same id with `-heading` and `-panel`. Outstand Accordion uses other ids, so links and scripts that use the old ids stop working. To link to an accordion, set its HTML anchor.
- The header button has no `aria-label`. Screen readers announce its title and its `aria-expanded` state.
- The `pixelalbatross_accordion_block_before_items`, `pixelalbatross_accordion_block_after_items`, `pixelalbatross_accordion_block_before_item_title` and `pixelalbatross_accordion_block_after_item_title` actions are removed.
- The `pixelalbatross.accordionBlock.allowedBlocks` JavaScript filter is removed. A panel accepts any block.
- The `accordion:item:open` and `accordion:item:close` events stay. They bubble from the header button, with the item ID in `detail.id`. The `accordion:init` event is removed.
- The `js` class Accordion Block added to `<html>` is removed.

## Finish

When no old accordions are left, deactivate and delete Accordion Block. To confirm that no posts or block widgets hold old accordions, run `wp outstand-accordion migrate --dry-run`: it reports "No Accordion Block accordions found."
