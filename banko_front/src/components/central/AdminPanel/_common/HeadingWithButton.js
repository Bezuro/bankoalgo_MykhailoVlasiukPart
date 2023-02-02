import React from 'react'

import { useNavigate } from 'react-router-dom'
import { withPather } from 'react-pather'

import PropTypes from 'prop-types'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Tooltip from '@mui/material/Tooltip'

function HeadingWithButton(props) {
    const navigate = useNavigate()
    const pather = props.pather
    const name = props.name

    return (
        <Box sx={{ position: 'relative' }}>
            <Tooltip title="Back" placement="top">
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translate(0, -50%)',
                    }}
                    onClick={() => navigate(pather.admin)}
                >
                    <ArrowBackIcon color="primary" />
                </IconButton>
            </Tooltip>
            <Typography align="center" variant="h3" color="primary" my={2}>
                {name}
            </Typography>
        </Box>
    )
}

HeadingWithButton.propTypes = {
    pather: PropTypes.object.isRequired,
}

export default withPather()(HeadingWithButton)
