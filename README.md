Atriva Web 🌐

The official website for Atriva, showcasing how we make Edge AI simple.
Built with Astro
, styled with TailwindCSS, and optimized for containerized deployment.

🚀 Overview

Building Edge AI apps is complex — it requires expertise across hardware, frameworks, and optimization.
Atriva simplifies this by providing ready-to-use, hardware-tuned containers so developers can focus on solutions, not infrastructure.

This website introduces Atriva, highlights features, and provides ways to connect.

🛠️ Tech Stack

Astro
 – Static site framework

TailwindCSS
 – Styling

Web3Forms
 – Contact form handling

Docker / Nginx – Deployment ready

📦 Getting Started
1. Clone the repo
git clone https://github.com/<your-org>/atriva-web.git
cd atriva-web

2. Install dependencies
npm install

3. Run locally
npm run dev


Site will be available at: http://localhost:4321

4. Build for production
npm run build
npm run preview

🐳 Deployment with Docker

Build and run with Docker:

# Build image
docker build -t atriva-web .

# Run container
docker run -d -p 8080:80 atriva-web


Your site will be live at: http://localhost:8080

✉️ Contact Form Setup

We use Web3Forms
 to handle form submissions.

Create a free access key on Web3Forms.

Replace YOUR_ACCESS_KEY_HERE in components/contact.astro.

Submissions will be delivered directly to your email inbox.

🤝 Contributing

We welcome contributions!

Open an issue for bug reports or feature requests.

Submit a PR for improvements.

Development guidelines

Follow Astro’s component conventions.

Use Tailwind for styling.

Keep sections modular (in components/).

📌 Release History

v1.0.0 – First public release of Atriva website 🎉

© Atriva. All rights reserved.