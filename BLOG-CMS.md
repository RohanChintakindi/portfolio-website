# Blog CMS

The portfolio uses Sanity Studio for online writing and image uploads.

## One-time setup

1. Create a free Sanity project at https://www.sanity.io/manage.
2. Copy `studio/.env.example` to `studio/.env` and add the project ID.
3. Copy `.env.example` to `.env` and add the same project ID.
4. In Sanity's API settings, add `http://localhost:4173` and `https://rohanc.dev` as CORS origins. Credentials are not required for the public portfolio origin.
5. Run `npm install` inside `studio`, then `npm run dev` to preview the editor.
6. Run `npm run deploy` inside `studio` to publish the editor to a private-login `*.sanity.studio` URL.

## Publishing

- Create a Post in Studio.
- Add a title, slug, summary, body, and any images.
- Leave `Published at` empty while drafting.
- Add a publish date when the post is ready. It will then appear under Writing on the portfolio.

The public site reads published posts directly from Sanity. Editing or publishing a post does not require a Git commit or a portfolio rebuild.
