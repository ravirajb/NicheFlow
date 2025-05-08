import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Typography,
  Box,
  styled,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface NicheCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headerActions?: React.ReactNode;
  sx?: any;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

export const NicheCard: React.FC<NicheCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  headerActions,
  sx,
}) => {
  return (
    <StyledCard sx={sx}>
      <CardHeader
        title={title}
        subheader={subtitle}
        action={headerActions}
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: '1.125rem',
            fontWeight: 600,
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.875rem',
            color: 'text.secondary',
          },
        }}
      />
      <CardContent>{children}</CardContent>
      {actions && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>{actions}</CardActions>
      )}
    </StyledCard>
  );
};
