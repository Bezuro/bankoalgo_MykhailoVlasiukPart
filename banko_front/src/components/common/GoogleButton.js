import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const GoogleButton = styled(Button)(({ theme }) => ({
    color: 'black',
    backgroundColor: 'white',
    '&:hover': {
        backgroundColor: '#b3f9ff',
    },
}))

export default GoogleButton
