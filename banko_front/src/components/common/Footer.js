import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Divider, Link } from '@mui/material'
import useTheme from '@mui/material/styles/useTheme'
import { useNavigate } from 'react-router-dom'

const tools = [
    {name: 'CSS generator', link: 'https://qwerty34-wq.github.io/CSSgenerator/', target: '_blank'},
    {name: 'PrePro'}, 
    {name: 'DeLang'},
    {name: 'Cated'} 
]

const contacts = [
    {name: 'Contact us', link: '/contacts', internal: true},
    {name: '@masterr314', link: 'https://github.com/masterr314', target: '_blank'},
    {name: '@Bezuro', link: 'https://github.com/Bezuro', target: '_blank'},
    {name: '@Staregeh', link: 'https://github.com/Staregeh', target: '_blank'},
]

const useful_links = [
    {name: 'About', link: '/about', internal: true},
    {name: 'Log in', link: '/login', internal: true},
    {name: 'Sign up', link: '/signup', internal: true},
]

const Footer = () => {

    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <Box component="footer" pt={4}>
            <Box>
                <Divider
                    style={{ backgroundColor: theme.palette.primary.main }}
                />
            </Box>
            <Grid
                container
                maxWidth="xl"
                justifyContent="space-between"
                py={3}
                px={{ md: 10, xs: 4 }}
                spacing={2}
            >
                {/* Logo */}
                <Grid item xs={12} md={3}>
                    <Box sx={{display: 'flex', flexDirection: 'column', rowGap: '10px'}}>
                        <Box>
                            <img
                                style={{
                                    width: '50%',
                                    height: 'auto',
                                }}
                                src="/images/Banko.png"
                                alt="Logo"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{fontSize: '15px'}}>
                                System for easily organizing and searching algorithms.
                                If you know a useful algorithm share it with other by adding it to <b>Banko</b>.
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                style={{
                                    width: '50%',
                                    height: 'auto',
                                }}
                                src="/images/netlify-badge.svg"
                                alt="Netlify"
                            />
                        </Box>
                    </Box>
                </Grid>
                {/* Other */}
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        {/* Tools */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="h6"
                                color={theme.palette.primary.main}
                            >
                                Other Tools
                            </Typography>
                            <Box>
                                {tools.map((page, index) => (
                                    <Link
                                        key={index}
                                        href={!!page?.link ? page.link : '#'}
                                        underline="hover"
                                        sx={{
                                            mt: 1,
                                            color: 'white',
                                            display: 'block',
                                        }}
                                        target={!!page?.target && page?.target}
                                        rel="noreferrer"
                                    >
                                        {page?.name}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                        {/* Links */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="h6"
                                color={theme.palette.primary.main}
                            >
                                Useful links
                            </Typography>
                            <Box>
                                {useful_links.map((page, index) => (
                                    !!page?.internal 
                                    ?
                                        <Link
                                            key={index}
                                            underline="hover"
                                            sx={{
                                                mt: 1,
                                                color: 'white',
                                                display: 'block',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => navigate(page?.link)}
                                        >
                                            {page.name}
                                        </Link>
                                    :
                                        <Link
                                            key={index}
                                            href={!!page?.link ? page.link : '#'}
                                            underline="hover"
                                            sx={{
                                                mt: 1,
                                                color: 'white',
                                                display: 'block',
                                            }}
                                            target={!!page?.target && page?.target}
                                            rel="noreferrer"
                                        >
                                            {page.name}
                                        </Link>
                                ))}
                            </Box>
                        </Grid>
                        {/* Contacts */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="h6"
                                color={theme.palette.primary.main}
                            >
                                Contacts
                            </Typography>
                            <Box>
                                {contacts.map((page, index) => (
                                    !!page?.internal 
                                    ?
                                        <Link
                                            key={index}
                                            underline="hover"
                                            sx={{
                                                mt: 1,
                                                color: 'white',
                                                display: 'block',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => navigate(page?.link)}
                                        >
                                            {page.name}
                                        </Link>
                                    :
                                    <Link
                                        key={index}
                                        href={!!page?.link ? page.link : '#'}
                                        underline="hover"
                                        sx={{
                                            mt: 1,
                                            color: 'white',
                                            display: 'block',
                                        }}
                                        target={!!page?.target && page?.target}
                                        rel="noreferrer"
                                    >
                                        {page?.name}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box p={1} mb={2}>
                <Typography variant="body2" align="center">
                    © 2022 Banko. All Rights Reserved.
                </Typography>
            </Box>
        </Box>
    )
}

export default Footer