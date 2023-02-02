import CircularProgress from '@mui/material/CircularProgress'
import useTheme from '@mui/material/styles/useTheme'

function Loader({ boxHeight }) {
    const theme = useTheme()
    return (
        <div
            style={{
                width: '100%',
                height: boxHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgress
                sx={{ color: theme.palette.primary.main }}
                size={70}
                thickness={1}
            />
        </div>
    )
}

export default Loader
