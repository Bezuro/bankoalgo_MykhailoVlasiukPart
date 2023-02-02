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

import { useMutation } from '@apollo/client'
import { withGraphQLService } from '../../../../di/hoc'

import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'

import validate from './services/validate'

function UniversalDialog(props) {
    const [dialogData, setDialogData] = useState({})
    const [selectedTags, setSelectedTags] = useState([])
    const [optionsTags, setOptionsTags] = useState([])
    const [open, setOpen] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const mode = props.mode // "view", "edit", "delete"

    //! Mutations
    const [
        mutateFunctionCreate,
        // { data: dataCreate, loading: loadingCreate, error: errorCreate },
        { data: dataCreate },
    ] = useMutation(props.graphqlService.createLanguageAdmin(), {
        variables: {
            input: {
                name: '',
                isActive: false,
                tags: [],
            },
        },
        onCompleted: () => {
            enqueueSnackbar(
                `Language "${dataCreate.createLanguageAdmin.name}" was successfully added`,
                {
                    variant: 'success',
                }
            )
        },
        onError: (error) => {
            enqueueSnackbar(
                `Error: language was not added!\n ${error.message}`,
                {
                    variant: 'error',
                }
            )
        },
        refetchQueries: [
            { query: props.graphqlService.languagesForAdminPanel() },
            { query: props.graphqlService.freeTagsForLanguagesTable() },
        ],
    })

    const [mutateFunctionEdit, { data: dataEdit }] = useMutation(
        props.graphqlService.updateLanguageAdmin(),
        {
            variables: {
                id: '',
                input: {
                    name: '',
                    isActive: false,
                    tags: [],
                },
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `Language "${dataEdit.updateLanguageAdmin.name}" was successfully edited`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: language was not edited!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.languagesForAdminPanel() },
                { query: props.graphqlService.freeTagsForLanguagesTable() },
            ],
        }
    )

    const [mutateFunctionDelete, { data: dataDelete }] = useMutation(
        props.graphqlService.deleteLanguageAdmin(),
        {
            variables: {
                id: '',
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `Language "${dataDelete.deleteLanguageAdmin.name}" was successfully deleted`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: language was not deleted!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.languagesForAdminPanel() },
                { query: props.graphqlService.freeTagsForLanguagesTable() },
            ],
        }
    )

    //! Functions
    async function addData() {
        const { isValid, message } = validate(dialogData, selectedTags)
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
                    tags: selectedTags.map((tag) => tag.id),
                    isActive: dialogData.isActive,
                },
            },
        })

        return true
    }

    async function editData() {
        const { isValid, message } = validate(dialogData, selectedTags)
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
                    tags: selectedTags.map((tag) => tag.id),
                    isActive: dialogData.isActive,
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
            setSelectedTags(props.data.tags)
            setOptionsTags([...props.data.tags, ...props.dataFreeTags])
        }
        if (mode === 'create') {
            setDialogData({
                id: '',
                name: '',
                isActive: false,
            })
            setSelectedTags([])
            setOptionsTags(props.dataFreeTags)
        }
    }

    const handleClose = () => {
        // console.log('dialogData :>> ', dialogData)
        // console.log(
        //     'selectedTags :>> ',
        //     selectedTags.map((tag) => tag.id)
        // )
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

    const tagsChangeHandler = (event, newValue) => {
        setSelectedTags((current) => [...newValue])
    }
    const isActiveChangeHandler = (event) => {
        setDialogData({
            ...dialogData,
            isActive: event.target.checked,
        })
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
                    Language{' '}
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
                            {/* tags */}
                            {/* <TextField
                                label="showNumber"
                                variant="outlined"
                                value={dialogData && dialogData.showNumber}
                                onChange={showNumberChangeHandler}
                                fullWidth={true}
                                type="number"
                                inputProps={{
                                    min: 1,
                                }}
                            /> */}
                            <Autocomplete
                                fullWidth
                                multiple
                                filterSelectedOptions
                                options={optionsTags}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => {
                                    return option.id === value.id
                                }}
                                value={selectedTags}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tags" />
                                )}
                                onChange={tagsChangeHandler}
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

                            {/* tags */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                tags
                            </Typography>
                            <Typography mb={2}>
                                {props.data.tags.map(
                                    (item, index) => item.name + ' '
                                )}
                            </Typography>

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
