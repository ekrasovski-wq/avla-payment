#!/bin/bash

USERNAME="ekrasovski-wq"
REPO="avla-payment"

echo "Pushing Avla Payment to GitHub..."
echo "Username: $USERNAME"
echo "Repository: $REPO"
echo ""

git remote add origin https://github.com/$USERNAME/$REPO.git
git branch -M main
git push -u origin main

echo ""
echo "✓ Done! Your code is now at: https://github.com/$USERNAME/$REPO"
echo "✓ Next: Go to vercel.com and deploy from GitHub"
