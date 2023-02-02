import { Link, useLocation, useParams } from 'react-router-dom'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import UserAlgoCard from './AccountAlgoCard'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useQuery } from '@apollo/client'
import { withGraphQLService } from '../../../di/hoc'

import CircularProgress from '@mui/material/CircularProgress'
import NotFound from '../../common/NotFound/NotFound'
import { ACCOUNT_ALGOS_PER_PAGE } from '../../../utils/constants'

import Box from '@mui/material/Box'

import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import ErrorMessage from '../../common/ErrorMessage'
import Loader from '../../common/Loader'

function AccountAlgos({ graphqlService }) {
    const theme = useTheme()
    const mediaQuery = useMediaQuery(theme.breakpoints.only('xs'))
    const user = useSelector((state) => state.user.value)
    const location = useLocation()
    const query = new URLSearchParams(location.search)

    const page = parseInt(query.get('page') || '1', 10)

    const { loading, error, data } = useQuery(
        graphqlService.userAlgorithmsPerPage(),
        {
            variables: {
                input: {
                    nickname: user?.nickname,
                    algosPerPage: ACCOUNT_ALGOS_PER_PAGE,
                    page: page,
                },
            },
        }
    )

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

    let algoView

    if (data.userAlgorithmsPerPage.algorithms.length) {
        algoView = (
            <>
                <Stack spacing={1}>
                    {data.userAlgorithmsPerPage.algorithms.map(
                        (item, index) => (
                            <UserAlgoCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                tags={item.tags}
                                likes={item.likes}
                                dislikes={item.dislikes}
                                created_at={item.created_at}
                                complexity={item.complexity}
                                description={item.description}
                            />
                        )
                    )}
                </Stack>

                <Pagination
                    page={page}
                    count={Math.ceil(
                        data.userAlgorithmsPerPage.allAlgosLength /
                            ACCOUNT_ALGOS_PER_PAGE
                    )}
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            to={
                                location.pathname +
                                `${item.page === 1 ? '' : `?page=${item.page}`}`
                            }
                            {...item}
                        />
                    )}
                />
            </>
        )
    } else {
        algoView = (
            <ErrorMessage message="No Algos" height="455px" variant="h2" />
        )
    }

    return (
        <Box component={'section'} pt={1}>
            <Container disableGutters={mediaQuery}>
                <Stack spacing={1} sx={{ minHeight: '100vh' }}>
                    <Typography align="center" variant="h4">
                        <Typography
                            component="span"
                            inline="true"
                            variant="inherit"
                        >
                            {user?.nickname}
                        </Typography>
                        's algos
                    </Typography>
                    <Typography align="center" variant="h6">
                        total: {data.userAlgorithmsPerPage.allAlgosLength}
                    </Typography>

                    {algoView}
                </Stack>
            </Container>
        </Box>
    )
}

AccountAlgos.propTypes = {
    graphqlService: PropTypes.object.isRequired,
}

export default withGraphQLService()(AccountAlgos)
