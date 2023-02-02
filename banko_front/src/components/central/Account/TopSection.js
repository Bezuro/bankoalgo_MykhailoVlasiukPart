import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import Button from '@mui/material/Button'
import { red } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withPather } from 'react-pather'
import Levels from '../../../utils/levels';
import Chip from '@mui/material/Chip';

function TopSection(props) {
    const navigate = useNavigate()
    const pather = props.pather

    const preparedLevel = props.level.toLowerCase().trim();
    
    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
            {/* Name */}
            <Grid item xs={6} md={3}>
                <Typography align="center" variant="h4" sx={{fontStyle: 'italic'}}>
                    {props.name}
                </Typography>
            </Grid>
            {/* Level */}
            <Grid item xs={6} md={3}>
                <Typography align="center" variant="h4">
                    <Chip 
                        style={
                            Levels.hasOwnProperty(preparedLevel) && {
                                color: Levels[preparedLevel],
                                border: `1px solid ${Levels[preparedLevel]}`,
                                fontSize: '24px',
                                height: '2em',
                            }
                        }
                        label={props.level} 
                        variant="outlined" 
                        size="medium"
                    />
                </Typography>
            </Grid>
            {/* Likes */}
            <Grid item xs={12} md={3}>
                <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <ThumbUpIcon fontSize="large" color="success" />
                    </Grid>
                    <Grid item>
                        <Typography display="inline" variant="h4">
                            {props.likes}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ThumbDownIcon
                            fontSize="large"
                            sx={{ color: red[500] }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography display="inline" variant="h4">
                            {props.dislikes}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            {/* New Algo Button */}
            <Grid item xs={12} md={3}>
                <Grid container spacing={1} justifyContent="center">
                    {props.isAdmin && (
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => navigate(pather.admin)}
                            >
                                Admin Panel
                            </Button>
                        </Grid>
                    )}
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate(pather.createAlgo)}
                        >
                            New Algo
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            ml={1}
                            onClick={() => navigate(pather.algos)}
                        >
                            User Algos
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

TopSection.propTypes = {
    pather: PropTypes.object.isRequired,
}

export default withPather()(TopSection);