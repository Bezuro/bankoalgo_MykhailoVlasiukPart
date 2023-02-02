import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import TopSection from './TopSection'
import ActivityChart from './ActivityChart'
import Banka from './Banka'
import PointsToLevelUp from './PointsToLevelUp'
import LanguageChart from './LanguageChart'
import NotFound from '../../common/NotFound/NotFound'

import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { withGraphQLService } from '../../../di/hoc'
import { useSelector } from 'react-redux'

import ErrorMessage from '../../common/ErrorMessage'
import Loader from '../../common/Loader'

function Account({ graphqlService }) {
    const theme = useTheme()
    const mediaQuery = useMediaQuery(theme.breakpoints.only('xs'))
    const user = useSelector((state) => state.user.value)

    const { loading, error, data, refetch } = useQuery(
        graphqlService.userForAccountPage(),
        {
            variables: {
                nickname: user?.nickname,
            },
        }
    )

    useEffect(() => {
        refetch()
    }, [])

    if (loading)
        return (
            <Container disableGutters={mediaQuery} sx={{ minHeight: '100vh' }}>
                <Box>
                    <Loader boxHeight="auto" />
                </Box>
            </Container>
        )

    if (error) {
        console.log(error)
        return <NotFound />
    }

    let banka
    let languagesDistribution
    let activityChart

    if (data.userForAccountPage.lastAlgos.length) {
        banka = <Banka data={data.userForAccountPage.lastAlgos} />
        languagesDistribution = (
            <LanguageChart
                data={data.userForAccountPage.languagesDistribution}
            />
        )
    } else {
        banka = <ErrorMessage message="No Algos" height="455px" variant="h2" />

        languagesDistribution = (
            <ErrorMessage message="No Algos" height="100px" variant="h5" />
        )
    }

    if (data.userForAccountPage.visitsPerDate.length) {
        activityChart = (
            <ActivityChart data={data.userForAccountPage.visitsPerDate} />
        )
    } else {
        activityChart = (
            <ErrorMessage message="No Activity" height="400px" variant="h5" />
        )
    }

    return (
        <section>
            <Grid
                container
                py={4}
                px={{ md: 10, xs: 4 }}
                spacing={2}
                alignItems="start"
            >
                <Grid item xs={12}>
                    <TopSection
                        nickname={user?.nickname}
                        name={data.userForAccountPage.nickname}
                        isAdmin={data.userForAccountPage.isAdmin}
                        level={data.userForAccountPage.levelName}
                        likes={data.userForAccountPage.totalLikes}
                        dislikes={data.userForAccountPage.totalDislikes}
                    />
                </Grid>

                {/* Left section */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            border: 1,
                            borderColor: 'transparent',
                            borderRadius: 2,
                            position: 'relative',
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                zIndex: '-1',
                                position: 'absolute',
                            }}
                            src="/images/WideBanka_x10.png"
                            alt=""
                        />
                        <Box mt={13} ml={9} mb={6} mr={9}>
                            {banka}
                        </Box>
                    </Box>
                    <PointsToLevelUp
                        left={data.userForAccountPage.algosToNextLevel}
                        nextLevel={data.userForAccountPage.nextLevelName}
                        total={data.userForAccountPage.allAlgosLength}
                    />
                </Grid>
                {/* Right section */}
                <Grid item xs={12} md={6}>
                    <Box p={1}>
                        <Typography align="center" variant="h6" color="primary">
                            Activity
                        </Typography>
                        {activityChart}
                    </Box>
                    <Box p={1}>
                        <Typography align="center" variant="h6" color="primary">
                            Languages distribution
                        </Typography>
                        {languagesDistribution}
                    </Box>
                </Grid>
            </Grid>
        </section>
    )
}

export default withGraphQLService()(Account)
