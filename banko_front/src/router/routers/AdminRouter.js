import { Route, Routes } from 'react-router-dom'
import * as Components from '../allComponents'
import * as AdminComponents from '../allAdminComponents'
// import * as Routers from '../allRouters'
// import PrivateRoutes from '../PrivateRoutes'

function CentralRouter() {
    return (
        <Routes>
            <Route path="/">
                <Route path="levels" element={<AdminComponents.Levels />} />
                <Route path="tags" element={<AdminComponents.Tags />} />
                <Route path="groups" element={<AdminComponents.Groups />} />
                <Route path="users" element={<AdminComponents.Users />} />
                <Route
                    path="languages"
                    element={<AdminComponents.Languages />}
                />
                <Route
                    path="algorithms"
                    element={<AdminComponents.Algorithms />}
                />
                <Route index element={<AdminComponents.AdminPanel />} />
            </Route>
            <Route path="*" element={<Components.NotFound />} />
        </Routes>
    )
}

export default CentralRouter
