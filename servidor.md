# SDA 问卷系统 - Ubuntu 服务器部署指南
 
> 项目路径：`/home/rootadmin/portal-suite`
>
> 技术栈：React 19 + Vite 7（纯前端 SPA 应用，无后端/数据库依赖）
>
> 构建产物：静态文件（`dist/` 目录）
 
---
 
## 目录
 
- [前置条件](#前置条件)
- [方案一：Systemd 直接部署（端口访问）](#方案一systemd-直接部署端口访问)
- [方案二：Systemd + Nginx 反向代理](#方案二systemd--nginx-反向代理)
- [方案三：Docker + Nginx 代理](#方案三docker--nginx-代理)
- [常见问题排查](#常见问题排查)
 
---
 
## 前置条件
 
### 安装 Node.js 18+
 
```bash
# 使用 NodeSource 安装 Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
 
# 验证安装
node -v   # 应输出 v18.x.x
npm -v    # 应输出 9.x.x 或更高
```
 
### 构建项目
 
```bash
cd /home/rootadmin/portal-suite/questionnaire-app
npm ci
npm run build
```
 
构建完成后，静态文件位于 `/home/rootadmin/portal-suite/questionnaire-app/dist/` 目录。
 
---
 
## 方案一：Systemd 直接部署（端口访问）
 
> 适用场景：快速部署、内部测试，通过 `http://服务器IP:4173` 直接访问。
 
### 第一步：创建 systemd 服务文件
 
```bash
sudo nano /etc/systemd/system/portal-suite.service
```
 
写入以下内容：
 
```ini
[Unit]
Description=SDA Portal Suite - Questionnaire App
After=network.target
 
[Service]
Type=simple
User=rootadmin
Group=rootadmin
WorkingDirectory=/home/rootadmin/portal-suite/questionnaire-app
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port 4173
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=portal-suite
Environment=NODE_ENV=production
 
[Install]
WantedBy=multi-user.target
```
 
> **说明：** `npm run preview` 使用 Vite 内置的预览服务器来托管 `dist/` 中的静态文件。`--host 0.0.0.0` 允许外部访问。
 
### 第二步：启动服务
 
```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload
 
# 启动服务
sudo systemctl start portal-suite
 
# 设置开机自启
sudo systemctl enable portal-suite
 
# 查看服务状态
sudo systemctl status portal-suite
```
 
### 第三步：配置防火墙
 
```bash
# 如果使用 ufw
sudo ufw allow 4173/tcp
sudo ufw reload
 
# 如果使用 iptables
sudo iptables -A INPUT -p tcp --dport 4173 -j ACCEPT
```
 
### 第四步：验证访问
 
在浏览器中访问：
 
```
http://你的服务器IP:4173
```
 
### 常用管理命令
 
```bash
sudo systemctl start portal-suite     # 启动
sudo systemctl stop portal-suite      # 停止
sudo systemctl restart portal-suite   # 重启
sudo systemctl status portal-suite    # 查看状态
journalctl -u portal-suite -f         # 实时查看日志
```
 
---
 
## 方案二：Systemd + Nginx 反向代理
 
> 适用场景：生产环境部署，支持域名访问、SSL 证书、标准 80/443 端口。
 
### 第一步：安装 Nginx
 
```bash
sudo apt update
sudo apt install -y nginx
```
 
### 第二步：创建 systemd 服务文件
 
与方案一相同，创建 `/etc/systemd/system/portal-suite.service`：
 
```bash
sudo nano /etc/systemd/system/portal-suite.service
```
 
写入以下内容：
 
```ini
[Unit]
Description=SDA Portal Suite - Questionnaire App
After=network.target
 
[Service]
Type=simple
User=rootadmin
Group=rootadmin
WorkingDirectory=/home/rootadmin/portal-suite/questionnaire-app
ExecStart=/usr/bin/npm run preview -- --host 127.0.0.1 --port 4173
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=portal-suite
Environment=NODE_ENV=production
 
[Install]
WantedBy=multi-user.target
```
 
> **注意：** 这里 `--host 127.0.0.1` 只监听本地，外部流量通过 Nginx 代理进入。
 
### 第三步：启动应用服务
 
```bash
sudo systemctl daemon-reload
sudo systemctl start portal-suite
sudo systemctl enable portal-suite
```
 
### 第四步：配置 Nginx 反向代理
 
```bash
sudo nano /etc/nginx/sites-available/portal-suite
```
 
写入以下内容：
 
```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # 替换为你的域名或服务器IP
 
    # 日志
    access_log /var/log/nginx/portal-suite-access.log;
    error_log  /var/log/nginx/portal-suite-error.log;
 
    location / {
        proxy_pass http://127.0.0.1:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
 
### 第五步：启用站点配置
 
```bash
# 创建软链接到 sites-enabled
sudo ln -s /etc/nginx/sites-available/portal-suite /etc/nginx/sites-enabled/
 
# 删除默认站点（可选）
sudo rm /etc/nginx/sites-enabled/default
 
# 测试 Nginx 配置是否正确
sudo nginx -t
 
# 重启 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```
 
### 第六步：配置防火墙
 
```bash
sudo ufw allow 'Nginx Full'
sudo ufw reload
```
 
### 第七步：验证访问
 
```
http://tu-dominio.com
```
 
### （可选）配置 SSL 证书（HTTPS）
 
使用 Let's Encrypt 免费证书：
 
```bash
# 安装 certbot
sudo apt install -y certbot python3-certbot-nginx
 
# 申请并自动配置证书（替换为你的域名）
sudo certbot --nginx -d tu-dominio.com
 
# 证书会自动续期，可以手动测试续期
sudo certbot renew --dry-run
```
 
完成后即可通过 `https://tu-dominio.com` 访问。
 
### Nginx 方案替代方式：直接托管静态文件
 
因为本项目构建产物是纯静态文件，也可以不使用 Vite preview 服务器，而是让 Nginx 直接托管 `dist/` 目录：
 
```bash
sudo nano /etc/nginx/sites-available/portal-suite
```
 
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
 
    root /home/rootadmin/portal-suite/questionnaire-app/dist;
    index index.html;
 
    access_log /var/log/nginx/portal-suite-access.log;
    error_log  /var/log/nginx/portal-suite-error.log;
 
    location / {
        try_files $uri $uri/ /index.html;
    }
 
    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
 
> **优势：** 无需 Node.js 进程常驻运行，Nginx 直接托管静态文件性能更好，资源占用更少。
>
> **注意：** 使用此方式时不需要创建 systemd 服务文件，也不需要运行 `npm run preview`。
>
> 确保 Nginx 用户对 `dist/` 目录有读取权限：
 
```bash
sudo chmod -R 755 /home/rootadmin/portal-suite/questionnaire-app/dist
sudo chmod 755 /home/rootadmin /home/rootadmin/portal-suite /home/rootadmin/portal-suite/questionnaire-app
```
 
---
 
## 方案三：Docker + Nginx 代理
 
> 适用场景：容器化部署，便于迁移、扩展和版本管理。
 
### 第一步：安装 Docker 和 Docker Compose
 
```bash
# 安装依赖
sudo apt update
sudo apt install -y ca-certificates curl gnupg
 
# 添加 Docker GPG 密钥
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
 
# 添加 Docker 软件源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
 
# 安装 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
 
# 将当前用户加入 docker 组（免 sudo 运行）
sudo usermod -aG docker rootadmin
 
# 验证安装
docker --version
docker compose version
```
 
> **注意：** 添加用户到 docker 组后，需要重新登录终端才能生效。
 
### 第二步：创建 Dockerfile
 
```bash
nano /home/rootadmin/portal-suite/Dockerfile
```
 
写入以下内容：
 
```dockerfile
# ============ 阶段一：构建 ============
FROM node:18-alpine AS build
 
WORKDIR /app
 
# 先复制依赖文件，利用 Docker 缓存层
COPY questionnaire-app/package.json questionnaire-app/package-lock.json ./
 
# 安装依赖
RUN npm ci
 
# 复制源代码并构建
COPY questionnaire-app/ .
RUN npm run build
 
# ============ 阶段二：运行 ============
FROM nginx:alpine
 
# 复制构建产物到 Nginx 默认目录
COPY --from=build /app/dist /usr/share/nginx/html
 
# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
```
 
### 第三步：创建容器内 Nginx 配置文件
 
```bash
nano /home/rootadmin/portal-suite/nginx.conf
```
 
写入以下内容：
 
```nginx
server {
    listen 80;
    server_name localhost;
 
    root /usr/share/nginx/html;
    index index.html;
 
    # SPA 路由支持 - 所有路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
 
    # 静态资源长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
 
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
 
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 256;
}
```
 
### 第四步：创建 Docker Compose 文件
 
```bash
nano /home/rootadmin/portal-suite/docker-compose.yml
```
 
写入以下内容：
 
```yaml
services:
  portal-suite:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: portal-suite
    restart: unless-stopped
    ports:
      - "8080:80"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```
 
> **说明：** 容器内部运行在 80 端口，映射到宿主机 8080 端口。
 
### 第五步：构建并启动容器
 
```bash
cd /home/rootadmin/portal-suite
 
# 构建镜像并启动
docker compose up -d --build
 
# 查看运行状态
docker compose ps
 
# 查看日志
docker compose logs -f portal-suite
```
 
### 第六步：验证容器运行
 
```bash
# 检查容器状态
docker ps
 
# 测试访问
curl http://localhost:8080
```
 
在浏览器访问：`http://你的服务器IP:8080`
 
### 第七步：（推荐）配置宿主机 Nginx 反向代理
 
如果希望通过域名和标准 80/443 端口访问，在宿主机上安装 Nginx 并配置反向代理：
 
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/portal-suite
```
 
写入以下内容：
 
```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # 替换为你的域名
 
    access_log /var/log/nginx/portal-suite-access.log;
    error_log  /var/log/nginx/portal-suite-error.log;
 
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
 
```bash
sudo ln -s /etc/nginx/sites-available/portal-suite /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```
 
### 第八步：（可选）配置 SSL
 
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```
 
### Docker 常用管理命令
 
```bash
# 启动
docker compose up -d
 
# 停止
docker compose down
 
# 重新构建并启动（代码更新后使用）
docker compose up -d --build
 
# 查看日志
docker compose logs -f
 
# 进入容器排查问题
docker exec -it portal-suite sh
 
# 查看资源使用
docker stats portal-suite
```
 
---
 
## 常见问题排查
 
### 1. 端口被占用
 
```bash
# 查看端口占用情况
sudo lsof -i :4173
sudo lsof -i :8080
 
# 或者使用 ss 命令
sudo ss -tlnp | grep 4173
```
 
### 2. 服务启动失败
 
```bash
# 查看 systemd 日志
journalctl -u portal-suite -n 50 --no-pager
 
# 查看 Docker 日志
docker compose logs --tail 50
```
 
### 3. Nginx 配置错误
 
```bash
# 测试配置文件语法
sudo nginx -t
 
# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/portal-suite-error.log
```
 
### 4. 权限问题
 
```bash
# 确保项目目录归属正确
sudo chown -R rootadmin:rootadmin /home/rootadmin/portal-suite
 
# 如果 Nginx 直接托管静态文件，确保有读取权限
sudo chmod -R 755 /home/rootadmin/portal-suite/questionnaire-app/dist
```
 
### 5. 代码更新后重新部署
 
```bash
cd /home/rootadmin/portal-suite
 
# 拉取最新代码
git pull
 
# 方案一/二：重新构建并重启服务
cd questionnaire-app && npm ci && npm run build && cd ..
sudo systemctl restart portal-suite
 
# 方案三（Docker）：重新构建镜像
docker compose up -d --build
```
 
---
 
## 三种方案对比
 
| 特性 | 方案一：Systemd | 方案二：Systemd + Nginx | 方案三：Docker + Nginx |
|------|----------------|------------------------|----------------------|
| 部署难度 | 简单 | 中等 | 中等 |
| 需要 Node.js | 是 | 是（或可选否） | 否（容器内含） |
| 标准端口（80/443）| 否 | 是 | 是 |
| SSL/HTTPS | 不方便 | 方便 | 方便 |
| 域名访问 | 不方便 | 方便 | 方便 |
| 环境隔离 | 无 | 无 | 完全隔离 |
| 迁移便捷 | 一般 | 一般 | 方便 |
| 资源占用 | 低 | 低 | 稍高 |
| 推荐场景 | 内部测试 | 生产环境 | 生产环境/多服务 |