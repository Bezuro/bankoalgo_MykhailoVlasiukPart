import React from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withPather } from 'react-pather';
import { withStyles } from '@mui/styles';

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(14),
        border: '1px solid #dadde9',
    },
}))

const styles = theme => ({
    chipStyle: {
        maxWidth: '100%',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        }
    }
});

/**
 * This layout demonstrates how to sync multiple responsive layouts to localstorage.
 */
class Banka extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            layouts: {},
        }
    }

    onLayoutChange(layout, layouts) {
        this.setState({ layouts })
    }

    render() {

        const { pather, classes } = this.props;
 
        return (
            <ResponsiveReactGridLayout
                cols={{ lg: 6, md: 6, sm: 6, xs: 6, xxs: 6 }}
                rowHeight={30}
                isDraggable={false}
                isResizable={false}
                layouts={this.state.layouts}
                onLayoutChange={(layout, layouts) =>
                    this.onLayoutChange(layout, layouts)
                }
                compactType="horizontal"
            >
                {this.props.data.map((item, index) => (
                    <div
                        key={index}
                        data-grid={{
                            w: 2,
                            h: 1,
                            x: (index * 2) % 6,
                            y: 10 - Math.floor((index * 2) / 6),
                            minW: 2,
                            minH: 1,
                        }}
                    >
                        <Grid container spacing={0} justifyContent="center">
                            <HtmlTooltip
                                title={
                                    <React.Fragment>{item.name}</React.Fragment>
                                }
                                placement="top"
                                disableInteractive
                            >
                                <Chip
                                    className={classes.chipStyle}
                                    label={item.name}
                                    component={RouterLink}
                                    to={pather.reverse(pather.algoView, {id: item.id})}
                                    clickable
                                />
                            </HtmlTooltip>
                        </Grid>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        )
    }
}

Banka.propTypes = {
    pather: PropTypes.object.isRequired,
}

export default withPather()(withStyles(styles, { withTheme: true })(Banka));