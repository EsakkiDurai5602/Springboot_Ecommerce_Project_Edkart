# AWS EC2 Production Deployment Guide

This guide details the step-by-step procedure to deploy the containerized **EdKart** application to an Amazon Web Services (AWS) EC2 virtual machine behind an Nginx Reverse Proxy with SSL (HTTPS) managed by Let's Encrypt.

---

## 1. AWS Infrastructure Setup

### Step 1: Launch EC2 Instance
- **OS (AMI):** Ubuntu Server 22.04 LTS or 24.04 LTS (64-bit x86).
- **Instance Type:** `t3.medium` (Recommended minimum: 2 vCPUs, 4GB RAM to support Java compile/runtime and MySQL processes. For low budgets, `t3.small` with swap space enabled can suffice).
- **Storage:** 20GB+ gp3 SSD.

### Step 2: Configure Security Groups
Add inbound firewall rules to control traffic accessing your instance:
| Rule Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| SSH | TCP | 22 | My IP | Secure Remote Admin Terminal Access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic (Redirected to HTTPS) |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure SSL Web traffic |
| Custom | TCP | 8081 | My IP | Secure access to phpMyAdmin (optional) |

### Step 3: Elastic IP Allocation
1. Navigate to AWS Console -> EC2 Dashboard -> **Elastic IPs**.
2. Click **Allocate Elastic IP address**, then select it and choose **Associate Elastic IP address**.
3. Link the Elastic IP to your newly created EC2 instance. This guarantees your public IP address remains static across restarts.

### Step 4: DNS Configuration (Domain Binding)
Login to your DNS provider (e.g., Route53, GoDaddy, Cloudflare) and create the following records pointing to your Elastic IP:
- **`A Record`** -> `yourdomain.com` -> `54.x.y.z` (Your Elastic IP)
- **`CNAME Record`** -> `www` -> `yourdomain.com`

---

## 2. Server Installation (Docker & Nginx)

SSH into your Ubuntu server using your PEM private key:
```bash
ssh -i /path/to/key.pem ubuntu@your-elastic-ip
```

### Install Docker and Docker Compose
Run the following script to install the newest Docker engine:
```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker --version
sudo docker compose version

# Add ubuntu user to docker group to run commands without sudo (requires terminal restart)
sudo usermod -aG docker ubuntu
```

### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 3. Deploying EdKart Configurations

### Step 1: Create Deployment Directory
```bash
mkdir -p ~/edkart/uploads
cd ~/edkart
```

### Step 2: Copy Deployment Files
Transfer your `docker-compose.yml`, `Dockerfile`, `nginx.conf`, and `.env` files from your local machine to the server using `scp` (or clone them via Git):
```bash
# Local command example:
scp -i key.pem docker-compose.yml Dockerfile nginx.conf .env ubuntu@your-elastic-ip:~/edkart/
```

### Step 3: Verify `.env` File on Server
Ensure the database host resolves to the database container name (`db`), database credentials are secure, and profiles are active:
```ini
SPRING_PROFILES_ACTIVE=prod
DB_HOST=db
DB_NAME=edkart
DB_USERNAME=root
DB_PASSWORD=YourStrongAppPassword123!
```

---

## 4. Configuring Nginx & SSL

To protect data in transit, we will set up Let's Encrypt certificates and configure Nginx as a reverse proxy.

### Step 1: Temporarily Stop Nginx for Initial SSL Setup
To request certificates, Certbot will temporarily listen on port 80:
```bash
sudo systemctl stop nginx
```

### Step 2: Install Certbot & Request Certificates
```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL Certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```
*Note: Make sure to replace `yourdomain.com` with your real registered domain.*

### Step 3: Link Nginx Configuration
Copy the custom `nginx.conf` to the Nginx configuration directory:
```bash
# Backup default nginx conf
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Copy your production nginx configuration
sudo cp ~/edkart/nginx.conf /etc/nginx/nginx.conf

# Check configuration syntax
sudo nginx -t
```

### Step 4: Start and Enable Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 5. Starting Container Stack

Go to your deployment directory and spin up the containers:
```bash
cd ~/edkart
docker compose up -d --build
```
This downloads MySQL, compiles the Java JAR from the source code, starts the Spring Boot process, and binds them to the Docker bridge network. Nginx will route all incoming requests on port 80/443 to the backend port 8080.

---

## 6. Post-Deployment & Maintenance

### Automatic SSL Renewal Cron Job
Let's Encrypt certificates are valid for 90 days. We schedule a systemd timer or cron job to check and renew them twice daily:
```bash
# Edit crontab
sudo crontab -e
```
Add the following line to the bottom to renew certificates and reload Nginx:
```text
0 0,12 * * * certbot renew --post-hook "systemctl reload nginx"
```

### Server Firewall (UFW) Configuration
For security, restrict direct external access to your database container from the internet. Enable Ubuntu's local firewall:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Redirect Container Logs to System Journal (AWS CloudWatch Support)
To integrate container logs with AWS CloudWatch agent, configure Docker to log using the `journald` driver:
Create `/etc/docker/daemon.json`:
```json
{
  "log-driver": "journald",
  "log-opts": {
    "tag": "{{.Name}}/{{.ID}}"
  }
}
```
Restart Docker service:
```bash
sudo systemctl restart docker
```
The CloudWatch agent can now be installed and set up to read from the system log journal.
```bash
# View container logs through journald
journalctl -u docker.service --no-pager | grep edkart-app
```
