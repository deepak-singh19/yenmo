import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';
import { mfAPI, loanAPI } from '../services/api';

interface MFHolding {
  fund_name: string;
  category: string;
  current_value: number;
  units: number;
  nav: number;
}

interface EligibilityCheck {
  loan_amount: number;
  amount: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mfHoldings, setMFHoldings] = useState<MFHolding[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityCheck[]>([]);
  const [loading, setLoading] = useState(true);


  // useEffect(()=>{console.log("MF HO", mfHoldings)},[mfHoldings])
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [holdingsResponse, historyResponse] = await Promise.all([
          mfAPI.getHoldings(user.pan),
          loanAPI.getHistory(user.pan)
        ]);

        setMFHoldings(holdingsResponse.data.holdings);
        setTotalValue(holdingsResponse.data.total_value);
        setEligibilityChecks(historyResponse.data.history);
      } catch (error) {
        console.error('Error fetching data:', error);
        setEligibilityChecks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleCheckEligibility = async () => {
    try {
      const response = await loanAPI.checkEligibility(user?.pan || '');
      setEligibilityChecks(prevChecks => [...prevChecks, {
        loan_amount: response.data.loan_amount,
        amount: totalValue,
        date: new Date().toISOString()
      }]);
      if(response.data.eligible){
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
    );
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
                    <TableCell>{holding.fund_name}</TableCell>
                    <TableCell>{holding.category}</TableCell>
                    <TableCell>₹{holding.current_value
                    }</TableCell>
                    <TableCell>{holding.units}</TableCell>
                    <TableCell>₹{holding.nav}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Value: ₹{totalValue}
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Loan Eligibility</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckEligibility}>
              Check Eligibility
            </Button>
          </Box>
          {eligibilityChecks && eligibilityChecks.length > 0 ? (
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
                      <TableCell>{new Date(check.date).toLocaleDateString()}</TableCell>
                      <TableCell>₹{(check.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>₹{(check.loan_amount || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 