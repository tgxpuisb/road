import { useEffect, useState } from 'react'
import { Card, Row, Col, DatePicker, Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons'
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
  const [videoPos, setVideoPos] = useState('TOP') // BOTTOM

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

  const [trendData, setTrendData] = useState({
    top: [],
    bottom: []
  })

  console.log('rangeDate', rangeDate)

  useEffect(() => {
    axios
      .postForm('http://localhost:8001/history_h', {
        start_date: dayjs(rangeDate[0], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
        end_date: dayjs(rangeDate[1], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
      })
      .then(res => {
        if (res.status === 200 && res.data) {
          const top = []
          const bottom = []
          ;(res.data?.historydata ?? []).forEach(it => {
            top.push({
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '上行总量',
              value: it[1],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '上行段一',
              value: it[2],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '上行段二',
              value: it[3],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '上行段三',
              value: it[4],
            })

            bottom.push({
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '下行总量',
              value: it[6],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '下行段一',
              value: it[7],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '下行段二',
              value: it[8],
            }, {
              time: dayjs(it[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
              label: '下行段三',
              value: it[9],
            })
          })
          console.log('history_h', res.data)
          setTrendData({
            top,
            bottom,
          })
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [rangeDate])

  useEffect(() => {
    let videos = []
    if (videoPos === 'TOP') {
      setTimeout(() => {
        videos = [
          videojs('my-video1'),
          videojs('my-video2'),
          videojs('my-video3'),
          videojs('my-video4'),
        ]
      }, 200)
    } else {
      videos = [
        videojs('my-video5'),
        videojs('my-video6'),
        videojs('my-video7'),
        videojs('my-video8'),
      ]
    }
    return () => {
      videos.map(video => video?.dispose())
      videos = null
    }
  }, [videoPos])

  const topLamp = [2, 6, 11, 17].map(v => v-1)
  const bottomLamp = [3, 8, 13, 18].map(v => v-1)

  return (
    <div style={{padding: 24}}>
      <Card style={{marginBottom: 24}} title={`视频播放列表-${videoPos === 'TOP' ? '上行' : '下行'}隧道`} extra={<Button icon={<SwapOutlined />} type="primary" onClick={() => setVideoPos(videoPos === 'TOP' ? 'BOTTOM' : 'TOP')}>上/下行隧道切换</Button>}>
        <Row gutter={24} style={{marginBottom: 24}} className="video-box">
          {(videoPos === 'TOP' ? [1,2,3,4] : [5,6,7,8]).map(v => {
            return (
              <Col span={6} key={v}>
                <div style={{position: 'relative', width: '100%'}}>
                  <video id={`my-video${v}`} className="video-js" controls preload="auto">
                    <source src={`http://localhost:8000/path/path${v}/stream.m3u8`} type="application/x-mpegURL" />
                  </video>
                </div>
              </Col>
            )
          })}
        </Row>
        <Row justify={"center"}>
          {Array.from({length: 20}).map((v, i) => {
            const isSelected = videoPos === 'TOP' ? (topLamp.includes(i)) : (bottomLamp.includes(i))
            return <div key={v} style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: isSelected ? '#52C41A' : '#DDD',
              marginRight: i !== 19 ? 24 : 0
            }}></div>
          })}
        </Row>
      </Card>
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
      <Row style={{marginBottom: 24}} gutter={24}>
        <Col span={12}>
          <Card title="历史详细车流量(上行)">
            <DatePicker.RangePicker defaultValue={rangeDate.map(v => dayjs(v))} showTime onChange={(dates, datesString) => {
              setRangeDate(datesString)
            }}/>
            <Chart
              appendPadding={[10, 0, 0, 10]}
              autoFit
              height={500}
              data={trendData.top}
            >
              <Line position="time*value" color="label"/>
              <Point position="time*value" color="label"/>
              <Tooltip shared={true} showCrosshairs />
            </Chart>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="历史详细车流量(下行)">
            <DatePicker.RangePicker defaultValue={rangeDate.map(v => dayjs(v))} showTime onChange={(dates, datesString) => {
              setRangeDate(datesString)
            }}/>
            <Chart
              appendPadding={[10, 0, 0, 10]}
              autoFit
              height={500}
              data={trendData.bottom}
            >
              <Line position="time*value" color="label"/>
              <Point position="time*value" color="label"/>
              <Tooltip shared={true} showCrosshairs />
            </Chart>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
