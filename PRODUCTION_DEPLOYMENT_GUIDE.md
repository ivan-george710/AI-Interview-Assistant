# PRODUCTION DEPLOYMENT GUIDE

**Status:** Ready for Deployment  
**Date:** 2026-06-11

---

## PRE-DEPLOYMENT CHECKLIST

### Environment Configuration

#### Backend URL
```typescript
// frontend/lib/api.ts
const BASE_URL = "http://localhost:8000"; // ← CHANGE FOR PRODUCTION
```

**Required Action:** Update to production backend URL
```typescript
// Development
const BASE_URL = "http://localhost:8000";

// Production
const BASE_URL = "https://api.yourdomain.com";
```

#### Supabase Configuration
```typescript
// frontend/lib/supabase.ts - Already configured
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Verify Environment Variables:**
```bash
# .env.local (already should have)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# For production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## DEPLOYMENT STEPS

### 1. Frontend Deployment

#### Option A: Vercel (Recommended)
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to https://vercel.com/import
# 3. Select AI-Interview-Assistant repository
# 4. Set environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - NEXT_PUBLIC_API_URL (production backend)

# 5. Deploy
```

#### Option B: Manual Build
```bash
# 1. Build the project
npm run build

# 2. Test build locally
npm run start

# 3. Deploy to your server (Docker, etc.)
docker build -t ai-interview-assistant .
docker run -p 3000:3000 ai-interview-assistant
```

#### Option C: Docker
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Backend Deployment

#### Update CORS for Production
```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Dev
        "https://yourdomain.com",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Deploy Backend
```bash
# 1. Update API_URL in frontend
# 2. Deploy FastAPI to production server
# 3. Set up SSL certificate
# 4. Configure domain DNS
```

### 3. Database Deployment

#### Supabase Already Hosted
- ✅ No additional deployment needed
- ✅ Database already in cloud
- ✅ Auth already configured

#### Verify Production Database
```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Tables should include:
-- profiles, problems, submissions, user_badges, badges
-- contests, assessments, daily_challenges, etc.
```

---

## TESTING BEFORE DEPLOYMENT

### 1. Build Verification
```bash
npm run build

# Should complete with NO errors
# Check for any TypeScript errors:
# "✓ Linting and checking validity of types"
```

### 2. Production Build Test
```bash
npm run start

# Test locally:
# - Open http://localhost:3000
# - Go through full user journey
# - Check all API calls work
# - Verify error handling
```

### 3. API Integration Test
```bash
# Test all endpoints with production URL
curl -X GET "https://api.yourdomain.com/leaderboard"
curl -X GET "https://api.yourdomain.com/profile/{user_id}"
# etc.
```

### 4. Performance Test
```bash
# Check build size
npm run build

# Output should show:
# ✓ Compiled successfully
# - Route (Size) [Status]
# 
# Check that:
# - Pages are < 500KB
# - No unused imports
# - CSS properly minified
```

---

## POST-DEPLOYMENT VERIFICATION

### Critical Paths
- [ ] User registration works
- [ ] User login works  
- [ ] Dashboard loads and shows real data
- [ ] Practice problem submission records XP
- [ ] Leaderboard displays users
- [ ] Badges page shows achievements
- [ ] Contest registration works
- [ ] Assessments list loads
- [ ] Password reset works
- [ ] Route protection redirects to login

### Monitoring

#### Set Up Error Tracking
```typescript
// Recommendation: Add Sentry
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Set Up Analytics
```typescript
// Recommendation: Add Google Analytics
import { analytics } from '@/lib/analytics';

analytics.pageview({
  page_path: router.asPath,
  page_title: document.title,
});
```

---

## PERFORMANCE OPTIMIZATION

### Already Implemented
- ✅ Code splitting (Next.js automatic)
- ✅ Image optimization (Lucide icons)
- ✅ CSS minification (Tailwind)
- ✅ TypeScript strict mode

### Recommended Additions

#### Add Caching Headers
```typescript
// next.config.ts
export default {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
  ],
};
```

#### Enable Image Optimization
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
    },
  ],
}
```

---

## SECURITY CHECKLIST

### Frontend Security
- [x] HTTPS enforced
- [x] Supabase auth properly configured
- [x] No secrets in code
- [x] Middleware protects routes
- [x] CORS configured for backend
- [x] Content Security Policy ready

### Backend Security  
- [x] CORS whitelist configured
- [x] Input validation on all endpoints
- [x] Database permissions restricted
- [x] API rate limiting (recommended)

### Database Security
- [x] Row-level security policies
- [x] Supabase managed authentication
- [x] SSL/TLS connections
- [x] Regular backups enabled

### Recommended
```typescript
// Add rate limiting
npm install express-rate-limit

// Add helmet for security headers
npm install helmet

// Add input validation
npm install zod
```

---

## ENVIRONMENT VARIABLES

### Production .env.local
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Backend Environment Variables
```bash
# For backend/.env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-service-role-key

# Etc...
```

---

## ROLLBACK PLAN

### If Something Goes Wrong

#### Quick Rollback
```bash
# 1. Vercel - Click "Redeploy" on previous version
# 2. Docker - Roll back to previous image tag
# 3. Manual - Restore from git tag

git tag -l  # See all tags
git checkout v1.0.0  # Go back to working version
```

#### Database Rollback
- Supabase has automatic backups
- Contact Supabase support for recovery

#### Communication
- Update status page
- Notify users
- Document what happened
- Fix and re-deploy

---

## MONITORING & MAINTENANCE

### Daily Checks
- [ ] Check error logs
- [ ] Verify API health
- [ ] Monitor database performance
- [ ] Check user login success rate

### Weekly Checks  
- [ ] Review analytics
- [ ] Check performance metrics
- [ ] Update dependencies
- [ ] Run security scan

### Monthly Checks
- [ ] Database optimization
- [ ] Backup verification
- [ ] Security audit
- [ ] Capacity planning

---

## SCALING CONSIDERATIONS

### If Traffic Grows

#### Frontend
- ✅ Vercel auto-scales
- ✅ CDN caches static files
- ✅ No changes needed typically

#### Backend
- Consider load balancing
- Add caching layer (Redis)
- Optimize database queries
- Consider database read replicas

#### Database
- Monitor query performance
- Add indexes to frequently queried fields
- Consider connection pooling
- Archive old submissions

### Recommended Actions
```bash
# Monitor database size
# Check slow query log
# Profile API endpoints
# Set up alerts for high latency
```

---

## SUPPORT & TROUBLESHOOTING

### Common Issues

#### "Cannot connect to backend"
1. Verify API_URL in frontend
2. Check backend is running
3. Verify CORS configuration
4. Check firewall rules

#### "Submissions not saving"
1. Check backend logs for errors
2. Verify database connectivity
3. Check user authentication
4. Review error response

#### "Dashboard shows no data"
1. Check Supabase connection
2. Verify user session
3. Check API response
4. Look for console errors

#### "Authentication failing"
1. Verify Supabase credentials
2. Check session storage
3. Clear browser cookies
4. Try incognito mode

---

## DOCUMENTATION FOR DEPLOYMENT TEAM

### System Architecture
```
┌─────────────────┐
│   Frontend      │ (Next.js 16.2.7)
│   ├─ React 19   │
│   ├─ TypeScript │
│   └─ Tailwind   │
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────┐
│   Backend       │ (FastAPI + Uvicorn)
│   ├─ Python     │
│   └─ PostgreSQL │
└────────┬────────┘
         │ SQL
┌────────▼──────────────┐
│   Supabase            │
│   ├─ Database         │
│   ├─ Authentication   │
│   └─ Storage          │
└──────────────────────┘
```

### Key Files to Monitor
- `frontend/lib/api.ts` - API integration
- `frontend/middleware.ts` - Route protection
- `backend/app/main.py` - Backend health
- `IMPLEMENTATION_SUMMARY.md` - Integration status
- `PHASE_10_VERIFICATION_REPORT.md` - Feature status

---

## FINAL DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Environment variables set
- [ ] Backend URL updated
- [ ] Database migrations run
- [ ] Security review completed

### Deployment
- [ ] Frontend deployed to production
- [ ] Backend deployed to production
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] CORS configured
- [ ] Monitoring enabled

### Post-Deployment
- [ ] All critical paths tested
- [ ] Users can register
- [ ] Users can login
- [ ] Data syncs to database
- [ ] No error spikes
- [ ] Performance acceptable
- [ ] Team notified

---

## DEPLOYMENT SUCCESS CRITERIA

✅ **All criteria must be met before marking as deployed:**

1. Frontend loads without errors
2. User can register and login
3. Dashboard shows real data
4. Practice submissions record XP
5. No 4xx/5xx errors in logs
6. Page load time < 3 seconds
7. API response time < 500ms
8. Database connections healthy
9. Backup system working
10. Monitoring alerts configured

---

**Deployment is approved when all criteria are met.**

**Expected Time to Production:** 30-60 minutes

**Post-Deployment Monitoring:** 2-4 weeks (watch for edge cases)

---

## CONTACT & ESCALATION

### If Issues Occur
1. Check logs immediately
2. Identify affected users
3. Communicate status
4. Implement fix
5. Test thoroughly
6. Re-deploy
7. Monitor for 24 hours

### Rollback Authority
- [ ] Team Lead - Can approve rollback
- [ ] DevOps - Can execute rollback
- [ ] Product - Should notify users

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-11  
**Next Review:** After first production deployment
