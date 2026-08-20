# QueueUp - Complete File Index & Analysis

## 📊 Repository Inventory

### 🔥 **Top 30 Critical Files** (Ranked by System Importance)

| Rank | File Path | Size | Purpose | Criticality |
|------|-----------|------|---------|-------------|
| 1 | `src/components/AdminDashboard.tsx` | 1418 lines | Core admin interface with role-based routing | **CRITICAL** |
| 2 | `firebase_config.js` | 37 lines | Firebase configuration & app constants | **CRITICAL** |
| 3 | `src/components/StudentDashboard.tsx` | 684 lines | Student portal interface | **CRITICAL** |
| 4 | `package.json` | 85 lines | Dependencies & build configuration | **CRITICAL** |
| 5 | `src/components/ActivityFeed.tsx` | 597 lines | Real-time activity monitoring | **HIGH** |
| 6 | `vercel.json` | 24 lines | Deployment & routing configuration | **HIGH** |
| 7 | `src/services/FirebaseAuthService.ts` | 221 lines | Authentication service layer | **HIGH** |
| 8 | `src/components/FirebaseListenerManager.tsx` | 161 lines | Firebase cleanup utility | **HIGH** |
| 9 | `src/theme/theme.ts` | 147 lines | UI theme configuration | **HIGH** |
| 10 | `src/hooks/useInactivityTimer.ts` | 104 lines | Auto-logout security feature | **HIGH** |
| 11 | `src/components/auth/LoginForm.tsx` | 199 lines | User authentication interface | **MEDIUM** |
| 12 | `src/components/auth/SignupForm.tsx` | 224 lines | User registration interface | **MEDIUM** |
| 13 | `src/components/Dashboard.tsx` | 191 lines | Main dashboard component | **MEDIUM** |
| 14 | `src/services/AuthService.ts` | 62 lines | Mock authentication service | **MEDIUM** |
| 15 | `main.tsx` | 16 lines | React application entry point | **MEDIUM** |
| 16 | `dashboard.tsx` | 82 lines | Dashboard routing component | **MEDIUM** |
| 17 | `index.css` | 15 lines | Global CSS styles | **MEDIUM** |
| 18 | `tsconfig.json` | - | TypeScript configuration | **MEDIUM** |
| 19 | `vite.config.ts` | - | Build tool configuration | **MEDIUM** |
| 20 | `src/components/auth/AuthLayout.tsx` | - | Authentication layout wrapper | **LOW** |
| 21 | `src/components/auth/FormInput.tsx` | - | Form input component | **LOW** |
| 22 | `src/components/auth/LoadingButton.tsx` | - | Loading button component | **LOW** |
| 23 | `src/components/DashboardHeader.tsx` | - | Dashboard header component | **LOW** |
| 24 | `src/components/ProfileCard.tsx` | - | User profile display | **LOW** |
| 25 | `src/components/ActionCard.tsx` | - | Action button cards | **LOW** |
| 26 | `src/components/StatusBadge.tsx` | - | Status indicator component | **LOW** |
| 27 | `src/components/ProgressModal.tsx` | - | Progress tracking modal | **LOW** |
| 28 | `src/components/TrackingModal.tsx` | - | Issue tracking modal | **LOW** |
| 29 | `src/components/UserManagementTab.tsx` | - | User management interface | **LOW** |
| 30 | `src/components/ExcelExportButton.tsx` | - | Data export functionality | **LOW** |

## 🏗️ **Project Architecture Analysis**

### **Project Type Detection**
- ✅ **Frontend**: React 19 + TypeScript + Vite
- ✅ **Backend**: Firebase Realtime Database + Authentication
- ✅ **Deployment**: Vercel static hosting
- ✅ **State Management**: Redux Toolkit
- ✅ **UI Framework**: Material-UI v7
- ✅ **Build System**: Vite with TypeScript

### **Technology Stack Summary**
```json
{
  "frontend": {
    "framework": "React 19",
    "language": "TypeScript",
    "ui_library": "Material-UI v7",
    "state_management": "Redux Toolkit",
    "routing": "React Router v7",
    "styling": "Emotion + MUI theming"
  },
  "backend": {
    "database": "Firebase Realtime Database",
    "authentication": "Firebase Auth",
    "hosting": "Vercel",
    "api": "Firebase SDK"
  },
  "build_tools": {
    "bundler": "Vite",
    "compiler": "TypeScript",
    "linter": "ESLint",
    "package_manager": "npm"
  }
}
```

## 📋 **API Endpoints Analysis**

### **Firebase Realtime Database Paths**

| Path | Method | Purpose | Request/Response |
|------|--------|---------|------------------|
| `/users` | GET/POST | User management | `{ uid, studentId, email, full_name, faculty, ... }` |
| `/complaints` | GET/POST/PATCH | Complaint handling | `{ subject, type, status, student_id, admin_route, ... }` |
| `/result_issues` | GET/POST/PATCH | Result issue tracking | `{ course_code, course_title, student_id, status, ... }` |
| `/admin_activities` | GET/POST | Admin action logging | `{ type, admin_name, action, timestamp, metadata, ... }` |

### **Authentication Endpoints**
| Endpoint | Method | Purpose | Request/Response |
|----------|--------|---------|------------------|
| Firebase Auth | POST | User signup | `{ gmailAddress, password, studentId }` |
| Firebase Auth | POST | User login | `{ studentId, password }` → `{ uid, email, verified }` |
| Firebase Auth | POST | Email verification | `{ verificationCode }` → `{ success, message }` |
| Firebase Auth | POST | Password reset | `{ email }` → `{ success, message }` |

## 🗄️ **Database Schema Details**

### **Users Collection**
```typescript
interface User {
  uid: string;                    // Firebase user ID
  studentId: string;              // University student ID
  studentID: string;              // Alternative field name
  email: string;                  // @live.gctu.edu.gh email
  full_name: string;              // Student full name
  name: string;                   // Alternative name field
  faculty: string;                // Academic faculty
  department: string;             // Department/Group
  programme: string;              // Study programme
  group: string;                  // Student group
  level: string;                  // Academic level
  academic_year: string;          // Current academic year
  semester: string;               // Current semester
  session: string;                // Time session
  timestamp: number;              // Registration timestamp
  emailVerified: boolean;         // Email verification status
  email_verified: boolean;        // Alternative verification field
  role: "Student";                // User role
}
```

### **Complaints Collection**
```typescript
interface Complaint {
  id: string;                     // Unique complaint ID
  subject: string;                // Complaint subject
  type: "Academic" | "Administrative" | "Technical" | "Facilities" | "Other";
  status: "Queued" | "in_progress" | "resolved" | "inactive";
  student_id: string;             // Submitting student ID
  description: string;            // Complaint details
  date_submitted: number;         // Submission timestamp
  admin_logs: string[];           // Admin action history
  recipient: "HOD" | "Exam" | "Registrar" | "General";
  recipient_email?: string;       // Target admin email
  admin_route: "hod" | "exam" | "registrar" | "general";
  last_updated?: string;          // Last modification timestamp
  last_updated_by?: string;       // Last admin to modify
}
```

### **Result Issues Collection**
```typescript
interface ResultIssue {
  id: string;                     // Unique issue ID
  course_code: string;            // Course code (e.g., "CS101")
  course_title: string;           // Course title
  courseTitle: string;            // Alternative title field
  course_name: string;            // Alternative name field
  student_id: string;             // Reporting student ID
  description: string;            // Issue description
  status: "Queued" | "in_progress" | "resolved" | "inactive";
  date_submitted: number;         // Submission timestamp
  lecturer_name: string;          // Course lecturer
  lecturerName: string;           // Alternative lecturer field
  faculty?: string;               // Academic faculty
  admin_logs: string[];           // Admin action history
  last_updated?: string;          // Last modification timestamp
  last_updated_by?: string;       // Last admin to modify
}
```

## 🔄 **Queue Algorithm Analysis**

### **Role-Based Routing Logic**
```typescript
// Core queue routing algorithm
const getFilteredComplaintsByRole = (complaints: Complaint[], role: string) => {
  if (role === 'SuperAdmin') {
    return complaints; // SuperAdmin sees all complaints
  }
  
  // Map admin roles to their corresponding routes
  const roleRouteMap: { [key: string]: string } = {
    'HOD': 'hod',
    'Dean': 'dean', 
    'Exam': 'exam',
    'Registrar': 'registrar'
  };
  
  const adminRoute = roleRouteMap[role];
  if (!adminRoute) {
    return complaints.filter(c => c.admin_route === 'general');
  }
  
  // Return complaints assigned to this admin role + general complaints
  return complaints.filter(c => 
    c.admin_route === adminRoute || c.admin_route === 'general'
  );
};
```

### **Queue Operations**
1. **Enqueue**: New complaints automatically assigned route based on type
2. **Dequeue**: Admin processes complaints from their assigned queue
3. **Prioritization**: FIFO (First In, First Out) with status-based filtering
4. **Persistence**: All queue state stored in Firebase Realtime Database
5. **Real-time Updates**: Live synchronization across all connected clients

## 🔐 **Security & Configuration Analysis**

### **Environment Variables** (Values Redacted)
```env
VITE_FIREBASE_API_KEY=<REDACTED>
VITE_FIREBASE_AUTH_DOMAIN=queueup-85662.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://queueup-85662-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=queueup-85662
VITE_FIREBASE_STORAGE_BUCKET=queueup-85662.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<REDACTED>
VITE_FIREBASE_APP_ID=<REDACTED>
```

### **Security Considerations**
✅ **Secure Practices**:
- Email verification required before access
- Inactivity timeout (15 minutes)
- Role-based access control
- HTTPS enforcement via Vercel
- Firebase security rules
- Input validation on forms

⚠️ **Security Flags**:
- Firebase config exposed in client code (standard for web apps)
- No rate limiting on API calls
- Admin roles assigned manually (no automated verification)

## 🔧 **Third-Party Services**

### **Firebase Services**
- **Realtime Database**: Primary data storage
- **Authentication**: User management & verification
- **Hosting**: Static file serving (if needed)

### **Vercel Services**
- **Static Hosting**: Primary deployment platform
- **Edge Functions**: Routing and redirects
- **Analytics**: Basic usage metrics

### **Development Tools**
- **Vite**: Build tool and dev server
- **TypeScript**: Type checking and compilation
- **ESLint**: Code linting and formatting
- **Material-UI**: Component library

## 📱 **Component Architecture**

### **Core Components Hierarchy**
```
App
├── KombaiWrapper (Error boundary)
├── Dashboard (Main routing)
│   ├── DashboardHeader
│   ├── ProfileCard
│   └── ActionCard[]
├── StudentDashboard
│   ├── ProfileCard
│   ├── ActionCard[]
│   ├── TrackingModal
│   └── ProgressModal
└── AdminDashboard
    ├── UserManagementTab
    ├── ActivityFeed
    ├── ResultIssuesTab
    ├── UserProfileModal
    ├── ResultIssueModal
    └── ExcelExportButton
```

### **Shared Utilities**
- `FirebaseListenerManager`: Prevents memory leaks
- `useInactivityTimer`: Security hook for auto-logout
- `AuthService`: Authentication abstraction layer
- `StatusBadge`: Consistent status indicators

## 🚀 **Build & Deployment Configuration**

### **Vite Configuration**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }
});
```

### **Vercel Deployment**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x
- **Framework**: Vite
- **Routing**: SPA with HTML fallbacks

## 📊 **Performance Metrics**

### **Bundle Analysis**
- **Main Bundle**: ~500KB (estimated)
- **Vendor Chunks**: React, MUI, Firebase SDK
- **Code Splitting**: Lazy loading for auth components
- **Tree Shaking**: Unused code elimination

### **Database Performance**
- **Real-time Listeners**: Efficient Firebase listeners with cleanup
- **Query Optimization**: Filtered queries by user role
- **Data Structure**: Optimized for read operations
- **Caching**: Firebase built-in caching

## 🐛 **Known Issues & Technical Debt**

### **High Priority Issues**
1. **Large Components**: AdminDashboard.tsx (1418 lines) needs refactoring
2. **Type Safety**: Some `any` types need proper TypeScript interfaces
3. **Error Handling**: Missing error boundaries in some components
4. **Testing**: No unit or integration tests present

### **Medium Priority Issues**
1. **Code Duplication**: Similar patterns across dashboard components
2. **Performance**: Large component re-renders on state changes
3. **Accessibility**: Missing ARIA labels and keyboard navigation
4. **Mobile Optimization**: Limited responsive design testing

### **Low Priority Issues**
1. **Documentation**: Inline code comments could be improved
2. **Logging**: Inconsistent console logging patterns
3. **Styling**: Some hardcoded styles instead of theme tokens
4. **Internationalization**: No multi-language support

---

*File Index Generated: January 2025*
*Total Files Analyzed: 30+ core files*
*Repository Size: ~2MB (excluding node_modules)*