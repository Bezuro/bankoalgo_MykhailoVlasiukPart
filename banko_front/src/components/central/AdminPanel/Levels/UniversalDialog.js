import React, { useState } from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PreviewIcon from '@mui/icons-material/Preview'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useMutation } from '@apollo/client'
import { withGraphQLService } from '../../../../di/hoc'

import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'

import validate from './services/validate'

function UniversalDialog(props) {
    const [dialogData, setDialogData] = useState({})
    const [open, setOpen] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const mode = props.mode // "view", "edit", "delete"

    //! Mutations
    const [
        mutateFunctionCreateLevel,
        // { data: dataCreate, loading: loadingCreate, error: errorCreate },
        { data: dataCreate },
    ] = useMutation(props.graphqlService.createLevel(), {
        variables: {
            level: {
                name: '',
                minAddedAlgorithms: '',
                maxAddedAlgorithms: '',
                description: '',
            },
        },
        onCompleted: () => {
            enqueueSnackbar(
                `Level "${dataCreate.createLevel.name}" was successfully added`,
                {
                    variant: 'success',
                }
            )
        },
        onError: (error) => {
            enqueueSnackbar(`Error: level was not added!\n ${error.message}`, {
                variant: 'error',
            })
        },
        refetchQueries: [{ query: props.graphqlService.levelsForAdminPanel() }],
    })

    const [mutateFunctionEditLevel, { data: dataEdit }] = useMutation(
        props.graphqlService.updateLevel(),
        {
            variables: {
                id: '',
                level: {
                    name: '',
                    minAddedAlgorithms: '',
                    maxAddedAlgorithms: '',
                    description: '',
                },
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `Level "${dataEdit.updateLevel.name}" was successfully edited`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: level was not edited!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.levelsForAdminPanel() },
            ],
        }
    )

    const [mutateFunctionDeleteLevel, { data: dataDelete }] = useMutation(
        props.graphqlService.deleteLevel(),
        {
            variables: {
                id: '',
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `Level "${dataDelete.deleteLevel.name}" was successfully deleted`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: level was not deleted!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.levelsForAdminPanel() },
            ],
        }
    )

    //! Functions
    async function addLevel() {
        const { isValid, message } = validate(dialogData)
        if (!isValid) {
            enqueueSnackbar(message, {
                variant: 'error',
            })
            return
        }

        mutateFunctionCreateLevel({
            variables: {
                level: {
                    name: dialogData.name,
                    minAddedAlgorithms: +dialogData.minAddedAlgorithms,
                    maxAddedAlgorithms: +dialogData.maxAddedAlgorithms,
                    description: dialogData.description,
                },
            },
        })

        return true
    }

    async function editLevel() {
        const { isValid, message } = validate(dialogData)
        if (!isValid) {
            enqueueSnackbar(message, {
                variant: 'error',
            })
            return
        }

        mutateFunctionEditLevel({
            variables: {
                id: dialogData.id,
                level: {
                    name: dialogData.name,
                    minAddedAlgorithms: +dialogData.minAddedAlgorithms,
                    maxAddedAlgorithms: +dialogData.maxAddedAlgorithms,
                    description: dialogData.description,
                },
            },
        })

        return true
    }

    async function deleteLevel() {
        mutateFunctionDeleteLevel({
            variables: {
                id: dialogData.id,
            },
        })
    }

    //! Handlers
    const handleOpen = () => {
        setOpen(true)
        if (mode === 'edit' || mode === 'delete') {
            setDialogData(props.data)
        }
        if (mode === 'create') {
            setDialogData({
                id: '',
                name: '',
                minAddedAlgorithms: '',
                maxAddedAlgorithms: '',
                description: '',
            })
        }
    }

    const handleClose = () => {
        // console.log('dialogData :>> ', dialogData)
        setOpen(false)
    }

    const handleCreate = async () => {
        const added = await addLevel()
        if (added) {
            setOpen(false)
        }
    }

    const handleEdit = async () => {
        const edited = await editLevel()
        if (edited) {
            setOpen(false)
        }
    }

    const handleDelete = async () => {
        await deleteLevel()
        setOpen(false)
    }

    const nameChangeHandler = (event) => {
        setDialogData({ ...dialogData, name: event.target.value })
    }
    const minAddedAlgorithmsChangeHandler = (event) => {
        setDialogData({ ...dialogData, minAddedAlgorithms: event.target.value })
    }
    const maxAddedAlgorithmsChangeHandler = (event) => {
        setDialogData({ ...dialogData, maxAddedAlgorithms: event.target.value })
    }
    const descriptionChangeHandler = (event) => {
        setDialogData({ ...dialogData, description: event.target.value })
    }

    //  TODO extract this maybe
    //? start
    const styleDialogHeading = {
        fontSize: {
            sm: '2rem',
            xs: '1.5rem',
        },
    }
    //? end

    return (
        <>
            <Tooltip title={mode.charAt(0).toUpperCase() + mode.slice(1)}>
                <IconButton
                    color="primary"
                    onClick={handleOpen}
                    size={mode === 'create' ? 'medium' : 'small'}
                >
                    {mode === 'create' && <AddCircleIcon />}
                    {mode === 'view' && <PreviewIcon />}
                    {mode === 'edit' && <EditIcon />}
                    {mode === 'delete' && <DeleteIcon />}
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth={true}
            >
                <DialogTitle textAlign="center" color="primary">
                    Level{' '}
                    <Typography
                        component="span"
                        sx={{ textTransform: 'capitalize' }}
                        fontSize="inherit"
                    >
                        {mode}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers={true}>
                    {(mode === 'edit' || mode === 'create') && (
                        <Stack spacing={2}>
                            {/* id */}
                            <TextField
                                label="Id"
                                variant="outlined"
                                value={props.data && props.data.id}
                                fullWidth={true}
                                disabled
                            />

                            {/* name */}
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={dialogData && dialogData.name}
                                onChange={nameChangeHandler}
                                fullWidth={true}
                            />

                            {/* minAddedAlgorithms */}
                            <TextField
                                label="Min Added Algorithms"
                                variant="outlined"
                                value={
                                    dialogData && dialogData.minAddedAlgorithms
                                }
                                onChange={minAddedAlgorithmsChangeHandler}
                                fullWidth={true}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                            />

                            {/* maxAddedAlgorithms */}
                            <TextField
                                label="Max Added Algorithms"
                                variant="outlined"
                                value={
                                    dialogData && dialogData.maxAddedAlgorithms
                                }
                                onChange={maxAddedAlgorithmsChangeHandler}
                                fullWidth={true}
                                type="number"
                                inputProps={{
                                    min: 1,
                                }}
                            />

                            {/* description */}
                            <TextField
                                label="Description"
                                variant="outlined"
                                value={dialogData && dialogData.description}
                                onChange={descriptionChangeHandler}
                                fullWidth={true}
                                multiline
                                maxRows={10}
                            />
                        </Stack>
                    )}
                    {(mode === 'view' || mode === 'delete') && (
                        <>
                            {/* id */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                id
                            </Typography>
                            <Typography mb={2}>{props.data.id}</Typography>

                            {/* name */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                name
                            </Typography>
                            <Typography mb={2}>{props.data.name}</Typography>

                            {/* minAddedAlgorithms */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                minAddedAlgorithms
                            </Typography>
                            <Typography mb={2}>
                                {props.data.minAddedAlgorithms}
                            </Typography>

                            {/* maxAddedAlgorithms */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                maxAddedAlgorithms
                            </Typography>
                            <Typography mb={2}>
                                {props.data.maxAddedAlgorithms}
                            </Typography>

                            {/* description */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                description
                            </Typography>
                            <Typography mb={2}>
                                {props.data.description}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    {mode === 'create' && (
                        <Button onClick={handleCreate}>Create</Button>
                    )}
                    {mode === 'edit' && (
                        <Button onClick={handleEdit}>Edit</Button>
                    )}
                    {mode === 'delete' && (
                        <Button onClick={handleDelete}>Delete</Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

UniversalDialog.propTypes = {
    graphqlService: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
}

export default withGraphQLService()(UniversalDialog)
