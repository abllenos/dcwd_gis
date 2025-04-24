import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { getCustomerStat } from './endpoints/getCustomerStat'; 
import CountUp from 'react-countup';
import type { StatisticProps } from 'antd';
import MapComponent from './mapView';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

interface StatResult {
  All: number;
  Active: number;
  DismountedTurnedoff: number;
}

interface Row {
  val: [number, number, number];
}

const Dashboard: React.FC = () => {
  const [row, setRow] = useState<Row>({ val: [0, 0, 0] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statResult = await getCustomerStat();
        console.log('API Response:', statResult);
    
        if (statResult && statResult.data) {
          console.log('Data:', statResult.data); 
          
          if (Array.isArray(statResult.data)) {
            const statData: StatResult[] = statResult.data;
    
            if (statData.length > 0) {
              const result = statData[0];
              setRow({ val: [result.All, result.Active, result.DismountedTurnedoff] });
            } else {
              setRow({ val: [0, 0, 0] });
            }
          } else {
            console.error('Data is not an array:', statResult.data);
            setRow({ val: [0, 0, 0] });
          }
        } else {
          console.error('Invalid API response structure:', statResult);
          setRow({ val: [0, 0, 0] });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRow({ val: [0, 0, 0] });
      }
    };
 
    fetchData();
  }, []);

  return (
    <>
      <div>
        <Row style={{ textAlign: 'center', margin: '20px 0 0 410px' }} gutter={16}>
          <Col span={6}>
            <Card title="Customer" bordered={false}>
              <Statistic value={row.val[0]} formatter={formatter} />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Active" bordered={false}>
              <Statistic value={row.val[1]} formatter={formatter} />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Dismounted" bordered={false}>
              <Statistic value={row.val[2]} formatter={formatter} />
            </Card>
          </Col>
        </Row>
      </div>
      <div style ={{margin: '20px'}}>
        <MapComponent geometry={null}/>
      </div>
    </>
  );
};

export default Dashboard;
