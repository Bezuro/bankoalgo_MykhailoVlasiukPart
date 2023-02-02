import React from 'react'

import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'

import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'

import { withPather } from 'react-pather'

const tables = ['Algorithms', 'Groups', 'Languages', 'Levels', 'Tags', 'Users']

function AdminPanel(props) {
    const theme = useTheme()
    const mediaQuery = useMediaQuery(theme.breakpoints.only('xs'))

    const navigate = useNavigate()
    const pather = props.pather

    return (
        <Container
            maxWidth="xl"
            disableGutters={mediaQuery}
            component="section"
        >
            <Typography align="center" variant="h3" color="primary" my={2}>
                Admin Panel
            </Typography>
            <Grid container spacing={2}>
                {tables.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                        <Box
                            minHeight="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Link
                                onClick={() =>
                                    navigate(pather[`${item.toLowerCase()}`])
                                }
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    color="primary"
                                    align="center"
                                >
                                    {item}
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default withPather()(AdminPanel)
