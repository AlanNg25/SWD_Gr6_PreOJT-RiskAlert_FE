import { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, Typography, Box, Grid, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const RiskAnalysisChart = ({ riskAnalys = [] }) => {
    // Xử lý dữ liệu
    const { finalData, stats, studentDetails } = useMemo(() => {
        const riskLevelMap = {
            "1": 1,
            "2": 2,
            "3": 3
        };

        // Lọc dữ liệu không bị xóa
        const chartData = Array.isArray(riskAnalys)
            ? riskAnalys
                .filter((risk) => !risk.isDeleted)
                .map((risk) => ({
                    date: new Date(risk.trackingDate).toLocaleDateString('vi-VN'),
                    level: riskLevelMap[risk.riskLevel] || 0,
                    student: risk.student, // Lưu thông tin sinh viên
                }))
            : [];

        // Nhóm dữ liệu theo ngày
        const grouped = {};
        chartData.forEach(({ date, level }) => {
            if (!grouped[date]) {
                grouped[date] = { total: 0, count: 0 };
            }
            grouped[date].total += level;
            grouped[date].count += 1;
        });

        // Tính trung bình rủi ro theo ngày
        const finalData = Object.entries(grouped).map(([date, { total, count }]) => ({
            date,
            avgRisk: total / count,
        }));

        // Thống kê số lượng theo mức độ rủi ro
        const riskCounts = { Low: 0, Moderate: 0, High: 0 };
        riskAnalys
            .filter((risk) => !risk.isDeleted)
            .forEach((risk) => {
                const riskLevel = risk.riskLevel === "1" ? "Low"
                    : risk.riskLevel === "2" ? "Moderate"
                        : risk.riskLevel === "3" ? "High" : "High";
                riskCounts[riskLevel]++;
            });

        // Thu thập chi tiết sinh viên theo mức độ rủi ro
        const studentDetails = {
            Low: [],
            Moderate: [],
            High: [],
        };
        chartData.forEach(({ student, level }) => {
            const riskLevel = level === 1 ? 'Low' : level === 2 ? 'Moderate' : 'High';
            if (!studentDetails[riskLevel].some((s) => s.userID === student.userID)) {
                studentDetails[riskLevel].push(student);
            }
        });

        return { finalData, stats: riskCounts, studentDetails };
    }, [riskAnalys]);

    const getRiskColor = (level) => {
        switch (level) {
            case 'Low':
                return '#4caf50';
            case 'Moderate':
                return '#ff9800';
            case 'High':
                return '#f44336';
            default:
                return '#2196f3';
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
                Student Risk Analysis Dashboard
            </Typography>

            {/* Thống kê tổng quan */}
            <Grid container spacing={3} sx={{ mb: 4 }} flex={1} display={'flex'} justifyContent={'space-around'}>
                {['Low', 'Moderate', 'High'].map((level) => (
                    <Grid item xs={12} md={4} key={level}>
                        <Card sx={{ bgcolor: getRiskColor(level) + '22', borderLeft: `4px solid ${getRiskColor(level)}` }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: getRiskColor(level), fontWeight: 'bold' }}>
                                    {level} Risk
                                </Typography>
                                <Typography variant="h3" sx={{ color: getRiskColor(level), fontWeight: 'bold' }}>
                                    {stats[level]}
                                </Typography>
                                <Typography variant="body2" sx={{ color: getRiskColor(level) }}>
                                    students
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Biểu đồ */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={'bold'} gutterBottom>
                        Average Risk Level Over Time
                    </Typography>
                    {finalData.length > 0 ? (
                        <LineChart
                            xAxis={[
                                {
                                    data: finalData.map((item) => item.date),
                                    label: 'Tracking Date',
                                    scaleType: 'point',
                                },
                            ]}
                            series={[
                                {
                                    data: finalData.map((item) => Number(item.avgRisk.toFixed(2))),
                                    label: 'Average Risk Level',
                                    color: '#1976d2',
                                    showMark: true,
                                    curve: 'linear',
                                },
                            ]}
                            height={300}
                            margin={{ left: 50, right: 50, top: 50, bottom: 80 }}
                            grid={{ vertical: true, horizontal: true }}
                            tooltip={{ trigger: 'item' }}
                        />
                    ) : (
                        <Typography color="text.secondary" align="center">
                            No data available for the chart
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Bảng dữ liệu rủi ro */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={'bold'} gutterBottom>
                        Risk Level Data
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Average Risk Score</TableCell>
                                    <TableCell>Risk Level</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {finalData.map((item, index) => {
                                    const avgRisk = Number(item.avgRisk);
                                    let riskLevel = 'Low';
                                    let chipColor = 'success';
                                    if (avgRisk > 2.5) {
                                        riskLevel = 'High';
                                        chipColor = 'error';
                                    } else if (avgRisk > 1.5) {
                                        riskLevel = 'Moderate';
                                        chipColor = 'warning';
                                    }
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{avgRisk.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Chip label={riskLevel} color={chipColor} size="small" variant="outlined" />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Bảng chi tiết sinh viên theo mức độ rủi ro */}
            {['High', 'Moderate', 'Low'].map((level) => (
                studentDetails[level].length > 0 && (
                    <Card sx={{ mb: 4 }} key={level}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={'bold'} gutterBottom>
                                {level} Risk Students
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Student Code</TableCell>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {studentDetails[level].map((student) => (
                                            <TableRow key={student.userID}>
                                                <TableCell>{student.code}</TableCell>
                                                <TableCell>{student.fullName}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>{student.phone}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )
            ))}

            {/* Ghi chú */}
            <Paper sx={{ p: 2, mt: 3, bgcolor: '#e3f2fd', border: '1px solid #bbdefb' }}>
                <Typography variant="subtitle2" sx={{ color: '#1565c0', fontWeight: 'bold', mb: 1 }}>
                    Risk Level Scale:
                </Typography>
                <Box component="ul" sx={{ color: '#1976d2', fontSize: '0.875rem', m: 0, pl: 2 }}>
                    <li><strong>Low (1)</strong>: Student performing well</li>
                    <li><strong>Moderate (2)</strong>: Student needs monitoring</li>
                    <li><strong>High (3)</strong>: Student at risk, immediate attention needed</li>
                </Box>
            </Paper>
        </Box>
    );
};

export default RiskAnalysisChart;