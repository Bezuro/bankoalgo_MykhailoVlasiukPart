import React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

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

function Languages({ graphqlService }) {
    const theme = useTheme()
    const mediaQuery = useMediaQuery(theme.breakpoints.only('xs'))

    const { loading, error, data } = useQuery(
        graphqlService.languagesForAdminPanel()
    )

    const {
        loading: loadingFreeTags,
        error: errorFreeTags,
        data: dataFreeTags,
    } = useQuery(graphqlService.freeTagsForLanguagesTable())

    if (loading || loadingFreeTags)
        return (
            <Container disableGutters={mediaQuery}>
                <Stack direction="row" sx={{ minHeight: '100vh' }}>
                    <Loader boxHeight="auto" />
                </Stack>
            </Container>
        )

    if (error || errorFreeTags) {
        console.log(error)
        return <NotFound />
    }

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
            name: 'tags',
            label: 'Tags',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    let tagsString = ''
                    value.forEach((element) => {
                        tagsString += `${element.name} `
                    })
                    return tagsString.trimEnd()
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
                                dataFreeTags={
                                    dataFreeTags.freeTagsForLanguagesTable
                                }
                            />
                            <UniversalDialog
                                data={rowData}
                                mode="edit"
                                dataFreeTags={
                                    dataFreeTags.freeTagsForLanguagesTable
                                }
                            />
                            <UniversalDialog
                                data={rowData}
                                mode="delete"
                                dataFreeTags={
                                    dataFreeTags.freeTagsForLanguagesTable
                                }
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
            <UniversalDialog
                mode="create"
                dataFreeTags={dataFreeTags.freeTagsForLanguagesTable}
            />
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
            <HeadingWithButton name="Languages" />

            {data && data.languagesForAdminPanel.length > 0 ? (
                <MUIDataTable
                    title={'Languages List'}
                    data={data.languagesForAdminPanel}
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
                        dataFreeTags={dataFreeTags.freeTagsForLanguagesTable}
                    />
                </>
            )}
        </Container>
    )
}

Languages.propTypes = {
    graphqlService: PropTypes.object.isRequired,
}

export default withGraphQLService()(Languages)
