import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import { red } from '@mui/material/colors'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'

function AccountAlgoCard(props) {
    const navigate = useNavigate()

    return (
        <Accordion
            sx={{
                border: 1,
                borderColor: 'primary.main',
                borderRadius: '15px !important',
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="primary" align="center">
                            {props.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Typography variant="p">
                            {props.created_at.slice(0, 10).replace(/-/g, '/')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/algo-view-${props.id}`)}
                        >
                            Open
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button variant="contained" color="primary">
                            Add to Bucket
                        </Button>
                    </Grid>
                </Grid>
                {/* <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    width="100%"
                >
                    <Typography variant="h6" color="primary">
                        {props.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                        {props.username}
                    </Typography>
                    <Typography variant="p">
                        {props.created_at.slice(0, 10).replace(/-/g, '/')}
                    </Typography>
                    <Button variant="contained" color="primary">
                        Open
                    </Button>
                    <Button variant="contained" color="primary">
                        Add to Bucket
                    </Button>
                </Stack> */}
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Stack spacing={1}>
                            <Grid
                                container
                                spacing={1}
                                justifyContent="start"
                                alignItems="center"
                            >
                                <Grid item>
                                    <ThumbUpIcon color="success" />
                                </Grid>
                                <Grid item>
                                    <Typography display="inline" variant="p">
                                        {props.likes}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <ThumbDownIcon sx={{ color: red[500] }} />
                                </Grid>
                                <Grid item>
                                    <Typography display="inline" variant="p">
                                        {props.dislikes}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="p">
                                Complexity: {props.complexity}
                            </Typography>
                            <Typography variant="p">
                                Description: {props.description}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Divider
                        orientation="vertical"
                        flexItem
                        style={{ marginRight: '-1px', marginTop: '19px' }}
                    />
                    <Grid item xs={4}>
                        <Stack spacing={1}>
                            <Button variant="outlined" color="primary">
                                Try on Codesandbox
                            </Button>
                            <Stack
                                direction="row"
                                spacing={0}
                                sx={{
                                    flexWrap: 'wrap',
                                    marginTop: '0px !important',
                                }}
                            >
                                {props.tags &&
                                    props.tags.map((tag, index) => (
                                        <Chip
                                            key={tag.id}
                                            label={tag.name}
                                            size="small"
                                            sx={{
                                                backgroundColor: tag.color,
                                                mr: 1,
                                                mt: 1,
                                            }}
                                        />
                                    ))}
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

export default AccountAlgoCard
