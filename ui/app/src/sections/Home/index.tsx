import React, { useState } from 'react'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import { Col, Modal, Row } from 'antd'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import DatePicker, { Calendar, DayRange, DayValue } from 'react-modern-calendar-datepicker'
import './styles.css'
import { CsCalendarLocale } from '../../lib/components/CsCalendarLocale'

export const Home = () => {
  const rooms = [
    {
      id: 1,
      name: "Apartman 2 + 2"
    },
    {
      id: 2,
      name: "Apartman 2 + 2"
    },
    {
      id: 3,
      name: "Apartman 2 + 2"
    },
    {
      id: 4,
      name: "Apartman 2 + 4"
    }
  ]
  const [ selectedRange, setSelectedRange ] = useState<DayRange>({
    from: null,
    to: null
  })
  const [ selectedDay, setSelectedDay ] = useState<DayValue>()
  const [ formVisible, setFormVisible ] = useState<boolean | undefined>(false)
  return (
    <Content className="home">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        <Row gutter={ 12 }>
          {
            rooms.map((room) => {
              return (
                <Col span={ 12 } key={ room.id } className="home__listing">
                  <Title level={ 4 } className="home__listings-title"> { room.name }</Title>
                  <div className="home__calendar">
                    <Calendar
                      value={ selectedRange }
                      onChange={ (range: DayRange) => {
                        setSelectedRange({
                          from: range.from,
                          to: null
                        })
                        setFormVisible(true)
                      } }
                      locale={ CsCalendarLocale }
                      shouldHighlightWeekends />
                  </div>
                </Col>
              )
            })
          }
        </Row>
      </div>
      <Modal
        title="Rezervační formulář"
        visible={ formVisible }
        onOk={ () => setFormVisible(false) }
        onCancel={ () => setFormVisible(false) }>
        <DatePicker
          value={ selectedDay }
          onChange={ (dayValue: DayValue) => {
            setSelectedRange({
              from: selectedRange.from,
              to: dayValue
            })
          } }
          inputPlaceholder="Select a day"
          shouldHighlightWeekends />
      </Modal>
    </Content >
  );
}