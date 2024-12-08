import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAxios } from '../hooks/useAxios';

interface Asset {
  id: number;
  name: string;
  category: number;
  status: string;
  department: number;
  purchase_date: string;
  value: number;
  specifications: any;
  location: string;
}

interface Category {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    department: '',
  });

  const axios = useAxios();

  const fetchAssets = async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        search: searchTerm,
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        ...(filters.department && { department: filters.department }),
      });

      const response = await axios.get(`/api/assets/?${params}`);
      setAssets(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error: any) {
      console.error('Error fetching assets:', error);
      setError(error.response?.data?.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/categories/');
      setCategories(response.data.results || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Failed to fetch categories');
    }
  };

  const fetchDepartments = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/departments/');
      setDepartments(response.data.results || []);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      setError(error.response?.data?.message || 'Failed to fetch departments');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAssets(),
        fetchCategories(),
        fetchDepartments(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [page, searchTerm, filters]);

  const handleCreateOrUpdate = async (asset: Partial<Asset>) => {
    try {
      setError(null);
      if (selectedAsset) {
        await axios.patch(`/api/assets/${selectedAsset.id}/`, asset);
      } else {
        await axios.post('/api/assets/', asset);
      }
      setOpenDialog(false);
      fetchAssets();
    } catch (error: any) {
      console.error('Error saving asset:', error);
      setError(error.response?.data?.message || 'Failed to save asset');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        setError(null);
        await axios.delete(`/api/assets/${id}/`);
        fetchAssets();
      } catch (error: any) {
        console.error('Error deleting asset:', error);
        setError(error.response?.data?.message || 'Failed to delete asset');
      }
    }
  };

  const AssetDialog = () => {
    const [formData, setFormData] = useState<Partial<Asset>>(
      selectedAsset || {
        name: '',
        category: 0,
        status: '',
        department: 0,
        purchase_date: '',
        value: 0,
        location: '',
      }
    );

    return (
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAsset ? 'Edit Asset' : 'Create New Asset'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) })}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="IN_USE">In Use</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="RETIRED">Retired</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: Number(e.target.value) })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Purchase Date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              fullWidth
              required
            />
            <TextField
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleCreateOrUpdate(formData)} color="primary">
            {selectedAsset ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Assets</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedAsset(null);
            setOpenDialog(true);
          }}
        >
          Add Asset
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box mb={3}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
        />
        <FormControl sx={{ mr: 2, minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="IN_USE">In Use</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
            <MenuItem value="RETIRED">Retired</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ mr: 2, minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === asset.category)?.name}
                  </TableCell>
                  <TableCell>{asset.status}</TableCell>
                  <TableCell>
                    {departments.find((d) => d.id === asset.department)?.name}
                  </TableCell>
                  <TableCell>{new Date(asset.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>${asset.value}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => {
                          setSelectedAsset(asset);
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(asset.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <AssetDialog />
    </Box>
  );
};

export default Assets;
