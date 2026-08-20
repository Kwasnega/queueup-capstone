import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  Stack,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useFirebaseListenerManager } from './FirebaseListenerManager';

const db = getDatabase();

const ActivityCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  marginBottom: '12px',
}));

const ActivityAvatar = styled(Avatar)<{ activityType: string }>(({ theme, activityType }) => {
  const getActivityColors = (type: string) => {
    switch (type) {
      case 'complaint':
        return { bg: '#fff3cd', color: '#856404' };
      case 'result_issue':
        return { bg: '#d1ecf1', color: '#0c5460' };
      case 'user_registration':
        return { bg: '#d4edda', color: '#155724' };
      case 'status_change':
        return { bg: '#e2e3e5', color: '#495057' };
      case 'admin_action':
        return { bg: '#f3e5f5', color: '#4a148c' }; // Purple for admin actions
      default:
        return { bg: '#f8f9fa', color: '#6c757d' };
    }
  };
  
  const colors = getActivityColors(activityType);
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    width: 40,
    height: 40,
  };
});

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'queued':
      case 'pending':
        return { bg: '#fff3cd', color: '#856404' };
      case 'in_progress':
        return { bg: '#d1ecf1', color: '#0c5460' };
      case 'resolved':
        return { bg: '#d4edda', color: '#155724' };
      case 'inactive':
        return { bg: '#e2e3e5', color: '#495057' };
      default:
        return { bg: '#f8f9fa', color: '#6c757d' };
    }
  };
  
  const colors = getStatusColors(status);
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontSize: '0.75rem',
    height: '20px',
  };
});

interface ActivityItem {
  id: string;
  type: 'complaint' | 'result_issue' | 'user_registration' | 'status_change';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  studentId?: string;
  adminName?: string;
  metadata?: any;
}

interface ActivityFeedProps {
  maxItems?: number;
  showExpanded?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ maxItems = 50, showExpanded = false }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [expanded, setExpanded] = useState(showExpanded);
  const [loading, setLoading] = useState(true);
  
  // Use Firebase listener manager for proper cleanup
  const listenerManager = useFirebaseListenerManager();

  useEffect(() => {
    const setupActivityListeners = () => {
      // Clear existing listeners
      listenerManager.removeAllListeners();
      
      let allActivities: ActivityItem[] = [];

      const updateActivitiesList = () => {
        // Remove duplicates and sort by timestamp
        const uniqueActivities = Array.from(
          new Map(allActivities.map(item => [item.id, item])).values()
        );
        
        const sortedActivities = uniqueActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, maxItems);
        
        setActivities(sortedActivities);
        setLoading(false);
      };

      // Listen to complaints
      const complaintsRef = ref(db, 'complaints');
      const complaintsUnsubscribe = onValue(complaintsRef, (snapshot) => {
        console.log('Complaints snapshot:', snapshot.exists(), snapshot.val());
        
        // Clear complaint activities first
        allActivities = allActivities.filter(activity => !activity.id.startsWith('complaint-'));
        
        if (snapshot.exists()) {
          const complaints = snapshot.val();
          Object.entries(complaints).forEach(([id, complaint]: [string, any]) => {
            // Skip if this is a nested student-specific complaint or invalid data
            if (typeof complaint !== 'object' || complaint === null) return;
            
            // Check if it has basic required fields
            const hasValidData = complaint.student_id || complaint.subject || complaint.text || complaint.date_submitted;
            if (!hasValidData) return;
            
            // New complaint activity
            allActivities.push({
              id: `complaint-${id}`,
              type: 'complaint',
              title: 'New Complaint Submitted',
              description: `${complaint.subject || 'Complaint'} - ${complaint.student_id || 'Unknown Student'}`,
              timestamp: complaint.date_submitted || complaint.created_at || new Date().toISOString(),
              status: complaint.status,
              studentId: complaint.student_id,
              metadata: complaint
            });

            // Status change activities - capture ALL admin logs
            if (complaint.admin_logs && Array.isArray(complaint.admin_logs)) {
              complaint.admin_logs.forEach((log: string, index: number) => {
                if (typeof log === 'string' && log.trim()) {
                  // Parse different types of admin actions
                  const statusMatch = log.match(/changed status to (\w+)/i);
                  const adminMatch = log.match(/^([^\s]+)/);
                  const timestampMatch = log.match(/at (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
                  
                  let title = 'Admin Action';
                  let description = log;
                  
                  if (statusMatch) {
                    title = 'Complaint Status Updated';
                    description = `${complaint.subject || 'Complaint'} status changed to ${statusMatch[1]} by ${adminMatch ? adminMatch[1] : 'Admin'}`;
                  } else if (log.toLowerCase().includes('assigned')) {
                    title = 'Complaint Assigned';
                    description = `${complaint.subject || 'Complaint'} - ${log}`;
                  } else if (log.toLowerCase().includes('reviewed')) {
                    title = 'Complaint Reviewed';
                    description = `${complaint.subject || 'Complaint'} - ${log}`;
                  } else if (log.toLowerCase().includes('resolved')) {
                    title = 'Complaint Resolved';
                    description = `${complaint.subject || 'Complaint'} - ${log}`;
                  } else if (log.toLowerCase().includes('note') || log.toLowerCase().includes('comment')) {
                    title = 'Admin Note Added';
                    description = `${complaint.subject || 'Complaint'} - ${log}`;
                  }
                  
                  allActivities.push({
                    id: `complaint-log-${id}-${index}`,
                    type: 'status_change',
                    title: title,
                    description: description,
                    timestamp: timestampMatch ? timestampMatch[1] : new Date(Date.now() - (index * 60000)).toISOString(), // Stagger timestamps if none provided
                    status: statusMatch ? statusMatch[1] : complaint.status,
                    studentId: complaint.student_id,
                    adminName: adminMatch ? adminMatch[1] : 'Admin',
                    metadata: { ...complaint, log, type: 'complaint' }
                  });
                }
              });
            }
          });
        }
        updateActivitiesList();
      }, (error) => {
        console.error('Complaints listener error:', error);
        setLoading(false);
      });
      listenerManager.addListener('complaints', complaintsUnsubscribe);

      // Listen to result issues
      const resultIssuesRef = ref(db, 'result_issues');
      const resultIssuesUnsubscribe = onValue(resultIssuesRef, (snapshot) => {
        console.log('Result issues snapshot:', snapshot.exists(), snapshot.val());
        
        // Clear result issue activities first
        allActivities = allActivities.filter(activity => !activity.id.startsWith('result-'));
        
        if (snapshot.exists()) {
          const resultIssues = snapshot.val();
          Object.entries(resultIssues).forEach(([id, issue]: [string, any]) => {
            // Skip if this is a nested student-specific issue or invalid data
            if (typeof issue !== 'object' || issue === null) return;
            
            // Check if it has basic required fields
            const hasValidData = issue.student_id || issue.course_code || issue.description || issue.date_submitted;
            if (!hasValidData) return;
            
            // New result issue activity
            allActivities.push({
              id: `result-${id}`,
              type: 'result_issue',
              title: 'New Result Issue Reported',
              description: `${issue.course_code || 'Course'} - ${issue.course_title || issue.courseTitle || issue.course_name || 'Course Title'} (${issue.student_id || 'Unknown Student'})`,
              timestamp: issue.date_submitted || issue.created_at || new Date().toISOString(),
              status: issue.status,
              studentId: issue.student_id,
              metadata: issue
            });

            // Status change activities for result issues - capture ALL admin logs
            if (issue.admin_logs && Array.isArray(issue.admin_logs)) {
              issue.admin_logs.forEach((log: string, index: number) => {
                if (typeof log === 'string' && log.trim()) {
                  // Parse different types of admin actions
                  const statusMatch = log.match(/changed status to (\w+)/i);
                  const adminMatch = log.match(/^([^\s]+)/);
                  const timestampMatch = log.match(/at (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
                  
                  let title = 'Admin Action';
                  let description = log;
                  
                  if (statusMatch) {
                    title = 'Result Issue Status Updated';
                    description = `${issue.course_code || 'Course'} (${issue.course_title || issue.courseTitle || issue.course_name || 'Course Title'}) status changed to ${statusMatch[1]} by ${adminMatch ? adminMatch[1] : 'Admin'}`;
                  } else if (log.toLowerCase().includes('assigned')) {
                    title = 'Result Issue Assigned';
                    description = `${issue.course_code || 'Course'} - ${log}`;
                  } else if (log.toLowerCase().includes('reviewed')) {
                    title = 'Result Issue Reviewed';
                    description = `${issue.course_code || 'Course'} - ${log}`;
                  } else if (log.toLowerCase().includes('resolved') || log.toLowerCase().includes('corrected')) {
                    title = 'Result Issue Resolved';
                    description = `${issue.course_code || 'Course'} - ${log}`;
                  } else if (log.toLowerCase().includes('note') || log.toLowerCase().includes('comment')) {
                    title = 'Admin Note Added';
                    description = `${issue.course_code || 'Course'} - ${log}`;
                  } else if (log.toLowerCase().includes('contacted') || log.toLowerCase().includes('lecturer')) {
                    title = 'Lecturer Contacted';
                    description = `${issue.course_code || 'Course'} - ${log}`;
                  }
                  
                  allActivities.push({
                    id: `result-log-${id}-${index}`,
                    type: 'status_change',
                    title: title,
                    description: description,
                    timestamp: timestampMatch ? timestampMatch[1] : new Date(Date.now() - (index * 60000)).toISOString(), // Stagger timestamps if none provided
                    status: statusMatch ? statusMatch[1] : issue.status,
                    studentId: issue.student_id,
                    adminName: adminMatch ? adminMatch[1] : 'Admin',
                    metadata: { ...issue, log, type: 'result_issue' }
                  });
                }
              });
            }
          });
        }
        updateActivitiesList();
      }, (error) => {
        console.error('Result issues listener error:', error);
        setLoading(false);
      });
      listenerManager.addListener('results', resultIssuesUnsubscribe);

      // Listen to user registrations
      const usersRef = ref(db, 'users');
      const usersUnsubscribe = onValue(usersRef, (snapshot) => {
        // Clear user activities first
        allActivities = allActivities.filter(activity => !activity.id.startsWith('user-'));
        
        if (snapshot.exists()) {
          const users = snapshot.val();
          Object.entries(users).forEach(([id, user]: [string, any]) => {
            if (user.timestamp) {
              allActivities.push({
                id: `user-${id}`,
                type: 'user_registration',
                title: 'New User Registration',
                description: `${user.full_name || user.name || 'Student'} (${user.studentId || user.studentID || id}) joined`,
                timestamp: new Date(user.timestamp).toISOString(),
                studentId: user.studentId || user.studentID || id,
                metadata: user
              });
            }
          });
        }
        updateActivitiesList();
      }, (error) => {
        console.error('Users listener error:', error);
        setLoading(false);
      });
      listenerManager.addListener('users', usersUnsubscribe);

      // Listen to admin activities
      const adminActivitiesRef = ref(db, 'admin_activities');
      const adminActivitiesUnsubscribe = onValue(adminActivitiesRef, (snapshot) => {
        console.log('Admin activities snapshot:', snapshot.exists(), snapshot.val());
        
        // Clear admin activities first
        allActivities = allActivities.filter(activity => !activity.id.startsWith('admin-'));
        
        if (snapshot.exists()) {
          const adminActivities = snapshot.val();
          Object.entries(adminActivities).forEach(([id, activity]: [string, any]) => {
            if (activity.timestamp) {
              // Create more descriptive activity entries
              let title = 'Admin Action';
              let description = activity.description;
              
              if (activity.action && activity.new_status) {
                if (activity.item_type === 'result_issue') {
                  title = 'Result Issue Status Updated';
                  description = `${activity.admin_name || 'Admin'} changed status to ${activity.new_status} for ${activity.metadata?.item_data?.course_code || 'course'}`;
                } else if (activity.item_type === 'complaint') {
                  title = 'Complaint Status Updated';
                  description = `${activity.admin_name || 'Admin'} changed status to ${activity.new_status} for complaint`;
                }
              } else if (activity.action) {
                title = `Admin Action: ${activity.action}`;
                description = activity.description || `${activity.admin_name || 'Admin'} ${activity.action}`;
              }
              
              allActivities.push({
                id: `admin-${id}`,
                type: 'admin_action',
                title: title,
                description: description,
                timestamp: activity.timestamp,
                status: activity.new_status,
                studentId: activity.student_id,
                adminName: activity.admin_name,
                metadata: {
                  ...activity,
                  admin_role: activity.admin_role,
                  item_type: activity.item_type
                }
              });
            }
          });
        }
        updateActivitiesList();
      }, (error) => {
        console.error('Admin activities listener error:', error);
        setLoading(false);
      });
      listenerManager.addListener('admin_activities', adminActivitiesUnsubscribe);
    };

    setupActivityListeners();
    
    // Add some mock activities if no real data is found after 3 seconds
    const fallbackTimeout = setTimeout(() => {
      if (allActivities.length === 0) {
        console.log('No activities found, adding mock data for testing');
        const mockActivities = [
          {
            id: 'mock-1',
            type: 'complaint',
            title: 'New Complaint Submitted',
            description: 'Academic Issue - Student ID: 2425400843',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'Queued',
            studentId: '2425400843',
            metadata: { subject: 'Academic Issue', type: 'mock' }
          },
          {
            id: 'mock-2',
            type: 'result_issue',
            title: 'New Result Issue Reported',
            description: 'CSSD 101 - Introduction to Computing (Student ID: 2425400843)',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            status: 'In Progress',
            studentId: '2425400843',
            metadata: { course_code: 'CSSD 101', course_title: 'Introduction to Computing', type: 'mock' }
          },
          {
            id: 'mock-3',
            type: 'user_registration',
            title: 'New User Registration',
            description: 'Lord Nyameyie Mensah (2425400843) joined',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            studentId: '2425400843',
            metadata: { full_name: 'Lord Nyameyie Mensah', type: 'mock' }
          }
        ];
        
        allActivities = mockActivities;
        setActivities(mockActivities);
        setLoading(false);
      }
    }, 3000);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(fallbackTimeout);
      listenerManager.removeAllListeners();
    };
  }, [maxItems, listenerManager]);

  const getActivityIcon = (type: string, metadata?: any) => {
    switch (type) {
      case 'complaint':
        return <ReportIcon />;
      case 'result_issue':
        return <AssignmentIcon />;
      case 'user_registration':
        return <PersonIcon />;
      case 'admin_action':
        // Use different icons based on the admin action type
        if (metadata?.action) {
          const action = metadata.action.toLowerCase();
          if (action.includes('resolved')) return <CheckCircleIcon />;
          if (action.includes('assigned')) return <PersonIcon />;
          if (action.includes('reviewed')) return <VisibilityIcon />;
          if (action.includes('progress')) return <EditIcon />;
          if (action.includes('inactive') || action.includes('delete')) return <ErrorIcon />;
        }
        return <CheckCircleIcon />;
      case 'status_change':
        // Use different icons based on the action type
        if (metadata?.log) {
          const log = metadata.log.toLowerCase();
          if (log.includes('resolved')) return <CheckCircleIcon />;
          if (log.includes('assigned')) return <PersonIcon />;
          if (log.includes('reviewed')) return <VisibilityIcon />;
          if (log.includes('note') || log.includes('comment')) return <InfoIcon />;
        }
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const displayedActivities = expanded ? activities : activities.slice(0, 10);

  return (
    <ActivityCard>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimelineIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
          </Stack>
          {activities.length > 10 && (
            <IconButton onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Stack>

        {loading ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Loading activities...
          </Typography>
        ) : displayedActivities.length > 0 ? (
          <List sx={{ p: 0 }}>
            {displayedActivities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <ActivityAvatar activityType={activity.type}>
                      {getActivityIcon(activity.type, activity.metadata)}
                    </ActivityAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {activity.title}
                        </Typography>
                        {activity.status && (
                          <StatusChip status={activity.status} label={activity.status} size="small" />
                        )}
                        {activity.metadata?.type === 'mock' && (
                          <Chip label="Demo" size="small" color="info" />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(activity.timestamp)}
                          </Typography>
                          {activity.adminName && (
                            <>
                              <Typography variant="caption" color="text.secondary">•</Typography>
                              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                                by {activity.adminName}
                              </Typography>
                            </>
                          )}
                          {activity.studentId && (
                            <>
                              <Typography variant="caption" color="text.secondary">•</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Student: {activity.studentId}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < displayedActivities.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No recent activity found.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Activities will appear here when complaints or result issues are submitted or updated.
            </Typography>
          </Box>
        )}

        <Collapse in={expanded}>
          {activities.length > 10 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Showing {displayedActivities.length} of {activities.length} activities
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </ActivityCard>
  );
};

export default ActivityFeed;