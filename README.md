# Glint Backend

Node.js backend for playlist scraping, AI generation, and YouTube matching.

## Supports
- **Spotify** — exact track list via Spotify Web API
- **SoundCloud** — HTML scraping
- **Apple Music / YouTube / other** — AI-powered equivalent tracks via Groq

## Local Development

```bash
cd glint-backend
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
```

Server runs at http://localhost:3001

## API Keys Needed

### Spotify (for exact playlist import)
1. Go to https://developer.spotify.com/dashboard
2. Click "Create App"
3. Name: "Glint", Redirect URI: http://localhost:3001
4. Copy Client ID and Client Secret → paste in .env

### YouTube (for matching tracks)
1. Go to https://console.cloud.google.com
2. Enable YouTube Data API v3
3. Create API Key → paste in .env

### Groq (for AI generation)
1. Go to https://console.groq.com/keys
2. Create API Key → paste in .env

## Connect Frontend to Backend

In your frontend `.env` file add:
```
VITE_BACKEND_URL=http://localhost:3001
```

For production (your Oracle VPS):
```
VITE_BACKEND_URL=https://your-vps-ip:3001
```

## Deploy on Oracle Cloud VPS

```bash
# 1. SSH into your VPS
ssh ubuntu@your-vps-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone/upload your backend files
# (use scp, git, or FileZilla to upload the glint-backend folder)

# 5. Install dependencies
cd glint-backend
npm install --production

# 6. Create .env with your real keys
cp .env.example .env
nano .env   # fill in your keys, set FRONTEND_URL to your domain

# 7. Start with PM2
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # run the command it outputs to auto-start on reboot

# 8. Open firewall port (Oracle Cloud)
sudo iptables -I INPUT -p tcp --dport 3001 -j ACCEPT
# Also open port 3001 in Oracle Cloud console → VCN → Security Lists

# 9. Check it's running
pm2 status
curl http://localhost:3001/health
```

## Nginx Reverse Proxy (optional but recommended)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /api/import | Import playlist from URL |
| POST | /api/generate | Generate AI playlist from prompt |
| GET | /api/search?q= | Search YouTube |

### POST /api/import
```json
{ "url": "https://open.spotify.com/playlist/..." }
```
Returns:
```json
{
  "name": "Playlist Name",
  "cover": "https://...",
  "platform": "Spotify",
  "tracks": [{ "id": "ytId", "title": "...", "artist": "...", "youtubeId": "...", ... }],
  "total": 25,
  "matched": 23
}
```

### POST /api/generate
```json
{ "prompt": "late night lofi for studying" }
```
