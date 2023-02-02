import React, { useState } from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Autocomplete from '@mui/material/Autocomplete'

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

import { ColorPicker } from 'mui-color'

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

    const groupsNamesOnly = props.groups.map((item) => item.name)

    //! Mutations
    const [
        mutateFunctionCreate,
        // { data: dataCreate, loading: loadingCreate, error: errorCreate },
        { data: dataCreate },
    ] = useMutation(props.graphqlService.createTagAdmin(), {
        variables: {
            input: {
                name: '',
                color: '',
                isActive: false,
                group: props.groups[0].id,
            },
        },
        onCompleted: () => {
            enqueueSnackbar(
                `Tag "${dataCreate.createTagAdmin.name}" was successfully added`,
                {
                    variant: 'success',
                }
            )
        },
        onError: (error) => {
            enqueueSnackbar(`Error: tag was not added!\n ${error.message}`, {
                variant: 'error',
            })
        },
        refetchQueries: [{ query: props.graphqlService.tagsForAdminPanel() }],
    })

    const [mutateFunctionEdit, { data: dataEdit }] = useMutation(
        props.graphqlService.updateTagAdmin(),
        {
            variables: {
                id: '',
                input: {
                    name: '',
                    color: '',
                    isActive: false,
                    group: props.groups[0].id,
                },
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `Tag "${dataEdit.updateTagAdmin.name}" was successfully edited`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: tag was not edited!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.tagsForAdminPanel() },
            ],
        }
    )

    const [mutateFunctionDelete, { data: dataDelete }] = useMutation(
        props.graphqlService.deleteTagAdmin(),
        {
            variables: {
                id: '',
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `Level "${dataDelete.deleteTagAdmin.name}" was successfully deleted`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: tag was not deleted!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.tagsForAdminPanel() },
            ],
        }
    )

    //! Functions
    async function addData() {
        const { isValid, message } = validate(dialogData)
        if (!isValid) {
            enqueueSnackbar(message, {
                variant: 'error',
            })
            console.log('message :>> ', message)
            return
        }

        mutateFunctionCreate({
            variables: {
                input: {
                    name: dialogData.name,
                    color: dialogData.color,
                    isActive: dialogData.isActive,
                    group: dialogData.groupId,
                },
            },
        })

        return true
    }

    async function editData() {
        const { isValid, message } = validate(dialogData)
        if (!isValid) {
            enqueueSnackbar(message, {
                variant: 'error',
            })
            return
        }

        mutateFunctionEdit({
            variables: {
                id: dialogData.id,
                input: {
                    name: dialogData.name,
                    color: dialogData.color,
                    isActive: dialogData.isActive,
                    group: dialogData.groupId,
                },
            },
        })

        return true
    }

    async function deleteData() {
        mutateFunctionDelete({
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
                color: '',
                isActive: false,
                groupId: props.groups[0].id,
                groupName: props.groups[0].name,
            })
        }
    }

    const handleClose = () => {
        // console.log('dialogData :>> ', dialogData)
        setOpen(false)
    }

    const handleCreate = async () => {
        const added = await addData()
        if (added) {
            setOpen(false)
        }
    }

    const handleEdit = async () => {
        const edited = await editData()
        if (edited) {
            setOpen(false)
        }
    }

    const handleDelete = async () => {
        await deleteData()
        setOpen(false)
    }

    const nameChangeHandler = (event) => {
        setDialogData({ ...dialogData, name: event.target.value })
    }

    const colorChangeHandler = (event) => {
        setDialogData({ ...dialogData, color: '#' + event.hex })
    }
    const isActiveChangeHandler = (event) => {
        setDialogData({
            ...dialogData,
            isActive: event.target.checked,
        })
    }
    const groupChangeHandler = (event, newValue) => {
        const groupId = props.groups.filter(
            (group) => group.name === newValue
        )[0].id
        const groupName = newValue

        setDialogData({ ...dialogData, groupName: groupName, groupId: groupId })
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
                    Tag{' '}
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
                            {/* color */}
                            {/* <TextField
                                label="Color"
                                variant="outlined"
                                value={dialogData && dialogData.color}
                                onChange={colorChangeHandler}
                                fullWidth={true}
                            /> */}
                            <ColorPicker
                                value={dialogData.color}
                                onChange={colorChangeHandler}
                            />
                            {/* isActive */}
                            <FormControlLabel
                                label="isActive"
                                control={
                                    <Checkbox
                                        checked={
                                            dialogData && dialogData.isActive
                                        }
                                        onChange={isActiveChangeHandler}
                                    />
                                }
                            />
                            {/* group */}
                            <Autocomplete
                                fullWidth
                                options={groupsNamesOnly}
                                value={dialogData && dialogData.groupName}
                                renderInput={(params) => (
                                    <TextField {...params} label="Group" />
                                )}
                                onChange={groupChangeHandler}
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

                            {/* color */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                color
                            </Typography>
                            <Typography mb={2}>{props.data.color}</Typography>

                            {/* isActive */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                isActive
                            </Typography>
                            <Typography mb={2}>
                                {props.data.isActive ? 'true' : 'false'}
                            </Typography>

                            {/* group */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                Group
                            </Typography>
                            <Typography mb={2}>{props.data.group}</Typography>

                            {/* user */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                user
                            </Typography>
                            <Typography mb={2}>{props.data.user}</Typography>
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
