import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { linearGradientDef } from '@nivo/core'

function Chart({ data }) {
{/**    const data = [{
        id: "22/04/2023",
        data: [
          {
            x: "2023-04-22",
            y: 40,
            color: "#533483"
          },
          {
            x: "2023-04-23",
            y: 35,
            color: "#FF5733"
          },
          {
            x: "2023-04-24",
            y: 60,
            color: "#2ECC71"
          },
          {
            x: "2023-04-25",
            y: 55,
            color: "#E74C3C"
          },
          {
            x: "2023-04-26",
            y: 45,
            color: "#3498DB"
          }
        ]
      }]; */} 
  return (
    <div className='chart' style={{ width: '100vh', height: '50vh'}}>
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 10, bottom: 50, left: 50 }}
            defs={[
                linearGradientDef('gradientA', [
                { offset: 0, color: 'inherit' },
                  { offset: 200, color: 'inherit', opacity: 0.4 },
                  ]),
               ]}
                  fill={[{ match: '*', id: 'gradientA' }]}
                  curve="monotoneX"
                  xScale={{ type:'point'}}
                  yScale={{
                      type: 'linear',
                      min:300,
                      max: 'auto',
                      stacked: true,
                      reverse: false
                  }}
                  
                  axisBottom={{
                     orient: 'bottom',
                     tickSize: 5,
                     tickPadding: 5,
                     tickRotation: 0,
                     legend: 'x',
                     legendOffset: 36,
                     legendPosition: 'middle'
                 }}
                 axisLeft={{
                     orient: 'left',
                     tickSize: 5,
                     tickPadding: 5,
                     tickRotation: 0,
                     legend: 'y',
                     legendOffset: -40,
                     legendPosition: 'middle'
                 }}
                  enableGridX={false}
                  enableGridY={false}
                  colors={{ scheme: 'dark2' }}
                  pointSize={0}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  useMesh={true}
                  areaOpacity={0.05}
                  enableArea = {true}
                  legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                  ]}
                  
                  />
    </div>
  )
}

export default Chart
