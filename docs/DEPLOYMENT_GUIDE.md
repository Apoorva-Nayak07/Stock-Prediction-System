# Deployment Guide

This guide covers deploying the AI Stock Market Platform to various cloud providers.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Docker Deployment](#docker-deployment)
4. [Railway Deployment](#railway-deployment)
5. [Render Deployment](#render-deployment)
6. [AWS Deployment](#aws-deployment)
7. [Azure Deployment](#azure-deployment)
8. [Production Checklist](#production-checklist)

---

## Prerequisites

- Git repository with your code
- Docker installed (for local testing)
- Cloud provider account
- Domain name (optional)
- SSL certificate (optional, most providers offer free SSL)

---

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-stock
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
AI_SERVICE_URL=https://your-ai-service.com
CLIENT_URL=https://your-frontend.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_SOCKET_URL=https://your-backend.com
```

### AI Service (.env)
```env
PORT=8000
HOST=0.0.0.0
```

---

## Docker Deployment

### 1. Build Images
```bash
docker-compose build
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Check Status
```bash
docker-compose ps
docker-compose logs -f
```

### 4. Stop Services
```bash
docker-compose down
```

---

## Railway Deployment

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Initialize Project
```bash
railway init
```

### 4. Deploy Backend
```bash
cd server
railway up
```

### 5. Deploy AI Service
```bash
cd ai-service
railway up
```

### 6. Deploy Frontend
```bash
cd client
npm run build
railway up
```

### 7. Add Environment Variables
```bash
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
```

### 8. Add MongoDB
```bash
railway add mongodb
```

---

## Render Deployment

### Backend Service

1. **Create New Web Service**
   - Connect GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`

2. **Environment Variables**
   - Add all backend environment variables
   - Use Render's MongoDB add-on or external MongoDB

3. **Deploy**
   - Click "Create Web Service"

### AI Service

1. **Create New Web Service**
   - Root Directory: `ai-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`

2. **Environment Variables**
   - Add AI service environment variables

### Frontend

1. **Create Static Site**
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Environment Variables**
   - Add frontend environment variables

---

## AWS Deployment

### Using ECS (Elastic Container Service)

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name ai-stock-server
aws ecr create-repository --repository-name ai-stock-client
aws ecr create-repository --repository-name ai-stock-ai
```

2. **Build and Push Images**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build images
docker build -f docker/Dockerfile.server -t ai-stock-server .
docker build -f docker/Dockerfile.client -t ai-stock-client .
docker build -f docker/Dockerfile.ai -t ai-stock-ai .

# Tag images
docker tag ai-stock-server:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-stock-server:latest
docker tag ai-stock-client:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-stock-client:latest
docker tag ai-stock-ai:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-stock-ai:latest

# Push images
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-stock-server:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-stock-client:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-stock-ai:latest
```

3. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name ai-stock-cluster
```

4. **Create Task Definitions**
- Define tasks for each service
- Set CPU, memory, and environment variables

5. **Create Services**
```bash
aws ecs create-service --cluster ai-stock-cluster --service-name server --task-definition server-task --desired-count 2
```

6. **Set Up Load Balancer**
- Create Application Load Balancer
- Configure target groups
- Set up health checks

7. **Configure Auto Scaling**
- Set up auto-scaling policies
- Define scaling triggers

### Using MongoDB Atlas
```bash
# Create cluster at mongodb.com/cloud/atlas
# Get connection string
# Add to environment variables
```

---

## Azure Deployment

### Using Azure Container Instances

1. **Create Resource Group**
```bash
az group create --name ai-stock-rg --location eastus
```

2. **Create Container Registry**
```bash
az acr create --resource-group ai-stock-rg --name aistockregistry --sku Basic
```

3. **Build and Push Images**
```bash
az acr build --registry aistockregistry --image ai-stock-server:latest -f docker/Dockerfile.server .
az acr build --registry aistockregistry --image ai-stock-client:latest -f docker/Dockerfile.client .
az acr build --registry aistockregistry --image ai-stock-ai:latest -f docker/Dockerfile.ai .
```

4. **Create Container Instances**
```bash
az container create \
  --resource-group ai-stock-rg \
  --name ai-stock-server \
  --image aistockregistry.azurecr.io/ai-stock-server:latest \
  --dns-name-label ai-stock-server \
  --ports 5000
```

5. **Set Up Cosmos DB (MongoDB API)**
```bash
az cosmosdb create \
  --name ai-stock-db \
  --resource-group ai-stock-rg \
  --kind MongoDB
```

---

## Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up firewall rules
- [ ] Enable security headers (Helmet.js)

### Performance
- [ ] Enable compression
- [ ] Set up CDN for static assets
- [ ] Configure caching
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Enable connection pooling
- [ ] Set up load balancing
- [ ] Configure auto-scaling

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston)
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Set up performance monitoring
- [ ] Enable database monitoring

### Backup
- [ ] Set up automated database backups
- [ ] Configure backup retention policy
- [ ] Test backup restoration
- [ ] Document backup procedures

### Documentation
- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables

### Testing
- [ ] Run all tests
- [ ] Perform load testing
- [ ] Test in production-like environment
- [ ] Verify all integrations
- [ ] Test backup/restore procedures

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check connection string
- Verify network access
- Check firewall rules
- Verify credentials

**CORS Errors**
- Update CLIENT_URL in backend
- Check CORS configuration
- Verify allowed origins

**AI Service Not Responding**
- Check AI_SERVICE_URL
- Verify service is running
- Check logs for errors
- Verify network connectivity

**Build Failures**
- Check Node.js version
- Verify Python version
- Check dependencies
- Review build logs

---

## Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Review documentation
- Contact support team
- Check GitHub issues

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Azure Container Instances](https://docs.microsoft.com/azure/container-instances/)
