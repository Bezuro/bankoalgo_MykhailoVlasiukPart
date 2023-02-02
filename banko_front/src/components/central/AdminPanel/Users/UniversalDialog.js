import React, { useState } from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PreviewIcon from '@mui/icons-material/Preview'
import EditIcon from '@mui/icons-material/Edit'

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

    const [mutateFunctionEdit, { data: dataEdit }] = useMutation(
        props.graphqlService.updateUserAdmin(),
        {
            variables: {
                id: '',
                input: {
                    email: '',
                    nickname: '',
                    isAdmin: false,
                    isBanned: false,
                },
            },
            onCompleted: () => {
                enqueueSnackbar(
                    `User "${dataEdit.updateUserAdmin.nickname}" was successfully edited`,
                    {
                        variant: 'success',
                    }
                )
            },
            onError: (error) => {
                enqueueSnackbar(
                    `Error: user was not edited!\n ${error.message}`,
                    {
                        variant: 'error',
                    }
                )
            },
            refetchQueries: [
                { query: props.graphqlService.usersForAdminPanel() },
            ],
        }
    )

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
                    email: dialogData.email,
                    nickname: dialogData.nickname,
                    isAdmin: dialogData.isAdmin,
                    isBanned: dialogData.isBanned,
                },
            },
        })

        return true
    }

    //! Handlers
    const handleOpen = () => {
        setOpen(true)
        if (mode === 'edit' || mode === 'delete') {
            setDialogData(props.data)
        }
    }

    const handleClose = () => {
        // console.log('dialogData :>> ', dialogData)
        setOpen(false)
    }

    const handleEdit = async () => {
        const edited = await editData()
        if (edited) {
            setOpen(false)
        }
    }

    const emailChangeHandler = (event) => {
        setDialogData({ ...dialogData, email: event.target.value })
    }

    const nicknameChangeHandler = (event) => {
        setDialogData({ ...dialogData, nickname: event.target.value })
    }
    const isAdminChangeHandler = (event) => {
        setDialogData({
            ...dialogData,
            isAdmin: event.target.checked,
        })
    }
    const isBannedChangeHandler = (event) => {
        setDialogData({
            ...dialogData,
            isBanned: event.target.checked,
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
                    {mode === 'view' && <PreviewIcon />}
                    {mode === 'edit' && <EditIcon />}
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth={true}
            >
                <DialogTitle textAlign="center" color="primary">
                    User{' '}
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
                            {/* email */}
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={dialogData && dialogData.email}
                                onChange={emailChangeHandler}
                                fullWidth={true}
                            />
                            {/* nickname */}
                            <TextField
                                label="Nickname"
                                variant="outlined"
                                value={dialogData && dialogData.nickname}
                                onChange={nicknameChangeHandler}
                                fullWidth={true}
                            />

                            {/* isAdmin */}
                            <FormControlLabel
                                label="isAdmin"
                                control={
                                    <Checkbox
                                        checked={
                                            dialogData && dialogData.isAdmin
                                        }
                                        onChange={isAdminChangeHandler}
                                    />
                                }
                            />

                            {/* isBanned */}
                            <FormControlLabel
                                label="isBanned"
                                control={
                                    <Checkbox
                                        checked={
                                            dialogData && dialogData.isBanned
                                        }
                                        onChange={isBannedChangeHandler}
                                    />
                                }
                            />
                        </Stack>
                    )}
                    {(mode === 'view' || mode === 'delete') && (
                        <>
                            {/* id */}
                            {/* <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                id
                            </Typography>
                            <Typography mb={2}>{props.data.id}</Typography> */}

                            {/* email */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                email
                            </Typography>
                            <Typography mb={2}>{props.data.email}</Typography>

                            {/* nickname */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                nickname
                            </Typography>
                            <Typography mb={2}>
                                {props.data.nickname}
                            </Typography>

                            {/* isAdmin */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                isAdmin
                            </Typography>
                            <Typography mb={2}>
                                {props.data.isAdmin ? 'true' : 'false'}
                            </Typography>

                            {/* isBanned */}
                            <Typography
                                sx={{
                                    ...styleDialogHeading,
                                }}
                                color="secondary"
                            >
                                isBanned
                            </Typography>
                            <Typography mb={2}>
                                {props.data.isBanned ? 'true' : 'false'}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    {mode === 'edit' && (
                        <Button onClick={handleEdit}>Edit</Button>
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
