import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface MFHolding {
  fundName: string;
  category: string;
  currentValue: number;
  units: number;
  nav: number;
}

interface EligibilityCheck {
  eligibleAmount: number;
  totalMFValue: number;
  checkDate: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mfHoldings, setMFHoldings] = useState<MFHolding[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch MF holdings
        const holdingsResponse = await axios.get(
          `http://localhost:5000/api/mf/holdings?pan=${user.pan}`
        );
        setMFHoldings(holdingsResponse.data.holdings);
        setTotalValue(holdingsResponse.data.totalValue);

        // Fetch eligibility check history
        const historyResponse = await axios.get(
          'http://localhost:5000/api/eligibility/history'
        );
        setEligibilityChecks(historyResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleCheckEligibility = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/eligibility/check', {
        pan: user?.pan,
      });
      setEligibilityChecks([response.data, ...eligibilityChecks]);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">Welcome, {user?.name}</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Mutual Fund Holdings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fund Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Current Value</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>NAV</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mfHoldings.map((holding, index) => (
                  <TableRow key={index}>
                    <TableCell>{holding.fundName}</TableCell>
                    <TableCell>{holding.category}</TableCell>
                    <TableCell>₹{holding.currentValue.toLocaleString()}</TableCell>
                    <TableCell>{holding.units}</TableCell>
                    <TableCell>₹{holding.nav.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Value: ₹{totalValue.toLocaleString()}
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Loan Eligibility</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckEligibility}>
              Check Eligibility
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total MF Value</TableCell>
                  <TableCell>Eligible Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eligibilityChecks.map((check, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(check.checkDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{check.totalMFValue.toLocaleString()}</TableCell>
                    <TableCell>₹{check.eligibleAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 