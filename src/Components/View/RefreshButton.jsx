import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import reload from './../img/icon/reload.png'

export const RefreshButton = ({ onClick, loading }) => {
    return (
        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={onClick}
                disabled={loading}
            >
                {loading ? <CircularProgress size={20} style={{ alignItems: 'center' }} color="inherit" /> : <> reload images  <img src={reload} width={20} /></>}
            </Button>
        </div>
    );
};