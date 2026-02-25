<div align="center">
  <img src="https://i.ibb.co/dspWJqwc/image-29.png" />
  <p>Enhance your experience.</p>
  <p>Ambient is a web based proxy built for all of your browsing needs.</p>
  <p><strong>Current Version: v1.4.2</strong></p>
  <p><strong>This is probably my last update. Enjoy!! </p>
</div>

![preview](https://i.ibb.co/xtNW3r2s/Screenshot-2025-03-28-10-37-09-AM.png)

> [!IMPORTANT]
> If you fork this repo please consider giving us a star. Thank you!

# Features
- Proxy
- Games Page
- Apps page
- Shortcuts

# Deployment
> [!WARNING]
> You __**can not**__ host Ambient locally via static web hosting.
> These apply to (but not limited to): Netlify, GitHub Pages, and Cloudflare Pages

## Server Deployment
To host Ambient on your server, you must run the following commands:

```bash
git clone https://github.com/jjtjtyt6644/proxyyy.git
cd proxyyy
```

### npm
If you're using npm, run the following commands:
```
npm i
npm run start
```

### pnpm
If you're using pnpm, run the following commands:
```bash
pnpm i
pnpm start
```

## Updating

```bash
cd proxyyy
git pull --force --allow-unrelated-histories # This may overwrite your local changes
```


Hosted by Junyu

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jjtjtyt6644/proxyyy)

[//]: # (Host your own proxy section)

## Host your own proxy

You can easily deploy your own instance of Ambient Proxy:

### Deploy to Vercel (Recommended)

Click the button above to instantly deploy your own copy to Vercel for free.

#### Detailed Vercel steps

1. Visit the [proxyyy GitHub repository](https://github.com/jjtjtyt6644/proxyyy) and make sure you are logged in to GitHub.
2. Click the **Deploy to Vercel** button near the top of this README. Vercel will open in a new tab.
3. If this is your first time on Vercel, sign up or log in using GitHub (the same account).
4. Vercel will prompt you to import a Git repository. The `jjtjtyt6644/proxyyy` repo should already be selected.
5. Choose the account or team where you want the project to reside.
6. On the "Configure Project" screen:
   - Leave the **Root Directory** set to `/`.
   - The **Framework Preset** should auto-select `Node.js` (no change required).
   - No build command is necessary; Vercel will detect and run the default script (`npm run start`).
   - No environment variables are required for basic functionality, but you can add any custom keys here.
7. Click **Deploy** at the bottom. Vercel will start building your project; this usually takes 30–60 seconds.
8. Once the deployment succeeds, Vercel will provide a unique URL (e.g. `https://proxyyy.vercel.app`). Use that URL to access your own proxy instance.
9. You can manage future redeployments by pushing to the GitHub repo or clicking "Deployments" in the Vercel dashboard.

### Manual Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jjtjtyt6644/proxyyy.git
   cd proxyyy
   ```
2. **Install dependencies:**
   ```bash
   npm install # or pnpm install
   ```
3. **Start the server:**
   ```bash
   npm run start # or pnpm start
   ```

Your proxy will be running locally. For production, deploy to a Node.js-compatible server or use Vercel for the easiest experience.

[![Contributors](https://contrib.rocks/image?repo=jjtjtyt6644/proxyyy)](https://github.com/jjtjtyt6644/proxyyy/graphs/contributors)
