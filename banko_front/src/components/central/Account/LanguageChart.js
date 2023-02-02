import React, { PureComponent } from 'react'
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

export default class LanguageChart extends PureComponent {
    render() {
        const barColors = this.props.data.map(l => {
            return l.color
        })

        return (
            <ResponsiveContainer
                width={'99%'}
                height={this.props.data.length * 50 + 50}
            >
                <BarChart
                    width={500}
                    height={300}
                    data={this.props.data}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 20,
                    }}
                    layout="vertical"
                    barSize={20}
                >
                    <XAxis hide type="number" />
                    <YAxis
                        axisLine={false}
                        stroke="white"
                        dataKey="name"
                        type="category"
                    />
                    <Tooltip
                        separator={''}
                        labelStyle={{ color: 'black' }}
                        formatter={(value, name, props) => [`${value}%`, '']}
                    />
                    <Legend
                        payload={this.props.data.map((item, index) => ({
                            id: item.name,
                            type: 'square',
                            value: `${item.name} (${item.percent}%)`,
                            color: barColors[index % barColors.length],
                        }))}
                    />
                    <Bar dataKey="percent" fill="#8884d8">
                        {this.props.data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={barColors[index % barColors.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }
}
