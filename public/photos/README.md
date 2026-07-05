# Photos

Real photography drops in here. The site shows a photo wherever one is set and
otherwise falls back to the hand-drawn schematic — nothing breaks if a photo is
missing.

## How to add a photo

1. Put a **licensed** image file in this folder, e.g. `redan-north-berwick.jpg`.
   (You must have the right to use it. Public-domain or Creative-Commons images
   are fine; keep the credit. Do not add copyrighted photos you don't have a
   licence for.)
2. Reference it from the content frontmatter with a leading `/photos/…` path and
   a **required** credit:

   ```yaml
   # content/templates/redan.md
   photoUrl: /photos/redan-north-berwick.jpg
   photoCredit: "Photo: Jane Doe / CC BY-SA 4.0 (Wikimedia Commons)"
   ```

   ```yaml
   # content/courses/st-andrews-old.md
   photoUrl: /photos/st-andrews-old.jpg
   photoCredit: "Photo: John Smith / CC BY 2.0"
   ```

3. Reseed (`npm run db:reset`) and the photo replaces the diagram:
   - on the template detail hero and its gallery plate,
   - across the top of the course profile.

Remote URLs also work in `photoUrl` (e.g. a CDN), but a local file in this
folder keeps the site self-contained and fast.

## Credit is not optional

Whenever `photoUrl` is set, set `photoCredit` too. The `<Figure>` component
renders the credit line beneath the image; leaving it blank means an
unattributed photo, which for CC-licensed work is a licence violation.
