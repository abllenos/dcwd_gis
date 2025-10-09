import { Card, Typography, Row, Col, Select, Button } from 'antd';
import { FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import Footer from './layout/Footer';
import { observer } from 'mobx-react-lite';
import { buildingFootprintsStore } from '../stores/buildingFootprintsStore';

const { Title } = Typography;

const months = [
  { value: '', label: '-- Month --' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const years = [
  { value: '', label: '-- Year --' },
  ...Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
  })
];


const BuildingFootprints = observer(() => {
  const { month, setMonth, year, setYear } = buildingFootprintsStore;

  return (
    <>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '0', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '16px', marginTop: '0' }}>
        <div style={{ background: '#e6edfc', borderRadius: '12px 12px 0 0', padding: '12px 24px', marginBottom: 18 }}>
          <Title level={5} style={{ color: '#2563eb', margin: 0 }}>Building Footprints</Title>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            Filter<span style={{ color: 'red' }}>*</span>
          </div>
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Select
                value={month}
                onChange={setMonth}
                style={{ width: '100%' }}
                options={months}
                prefix={<CalendarOutlined />}
                placeholder="-- Month --"
                suffixIcon={<CalendarOutlined style={{ color: '#6b7280' }} />}
              />
            </Col>
            <Col span={6}>
              <Select
                value={year}
                onChange={setYear}
                style={{ width: '100%' }}
                options={years}
                prefix={<CalendarOutlined />}
                placeholder="-- Year --"
                suffixIcon={<CalendarOutlined style={{ color: '#6b7280' }} />}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" icon={<FilterOutlined />} className="license-register-button" style={{ width: 100 }}>
                Filter
              </Button>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
});

export default BuildingFootprints;
