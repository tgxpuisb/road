import { useEffect, useState } from 'react'
import { Card, Row, Col } from 'antd';
import Granim from 'granim'
import axios from 'axios';
import './App.css';

function App() {

  const [infos, setInfos] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:8001/parameters')
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          setInfos(res.data)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    new Granim({
      element: '#tunnel-1',
      direction: 'left-right',
      states : {
          "default-state": {
              gradients: [
                  [
                    { color: '#ff3a00', pos: .2 },
                    { color: '#00ff00', pos: .5 },
                    { color: '#fd1d1d', pos: .8 },
                    { color: '#38ef7d', pos: 1 }
                  ],
              ]
          }
      }
    })

    // new Granim({
    //   element: '#tunnel-2',
    //   direction: 'left-right',
    //   states : {
    //       "default-state": {
    //           gradients: [
    //               [
    //                 { color: '#00ff00', pos: .2 },
    //                 { color: '#00ff00', pos: .5 },
    //                 { color: '#ff0000', pos: .8 },
    //                 { color: '#00ef7d', pos: 1 }
    //               ],
    //           ]
    //       }
    //   }
    // })

    // new Granim({
    //   element: '#tunnel-3',
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
          <Card title="流量整合图">
            <div className='tunnel-bg'>
              <canvas className="tunnel" id="tunnel-1"></canvas>
            </div>
          </Card>
        </Col>
      </Row>
      <Card title="视频播放列表">
        <Row gutter={24} style={{marginBottom: 24}} className="video-box">
          <Col span={8}>
            <video controls>
              <source src="http://localhost:8000/path/path1/stream.m3u8" type="application/x-mpegURL" />
            </video>
          </Col>
          <Col span={8}>
            <video controls src="http://localhost:8001/path/path2/stream.m3u8">
              <source src="http://localhost:8000/path/path2/stream.m3u8" type="application/x-mpegURL" />
            </video>
          </Col>
          <Col span={8}>
            <video controls src="http://localhost:8001/path/path3/stream.m3u8">
              <source src="http://localhost:8000/path/path3/stream.m3u8" type="application/x-mpegURL" />
            </video>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default App;
