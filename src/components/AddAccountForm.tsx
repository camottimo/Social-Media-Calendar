import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import { SocialMediaAccount } from '../types';

interface AddAccountFormProps {
  onAddAccount: (account: Omit<SocialMediaAccount, 'id'>) => void;
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAddAccount }) => {
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    phoneDevice: '',
    monthlyEarnings: '',
    postsPerDay: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [errors, setErrors] = useState({
    contactEmail: '',
    contactPhone: '',
  });

  const validateForm = () => {
    const newErrors = {
      contactEmail: '',
      contactPhone: '',
    };

    if (!formData.contactEmail && !formData.contactPhone) {
      newErrors.contactEmail = 'Either email or phone is required';
      newErrors.contactPhone = 'Either email or phone is required';
    }

    setErrors(newErrors);
    return !newErrors.contactEmail && !newErrors.contactPhone;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newAccount: Omit<SocialMediaAccount, 'id'> = {
      platform: formData.platform as 'TikTok' | 'Instagram',
      username: formData.username,
      phoneDevice: formData.phoneDevice,
      monthlyEarnings: parseFloat(formData.monthlyEarnings),
      postsPerDay: parseInt(formData.postsPerDay),
      contact: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone || undefined,
      },
    };

    onAddAccount(newAccount);
    setFormData({
      platform: '',
      username: '',
      phoneDevice: '',
      monthlyEarnings: '',
      postsPerDay: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    });
    setErrors({
      contactEmail: '',
      contactPhone: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when either field is filled
    if (name === 'contactEmail' || name === 'contactPhone') {
      setErrors(prev => ({
        ...prev,
        contactEmail: '',
        contactPhone: '',
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Add New Account</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            name="platform"
            value={formData.platform}
            label="Platform"
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="TikTok">TikTok</MenuItem>
            <MenuItem value="Instagram">Instagram</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone Device"
          name="phoneDevice"
          value={formData.phoneDevice}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Monthly Earnings"
          name="monthlyEarnings"
          type="number"
          value={formData.monthlyEarnings}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Posts Per Day"
          name="postsPerDay"
          type="number"
          value={formData.postsPerDay}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>Contact Information</Typography>

        <TextField
          fullWidth
          label="Contact Name"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Contact Email"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
          error={!!errors.contactEmail}
          helperText={errors.contactEmail}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Contact Phone"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          error={!!errors.contactPhone}
          helperText={errors.contactPhone}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Add Account
        </Button>
      </Box>
    </Paper>
  );
}; 