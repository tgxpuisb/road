import { useEffect, useState } from 'react'
import { Card, Row, Col } from 'antd';
// import Granim from 'granim'
import axios from 'axios';
import videojs from 'video.js';
import { Chart, Line, Point } from 'bizcharts';
import 'video.js/dist/video-js.css'
import './App.css';

function App() {

  const [infos, setInfos] = useState(null)
  const [lineData, setLineData] = useState([])

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
    axios
      .get('http://localhost:8001/history')
      .then(res => {
        if (res.status === 200 && res.data) {
          // setInfos(res.data)
          const data = res.data?.historydata ?? [].map(it => {
            return {
              time: it[0],
              value: it[1]
            }
          })
          console.log(data)
          setLineData(data)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    // new Granim({
    //   element: '#tunnel-1',
    //   direction: 'left-right',
    //   states : {
    //       "default-state": {
    //           gradients: [
    //               [
    //                 { color: '#ff3a00', pos: .2 },
    //                 { color: '#00ff00', pos: .5 },
    //                 { color: '#fd1d1d', pos: .8 },
    //                 { color: '#38ef7d', pos: 1 }
    //               ],
    //           ]
    //       }
    //   }
    // })

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
              <>
                <div>隧道内车辆总数：<b>{infos.parameter1}</b></div>
                <div>隧道内第一段车辆数：<b>{infos.parameter2}</b></div>
                <div>隧道内第二段车辆数：<b>{infos.parameter3}</b></div>
                <div>每小时车流量：<b>{infos.parameter4}</b></div>
              </>:
              <span>暂无数据</span>
            }
            
          </Card>
        </Col>
        {/* <Col span={16}>
          <Card title="隧道车流量">
            
          </Card>
        </Col> */}
      </Row>
      <Row style={{marginBottom: 24}}>
        <Col span={24}>
          <Card title="数据趋势">
            <Chart
              appendPadding={[10, 0, 0, 10]}
              autoFit
              height={500}
              data={lineData}
            >
              <Line position="time*value" />
              <Point position="time*value" />
            </Chart>
          </Card>
        </Col>
      </Row>
      <Card title="视频播放列表">
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
    </div>
  );
}

export default App;
