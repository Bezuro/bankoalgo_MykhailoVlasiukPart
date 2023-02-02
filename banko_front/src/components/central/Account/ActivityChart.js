import React, { memo, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import useTheme from '@mui/material/styles/useTheme'
import moment from 'moment'

let data = [
    {
        date: '2021-07-07T00:00:00.000Z',
        visits: 7,
    },
    {
        date: '2022-07-08T00:00:00.000Z',
        visits: 2,
    },
    {
        date: '2022-07-18T00:00:00.000Z',
        visits: 41,
    },
    {
        date: '2022-07-19T00:00:00.000Z',
        visits: 1,
    },
    {
        date: '2022-08-13T00:00:00.000Z',
        visits: 6,
    },
    {
        date: '2022-08-23T00:00:00.000Z',
        visits: 3,
    },
]

const FILTER_OPTIONS = {
    lastWeek: 'Last week',
    lastMonth: 'Last month',
    lastYear: 'Last year',
    all: 'All',
}
const FILTER_OPTIONS_ARRAY = ['Last week', 'Last month', 'Last year', 'All']

function joinData(data) {
    let newData = []

    data.forEach((item) => {
        const idx = newData.findIndex((el) => el.date === item.date)

        if (idx === -1) {
            newData.push({
                date: item.date,
                visits: item.visits,
            })
        } else {
            newData[idx].visits += item.visits
        }
    })

    return newData
}

function allDataMoment(data) {
    const formattedData = data.map((item) => {
        return {
            ...item,
            date: moment(item.date).format('YYYY-MMM'),
        }
    })

    return joinData(formattedData)
}

function lastYearDataMoment(data) {
    const now = moment()
    const startDay = moment().subtract(1, 'year')

    const filteredData = data
        .filter((item) => {
            const date = item.date
            return moment(date).isBetween(startDay, now)
        })
        .map((item) => {
            return { ...item, date: moment(item.date).format('YYYY-MMM') }
        })

    return joinData(filteredData)
}

function lastMonthDataMoment(data) {
    const now = moment()
    const startDay = moment().subtract(1, 'month')

    return data
        .filter((item) => {
            const date = item.date
            return moment(date).isBetween(startDay, now)
        })
        .map((item) => {
            return { ...item, date: moment(item.date).format('YYYY-MM-DD') }
        })
}

function lastWeekDataMoment(data) {
    const now = moment()
    const startDay = moment().subtract(1, 'week')

    return data
        .filter((item) => {
            const date = item.date
            return moment(date).isBetween(startDay, now)
        })
        .map((item) => {
            return { ...item, date: moment(item.date).format('YYYY-MM-DD') }
        })
}

const CustomTooltip = ({ active, payload, label }) => {
    const theme = useTheme()

    if (active && payload && payload.length) {
        return (
            <Box
                bgcolor={theme.palette.background.default}
                sx={{
                    border: 1,
                    borderColor: theme.palette.primary.main,
                    borderRadius: 3,
                }}
                p={1}
            >
                <p>{`date: ${payload[0].payload.date}`}</p>
                <p>{`visits: ${payload[0].payload.visits}`}</p>
            </Box>
        )
    }

    return null
}

function ActivityChart(props) {
    const [filter, setFilter] = useState(
        FILTER_OPTIONS_ARRAY[FILTER_OPTIONS_ARRAY.length - 1]
    )
    const [chartData, setChartData] = useState(allDataMoment(props.data))

    function changeFilterHandler(event) {
        const filterName = event.target.value
        setFilter(filterName)

        if (filterName === FILTER_OPTIONS.all) {
            setChartData(allDataMoment(props.data))
        }
        if (filterName === FILTER_OPTIONS.lastYear) {
            setChartData(lastYearDataMoment(props.data))
        }
        if (filterName === FILTER_OPTIONS.lastMonth) {
            setChartData(lastMonthDataMoment(props.data))
        }
        if (filterName === FILTER_OPTIONS.lastWeek) {
            setChartData(lastWeekDataMoment(props.data))
        }
    }

    return (
        <>
            <ResponsiveContainer width={'99%'} height={400}>
                <BarChart
                    width={500}
                    height={400}
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 0,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                        content={<CustomTooltip />}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend />
                    <Bar dataKey="visits" stackId="a" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <Grid
                container
                spacing={1}
                mt={2}
                justifyContent="center"
                alignItems="center"
            >
                {FILTER_OPTIONS_ARRAY.map((filterName) => (
                    <Grid item key={filterName}>
                        <Button
                            variant={
                                filterName === filter ? 'contained' : 'outlined'
                            }
                            color="primary"
                            onClick={changeFilterHandler}
                            value={filterName}
                        >
                            {filterName}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default memo(ActivityChart)
