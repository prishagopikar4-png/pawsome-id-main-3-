Render deployment steps for `server/` (example)

1. Push your repo to GitHub (if not already).

2. Create a Render account and connect your GitHub.

3. In Render dashboard -> New -> Web Service:
   - Name: pawsome-server
   - Region: choose closest
   - Branch: main (or your branch)
   - Root Directory: server
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node src/index.js

4. Add environment variables in Render (Dashboard -> Environment):
   - MONGO_URI: your MongoDB Atlas connection string
   - JWT_SECRET: a secret string for JWT signing
   - CORS_ORIGIN: https://your-frontend-vercel-domain (or * for testing)

5. Deploy. Render will build and deploy; note the service URL (e.g., https://pawsome-server.onrender.com).

6. In Vercel (frontend project) set `VITE_API_BASE` to the backend API base, including `/api` if your server routes are mounted under `/api`.
   Example: https://pawsome-server.onrender.com/api

7. Redeploy the frontend on Vercel to pick up the new env var.

Optional `render.yaml` snippet (fill `repo` if you want Render to use it automatically):

```yaml
# Example render.yaml - edit repo and branch as needed
services:
  - type: web
    name: pawsome-server
    env: node
    plan: free
    repo: "git@github.com:YOURNAME/YOURREPO.git"
    branch: main
    buildCommand: npm install
    startCommand: node src/index.js
    rootDir: server
    autoDeploy: true
```
