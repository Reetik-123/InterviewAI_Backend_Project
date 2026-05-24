Deployment notes — connect frontend and backend on Render
=====================================================

This project uses a frontend (Vite/React) and a backend (Express + Socket.IO).
To connect the deployed frontend and backend (Render), set the environment variables below and redeploy both services.

Backend (Render service)
- Set environment variable `FRONTEND_URL` to your frontend URL:
  - FRONTEND_URL = https://interviewai-backend-project-1.onrender.com
- Ensure `MONGODB_URL`, `JWT_SECRET` and other backend secrets are set in Render.
- After updating env vars, redeploy or restart the backend service.

Frontend (Render service)
- Set environment variable `VITE_API_URL` to your backend URL:
  - VITE_API_URL = https://interviewai-backend-project.onrender.com
- Rebuild/redeploy the frontend so Vite embeds the correct API URL into the build.

Why these values
- `VITE_API_URL` instructs the frontend to send API requests and open socket connections to the backend.
- `FRONTEND_URL` is used by the backend to allow CORS and socket connections only from that origin.

Quick verification (curl)
- Check CORS by sending an OPTIONS request with the frontend origin header:

```bash
curl -i -X OPTIONS "https://interviewai-backend-project.onrender.com/api/auth" -H "Origin: https://interviewai-backend-project-1.onrender.com" -H "Access-Control-Request-Method: GET"
```

- If CORS is configured correctly you should see `Access-Control-Allow-Origin: https://interviewai-backend-project-1.onrender.com` in the response headers.

Sanity checks
- Use the `scripts/check_deploy.js` Node script to run a simple connectivity test (added to this repo). Example:

```powershell
# from repo root
node scripts/check_deploy.js \
  --backend https://interviewai-backend-project.onrender.com \
  --origin https://interviewai-backend-project-1.onrender.com
```

If you want, I can help set these env vars in Render (I will need access or deploy tokens), or I can walk you through the Render UI step-by-step.
