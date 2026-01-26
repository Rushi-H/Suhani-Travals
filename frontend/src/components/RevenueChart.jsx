import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const RevenueChart = ({ stats }) => {
    if (!stats || !stats.revenueByVehicle) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No revenue data available</Typography>
            </Paper>
        );
    }

    const chartData = Object.entries(stats.revenueByVehicle).map(([vehicle, revenue]) => ({
        vehicle: vehicle.replace('Maruti Suzuki ', '').replace('Tata ', '').replace(' 12-seater', ''),
        revenue
    }));

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
                Daily Revenue by Vehicle
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vehicle" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => `₹${value}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ccc',
                            borderRadius: 8
                        }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#667eea" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                        ₹{stats.totalRevenue}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Total Revenue Today
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                        {stats.todayBookings}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Bookings Today
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="info.main">
                        {stats.occupancyRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Occupancy Rate
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default RevenueChart;
