import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  InventoryOutlined,
  PeopleOutline,
  AssignmentOutlined,
  ErrorOutline,
  BuildOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { useAxios } from '../hooks/useAxios';

interface DashboardMetrics {
  assets: {
    total: number;
    available: number;
    assigned: number;
    utilization_rate: number;
  };
  maintenance: {
    total_in_maintenance: number;
    avg_cost: number;
    total_cost: number;
  };
  lifecycle: {
    avg_age_days: number;
    total_value: number;
  };
  requests: {
    total: number;
    pending: number;
    approved: number;
    approval_rate: number;
  };
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/reports/metrics/dashboard/');
        if (!response.data || !response.data.assets) {
          throw new Error('Invalid metrics data received');
        }
        setMetrics(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err.response?.data?.error || 'Failed to load dashboard data');
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axios]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!metrics || !metrics.assets) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="warning">No data available</Alert>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Asset Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assets"
            value={metrics?.assets?.total || 0}
            icon={<InventoryOutlined fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Assets"
            value={metrics?.assets?.assigned || 0}
            icon={<AssignmentOutlined fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Maintenance"
            value={metrics?.maintenance?.total_in_maintenance || 0}
            icon={<BuildOutlined fontSize="large" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilization Rate"
            value={`${metrics?.assets?.utilization_rate || 0}%`}
            icon={<TrendingUpOutlined fontSize="large" />}
            color="info.main"
          />
        </Grid>

        {/* Additional Stats */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Asset Lifecycle
            </Typography>
            <Typography>
              Average Age: {metrics?.lifecycle?.avg_age_days || 0} days
            </Typography>
            <Typography>
              Total Value: ${metrics?.lifecycle?.total_value?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance
            </Typography>
            <Typography>
              Average Cost: ${metrics?.maintenance?.avg_cost?.toLocaleString() || 0}
            </Typography>
            <Typography>
              Total Cost: ${metrics?.maintenance?.total_cost?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Requests
            </Typography>
            <Typography>
              Pending: {metrics?.requests?.pending || 0}
            </Typography>
            <Typography>
              Approval Rate: {metrics?.requests?.approval_rate || 0}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
