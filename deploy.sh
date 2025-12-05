#!/bin/bash

cd /home/enpower-skill-lab || exit

echo "👉 Pulling latest code from GitHub..."
git pull origin main

echo "👉 Activating virtual environment..."
source venv/bin/activate

echo "👉 Applying migrations..."
python manage.py migrate

echo "👉 Collecting static files..."
python manage.py collectstatic --noinput

echo "👉 Restarting Gunicorn..."
systemctl restart gunicorn

echo "👉 Restarting NGINX..."
systemctl restart nginx

echo "🎉 Deployment complete!"
