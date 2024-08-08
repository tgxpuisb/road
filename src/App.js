import { useEffect } from 'react'
import './App.css';
import { Select, Form, Space, Card, Row, Col } from 'antd';
import Granim from 'granim'

function App() {

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

    new Granim({
      element: '#tunnel-2',
      direction: 'left-right',
      states : {
          "default-state": {
              gradients: [
                  [
                    { color: '#00ff00', pos: .2 },
                    { color: '#00ff00', pos: .5 },
                    { color: '#ff0000', pos: .8 },
                    { color: '#00ef7d', pos: 1 }
                  ],
              ]
          }
      }
    })

    new Granim({
      element: '#tunnel-3',
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
  }, [])

  return (
    <div style={{padding: 24}}>
      {/* <Form className='filter' style={{ maxWidth: 400 }}>
        <Form.Item
          name="tunnel"
          label="请选择隧道"
        >
          <Select
            defaultValue={'1'}
            options={[
              {
                label: '隧道1',
                value: '1'
              },
              {
                label: '隧道2',
                value: '2'
              },
            ]}
          />
        </Form.Item>
      </Form> */}
      <Row gutter={24} style={{marginBottom: 24}}>
        <Col span={8}>
          <Card title="流量信息栏">
          </Card>
        </Col>
        <Col span={16}>
          <Card title="隧道车流量">
            <canvas className="tunnel" id="tunnel-1"></canvas>
            <canvas className="tunnel" id="tunnel-2"></canvas>
            <canvas className="tunnel" id="tunnel-3"></canvas>
          </Card>
        </Col>
      </Row>
      <Row style={{marginBottom: 24}}>
        <Col span={24}>
          <Card title="流量整合图">
            <div style={{height: 300}}></div>
          </Card>
        </Col>
      </Row>
      <Card title="视频播放列表">
        <Row gutter={24} style={{marginBottom: 24}}>
          <Col span={8}>
            <video controls src="http://localhost:8000/path/path1/stream.m3u8"></video>
          </Col>
          <Col span={8}>
            <video controls src="http://localhost:8000/path/path2/stream.m3u8"></video>
          </Col>
          <Col span={8}>
            <video controls src="http://localhost:8000/path/path3/stream.m3u8"></video>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default App;
