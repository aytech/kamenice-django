import { useQuery } from "@apollo/client"
import { Empty } from "antd"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import { ApexOptions } from "apexcharts"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { RESERVATIONS } from "../../lib/graphql/queries/Reservations"
import { Reservations, Reservations_reservations } from "../../lib/graphql/queries/Reservations/__generated__/Reservations"
import "./styles.css"

// https://apexcharts.com/react-chart-demos/timeline-charts/multiple-series-group-rows/
export const Overview = () => {

  const [ series, setSeries ] = useState<any[]>([])
  const getColor = (reservationType: string): string => {
    switch (reservationType) {
      case "Nezávazná Rezervace":
        return "#e4e724"
      case "Aktuálně Ubytování":
        return "#9c88ff"
      case "Obydlený Termín":
        return "#db913c"
      case "Závazná Rezervace":
      default: return "#0eca2d"
    }
  }
  const getTimePadded = (hours: number, minutes: number) => {
    let time = ''
    time += (hours < 10 ? '0' : '') + hours
    time += ':'
    time += (minutes < 10 ? '0' : '') + minutes
    return time
  }

  const { data } = useQuery<Reservations>(RESERVATIONS)

  useEffect(() => {
    const series: any[] = []
    data?.reservations?.forEach((reservation: Reservations_reservations | null) => {
      if (reservation !== null) {
        // const { fromYear, fromMonth, fromDay, fromHour, fromMinute, toYear, toMonth, toDay, toHour, toMinute } = reservation
        // let from, to
        // if (fromHour === null || fromMinute === null) {
        //   from = new Date(fromYear, fromMonth, fromDay)
        // } else {
        //   from = new Date(fromYear, fromMonth, fromDay, fromHour, fromMinute)
        // }
        // if (toHour === null || toMinute === null) {
        //   to = new Date(toYear, toMonth, toDay)
        // } else {
        //   to = new Date(toYear, toMonth, toDay, toHour, toMinute)
        // }
        // series.push({
        //   data: [
        //     {
        //       x: `${ reservation.suite.title } (${ reservation.suite.number })`,
        //       y: [ from.getTime(), to.getTime() ]
        //     }
        //   ],
        //   name: Reservation.getType(reservation.type),
        //   suite: reservation.suite.id
        // })
      }
    })
    setSeries(series)
  }, [ data ])

  const locateSeries = (index: number) => {
    if (index === -1) {
      console.log("Empty space was clicked")
    } else {
      console.log('Reservation ', series[ index ], ' was clicked')
    }
  }

  const options: ApexOptions = {
    chart: {
      events: {
        click: (_e, chart, config) => {
          console.log('Event: ', _e)
          console.log('Chart: ', chart)
          console.log('Config: ', config)
          console.log('Find: ', chart.series.ctx.data.twoDSeriesX[ 0 ])
          locateSeries(config.seriesIndex)
        }
      },
      height: 350,
      locales: [ {
        name: "en",
        options: {
          months: [ "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec" ],
          shortMonths: [ "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec" ],
          toolbar: {
            download: "Stáhnout",
            pan: "Panoráma",
            reset: "Resetovat Přiblížení",
            selectionZoom: "Zvětšení Výběru",
            zoomIn: "Přiblížit",
            zoomOut: "Oddálit"
          }
        }
      } ],
      type: "rangeBar" as const
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        rangeBarGroupRows: true
      }
    },
    colors: [ ({ seriesIndex, w }: { seriesIndex: any, w: any }) => {
      return getColor(w.config.series[ seriesIndex ].name)
    }
    ],
    fill: {
      type: 'solid'
    },
    xaxis: {
      type: 'datetime' as const
    },
    legend: {
      customLegendItems: [
        "Závazná Rezervace",
        "Nezávazná Rezervace",
        "Aktuálně Ubytování",
        "Obydlený Termín"
      ],
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: [
          "#0eca2d",
          "#e4e724",
          "#9c88ff",
          "#db913c"
        ],
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
      },
      position: 'top' as const
    },
    stroke: {
      width: 1
    },
    tooltip: {
      custom: (options) => {
        const tooltipValues = options.ctx.rangeBar.getTooltipValues(options)
        const seriesName = tooltipValues.seriesName.trim().substring(0, tooltipValues.seriesName.trim().length - 1)
        const reservationName = tooltipValues.ylabel.trim().substring(0, tooltipValues.ylabel.trim().length - 1)
        const from = new Date(tooltipValues.start)
        const to = new Date(tooltipValues.end)
        return '<div class="apexcharts-tooltip-rangebar"><div>' +
          `<span class="series-name" style="font-weight: bold">${ reservationName }</span>` +
          '</div><div>' +
          `<span class="category" style="color:${ getColor(seriesName) }">${ tooltipValues.seriesName }</span>` +
          `<span class="value start-value" style="font-weight: bold">${ tooltipValues.startVal } ${ getTimePadded(from.getHours(), from.getMinutes()) }</span>` +
          '<span class="separator"> - </span>' +
          `<span class="value end-value" style="font-weight: bold">${ tooltipValues.endVal } ${ getTimePadded(to.getHours(), to.getMinutes()) }</span>` +
          '</div></div></div>'
      }
    }
  }

  const getContent = () => {
    return series.length > 0 ? (
      <div id="chart">
        <ReactApexChart series={ series } options={ options } type="rangeBar" height={ 350 }></ReactApexChart>
      </div>
    ) : <Empty />
  }

  return (
    <Content className="app-content">
      <Title level={ 3 } className="home__listings-title">
        Přehled
      </Title>
      { getContent() }
    </Content>
  )
}