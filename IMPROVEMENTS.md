# 🚀 Pelawahak.lk — Improvement Suggestions

Simple point-by-point list of improvements, grouped by priority.

---

## 🔴 CRITICAL (Do Before Going Live)

### 1. Image Storage → Cloudinary or S3
- **Problem:** Images save to local disk → lost on every redeploy
- **Fix:** Migrate Multer uploads to Cloudinary (free 25GB)
- **Impact:** Without this, all user images disappear when you redeploy

### 2. Rotate Leaked Secrets
- **Problem:** MongoDB password + JWT secret exposed in old commits/chats
- **Fix:** Generate new MongoDB password, new 64-char JWT secret
- **Generate:** `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Change Admin Password
- **Problem:** Default `Admin@567` is weak and hardcoded
- **Fix:** Use strong password in production env, change on first login

### 4. Socket.io Authentication
- **Problem:** Any user can join any other user's socket room (privacy leak)
- **Fix:** Add JWT handshake middleware to Socket.io connection
- **Impact:** Currently anyone can eavesdrop on another user's chats

### 5. Rate Limiting
- **Problem:** No throttling on login/register → brute force attacks possible
- **Fix:** Install `express-rate-limit`, 5 attempts per 15 min on `/api/auth/*`

### 6. Fix Auth Middleware Bug
- **Problem:** `authMiddleware.js` can send double response → server crash
- **Fix:** Add `return` before each `res.status(401).json(...)` call

### 7. Production MongoDB IP Whitelist
- **Problem:** Currently allows `0.0.0.0/0` (anywhere)
- **Fix:** Restrict to hosting platform's specific IP ranges

---

## 🟠 HIGH PRIORITY (Within First Month)

### 8. Input Validation
- Add `express-validator` or `joi`
- Validate email format, password strength, phone numbers, price > 0
- Prevent SQL/NoSQL injection attempts

### 9. File Upload Limits
- Add Multer `limits: { fileSize: 5 * 1024 * 1024 }` (5MB)
- Validate file types strictly
- Use UUID filenames (prevent collisions)

### 10. Fix `freeAdsRemaining` Race Condition
- Replace read-modify-write with atomic `findOneAndUpdate`
- Currently two simultaneous requests can bypass the limit

### 11. Password Reset Flow
- Currently no way to reset forgotten passwords
- Add email-based reset with nodemailer + token

### 12. Email Verification
- Verify email on registration
- Reduces fake accounts

### 13. Password Strength Policy
- Enforce minimum 8 chars, mix of letters/numbers/symbols
- Currently accepts `1` as password

### 14. Logging Strategy
- Replace `console.log` with `winston` or `pino`
- Add log levels (error, warn, info, debug)
- Don't log error details to clients

### 15. Error Messages
- Don't leak internal errors to users
- Currently exposes `error.message` in responses

---

## 🟡 MEDIUM PRIORITY (Within 3 Months)

### 16. Image Optimization
- Auto-resize uploads (1200x1200 max)
- Convert to WebP for better compression
- Generate thumbnails

### 17. Database Indexes
- Add compound indexes on `{ status, category }`, `{ status, district }`
- Add text index on `title` for search
- Currently slow as data grows

### 18. Pagination
- `GET /api/ads` returns everything (slow with many ads)
- Add `limit` + `skip` or cursor-based pagination

### 19. Frontend Code Splitting
- All 11 pages loaded eagerly → large initial bundle
- Use `React.lazy()` + `Suspense` for route splitting

### 20. Error Boundaries
- One broken page crashes entire app
- Wrap routes in React ErrorBoundary

### 21. Loading States
- `<div>Loading...</div>` is ugly
- Add skeleton loaders / spinners

### 22. Favorites/Saved Ads
- Let users save ads to "favorites"
- Improves engagement

### 23. Reviews & Ratings
- Let users review service providers
- Build trust and SEO

### 24. Reporting System
- Let users flag inappropriate content
- Admin review queue

### 25. Admin Dashboard Metrics
- Show total users, pending ads, monthly revenue
- Charts and graphs

---

## 🟢 NICE TO HAVE (Optional)

### 26. TypeScript Migration
- Catch type errors at build time
- Better IDE autocomplete

### 27. Unit & Integration Tests
- Currently zero tests
- Add Jest + Supertest for API tests

### 28. Docker Setup
- Add `Dockerfile` + `docker-compose.yml`
- Consistent dev environment

### 29. CI/CD Pipeline
- GitHub Actions for auto-testing on PRs
- Auto-deploy on merge to main

### 30. SEO Improvements
- Add meta descriptions
- Open Graph tags for social sharing
- Consider SSR (Next.js) for ad detail pages

### 31. Accessibility
- Add `aria-label` to icon buttons
- Fix color contrast (WCAG AA)
- Keyboard navigation

### 32. Mobile App
- React Native version
- Share backend API

### 33. Notifications Center
- Bell icon with unread count
- Persistent notifications beyond chat

### 34. Typing Indicators
- "Bob is typing..." in chat
- Leverages existing Socket.io

### 35. Online/Offline Status
- Green dot for online users
- Last seen timestamps

### 36. Read Receipts
- "Seen at 2:30 PM"
- Already have `isRead` field in Message model

### 37. Payment Integration
- PayHere for Sri Lanka market
- Paid ads beyond free 3

### 38. Advanced Search
- Filters: price range, date posted, verified sellers
- Saved searches with alerts

### 39. Multi-language Support
- Sinhala + Tamil + English
- i18next or react-intl

### 40. Push Notifications
- Browser push for new messages
- Service workers

---

## 🔧 TECHNICAL DEBT (Refactoring)

### 41. Controllers Pattern
- Routes have all logic mixed in
- Split into `controllers/`, `services/`, `validators/`

### 42. Environment Config Validation
- Validate env vars on startup
- Fail fast if required vars missing
- Use `envalid` package

### 43. Database Connection Retry
- Currently exits on connection failure
- Add retry logic with exponential backoff

### 44. Security Headers
- Install `helmet` middleware
- Add CSP, HSTS, X-Frame-Options

### 45. Request Compression
- Install `compression` middleware
- Reduce bandwidth

### 46. API Versioning
- `/api/v1/ads` instead of `/api/ads`
- Easier to maintain backward compatibility

### 47. Socket.io Reconnect Fix
- `Chat.jsx` useEffect causes reconnect loop
- Separate socket setup from message handler

### 48. Auto-logout Optimization
- `api.js` interceptor uses `window.location.href` (full page reload)
- Use React Router `navigate()` instead

### 49. Remove Unused Dependencies
- Audit `package.json` for unused packages
- Run `npx depcheck`

### 50. README + Contributing Guide
- Add `CONTRIBUTING.md`
- Add `CODE_OF_CONDUCT.md`
- Template for issues/PRs

---

## 📊 Priority Order for First 30 Days

**Week 1 (Critical):**
- [ ] Items #1, #2, #3, #4, #5, #6, #7

**Week 2 (Security):**
- [ ] Items #8, #9, #10, #13, #15

**Week 3 (UX):**
- [ ] Items #11, #12, #18, #19, #21

**Week 4 (Features):**
- [ ] Items #16, #20, #22, #25

---

## 💰 Cost Estimate for Recommended Tools

| Service | Free Tier | Paid |
|---------|-----------|------|
| Cloudinary (images) | 25GB | $89/mo |
| MongoDB Atlas | 512MB | $9/mo (M2) |
| Railway (backend) | $5 credit | $5/mo |
| Netlify (frontend) | 100GB bandwidth | $19/mo |
| Sentry (error tracking) | 5K events/mo | $26/mo |
| **Total to start** | **$0-5/mo** | |

---

## 🎯 Quick Wins (Can Do Today)

- [ ] Add `helmet` middleware (security headers) — 2 min
- [ ] Add request body size limit — 2 min
- [ ] Install `compression` middleware — 2 min
- [ ] Change admin password — 5 min
- [ ] Set up MongoDB IP whitelist — 5 min
- [ ] Generate new JWT secret — 5 min
- [ ] Add `.env` to `.gitignore` if not there — 1 min
- [ ] Add Sentry error tracking — 15 min

---

## 📝 Notes

- Priorities depend on your launch timeline
- Focus on **CRITICAL** items before accepting real users
- **HIGH PRIORITY** items can wait if you're in MVP/beta stage
- **NICE TO HAVE** items improve the product but aren't blockers
- Always test changes locally before deploying

---

**Last updated:** 2026-04-23