# Deploy Avla Payment to Vercel (2 minutes)

## Step 1: Create a GitHub account (if you don't have one)
Go to **github.com**, sign up, verify email.

## Step 2: Push code to GitHub
Open Terminal in this folder (`/Users/elene/Desktop/sadiplomo`) and run:

```bash
git init
git add .
git commit -m "Avla Payment ready to ship"
git remote add origin https://github.com/YOUR_USERNAME/avla-payment.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Vercel
1. Go to **vercel.com**
2. Click "Sign up with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "Add New..." → "Project"
5. Select `avla-payment` repository
6. Click "Deploy"
7. Wait 30 seconds. Done.

Your app will be live at: `https://avla-payment.vercel.app`

## Testing the live app

Replace the domain in the URLs below with your actual Vercel domain:

**Payment QR:**
```
https://avla-payment.vercel.app/?qr=payment
```

**Menu QR:**
```
https://avla-payment.vercel.app/?qr=menu
```

You can generate real QR codes by going to **qr-server.com**:
- Input: `https://avla-payment.vercel.app/?qr=payment`
- Download PNG
- Print for each table

## Local development (optional)

To test locally before pushing:

```bash
npm install
npm run dev
```

Then visit: `http://localhost:5173/?qr=payment`

---

Done. Your Avla Payment system is now live.
