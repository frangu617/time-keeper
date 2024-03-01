import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';
import './App.css';
import {format} from 'date-fns'


function App() {
  const [location, setLocation] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true); // Initially set showLoadingSpinner to true

  useEffect(() => {
    // Start a 50-second timer to hide the loading spinner
    const timer = setTimeout(() => {
      setShowLoadingSpinner(false);
    }, 50000);

    fetchWorkLogs();

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  const fetchWorkLogs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/workLogs/all`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLogs(data.map(log => ({ ...log, time: format(new Date(log.time), 'MM/dd/yyyy hh:mm:ss a') }))); // Format time using date-fns
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching work logs:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };
  
//  useEffect(() => {
//     fetchWorkLogs();
//   }, []);
  const handleClockInOut = async () => {
    try {
      if (logs.length % 2 === 0) {
        if (!location.trim()) {
          alert('Please enter a location.');
          return;
        }
      } else {
        if (logs.length === 0) {
          alert('No clock-in found to clock out.');
          return;
        }
      }
  
      const type = logs.length % 2 === 0 ? 'Clock In' : 'Clock Out';
      const time = new Date().toLocaleString();
      const newLocation = type === 'Clock Out' ? logs[logs.length - 1].location : location;
      const newLog = { location: newLocation, type, time };
  
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/workLogs/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLog),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      fetchWorkLogs(); // Fetch updated logs after adding a new log
      if (type === 'Clock In') {
        setLocation('');
      }
    } catch (error) {
      console.error('Error clocking in/out:', error);
    }
  };
  

  const handleDelete = async (index) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/workLogs/${logs[index]._id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      fetchWorkLogs(); // Fetch updated logs after deleting a log
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };
  

  // Function to group logs by week
  const groupLogsByWeek = () => {
    const groupedLogs = {};
    logs.forEach(log => {
      const logDate = new Date(log.time);
      const weekStart = new Date(logDate);
      weekStart.setDate(logDate.getDate() - logDate.getDay() + (logDate.getDay() === 0 ? -6 : 1)); // Adjust to Monday of the current week
      weekStart.setHours(0, 0, 0, 0); // Set time to midnight

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 4); // Friday of the same week
      const weekRange = weekStart.toDateString() + '-' + weekEnd.toDateString();

      if (!groupedLogs[weekRange]) {
        groupedLogs[weekRange] = [];
      }
      groupedLogs[weekRange].push(log);
    });
    return groupedLogs;
  };

  return (
    <Container maxWidth="lg" className="container">
      <h1>Work Hours Tracker</h1>
      <TextField
        fullWidth
        label="Location"
        variant="outlined"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        margin="normal"
        disabled={logs.length > 0 && logs[logs.length - 1].type === 'Clock In'}
      />
      <Button variant="contained" color="primary" onClick={handleClockInOut}>
        Clock {logs.length % 2 === 0 ? 'In' : 'Out'}
      </Button>
      <div>
        {loading ? ( // Display loading spinner if loading is true
          <div className="loading-spinner">
            {showLoadingSpinner && <CircularProgress />} {/* Show the loading spinner if showLoadingSpinner is true */}
            {showLoadingSpinner && <p>Loading data...</p>} {/* Show loading message if showLoadingSpinner is true */}
            {!showLoadingSpinner && <p>Data loading is taking longer than expected...</p>} {/* Show message when loading takes more than 50 seconds */}
          </div>
        ) : (
          Object.entries(groupLogsByWeek()).map(([weekRange, logs]) => (
            <div key={weekRange}>
              <h2>{weekRange}</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.location}</TableCell>
                        <TableCell>{log.type}</TableCell>
                        <TableCell>{new Date(log.time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDelete(index)} aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}

export default App;
