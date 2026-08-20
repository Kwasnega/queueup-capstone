import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Stack,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  getDatabase, 
  ref, 
  onValue, 
  remove,
  DatabaseReference 
} from 'firebase/database';
import { useFirebaseListenerManager } from './FirebaseListenerManager';

const db = getDatabase();

const StatusPill = styled('div')<{ status: string }>(({ theme, status }) => {
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase().replace(/\s/g, '')) {
      case 'queued':
        return { background: '#bfdbfe', color: '#1e3a8a' };
      case 'inprogress':
        return { background: '#fef3c7', color: '#713f12' };
      case 'resolved':
        return { background: '#dcfce7', color: '#14532d' };
      case 'closed':
        return { background: '#e5e7eb', color: '#374151' };
      case 'inactive':
        return { background: '#f3f4f6', color: '#6b7280' };
      default:
        return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  const colors = getStatusColors(status);
  return {
    backgroundColor: colors.background,
    color: colors.color,
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-block',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
  };
});

interface TrackingModalProps {
  open: boolean;
  onClose: () => void;
  type: 'complaints' | 'results';
  studentId: string;
  onProgressClick: (item: any) => void;
  onShowSnackbar: (message: string, severity: 'success' | 'error' | 'info') => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({
  open,
  onClose,
  type,
  studentId,
  onProgressClick,
  onShowSnackbar
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Use the Firebase listener manager for proper cleanup
  const listenerManager = useFirebaseListenerManager();

  // Setup listener when modal opens with proper cleanup
  const setupListener = useCallback(() => {
    if (!open || !studentId) return;

    const path = type === 'complaints' ? `complaints/${studentId}` : `result_issues/${studentId}`;
    const itemsRef = ref(db, path);
    const listenerKey = `tracking-modal-${type}-${studentId}`;
    
    // Create a new listener with proper error handling
    try {
      const unsubscribe = onValue(itemsRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const itemsArray = Object.entries(data).map(([id, item]: [string, any]) => ({
              id,
              ...item
            }));
            // Sort by date submitted (newest first)
            itemsArray.sort((a, b) => new Date(b.date_submitted).getTime() - new Date(a.date_submitted).getTime());
            setItems(itemsArray);
          } else {
            setItems([]);
          }
          setLoading(false);
        } catch (processingError) {
          console.error('Error processing snapshot:', processingError);
          setItems([]);
          setLoading(false);
        }
      }, (error) => {
        console.error(`${type} listener error:`, error);
        setItems([]);
        setLoading(false);
        onShowSnackbar(`Error loading ${type}`, 'error');
      });

      // Add listener to manager for proper cleanup
      listenerManager.addListener(listenerKey, unsubscribe);
    } catch (setupError) {
      console.error('Error setting up listener:', setupError);
      setLoading(false);
      onShowSnackbar(`Error setting up ${type} listener`, 'error');
    }
  }, [open, studentId, type, onShowSnackbar, listenerManager]);

  // Setup listener when modal opens
  useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      // Small delay to ensure proper cleanup of previous listeners
      const timeoutId = setTimeout(() => {
        setupListener();
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // Clean up listeners when modal closes
      listenerManager.removeAllListeners();
      setItems([]);
      setLoading(false);
    }
  }, [open, studentId, setupListener, listenerManager]);

  const handleDelete = async (itemId: string) => {
    try {
      // CRITICAL FIX: Ensure proper deletion from both locations
      const flatPath = type === 'complaints' ? `complaints/${itemId}` : `result_issues/${itemId}`;
      const studentPath = type === 'complaints' 
        ? `complaints/${studentId}/${itemId}` 
        : `result_issues/${studentId}/${itemId}`;
      
      // Find the item to get its unique_id if different from itemId
      const item = items.find(i => i.id === itemId);
      const alternativeFlatPath = item?.unique_id && item.unique_id !== itemId 
        ? (type === 'complaints' ? `complaints/${item.unique_id}` : `result_issues/${item.unique_id}`)
        : null;
      
      // Delete from all possible locations
      const deletePromises = [
        remove(ref(db, flatPath)),
        remove(ref(db, studentPath))
      ];
      
      // Also try alternative path if unique_id exists
      if (alternativeFlatPath) {
        deletePromises.push(remove(ref(db, alternativeFlatPath)));
      }
      
      await Promise.all(deletePromises.map(p => p.catch(e => console.debug('Delete path not found:', e))));
      
      console.log(`Deleted ${type === 'complaints' ? 'complaint' : 'result issue'} from:`, {
        flatPath,
        studentPath,
        alternativeFlatPath
      });
      
      onShowSnackbar(`${type === 'complaints' ? 'Complaint' : 'Result issue'} deleted successfully`, 'success');
    } catch (error) {
      console.error('Delete error:', error);
      onShowSnackbar(`Error deleting ${type === 'complaints' ? 'complaint' : 'result issue'}`, 'error');
    }
  };

  const handleClose = () => {
    // Clean up all listeners before closing
    listenerManager.removeAllListeners();
    setItems([]);
    setLoading(false);
    
    // Call onClose immediately - the delay was causing issues
    onClose();
  };

  const getItemTitle = (item: any) => {
    if (type === 'complaints') {
      return item.subject || 'Complaint';
    } else {
      return `${item.course_code || 'Course'} - ${item.course_title || 'Course Title'}`;
    }
  };

  const getItemDescription = (item: any) => {
    if (type === 'complaints') {
      return item.text || item.description || 'No description';
    } else {
      return item.description || 'No description';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Track {type === 'complaints' ? 'Complaints' : 'Results Issues'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {loading ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Loading...
            </Typography>
          ) : items.length > 0 ? (
            <List>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {getItemTitle(item)}
                          </Typography>
                          <StatusPill 
                            status={item.status}
                            onClick={() => onProgressClick({ type: type.slice(0, -1), ...item })}
                          >
                            {item.status}
                          </StatusPill>
                        </Stack>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {getItemDescription(item)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.date_submitted).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        color="error"
                        onClick={() => handleDelete(item.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No {type === 'complaints' ? 'complaints' : 'results issues'} submitted yet.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrackingModal;