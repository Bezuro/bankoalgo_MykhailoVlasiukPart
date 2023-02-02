import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { withGraphQLService } from '../di/hoc'
import { useDispatch } from 'react-redux'
import { changeUser } from '../slices/userSlice'

import Loader from '../components/common/Loader'
import NotFound from '../components/common/NotFound/NotFound'

const PrivateRoutes = ({ graphqlService }) => {
    const dispatch = useDispatch()
    const jwt = useSelector((state) => state.jwt.value)
    const user = useSelector((state) => state.user.value)

    const { loading, error, data } = useQuery(graphqlService.getCurrentUser())

    if (loading) return <Loader boxHeight="200px" />

    if (error) {
        console.log(error)
    }

    const currentUser = data?.getCurrentUser

    if (!jwt || !currentUser?.id) {
        return <NotFound />
    }

    if (!user?.id) {
        dispatch(changeUser(currentUser))
    }

    if (!user?.isAdmin) {
        return <NotFound />
    }

    return <Outlet />

    //return user?.id ? <Outlet /> : <Navigate to="/login" />
}

PrivateRoutes.propTypes = {
    graphqlService: PropTypes.object.isRequired,
}

export default withGraphQLService()(PrivateRoutes)
