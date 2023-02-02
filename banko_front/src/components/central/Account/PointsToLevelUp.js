import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function PointsToLevelUp(props) {
    return (
        <Box p={1}>
            {props.nextLevel && (
                <Typography align="center" variant="h5" color="primary">
                    <Typography
                        variant="inherit"
                        color="secondary"
                        mx={1}
                        sx={{ textDecoration: 'underline' }}
                        display="inline"
                    >
                        {props.left}
                    </Typography>
                    left to become
                    <Typography
                        variant="inherit"
                        color="secondary"
                        mx={1}
                        sx={{ textDecoration: 'underline' }}
                        display="inline"
                    >
                        {props.nextLevel}
                    </Typography>
                </Typography>
            )}

            <Typography align="center" variant="h5" color="primary">
                Total:
                <Typography
                    variant="inherit"
                    color="secondary"
                    mx={1}
                    sx={{ textDecoration: 'underline' }}
                    display="inline"
                >
                    {props.total}
                </Typography>
            </Typography>
        </Box>
    )
}

export default PointsToLevelUp
