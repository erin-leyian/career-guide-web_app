# career-guide-web_app

CAREERGUIDE - A career path Discovery Platform 

Career Guide is a web app that helps its users explore career paths, understand job requirements and also discover live job opportunities using real time data from JSearch API.

PURPOSE

CareerGuide focuses on a common problem of career uncertainty by providing:
 * Curated nice career information for new, modern and emerging roles
 * Real-time job listings from the JSearch API.
 * The skill requirements and salary ranges for the careers
 * Category-based exploration for the niche careers.

 FEATURES

  -> Career Search - Search for 20+ curated niche careers
  -> Live job Data - Real time job listings via JSearch API
  -> Category filtering - Browse careers by tech, business, health, creative,engineering and education.
  -> Salary information
  ->Skills breakdowns.

USER INTERACTION

User Interaction

-> Sort & Filter: Category-based filtering of careers
-> Search: Real-time search across career database
-> Dynamic Content: Live job postings fetched from JSearch API
-> Responsive Design: Works on desktop and mobile

TECHNICAL FEATURES

- Dark Mode 
- Error Handling
- Load Balanced

TECHNOLOGIES USED
Frontend

-> HTML,CSS,Javascript
-> Responsive design with css grid
 
Backend

-> Python Flask - API 
-> Gunicorn
-> Requests - HTTP library for API calls

APIs

JSearch API (RapidAPI) - Live job listings and career data
 ->Documentation: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

INFRASTRUCTURE

-Nginx - Web server and reverse proxy
-Load Balancer - Distributes traffic between Web01 and Web02
Systemd - service management

PROJECT STRUCTURE

career-guide-web_app/
│
├── index.html              # Homepage
├── careers.html            # All careers listing
├── career.html             # Individual career details + live jobs
├── about.html              # About page
├── contact.html            # Contact page
│
├── css/
│   └── style.css           # All styles
│
├── js/
│   ├── script.js           # Homepage logic
│   ├── careers.js          # Careers page logic
│   ├── details.js          # Career details + API integration
│   └── sidebar.js          # Theme toggle & navigation
│
├── data/
│   └── careers.json        # Local career database (20 careers)
│
├── server.py               # Flask backend
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (API key)
├── .gitignore              # Git ignore rules
└── README.md               # This file

SETUP INSTRUCTIONS

HOW TO RUN THE APP LOCALLY

1. Clone the repository

git clone https://github.com/erin-leyian/career-guide-web_app.git
cd career-guide-web_app

2. Create and activate Virtual environment

python3 -m venv venv
source venv/bin/activate  (On Windows : venv\Scripts\activate)

3. Install Dependencies

pip install -r requirements.txt

4. Create a .env file
- Create a .env file in the root directory

  RAPID_API_KEY=your_rapidapi_key_here

5. Run the Backend(Flask)

python server.py

The server will start on http://localhost:5000

6. Open the application

(OPTION 1 : Simple HTTP Server)

python -m http.server 8000

then visit : http://localhost:8000

(OPTION 2)
Just Open index.html in your browser


DEPLOYMENT INSTRUCTIONS

Your application must run on Web01, Web02, and be accessible through Lb01.

1. Install Dependencies

sudo apt update
sudo apt install python3 python3-pip python3-venv nginx

2. Clone the Repository

git clone https://github.com/erin-leyian/career-guide-web_app.git
cd career-guide-web_app

3. Setup Virtual Environment

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

4. Set Environment Variable 

echo "RAPID_API_KEY=your_key_here" | sudo tee /etc/environment
source /etc/environment

5. Start Gunicorn

gunicorn --bind 127.0.0.1:5000 server:app

6. Configure Nginx

Create file:
 /etc/nginx/sites-available/career
 
 And paste:

 server {
    listen 80;

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
    }

    location / {
        root /home/ubuntu/career-guide-web_app;
        try_files $uri /index.html;
    }
}

Then enable and restart:

sudo ln -s /etc/nginx/sites-available/career /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

API now available at:

http://<server-ip>/api/jobs?q=software

7. Load Balancer Configuration


