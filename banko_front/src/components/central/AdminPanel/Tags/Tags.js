import React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import { ColorButton } from 'mui-color'

import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useQuery } from '@apollo/client'
import { withGraphQLService } from '../../../../di/hoc'

import MUIDataTable from 'mui-datatables'
import PropTypes from 'prop-types'

import Loader from '../../../common/Loader'
import NotFound from '../../../common/NotFound/NotFound'
import UniversalDialog from './UniversalDialog'
import HeadingWithButton from '../_common/HeadingWithButton'

function Tags({ graphqlService }) {
    const theme = useTheme()
    const mediaQuery = useMediaQuery(theme.breakpoints.only('xs'))

    const {
        loading,
        error,
        data: dataTags,
    } = useQuery(graphqlService.tagsForAdminPanel())

    const {
        loading: loadingGroup,
        error: errorGroup,
        data: dataGroup,
    } = useQuery(graphqlService.groupsAdmin())

    if (loading || loadingGroup)
        return (
            <Container disableGutters={mediaQuery}>
                <Stack direction="row" sx={{ minHeight: '100vh' }}>
                    <Loader boxHeight="auto" />
                </Stack>
            </Container>
        )

    if (error || errorGroup) {
        console.log(error)
        return <NotFound />
    }

    const data = dataTags.tagsForAdminPanel.map((item) => {
        return {
            id: item.id,
            name: item.name,
            color: item.color,
            isActive: item.isActive,
            groupId: item.group.id,
            groupName: item.group.name,
            user: item.user.nickname,
        }
    })

    const columns = [
        {
            name: 'name',
            label: 'Name',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'color',
            label: 'Color',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <ColorButton color={value} />
                },
            },
        },
        {
            name: 'isActive',
            label: 'isActive',
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value) => {
                    return value ? 'true' : 'false'
                },
            },
        },
        {
            name: 'groupName',
            label: 'Group',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'user',
            label: 'User',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'id',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                empty: true,
                setCellHeaderProps: (value) => ({
                    style: {
                        width: '150px', // for IconButtons
                    },
                }),
                customBodyRender: (value, tableMeta, updateValue) => {
                    const tableData = tableMeta.tableData
                    const index = tableMeta.rowIndex
                    const rowData = tableData[index]

                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                alignContent: 'space-around',
                                gap: '10px',
                            }}
                        >
                            <UniversalDialog
                                data={rowData}
                                mode="view"
                                groups={dataGroup.groupsAdmin}
                            />
                            <UniversalDialog
                                data={rowData}
                                mode="edit"
                                groups={dataGroup.groupsAdmin}
                            />
                            <UniversalDialog
                                data={rowData}
                                mode="delete"
                                groups={dataGroup.groupsAdmin}
                            />
                        </Box>
                    )
                },
            },
        },
    ]

    const options = {
        filter: false,
        print: false,
        download: false,
        selectableRows: 'none',
        filterType: 'checkbox',
        customToolbar: () => (
            <UniversalDialog mode="create" groups={dataGroup.groupsAdmin} />
        ),
        setTableProps: () => {
            return {
                size: 'small',
            }
        },
    }

    return (
        <Container
            maxWidth="xl"
            disableGutters={mediaQuery}
            component="section"
            sx={{ minHeight: '93vh' }}
        >
            <HeadingWithButton name="Tags" />

            {data && data.length > 0 ? (
                <MUIDataTable
                    title={'Tags List'}
                    data={data}
                    columns={columns}
                    options={options}
                />
            ) : (
                <>
                    <Typography align="center" variant="h3" color="primary">
                        No items :&#40;
                    </Typography>

                    <Typography align="center" variant="h4" color="primary">
                        Create new
                    </Typography>
                    <UniversalDialog
                        mode="create"
                        groups={dataGroup.groupsAdmin}
                    />
                </>
            )}
        </Container>
    )
}

Tags.propTypes = {
    graphqlService: PropTypes.object.isRequired,
}

export default withGraphQLService()(Tags)
