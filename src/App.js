import { useEffect, useState } from 'react'
import { Card, Row, Col, DatePicker } from 'antd';
// import Granim from 'granim'
import axios from 'axios';
import videojs from 'video.js';
import { Chart, Line, Point, Tooltip } from 'bizcharts';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'video.js/dist/video-js.css'
import './App.css';

dayjs.locale('zh-cn');

function App() {

  const [infos, setInfos] = useState(null)
  useEffect(() => {
    setInterval(() => {
      axios
        .get('http://localhost:8001/parameters')
        .then(res => {
          if (res.status === 200) {
            setInfos(res.data)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }, 5000);
  }, [])

  const [selectDay, setSelectDay] = useState(dayjs().format('YYYY-MM-DD'))
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    axios
      .postForm('http://localhost:8001/history_d', {
        date: selectDay,
      })
      .then(res => {
        if (res.status === 200 && res.data) {
          const data = []
          ;(res.data?.historydata ?? []).forEach(it => {
            data.push({
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '上行车流量',
              value: it[1],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '下行车流量',
              value: it[2],
            })
          })
          console.log(data)
          setLineData(data)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [selectDay])

  const [rangeDate, setRangeDate] = useState([dayjs().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')])
  const [lineData2, setLineData2] = useState([])
  console.log('rangeDate', rangeDate)

  useEffect(() => {
    axios
      .postForm('http://localhost:8001/history_h', {
        start_date: dayjs(rangeDate[0], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
        end_date: dayjs(rangeDate[1], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
      })
      .then(res => {
        if (res.status === 200 && res.data) {
          const data = []
          ;(res.data?.historydata ?? []).forEach(it => {
            data.push({
              // time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              time: it[0],
              label: '上行总量',
              value: it[1],
            }, {
              // time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              time: it[0],
              label: '上行段一',
              value: it[2],
            }, {
              // time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              time: it[0],
              label: '上行段二',
              value: it[3],
            }, {
              // time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              time: it[0],
              label: '下行总量',
              value: it[5],
            }, {
              // time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              time: it[0],
              label: '下行段一',
              value: it[6],
            }, {
              // time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              time: it[0],
              label: '下行段二',
              value: it[7],
            })
          })
          console.log('history_h', res.data)
          setLineData2(data)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [rangeDate])

  useEffect(() => {
    videojs('my-video1')
    videojs('my-video2')
    videojs('my-video3')
  }, [])

  return (
    <div style={{padding: 24}}>
      <Row gutter={24} style={{marginBottom: 24}}>
        <Col span={24}>
          <Card title="流量信息栏">
            {infos ? 
              <Row gutter={24}>
                <Col span={12}>
                  <div>上行隧道内车辆总数：<b>{infos.parameter1}</b></div>
                  <div>上行隧道内第一段车辆数：<b>{infos.parameter2}</b></div>
                  <div>上行隧道内第二段车辆数：<b>{infos.parameter3}</b></div>
                  <div>上行每小时车流量：<b>{infos.parameter4}</b></div>
                </Col>
                <Col span={12}>
                  <div>下行隧道内车辆总数：<b>{infos.parameter5}</b></div>
                  <div>下行隧道内第一段车辆数：<b>{infos.parameter6}</b></div>
                  <div>下行隧道内第二段车辆数：<b>{infos.parameter7}</b></div>
                  <div>下行每小时车流量：<b>{infos.parameter8}</b></div>
                </Col>
              </Row>:
              <span>暂无数据</span>
            }
          </Card>
        </Col>
      </Row>
      <Row style={{marginBottom: 24}}>
        <Col span={24}>
          <Card title="历史车流量">
            <DatePicker defaultValue={dayjs(selectDay, 'YYYY-MM-DD')} onChange={(date, dateString) => {
              setSelectDay(dateString)
            }}/>
            <Chart
              appendPadding={[10, 0, 0, 10]}
              autoFit
              height={500}
              data={lineData}
            >
              <Line position="time*value" color="label"/>
              <Point position="time*value" color="label"/>
              <Tooltip shared={true} showCrosshairs />
            </Chart>
          </Card>
        </Col>
      </Row>
      <Row style={{marginBottom: 24}}>
        <Col span={24}>
          <Card title="历史详细车流量">
            <DatePicker.RangePicker defaultValue={rangeDate.map(v => dayjs(v))} showTime onChange={(dates, datesString) => {
              setRangeDate(datesString)
            }}/>
            <Chart
              appendPadding={[10, 0, 0, 10]}
              autoFit
              height={500}
              data={lineData2}
            >
              <Line position="time*value" color="label"/>
              <Point position="time*value" color="label"/>
              <Tooltip shared={true} showCrosshairs />
            </Chart>
          </Card>
        </Col>
      </Row>
      <Card title="视频播放列表-上行隧道">
        <Row gutter={24} style={{marginBottom: 24}} className="video-box">
          <Col span={8}>
            <div style={{position: 'relative', width: '100%'}}>
              <video id="my-video1" className="video-js" controls preload="auto">
                <source src="http://localhost:8000/path/path1/stream.m3u8" type="application/x-mpegURL" />
              </video>
            </div>
          </Col>
          <Col span={8}>
            <div style={{position: 'relative', width: '100%'}}>
              <video id="my-video2" className="video-js" controls preload="auto">
                <source src="http://localhost:8000/path/path2/stream.m3u8" type="application/x-mpegURL" />
              </video>
            </div>
          </Col>
          <Col span={8}>
            <div style={{position: 'relative', width: '100%'}}>
              <video id="my-video3" className="video-js" controls preload="auto">
                <source src="http://localhost:8000/path/path3/stream.m3u8" type="application/x-mpegURL" />
              </video>
            </div>
          </Col>
        </Row>
      </Card>
      <Card title="视频播放列表-下行隧道">
        <Row gutter={24} style={{marginBottom: 24}} className="video-box">
          <Col span={8}>
            <div style={{position: 'relative', width: '100%'}}>
              <video id="my-video1" className="video-js" controls preload="auto">
                <source src="http://localhost:8000/path/path4/stream.m3u8" type="application/x-mpegURL" />
              </video>
            </div>
          </Col>
          <Col span={8}>
            <div style={{position: 'relative', width: '100%'}}>
              <video id="my-video2" className="video-js" controls preload="auto">
                <source src="http://localhost:8000/path/path5/stream.m3u8" type="application/x-mpegURL" />
              </video>
            </div>
          </Col>
          <Col span={8}>
            <div style={{position: 'relative', width: '100%'}}>
              <video id="my-video3" className="video-js" controls preload="auto">
                <source src="http://localhost:8000/path/path6/stream.m3u8" type="application/x-mpegURL" />
              </video>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default App;
