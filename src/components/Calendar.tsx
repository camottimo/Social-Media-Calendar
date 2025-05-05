import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { DailySchedule, SocialMediaAccount } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

interface CalendarProps {
  accounts: SocialMediaAccount[];
  weeklySchedule: DailySchedule[];
  onUpdateContent: (day: string, accountId: string, postId: string, newContent: string) => void;
  onTogglePost: (day: string, accountId: string, postId: string) => void;
  onDeleteAccount: (accountId: string) => void;
  onUpdateHashtags: (accountId: string, newHashtags: string[]) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  accounts, 
  weeklySchedule, 
  onUpdateContent,
  onTogglePost,
  onDeleteAccount,
  onUpdateHashtags
}) => {
  const [editingCell, setEditingCell] = useState<{ day: string; accountId: string; postId: string } | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Manage hashtag input state per account
  const [hashtagInputs, setHashtagInputs] = useState<{ [accountId: string]: string }>({});

  const calculateTotalMonthlyEarnings = () => {
    return accounts.reduce((total, account) => total + account.monthlyEarnings, 0);
  };

  const handleEditClick = (day: string, accountId: string, postId: string, currentContent: string) => {
    setEditingCell({ day, accountId, postId });
    setEditedContent(currentContent);
  };

  const handleSaveClick = () => {
    if (editingCell) {
      onUpdateContent(editingCell.day, editingCell.accountId, editingCell.postId, editedContent);
      setEditingCell(null);
    }
  };

  const getPostsForDay = (day: string, accountId: string) => {
    const daySchedule = weeklySchedule.find(schedule => schedule.day === day);
    if (!daySchedule) return [];
    
    const accountSchedule = daySchedule.accounts.find(acc => acc.accountId === accountId);
    return accountSchedule?.posts || [];
  };

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }}
              >
                Account
              </TableCell>
              <TableCell
                sx={{
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }}
              >
                Hashtags
              </TableCell>
              <TableCell 
                sx={{ 
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }}
              >
                Platform
              </TableCell>
              <TableCell 
                sx={{ 
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }}
              >
                Phone Device
              </TableCell>
              <TableCell 
                sx={{ 
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }}
              >
                Posts/Day
              </TableCell>
              {weeklySchedule.map((day, index) => {
                // Calculate total and completed posts for this day
                const dayStats = day.accounts.reduce((stats, account) => {
                  const totalPosts = account.posts.length;
                  const completedPosts = account.posts.filter(post => post.completed).length;
                  return {
                    total: stats.total + totalPosts,
                    completed: stats.completed + completedPosts
                  };
                }, { total: 0, completed: 0 });

                return (
                  <TableCell 
                    key={day.day} 
                    align="center"
                    sx={{ 
                      borderRight: index < weeklySchedule.length - 1 ? '1px solid rgba(224, 224, 224, 1)' : 'none',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {day.day}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayStats.completed}/{dayStats.total} posts
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => {
              return (
                <TableRow key={account.id}>
                  <TableCell 
                    sx={{ 
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {account.username}
                        <Tooltip title="Delete Account">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteAccount(account.id)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        {account.contact.email || account.contact.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                      minWidth: 180,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {account.hashtags.map((tag, idx) => (
                        <Chip
                          key={tag + idx}
                          label={tag}
                          onDelete={() => {
                            const newTags = account.hashtags.filter((_, i) => i !== idx);
                            onUpdateHashtags(account.id, newTags);
                          }}
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        size="small"
                        value={hashtagInputs[account.id] || ''}
                        onChange={e => setHashtagInputs(inputs => ({ ...inputs, [account.id]: e.target.value }))}
                        placeholder="#hashtag"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && (hashtagInputs[account.id] || '').trim()) {
                            const newTags = [...account.hashtags, (hashtagInputs[account.id] || '').trim()];
                            onUpdateHashtags(account.id, newTags);
                            setHashtagInputs(inputs => ({ ...inputs, [account.id]: '' }));
                            e.preventDefault();
                          }
                        }}
                        sx={{ minWidth: 100 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}
                  >
                    {account.platform}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}
                  >
                    {account.phoneDevice}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}
                  >
                    {account.postsPerDay}
                  </TableCell>
                  {weeklySchedule.map((day, index) => {
                    const posts = getPostsForDay(day.day, account.id);

                    return (
                      <TableCell 
                        key={`${day.day}-${account.id}`}
                        sx={{ 
                          minWidth: '200px',
                          height: '200px',
                          position: 'relative',
                          borderRight: index < weeklySchedule.length - 1 ? '1px solid rgba(224, 224, 224, 1)' : 'none',
                        }}
                      >
                        <List dense>
                          {posts.map((post, index) => {
                            const isEditing = editingCell?.day === day.day && 
                                           editingCell?.accountId === account.id &&
                                           editingCell?.postId === post.id;

                            return (
                              <ListItem
                                key={post.id}
                                sx={{
                                  textDecoration: post.completed ? 'line-through' : 'none',
                                  opacity: post.completed ? 0.7 : 1,
                                }}
                              >
                                {isEditing ? (
                                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                      fullWidth
                                      value={editedContent}
                                      onChange={(e) => setEditedContent(e.target.value)}
                                      size="small"
                                    />
                                    <IconButton
                                      onClick={handleSaveClick}
                                      color="primary"
                                      size="small"
                                    >
                                      <SaveIcon />
                                    </IconButton>
                                  </Box>
                                ) : (
                                  <>
                                    <ListItemText 
                                      primary={`Post ${index + 1}`}
                                      secondary={post.content}
                                      sx={{ pr: 7 }}
                                      secondaryTypographyProps={{
                                        style: { wordBreak: 'break-word', whiteSpace: 'pre-line' },
                                        noWrap: false,
                                      }}
                                    />
                                    <ListItemSecondaryAction>
                                      <Checkbox
                                        edge="end"
                                        checked={post.completed}
                                        onChange={() => onTogglePost(day.day, account.id, post.id)}
                                      />
                                      <IconButton
                                        edge="end"
                                        onClick={() => handleEditClick(day.day, account.id, post.id, post.content)}
                                        size="small"
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </>
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Monthly Earnings Summary</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>Monthly Earnings</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.platform}</TableCell>
                  <TableCell>${account.monthlyEarnings.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}><strong>Total Monthly Earnings</strong></TableCell>
                <TableCell><strong>${calculateTotalMonthlyEarnings().toLocaleString()}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}; 