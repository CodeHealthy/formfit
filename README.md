# FormFit

FormFit is an application file size and format fixer. It helps users resize, compress, crop, and convert photos, signatures, PDFs, and documents so they meet online form upload requirements.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript
- Database: MongoDB
- Billing: Stripe Checkout, Stripe webhooks, Stripe Customer Portal

## Project Structure

```txt
formfit/
  frontend/
  backend/
```

## Local Development

Backend:

```bash
cd backend
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Stripe webhook listener:

```bash
stripe listen --forward-to localhost:5000/billing/webhook
```

## Environment Files

- `backend/.env` is private and must not be committed.
- `backend/.env.example` contains safe placeholder values.
- `frontend/.env.local` is private and must not be committed.
- `frontend/.env.example` contains safe frontend values.

## Production Notes

- Configure MongoDB Atlas, Stripe Checkout, Stripe webhooks, and Stripe Customer Portal before launching paid plans.
- Keep `FRONTEND_URL`, billing success/cancel URLs, Stripe keys, JWT secret, and MongoDB connection values environment-specific.
- The backend includes global request throttling and Stripe webhook idempotency.
- Image and PDF tools run browser-side where possible to keep server costs low.
- PDF optimization is browser-side structural optimization. It does not deeply recompress embedded images.

## CI/CD

GitHub Actions CI is configured in `.github/workflows/ci.yml`.

The workflow runs on pushes and pull requests to `main` and `master`:

- installs backend dependencies with `npm ci`
- builds the NestJS backend
- installs frontend dependencies with `npm ci`
- builds the Next.js frontend

Dependabot is configured in `.github/dependabot.yml` for weekly backend and frontend npm dependency updates.

Deployment jobs should be added after the hosting targets are chosen. Common options:

- Frontend: Vercel, Netlify, or a Docker host
- Backend: Render, Railway, Fly.io, AWS, or a Docker host
- Database: MongoDB Atlas

### Vercel Frontend Deployment

GitHub Actions workflow: `.github/workflows/deploy-frontend.yml`

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_API_BASE_URL`

The frontend workflow builds `frontend/` and deploys it to Vercel production when frontend files change on `main` or `master`.

### EC2 Backend Deployment

GitHub Actions workflow: `.github/workflows/deploy-backend.yml`

Required GitHub repository secrets:

- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`
- `EC2_SSH_PORT`
- `EC2_BACKEND_DIR`
- `FRONTEND_URL`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_PRO`
- `FRONTEND_BILLING_SUCCESS_URL`
- `FRONTEND_BILLING_CANCEL_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`

Prepare the EC2 instance before first deployment:

```bash
sudo apt update
sudo apt install -y nodejs npm nginx
sudo npm install -g pm2
mkdir -p /home/ubuntu/formfit-backend
```

Set `EC2_BACKEND_DIR` to the same directory, for example:

```txt
/home/ubuntu/formfit-backend
```

The workflow uploads the compiled NestJS backend, installs production dependencies, writes the production `.env`, and starts/reloads the app through PM2 using `backend/ecosystem.config.cjs`.
