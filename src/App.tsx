import { useState, useEffect } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { Calendar } from './components/Calendar'
import { AddAccountForm } from './components/AddAccountForm'
import { SocialMediaAccount, DailySchedule } from './types'

function App() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<DailySchedule[]>([
    { day: 'Monday', accounts: [] },
    { day: 'Tuesday', accounts: [] },
    { day: 'Wednesday', accounts: [] },
    { day: 'Thursday', accounts: [] },
    { day: 'Friday', accounts: [] },
    { day: 'Saturday', accounts: [] },
    { day: 'Sunday', accounts: [] },
  ])

  // Load from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('accounts');
    const savedSchedule = localStorage.getItem('weeklySchedule');
    if (savedAccounts) {
      const parsed = JSON.parse(savedAccounts);
      // Migrate hashtags from string to array if needed
      const migrated = parsed.map((acc: any) => ({
        ...acc,
        hashtags: Array.isArray(acc.hashtags)
          ? acc.hashtags
          : acc.hashtags
          ? acc.hashtags.split(' ').filter((tag: string) => tag.trim() !== '')
          : [],
      }));
      setAccounts(migrated);
    }
    if (savedSchedule) setWeeklySchedule(JSON.parse(savedSchedule));
  }, []);

  // Save accounts to localStorage on change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Save weeklySchedule to localStorage on change
  useEffect(() => {
    localStorage.setItem('weeklySchedule', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  const handleAddAccount = (newAccount: Omit<SocialMediaAccount, 'id'>) => {
    const account: SocialMediaAccount = {
      ...newAccount,
      id: crypto.randomUUID(),
    }
    setAccounts(prev => [...prev, account])

    // Add the new account to each day's schedule with empty posts
    setWeeklySchedule(prev => prev.map(day => ({
      ...day,
      accounts: [
        ...day.accounts,
        {
          accountId: account.id,
          posts: Array(newAccount.postsPerDay).fill(null).map(() => ({
            id: crypto.randomUUID(),
            content: '',
            completed: false
          }))
        }
      ]
    })))
  }

  const handleDeleteAccount = (accountId: string) => {
    // Remove the account from the accounts list
    setAccounts(prev => prev.filter(account => account.id !== accountId))

    // Remove the account from the weekly schedule
    setWeeklySchedule(prev => prev.map(day => ({
      ...day,
      accounts: day.accounts.filter(account => account.accountId !== accountId)
    })))
  }

  const handleUpdateContent = (day: string, accountId: string, postId: string, newContent: string) => {
    setWeeklySchedule(prev => prev.map(daySchedule => {
      if (daySchedule.day === day) {
        return {
          ...daySchedule,
          accounts: daySchedule.accounts.map(account => {
            if (account.accountId === accountId) {
              return {
                ...account,
                posts: account.posts.map(post => {
                  if (post.id === postId) {
                    return { ...post, content: newContent };
                  }
                  return post;
                })
              }
            }
            return account
          })
        }
      }
      return daySchedule
    }))
  }

  const handleTogglePost = (day: string, accountId: string, postId: string) => {
    setWeeklySchedule(prev => prev.map(daySchedule => {
      if (daySchedule.day === day) {
        return {
          ...daySchedule,
          accounts: daySchedule.accounts.map(account => {
            if (account.accountId === accountId) {
              return {
                ...account,
                posts: account.posts.map(post => {
                  if (post.id === postId) {
                    return { ...post, completed: !post.completed };
                  }
                  return post;
                })
              }
            }
            return account
          })
        }
      }
      return daySchedule
    }))
  }

  const handleClearAllPostTitles = () => {
    setWeeklySchedule(prev => prev.map(daySchedule => ({
      ...daySchedule,
      accounts: daySchedule.accounts.map(account => ({
        ...account,
        posts: account.posts.map(post => ({
          ...post,
          content: ''
        }))
      }))
    })));
  };

  const handleUpdateHashtags = (accountId: string, newHashtags: string[]) => {
    setAccounts(prev => prev.map(account =>
      account.id === accountId ? { ...account, hashtags: newHashtags } : account
    ));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Social Media Content Calendar
        </Typography>
        <AddAccountForm onAddAccount={handleAddAccount} />
        <Button
          variant="outlined"
          color="warning"
          sx={{ mb: 2 }}
          onClick={handleClearAllPostTitles}
        >
          Clear All Post Titles
        </Button>
        <Calendar
          accounts={accounts}
          weeklySchedule={weeklySchedule}
          onUpdateContent={handleUpdateContent}
          onTogglePost={handleTogglePost}
          onDeleteAccount={handleDeleteAccount}
          onUpdateHashtags={handleUpdateHashtags}
        />
      </Box>
    </Container>
  )
}

export default App
