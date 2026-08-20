import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TimelineContainer = styled(Box)(({ theme }) => ({
  margin: '16px 0',
}));

const TimelineItem = styled(Box)<{ status: 'pending' | 'current' | 'completed' }>(({ theme, status }) => {
  const getStyles = () => {
    switch (status) {
      case 'completed':
        return {
          background: '#f0fdf4',
          borderLeftColor: '#22c55e',
        };
      case 'current':
        return {
          background: '#eef2ff',
          borderLeftColor: '#5596ff',
        };
      default:
        return {
          background: '#f9fafb',
          borderLeftColor: '#e5e7eb',
        };
    }
  };

  const styles = getStyles();
  return {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '8px',
    background: styles.background,
    borderLeft: `4px solid ${styles.borderLeftColor}`,
  };
});

const TimelineDot = styled(Box)<{ status: 'pending' | 'current' | 'completed' }>(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'current':
        return '#5596ff';
      default:
        return '#d1d5db';
    }
  };

  return {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: getColor(),
    marginRight: '12px',
    marginTop: '4px',
    flexShrink: 0,
  };
});

const TimelineContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

interface ProgressModalProps {
  open: boolean;
  onClose: () => void;
  item: any;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  open,
  onClose,
  item
}) => {
  if (!item) return null;

  // CRITICAL FIX: Enhanced progress stages mapping for result issues
  const getProgressStages = () => {
    if (item.type === 'complaint') {
      return [
        {
          id: 'submitted',
          title: 'Complaint Submitted',
          description: 'Your complaint has been received and is in the queue',
          icon: <AssignmentIcon />,
        },
        {
          id: 'under_review',
          title: 'Under Review',
          description: 'Admin is reviewing your complaint',
          icon: <ScheduleIcon />,
        },
        {
          id: 'in_progress',
          title: 'In Progress',
          description: 'Admin is working on resolving your complaint',
          icon: <CheckCircleIcon />,
        },
        {
          id: 'resolved',
          title: 'Resolved',
          description: 'Your complaint has been resolved',
          icon: <DoneIcon />,
        },
      ];
    } else {
      // Result issue stages
      return [
        {
          id: 'submitted',
          title: 'Issue Reported',
          description: 'Your result issue has been submitted and is queued for review',
          icon: <AssignmentIcon />,
        },
        {
          id: 'under_review',
          title: 'Under Review',
          description: 'Academic office is reviewing your result issue',
          icon: <ScheduleIcon />,
        },
        {
          id: 'in_progress',
          title: 'Being Processed',
          description: 'Your result issue is being processed by the relevant department',
          icon: <CheckCircleIcon />,
        },
        {
          id: 'resolved',
          title: 'Issue Resolved',
          description: 'Your result issue has been resolved and grades have been updated',
          icon: <DoneIcon />,
        },
      ];
    }
  };

  // CRITICAL FIX: Enhanced status mapping to determine current stage
  const getCurrentStageIndex = () => {
    const status = (item.status || '').toLowerCase().replace(/\s+/g, '');
    
    // Map various status values to progress stages
    switch (status) {
      case 'queued':
      case 'pending':
      case 'submitted':
        return 0; // Just submitted
      case 'under_review':
      case 'reviewing':
        return 1; // Under review
      case 'inprogress':
      case 'in_progress':
      case 'processing':
        return 2; // In progress
      case 'resolved':
      case 'completed':
      case 'done':
      case 'finished':
        return 3; // Resolved - FINAL STAGE
      case 'closed':
      case 'inactive':
        return 3; // Also treat as final stage
      default:
        // If status doesn't match known values, try to infer from admin logs
        const logs = item.admin_logs || [];
        const hasResolvedLog = logs.some((log: string) => 
          log.toLowerCase().includes('resolved') || 
          log.toLowerCase().includes('completed') ||
          log.toLowerCase().includes('status to resolved')
        );
        
        if (hasResolvedLog) {
          return 3; // Resolved
        }
        
        const hasInProgressLog = logs.some((log: string) => 
          log.toLowerCase().includes('in progress') || 
          log.toLowerCase().includes('processing')
        );
        
        if (hasInProgressLog) {
          return 2; // In progress
        }
        
        return 0; // Default to submitted
    }
  };

  const stages = getProgressStages();
  const currentStageIndex = getCurrentStageIndex();

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getItemTitle = () => {
    if (item.type === 'complaint') {
      return item.subject || 'Complaint';
    } else {
      return `${item.course_code || 'Course'} - ${item.course_title || item.courseTitle || 'Course Title'}`;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Progress Tracking
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Item Details */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              {getItemTitle()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status: <strong>{item.status}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted: {formatDate(item.date_submitted)}
            </Typography>
            {item.description && (
              <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  {item.description}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Progress Timeline */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Progress Timeline
            </Typography>
            <TimelineContainer>
              {stages.map((stage, index) => {
                const stageStatus = getStageStatus(index);
                return (
                  <TimelineItem key={stage.id} status={stageStatus}>
                    <TimelineDot status={stageStatus} />
                    <TimelineContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {stage.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {stage.description}
                      </Typography>
                      {stageStatus === 'completed' && (
                        <Typography variant="caption" color="success.main">
                          ✓ Completed
                        </Typography>
                      )}
                      {stageStatus === 'current' && (
                        <Typography variant="caption" color="primary.main">
                          ● Current Stage
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </TimelineContainer>
          </Box>

          <Divider />

          {/* Admin Activity Logs */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Activity Log
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'grey.50', borderRadius: 1, p: 2 }}>
              {item.admin_logs && item.admin_logs.length > 0 ? (
                <Stack spacing={1}>
                  {item.admin_logs.map((log: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ 
                      borderBottom: index < item.admin_logs.length - 1 ? '1px solid #e0e0e0' : 'none',
                      pb: index < item.admin_logs.length - 1 ? 1 : 0
                    }}>
                      {log}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No activity recorded yet.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Debug Info - Current Stage Index: {currentStageIndex}, Status: "{item.status}"
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressModal;