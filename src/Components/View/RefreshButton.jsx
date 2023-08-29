import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

export const RefreshButton = ({ onClick, loading }) => {
    return (
        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={onClick}
                disabled={loading}
            >
                {loading ? <CircularProgress size={20} style={{ alignItems: 'center' }} color="inherit" /> : 'AGGIORNA'}
            </Button>
        </div>
    );
};