import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Modal, Button, createTheme, ThemeProvider, CssBaseline, TextField, AppBar, Toolbar } from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';

const DataTable = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode') || 'false'));
    const [tableState, setTableState] = useState(JSON.parse(localStorage.getItem('tableState') || '{}'));
    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/photos?_limit=100')
            .then(response => {
                const formattedData = response.data.map(item => ({
                    id: item.id,
                    image: item.thumbnailUrl, // Small image
                    largeImage: item.url, // Large image
                    description: item.title,
                    date: new Date().toISOString().split('T')[0],
                    number: item.id
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('tableState', JSON.stringify(tableState));
    }, [tableState]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const handleRowClick = (params) => {
        // Placeholder for row click behavior if needed
    };

    const handleImageClick = (largeImage) => {
        setSelectedImage(largeImage);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchText(searchTerm);
        const filtered = rows.filter(row => {
            return (
                row.description.toLowerCase().includes(searchTerm) ||
                row.date.toLowerCase().includes(searchTerm) ||
                row.number.toString().includes(searchTerm)
            );
        });
        setFilteredRows(filtered);
    };

    const columns = [
        {
            field: 'image', headerName: 'Image', width: 150,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt="img"
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => handleImageClick(params.row.largeImage)} // Pass large image URL
                />
            )
        },
        {
            field: 'description', headerName: 'Description', width: 200,
            renderCell: (params) => (
                <div style={{
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'date', headerName: 'Date', width: 150,
            renderCell: (params) => (
                <div style={{
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'number', headerName: 'Number', width: 100,
            renderCell: (params) => (
                <div style={{
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}>
                    {params.value}
                </div>
            )
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <TextField
                        variant="outlined"
                        placeholder='Search'
                        value={searchText}
                        onChange={handleSearch}
                        style={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
                            borderRadius: '5px',
                            color: theme.palette.text.primary
                        }}
                        InputProps={{
                            startAdornment: <Search style={{ color: theme.palette.text.primary }} />,
                        }}
                    />
                    <Button color="inherit" onClick={() => setDarkMode(!darkMode)}>
                        {'Toggle Theme'}
                    </Button>
                </Toolbar>
            </AppBar>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={handleRowClick}
                    autoHeight
                    getRowHeight={() => 'auto'}
                    initialState={tableState}
                    components={{ Toolbar: GridToolbar }}
                />
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                        <img src={selectedImage} alt="img" style={{ width: '100%' }} />
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

export default DataTable;
