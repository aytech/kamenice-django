import { useQuery } from "@apollo/client"
import { ApexOptions } from "apexcharts"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { RESERVATIONS } from "../../lib/graphql/queries/Reservations"
import { Reservations, Reservations_reservations } from "../../lib/graphql/queries/Reservations/__generated__/Reservations"
import { Reservation } from "../../lib/Types"
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
        const { fromYear, fromMonth, fromDay, fromHour, fromMinute, toYear, toMonth, toDay, toHour, toMinute } = reservation
        let from, to
        if (fromHour === null || fromMinute === null) {
          from = new Date(fromYear, fromMonth, fromDay)
        } else {
          from = new Date(fromYear, fromMonth, fromDay, fromHour, fromMinute)
        }
        if (toHour === null || toMinute === null) {
          to = new Date(toYear, toMonth, toDay)
        } else {
          to = new Date(toYear, toMonth, toDay, toHour, toMinute)
        }
        series.push({
          data: [
            {
              x: `${ reservation.suite.title } (${ reservation.suite.number })`,
              y: [ from.getTime(), to.getTime() ]
            }
          ],
          name: Reservation.getType(reservation.type),
          suite: reservation.suite.id
        })
      }

    })
    setSeries(series)
    console.log('Data: ', data)
    console.log('Series: ', series)
  }, [ data ])

  // For DEV only
  // useEffect(() => {
  // setSeries([
  //   {
  //     data: [
  //       {
  //         x: 'Apartman 2 + 2 (7)',
  //         y: [
  //           new Date(2021, 5, 1, 14, 0).getTime(),
  //           new Date(2021, 5, 5, 10, 0).getTime()
  //         ]
  //       },
  //     ],
  //     name: 'Závazná Rezervace',
  //     suite: 1
  //   },
  //   {
  //     data: [
  //       {
  //         x: 'Apartman 2 + 2 (8)',
  //         y: [
  //           new Date(2021, 5, 7, 14, 0).getTime(),
  //           new Date(2021, 5, 12, 10, 0).getTime()
  //         ]
  //       }
  //     ],
  //     name: 'Závazná Rezervace',
  //     suite: 1
  //   },
  //   {
  //     data: [
  //       {
  //         x: 'Apartman 2 + 4 (3)',
  //         y: [
  //           new Date(2021, 5, 3, 14, 0).getTime(),
  //           new Date(2021, 5, 6, 10, 0).getTime()
  //         ]
  //       }
  //     ],
  //     name: 'Aktuálně Ubytování',
  //     suite: 2
  //   },
  //   {
  //     data: [
  //       {
  //         x: 'Apartman 2 + 4 (3)',
  //         y: [
  //           new Date(2021, 5, 11, 14, 0).getTime(),
  //           new Date(2021, 5, 15, 10, 0).getTime()
  //         ]
  //       }
  //     ],
  //     name: 'Obydlený Termín',
  //     suite: 2
  //   },
  //   {
  //     data: [
  //       {
  //         x: 'Apartman 4 + 4 (1)',
  //         y: [
  //           new Date(2021, 5, 5, 14, 0).getTime(),
  //           new Date(2021, 5, 10, 10, 0).getTime()
  //         ]
  //       }
  //     ],
  //     name: 'Nezávazná Rezervace',
  //     suite: 3
  //   },
  //   {
  //     data: [
  //       {
  //         x: "Novy apartma",
  //         y: []
  //       }
  //     ],
  //     name: "Novy apartma",
  //     suite: 4
  //   }
  // ])
  // }, [])
  // -- ! -- //

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

        // legendClick: (e: any) => console.log('Legend click: ', e),
        // markerClick: (e: any) => console.log('Marker click: ', e)
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

  return (
    <div id="chart">
      <ReactApexChart series={ series } options={ options } type="rangeBar" height={ 350 }></ReactApexChart>
    </div>
  )
}