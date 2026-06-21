# Schema Vault Frontend

This is the React + TypeScript frontend application for Schema Vault, powered by Vite.

## 🚀 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd schema-vault-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   *Make sure `VITE_API_BASE_URL` in your `.env` points to your backend API (e.g., `http://localhost:8080/api`).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application should now be running on `http://localhost:5173`.

## 🏗️ Building for Production

To create a production build manually:
```bash
npm run build
```
The compiled static assets will be located in the `dist` folder.

## 🌐 Deployment (Vercel)

This frontend is pre-configured to be deployed easily using **Vercel** (a `vercel.json` file is already included).

### How to deploy:
1. Push your code to your GitHub repository.
2. Create an account on [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `schema-vault-frontend` GitHub repository.
4. **Important**: Before clicking deploy, go to **Environment Variables** in the Vercel dashboard and add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: The URL to your production backend (e.g., `https://api.yourdomain.com/api`)
5. Click **Deploy**. Vercel will automatically build and host your frontend every time you push to the `main` branch!

## 🛠️ Tech Stack
- **React** (UI Library)
- **TypeScript** (Static Typing)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
