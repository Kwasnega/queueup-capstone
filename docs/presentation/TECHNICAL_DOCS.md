# QueueUp - Technical Documentation

## 📋 Project Overview

**QueueUp** is a modern web-based queue management system designed specifically for Ghana Communication Technology University (GCTU). The system streamlines student complaint handling and result issue reporting through an intelligent role-based routing system, eliminating the need for physical queuing and improving administrative efficiency.

### 🎯 Core Purpose
- **Student Portal**: Submit complaints and result issues with real-time tracking
- **Admin Dashboard**: Role-based complaint management with automated routing
- **Queue Management**: Intelligent routing to appropriate departments (HOD, Exam Officer, Registrar)
- **Real-time Updates**: Live activity feed and status tracking

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Material-UI v7
- **State Management**: Redux Toolkit with RTK Query
- **Backend**: Firebase Realtime Database + Authentication
- **Build Tool**: Vite with TypeScript support
- **Deployment**: Vercel with static site generation
- **Styling**: Emotion CSS-in-JS + MUI theming

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Student Web   │    │   Admin Web     │    │  Firebase       │
│   Dashboard     │◄──►│   Dashboard     │◄──►│  Realtime DB    │
│                 │    │                 │    │                 │
│ - Submit Issues │    │ - Role Routing  │    │ - Users         │
│ - Track Status  │    │ - Status Mgmt   │    │ - Complaints    │
│ - Real-time     │    │ - Activity Feed │    │ - Result Issues │
└─────────────────┘    └─────────────────┘    │ - Admin Logs    │
                                              └─────────────────┘
```

## 📁 Directory Structure

```
queueup-main/
├── src/
│   ├── components/           # React components
│   │   ├── auth/            # Authentication forms
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── FormInput.tsx
│   │   │   └── LoadingButton.tsx
│   │   ├── AdminDashboard.tsx    # Admin interface (1418 lines)
│   │   ├── StudentDashboard.tsx  # Student interface (684 lines)
│   │   ├── Dashboard.tsx         # Main dashboard component
│   │   ├── ActivityFeed.tsx      # Real-time activity tracking
│   │   ├── FirebaseListenerManager.tsx # Firebase cleanup utility
│   │   ├── DashboardHeader.tsx   # Header component
│   │   ├── ProfileCard.tsx       # User profile display
│   │   ├── ActionCard.tsx        # Action buttons
│   │   ├── StatusBadge.tsx       # Status indicators
│   │   ├── ProgressModal.tsx     # Progress tracking
│   │   ├── TrackingModal.tsx     # Issue tracking
│   │   ├── UserManagementTab.tsx # User management
│   │   ├── UserProfileModal.tsx  # Profile editing
│   │   ├── ResultIssueModal.tsx  # Result issue details
│   │   ├── ResultIssueTable.tsx  # Result issue listing
│   │   ├── ResultIssuesTab.tsx   # Result issues tab
│   │   ├── ExcelExportButton.tsx # Data export
│   │   └── UserVerificationStatus.tsx # Email verification
│   ├── services/            # Business logic services
│   │   ├── AuthService.ts        # Authentication service
│   │   └── FirebaseAuthService.ts # Firebase auth wrapper
│   ├── hooks/               # Custom React hooks
│   │   └── useInactivityTimer.ts # Auto-logout functionality
│   ├── theme/               # UI theming
│   │   └── theme.ts              # MUI theme configuration
│   └── theme.ts             # Theme export
├── public/                  # Static assets
│   ├── gctu.ico            # University favicon
│   ├── gctu.png            # University logo
│   └── lib.jpg             # Library image
├── App.*.tsx               # Various app configurations
├── dashboard.tsx           # Main dashboard entry
├── main.tsx               # React app entry point
├── index.css              # Global styles
├── firebase_config.js     # Firebase configuration
├── package.json           # Dependencies and scripts
├── vercel.json           # Deployment configuration
├── vite.config.ts        # Build configuration
├── tsconfig.json         # TypeScript configuration
└── *.html                # Static HTML pages
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Firebase project with Realtime Database
- Vercel account (for deployment)

### Local Development Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd queueup-main
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env.local` file:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=<REDACTED>
VITE_FIREBASE_AUTH_DOMAIN=queueup-85662.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://queueup-85662-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=queueup-85662
VITE_FIREBASE_STORAGE_BUCKET=queueup-85662.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<REDACTED>
VITE_FIREBASE_APP_ID=<REDACTED>
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

6. **Preview Production Build**
```bash
npm run preview
```

## 🗄️ Database Schema

### Firebase Realtime Database Structure

```json
{
  "users": {
    "<studentId>": {
      "uid": "string",
      "studentId": "string",
      "studentID": "string", 
      "email": "string",
      "full_name": "string",
      "name": "string",
      "faculty": "string",
      "department": "string", 
      "programme": "string",
      "group": "string",
      "level": "string",
      "academic_year": "string",
      "semester": "string",
      "session": "string",
      "timestamp": "number",
      "emailVerified": "boolean",
      "email_verified": "boolean",
      "role": "Student"
    }
  },
  "complaints": {
    "<complaintId>": {
      "id": "string",
      "subject": "string",
      "type": "Academic|Administrative|Technical|Facilities|Other",
      "status": "Queued|in_progress|resolved|inactive",
      "student_id": "string",
      "description": "string",
      "date_submitted": "number",
      "admin_logs": ["string"],
      "recipient": "HOD|Exam|Registrar|General",
      "recipient_email": "string",
      "admin_route": "hod|exam|registrar|general",
      "last_updated": "string",
      "last_updated_by": "string"
    }
  },
  "result_issues": {
    "<issueId>": {
      "id": "string",
      "course_code": "string",
      "course_title": "string",
      "courseTitle": "string",
      "course_name": "string",
      "student_id": "string",
      "description": "string",
      "status": "Queued|in_progress|resolved|inactive",
      "date_submitted": "number",
      "lecturer_name": "string",
      "lecturerName": "string",
      "faculty": "string",
      "admin_logs": ["string"],
      "last_updated": "string",
      "last_updated_by": "string"
    }
  },
  "admin_activities": {
    "<activityId>": {
      "type": "complaint_update|result_issue_update",
      "item_id": "string",
      "item_type": "complaint|result_issue",
      "admin_name": "string",
      "admin_role": "SuperAdmin|HOD|Dean|Exam|Registrar",
      "action": "string",
      "new_status": "string",
      "student_id": "string",
      "timestamp": "string",
      "description": "string",
      "metadata": "object"
    }
  }
}
```

### Key Database Features
- **Email Verification Filtering**: Only verified users appear in admin dashboard
- **Role-based Routing**: Complaints automatically routed based on `admin_route` field
- **Audit Trail**: Complete admin action logging in `admin_logs` arrays
- **Real-time Sync**: All changes propagate instantly to connected clients

## 🔌 API Reference

### Firebase Realtime Database Operations

#### User Management
```typescript
// Get verified users only
const usersRef = ref(db, 'users');
onValue(usersRef, (snapshot) => {
  const users = snapshot.val();
  const verifiedUsers = Object.values(users).filter(user => 
    user.emailVerified === true || user.email_verified === true
  );
});
```

#### Complaint Operations
```typescript
// Submit new complaint
const complaintsRef = ref(db, 'complaints');
const newComplaintRef = push(complaintsRef);
await set(newComplaintRef, {
  subject: "Academic Issue",
  type: "Academic",
  status: "Queued",
  student_id: "2425400843",
  description: "Course registration problem",
  date_submitted: Date.now(),
  admin_route: "hod",
  recipient: "HOD",
  admin_logs: ["Complaint received"]
});
```

#### Status Updates with Logging
```typescript
// Update complaint status with admin logging
const complaintRef = ref(db, `complaints/${complaintId}`);
const timestamp = new Date().toISOString();
const logMessage = `${adminName} changed status to ${newStatus} at ${timestamp}`;

await update(complaintRef, {
  status: newStatus,
  admin_logs: [...currentLogs, logMessage],
  last_updated: timestamp,
  last_updated_by: adminName
});
```

#### Role-based Filtering
```typescript
// Filter complaints by admin role
const getFilteredComplaintsByRole = (complaints, role) => {
  if (role === 'SuperAdmin') return complaints;
  
  const roleRouteMap = {
    'HOD': 'hod',
    'Dean': 'dean', 
    'Exam': 'exam',
    'Registrar': 'registrar'
  };
  
  const adminRoute = roleRouteMap[role];
  return complaints.filter(c => 
    c.admin_route === adminRoute || c.admin_route === 'general'
  );
};
```

## 🚀 Deployment Guide

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_FIREBASE_API_KEY=<REDACTED>
   VITE_FIREBASE_AUTH_DOMAIN=queueup-85662.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://queueup-85662-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=queueup-85662
   VITE_FIREBASE_STORAGE_BUCKET=queueup-85662.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=<REDACTED>
   VITE_FIREBASE_APP_ID=<REDACTED>
   ```

3. **Build Configuration**
   ```json
   {
     "version": 2,
     "outputDirectory": "dist",
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "dist" }
       }
     ],
     "rewrites": [
       { "source": "/login", "destination": "/login.html" },
       { "source": "/dashboard", "destination": "/dashboard.html" },
       { "source": "/admin", "destination": "/admin.html" },
       { "source": "/admin_dashboard", "destination": "/admin_dashboard.html" }
     ]
   }
   ```

### Firebase Setup

1. **Create Firebase Project**
   - Enable Realtime Database
   - Configure Authentication
   - Set up security rules

2. **Database Security Rules**
   ```json
   {
     "rules": {
       "users": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "complaints": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "result_issues": {
         ".read": "auth != null", 
         ".write": "auth != null"
       },
       "admin_activities": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

## 🧪 Testing Strategy

### Manual Testing Checklist

#### Student Dashboard
- [ ] User registration with email verification
- [ ] Login with student ID and password
- [ ] Submit complaint with proper routing
- [ ] Submit result issue with course details
- [ ] Track complaint/issue status
- [ ] View real-time progress updates
- [ ] Inactivity timeout functionality

#### Admin Dashboard  
- [ ] Role-based complaint filtering
- [ ] Status update with logging
- [ ] User management (view verified users only)
- [ ] Activity feed real-time updates
- [ ] Excel export functionality
- [ ] Admin action audit trail

#### System Integration
- [ ] Firebase real-time synchronization
- [ ] Email verification workflow
- [ ] Role-based access control
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Performance under load

### Automated Testing
```bash
# Run ESLint
npm run lint

# Build verification
npm run build

# Type checking
npx tsc --noEmit
```

## 🔒 Security Considerations

### Authentication & Authorization
- **Email Verification**: Required before system access
- **Role-based Access**: Admin roles filter visible complaints
- **Session Management**: Inactivity timeout (15 minutes)
- **Firebase Security Rules**: Database access control

### Data Protection
- **Student Privacy**: Personal data encrypted in transit
- **Audit Logging**: All admin actions tracked
- **Input Validation**: Form data sanitization
- **HTTPS Enforcement**: All communications encrypted

### Security Best Practices
- Regular dependency updates
- Firebase security rules review
- Access token rotation
- Monitoring for suspicious activity

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Compressed assets
- **Caching Strategy**: Service worker implementation

### Database Optimizations
- **Indexed Queries**: Efficient data retrieval
- **Data Pagination**: Limit query results
- **Connection Pooling**: Firebase connection management
- **Real-time Listeners**: Proper cleanup to prevent memory leaks

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Email Dependency**: Requires Gmail for verification
2. **Single Institution**: Designed specifically for GCTU
3. **Manual Role Assignment**: Admin roles set manually
4. **Limited File Upload**: No document attachment support
5. **Basic Reporting**: Limited analytics dashboard

### Technical Debt
1. **Component Refactoring**: Large components need splitting
2. **Type Safety**: Some `any` types need proper typing
3. **Error Handling**: Improve error boundary coverage
4. **Testing Coverage**: Add unit and integration tests
5. **Documentation**: API documentation needs expansion

### Priority Fixes
- **High**: Add proper error boundaries
- **Medium**: Implement file upload for complaints
- **Low**: Add advanced analytics dashboard

## 🔄 CI/CD Process

### Current Deployment Flow
1. **Code Push**: Developer pushes to main branch
2. **Vercel Build**: Automatic build trigger
3. **Type Check**: TypeScript compilation
4. **Lint Check**: ESLint validation
5. **Build**: Vite production build
6. **Deploy**: Automatic deployment to production

### Recommended Enhancements
- Add automated testing pipeline
- Implement staging environment
- Add database migration scripts
- Set up monitoring and alerting

## 📈 Monitoring & Analytics

### Current Monitoring
- Vercel deployment status
- Firebase usage metrics
- Browser console error tracking

### Recommended Additions
- User activity analytics
- Performance monitoring (Core Web Vitals)
- Error tracking (Sentry integration)
- Database query performance
- User satisfaction metrics

## 🆘 Troubleshooting Guide

### Common Issues

#### Firebase Connection Errors
```
Error: Cannot read properties of undefined (reading 'pieceNum_')
```
**Solution**: Use FirebaseListenerManager for proper cleanup

#### Build Failures
```
Error: Module not found
```
**Solution**: Check import paths and TypeScript configuration

#### Authentication Issues
```
Error: Email not verified
```
**Solution**: Ensure email verification before login

### Debug Commands
```bash
# Check Firebase connection
npm run dev -- --debug

# Analyze bundle size
npm run build -- --analyze

# Check TypeScript errors
npx tsc --noEmit --watch
```

## 📞 Support & Maintenance

### Development Team Contacts
- **Kay**: Project lead, business requirements
- **Lord**: Frontend development, UX design
- **Rigwell**: Architecture, deployment, DevOps

### Maintenance Schedule
- **Daily**: Monitor error logs and user feedback
- **Weekly**: Security updates and dependency patches
- **Monthly**: Performance review and optimization
- **Quarterly**: Feature updates and system upgrades

---

*Last Updated: January 2025*
*Version: 1.0.0*