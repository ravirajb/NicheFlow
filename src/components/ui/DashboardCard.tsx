import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  styled,
  useTheme,
} from '@mui/material';
import { NicheCard } from './NicheCard';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  changeText?: string;
  sx?: any;
}

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing(2)};
  height: 100%;
`;

const StyledIcon = styled(Box)<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.palette.common.white};
`;

const StyledValue = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
`;

const StyledChange = styled(Typography)`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
  changeText,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...sx,
        height: '100%',
        minHeight: 160,
      }}
    >
      <StyledCardContent>
        <StyledIcon color={color}>{icon}</StyledIcon>
        <StyledValue>{value}</StyledValue>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        {change !== undefined && (
          <StyledChange
            sx={{
              color: change >= 0 ? theme.palette.success.main : theme.palette.error.main,
            }}
          >
            {changeText || (change >= 0 ? '+ ' : '- ')}
            {Math.abs(change)}%
          </StyledChange>
        )}
      </StyledCardContent>
    </Card>
  );
};
