CareerGuide - Career Path Discovery Platform
A comprehensive web application that helps users explore career paths, understand job requirements, and discover live job opportunities using real-time data from the JSearch API.

 Live Application: http://erinn.tech

DEMO-VIDEO LINK: https://www.canva.com/design/DAG6LtocdFc/wRY0f3NKR0OVGG3wHzhqsQ/edit?utm_content=DAG6LtocdFc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

 Purpose & Value
The Problem
Many students and young professionals struggle to:

Discover niche and emerging career paths
Understand job requirements and salary expectations
Find real job opportunities in their field of interest
Navigate the overwhelming amount of career information available online
Our Solution
CareerGuide provides:

Curated career information for 20+ niche and emerging careers (AI Prompt Engineer, Blockchain Auditor, XR Designer, etc.)
Real-time job listings from the JSearch API with apply links
Skills and salary data for informed decision-making
Category-based exploration (Tech, Business, Health, Creative, Engineering, Education)
Live job market statistics (open positions, hiring companies, salary ranges)
User-friendly interface with dark mode and responsive design

Why it's meaningful:

Addresses a genuine need for career guidance beyond traditional resources
Provides actionable information with real job postings users can apply to
Focuses on emerging careers that traditional career guides often overlook

✨ Features
Core Functionality
Dynamic Career Search - Search for ANY career and get live job results
Live Job Listings - Real-time job postings via JSearch API with company names, locations, and apply links
Category Filtering - Browse careers by Tech, Business, Health, Creative, Engineering, Education
Salary Information - View salary ranges and market statistics for each career
Skills Breakdown - Understand required skills for each role
Job Market Statistics - See total positions, hiring companies, countries, and average salaries
🔗 Related Careers - Discover similar career paths

User Interaction Features

Search & Filter - Find careers by name or browse by category
Dynamic Content - Live API calls fetch current job market data
Direct Apply - One-click access to job application pages
Responsive Design - Works seamlessly on desktop, tablet, and mobile
Interactive Navigation - Smooth transitions between pages

Technical Features

Dark Mode Toggle - Persistent theme preference using localStorage
Optimized Loading - Cached static assets for fast page loads
Load Balancing - Traffic distributed across two servers via HAProxy
Error Handling - Graceful handling of API failures with user-friendly messages
Secure API Keys - Server-side API key management, never exposed to frontend

Tech Stack

Frontend

HTML5 - Semantic markup for better SEO
CSS3 - Modern styling with CSS Grid/Flexbox, custom properties for theming
Vanilla JavaScript - No frameworks, pure JS for optimal performance
LocalStorage API - Theme persistence across sessions

Backend

Python 3.10+ - Core programming language
Flask - Lightweight web framework for API endpoints
Flask-CORS - Cross-origin resource sharing support
Requests - HTTP library for external API calls
python-dotenv - Environment variable management
Gunicorn - Production-grade WSGI HTTP server

Deployment Infrastructure

Ubuntu 22.04 LTS - Operating system
HAProxy - High-performance load balancer with health checks
Nginx - Web server for serving static files
Systemd - Service management and auto-restart
Git - Version control
Custom Domain - Professional .tech domain with DNS configuration

External APIs

JSearch API (RapidAPI) - Job search and career data
Documentation: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
Endpoints used: /search
Rate limit: 1000 requests/month (free tier)
Response time: ~1-3 seconds

Project Structure

career-guide-web_app/
│
├── index.html
├── careers.html            
├── career.html            
├── about.html             
├── contact.html            
│
├── css/
│   └── style.css          
│
├── js/
│   ├── script.js          
│   ├── careers.js          
│   ├── details.js         
│   └── sidebar.js         
├── data/
│   └── careers.json        # Local career database 
│
├── server.py               # Flask backend API server
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (API key) - NOT in Git
├── .gitignore              # Git ignore rules
└── README.md              

Local Setup
Prerequisites

Python 3.8 or higher
pip (Python package manager)
Git
Modern web browser (Chrome, Firefox, Safari, Edge)

Step-by-Step Instructions

1. Clone the Repository
bash
git clone https://github.com/erin-leyian/career-guide-web_app.git
cd career-guide-web_app

2. Create Virtual Environment
bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install Dependencies
bash
pip install -r requirements.txt
Dependencies installed:

Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0

4. Configure Environment Variables
Create a .env file in the root directory:

bash
nano .env
Add your RapidAPI key:

RAPID_API_KEY=your_rapidapi_key_here
How to get API key:

Go to https://rapidapi.com and create a free account
Search for "JSearch API" or visit: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
Click "Subscribe to Test" → Choose the FREE plan (1000 requests/month)
Copy your API key from the "X-RapidAPI-Key" field in the code snippet
Paste it in your .env file
Important: The API key in the assignment submission comments is for grading purposes. For your own deployment, get your own free key from RapidAPI.

5. Run Flask Backend
bash
python server.py
Backend starts at: http://localhost:5000

You should see:

 * Running on http://0.0.0.0:5000
 * Debug mode: on

6. Run Frontend
Option 1: Python HTTP Server

bash
# Open new terminal
python -m http.server 8000
Visit: http://localhost:8000

Option 2: VS Code Live Server

Install "Live Server" extension
Right-click index.html → "Open with Live Server"

7. Test the Application
Homepage should load with career categories
Search for "Software Engineer"
Check if live jobs appear on career.html
Open browser console (F12) to verify no errors

 Deployment Architecture
                    ┌─────────────────────┐
                    │   Load Balancer     │
                    │   erinn.tech        │
                    │  184.72.117.196     │
                    │      HAProxy        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
         ┌──────▼───────┐            ┌───────▼──────┐
         │    Web01     │            │    Web02     │
         │ 10.227.5.183 │            │10.227.121.222│
         │    Nginx     │            │    Nginx     │
         │  Gunicorn    │            │  Gunicorn    │
         │    Flask     │            │    Flask     │
         └──────────────┘            └──────────────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                        ┌──────▼──────┐
                        │ JSearch API │
                        │  (RapidAPI) │
                        └─────────────┘
Traffic Flow:

User accesses http://erinn.tech via browser
DNS resolves to Load Balancer IP (184.72.117.196)
HAProxy receives request and distributes to Web01 or Web02 (round-robin)
Nginx on web server handles request:
Static files (HTML/CSS/JS) served directly from disk
/api/ requests proxied to Gunicorn via Unix socket
Gunicorn runs Flask application
Flask makes authenticated request to JSearch API
Response flows back through the stack to user's browser
Benefits:

High availability (if one server fails, the other continues)
Load distribution (balanced traffic for better performance)
Scalability (easy to add more servers)
Professional custom domain
🚀 Deployment Instructions
Part 1: Deploy to Web Servers (Web01 & Web02)
Note: Repeat these steps on BOTH Web01 and Web02

1. Connect to Server
bash
ssh ubuntu@<server-ip>
2. Install Required Software
bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv nginx git -y
3. Clone Repository
Choose deployment location:

Web01: /var/www/career-guide-web_app/

bash
cd /var/www/
sudo git clone https://github.com/erin-leyian/career-guide-web_app.git
cd career-guide-web_app
Web02: /home/ubuntu/career-guide-web_app/

bash
cd /home/ubuntu/
git clone https://github.com/erin-leyian/career-guide-web_app.git
cd career-guide-web_app
4. Setup Python Virtual Environment
bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
5. Configure Environment Variables
bash
nano .env
Add:

RAPID_API_KEY=your_rapidapi_key_here
Save (Ctrl+X, Y, Enter)

bash
chmod 600 .env
6. Create Systemd Service
Web01:

bash
sudo nano /etc/systemd/system/careerguide.service
ini
[Unit]
Description=CareerGuide Flask App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/career-guide-web_app
Environment="PATH=/var/www/career-guide-web_app/venv/bin"
ExecStart=/var/www/career-guide-web_app/venv/bin/gunicorn --workers 3 --bind unix:/var/www/career-guide-web_app/careerguide.sock server:app
Restart=always

[Install]
WantedBy=multi-user.target
Web02:

bash
sudo nano /etc/systemd/system/careerguide.service
ini
[Unit]
Description=CareerGuide Flask App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/career-guide-web_app
Environment="PATH=/home/ubuntu/career-guide-web_app/venv/bin"
ExecStart=/home/ubuntu/career-guide-web_app/venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/career-guide-web_app/careerguide.sock server:app
Restart=always

[Install]
WantedBy=multi-user.target
7. Start Flask Service
bash
sudo systemctl daemon-reload
sudo systemctl start careerguide
sudo systemctl enable careerguide
sudo systemctl status careerguide
Should show: Active: active (running)

8. Configure Nginx
Web01:

bash
sudo nano /etc/nginx/sites-available/careerguide
nginx
server {
    listen 80;
    server_name _;
    
    add_header X-Served-By $hostname;
    
    root /var/www/career-guide-web_app;
    index index.html;
    
    error_page 404 /404.html;
    location = /404.html {
        root /var/www/html;
    }
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/career-guide-web_app/careerguide.sock;
    }
    
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|json)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
Web02:

bash
sudo nano /etc/nginx/sites-available/careerguide
nginx
server {
    listen 80;
    server_name _;
    
    add_header X-Served-By $hostname;
    
    root /home/ubuntu/career-guide-web_app;
    index index.html;
    
    error_page 404 /404.html;
    location = /404.html {
        root /var/www/html;
    }
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/career-guide-web_app/careerguide.sock;
    }
    
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|json)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
9. Enable Nginx Site
bash
sudo ln -s /etc/nginx/sites-available/careerguide /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
10. Set Permissions
Web01:

bash
sudo chown -R ubuntu:www-data /var/www/career-guide-web_app
sudo chmod -R 755 /var/www/career-guide-web_app
Web02:

bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/career-guide-web_app
sudo chmod -R 755 /home/ubuntu/career-guide-web_app
11. Test Web Server
bash
curl http://localhost/
curl "http://localhost/api/jobs?q=engineer"
Both should return valid responses.

Part 2: Configure Load Balancer (Lb01)
1. Connect to Load Balancer
bash
ssh ubuntu@184.72.117.196
2. Install HAProxy
bash
sudo apt update
sudo apt install haproxy -y
3. Configure HAProxy
bash
sudo nano /etc/haproxy/haproxy.cfg
Add/replace backend configuration:

haproxy
frontend www-http
    bind *:80
    mode http
    default_backend webservers

backend webservers
    mode http
    balance roundrobin
    option httpchk GET /
    http-check expect status 200
    server web01 10.227.5.183:80 check
    server web02 10.227.121.222:80 check
Replace private IPs with your actual server IPs!

4. Enable and Restart HAProxy
bash
sudo systemctl enable haproxy
sudo systemctl restart haproxy
sudo systemctl status haproxy
Should show: Active: active (running)

5. Test Load Balancer
bash
curl http://184.72.117.196/
curl "http://184.72.117.196/api/jobs?q=software"

Domain Configuration
DNS Setup
This application is deployed on a custom domain: erinn.tech

DNS Records:

Type: A
Host: @
Value: 184.72.117.196 (Load Balancer Public IP)
TTL: 3600

Type: A
Host: www
Value: 184.72.117.196
TTL: 3600
Live URLs:

Production: http://erinn.tech
Alternative: http://www.erinn.tech
API Endpoint: http://erinn.tech/api/jobs?q=software
Direct IP: http://184.72.117.196
How Domain Works
DNS Resolution: User enters erinn.tech → DNS resolves to 184.72.117.196
Load Balancer: HAProxy receives request on port 80
Distribution: Request proxied to Web01 or Web02 (round-robin with health checks)
Web Servers: Nginx serves static files or proxies API to Flask
Response: Flows back through load balancer to user

🧪 Testing
Local Testing
Backend API Test:
bash
   curl "http://localhost:5000/api/jobs?q=engineer"
Frontend Test:
Open http://localhost:8000
Search for "Software Engineer"
Verify jobs appear
Production Testing

Test Individual Servers
bash
# Web01
curl http://10.227.5.183/
curl "http://10.227.5.183/api/jobs?q=developer"

# Web02
curl http://10.227.121.222/
curl "http://10.227.121.222/api/jobs?q=developer"
Test Load Balancer
bash
curl http://184.72.117.196/
curl "http://184.72.117.196/api/jobs?q=developer"

# Via domain
curl http://erinn.tech/
curl "http://erinn.tech/api/jobs?q=developer"
Verify Load Distribution
bash
# On Lb01, monitor logs
sudo tail -f /var/log/haproxy.log
Refresh browser multiple times at http://erinn.tech/ and verify requests alternate between Web01 and Web02.

Test All Features
 Homepage loads
 Search redirects to career page
 Category filtering works
 Career details display
 Live jobs load from API
 Apply buttons work
 Dark mode toggles
 All pages accessible via domain

 Challenges & Solutions

Challenge 1: API Key Security
Problem: Initial implementation exposed API key in frontend JavaScript, creating a major security vulnerability where anyone could view source code and steal the key.

Solution:

Created Flask backend to proxy all API requests
Stored API key in .env file on server-side only
Configured CORS to allow secure frontend-backend communication
Added .gitignore to prevent accidental key exposure in version control
Updated frontend to use relative URLs (/api/jobs) instead of absolute URLs
Impact: API key now completely hidden from users, preventing abuse and ensuring continued service.

Challenge 2: Load Balancing with HAProxy
Problem: Initial Nginx load balancer configuration wasn't distributing traffic evenly between Web01 and Web02. Some requests would consistently go to one server, defeating the purpose of load balancing.

Solution:

Switched from Nginx to HAProxy for superior load balancing capabilities
Configured proper upstream backend servers with correct private IPs (not public IPs)
Added health checks with option httpchk to ensure servers were accessible
Implemented round-robin distribution algorithm
Tested each web server individually before configuring load balancer
Verified distribution by monitoring HAProxy logs
Impact: Even traffic distribution, improved reliability, and better performance under load.


📚 API Documentation & Credits
JSearch API (Primary Data Source)
Provider: letscrape via RapidAPI
Purpose: Real-time job listings and career market data
Documentation: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
Endpoint Used: /search
Rate Limit: 1000 requests/month (free tier)
Authentication: X-RapidAPI-Key header

Technologies & Frameworks
Flask - Python web framework (https://flask.palletsprojects.com/)
Gunicorn - WSGI HTTP server (https://gunicorn.org/)
HAProxy - High-performance load balancer (http://www.haproxy.org/)
Nginx - Web server and reverse proxy (https://nginx.org/)
RapidAPI - API marketplace (https://rapidapi.com/)
Resources Used
RapidAPI documentation for API integration best practices
Flask documentation for backend implementation patterns
HAProxy documentation for load balancing configuration
Nginx documentation for reverse proxy setup
MDN Web Docs for frontend JavaScript development
Ubuntu Server documentation for systemd service management

 Author
Erin Leyian

GitHub: @erin-leyian
Email: erinleyian@gmail.com

License & Usage

This project is created for educational purposes as part of an ALX/ALU software engineering assignment. The code is open source and can be used for learning purposes with proper attribution.

Future Enhancements
Potential improvements for future versions:

User authentication and personalized job recommendations
Email notifications for new job postings matching saved searches
Resume builder and application tracking system
Advanced filtering (salary range, remote/onsite, experience level, job type)
Integration with additional job APIs (LinkedIn Jobs, Indeed, Glassdoor)
AI-powered career path recommendations based on skills and interests
Salary comparison tools by location and experience level
Social features (share jobs, discuss careers)

Open an issue on GitHub: https://github.com/erin-leyian/career-guide-web_app/issues
Contact via email: e.leyian@alustudent.com

Thank you for exploring CareerGuide!



