import React, { useState, useEffect } from 'react';
import MapComponent from '../Endpoints/MapView';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  Row,
  Col,
  Breadcrumb,
  message,
  Space,
  Modal,
} from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { devApi } from '../Endpoints/Interceptor';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
};

const ReportALeak: React.FC = () => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState(7.0722);
  const [lng, setLng] = useState(125.6131);
  const [wscode, setWscode] = useState<string>('');
  const [CT_ID, setCaretaker] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ address?: string; NearestMeter?: string }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string }>({ title: '', content: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Your session has expired. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      fetchWscode(lat, lng);
      fetchCaretaker(lat, lng);
    }
  }, [lat, lng]);

  const fetchWscode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        setWscode(data.data[0].wscode);
      }
    } catch (error) {
      console.error('Error fetching wscode: ', error);
    }
  };

  const fetchCaretaker = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getCaretaker.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      if (data?.CT_ID) {
        setCaretaker(data.CT_ID);
      } else if (Array.isArray(data.data) && data.data[0]?.CT_ID) {
        setCaretaker(data.data[0].CT_ID);
      }
    } catch (error) {
      console.error('Error fetching caretaker: ', error);
    }
  };

  const handleMapClick = React.useCallback((clickedLat: number, clickedLng: number) => {
    setLat(clickedLat);
    setLng(clickedLng);
  }, []);

  const showModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem('debug_token');
    if (!token) {
      showModal('Session Expired', 'Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }

    const DateReported = new Date()
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '+00:00');
    const formData = new FormData();
    formData.append('Name', values.Name || '');
    formData.append('Number', values.Number || '');
    formData.append('NearestMeter', values.NearestMeter || '');
    formData.append('Address', values.address || '');
    formData.append('Landmark', values.Landmark || '');
    formData.append('LeakPressure', values.leakPressure || '');
    formData.append('Visibility', values.visibility || '');
    formData.append('TypeId', values.typeId || '');
    formData.append('SpoolID', '0');
    formData.append('Latitude', lat.toString());
    formData.append('Longitude', lng.toString());
    formData.append('remarks', values.Remarks || '');
    formData.append('ct_code', CT_ID || '');
    formData.append('wscode', wscode || '');
    formData.append('DT_Reported', DateReported);
    formData.append('refAccNo', values.refAccNo || '');

    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('Images', file.originFileObj);
      });
    }

    try {
      setLoading(true);
      await devApi.post(
        'dcwd-gis/api/v1/admin/LeakDetection/saveLeakReport',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success('Leak report submitted successfully');
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      if (error.response?.status === 401) {
        showModal('Unauthorized', 'Unauthorized. Please log in again.');
        navigate('/login');
      } else {
        showModal('Submission Failed', 'Failed to submit leak report.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCustomer = async () => {
    if (!searchValue.trim()) {
      showModal('Warning', 'Please enter an account number or meter number');
      return;
    }

    const token = localStorage.getItem('debug_token');
    if (!token) {
      showModal('Session Expired', 'Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      setSearchLoading(true);
      const response = await devApi.get(
        `dcwd-gis/api/v1/admin/customer/SearchAccountOrMeterNumber`,
        {
          params: { searchValue },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.statusCode === 200 && response.data.data?.length > 0) {
        const customer = response.data.data[0];

        const accountNumber = customer.accountNumber || '';
        const RefAccAddress = accountNumber.match(/-(.*?)-/)?.[1] || '';

        form.setFieldsValue({
          address: customer.address || '',
          NearestMeter: customer.meterNumber || '',
          refAccNo: RefAccAddress,
        });

        const newLat = parseFloat(customer.latitude);
        const newLng = parseFloat(customer.longitude);

        if (!isNaN(newLat) && !isNaN(newLng)) {
          setLat(newLat);
          setLng(newLng);
        }
      } else if (response.data?.statusCode === 404) {
        showModal('Not Found', response.data.message || 'Account or Meter Number not found in the database.');

        form.setFieldsValue({
          address: '',
          NearestMeter: '',
          refAccNo: '',
        });
        setLat(7.0722);
        setLng(125.6131);
      } else {
        showModal('Error', 'Unexpected response from the server');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        showModal('Not Found', error.response.data?.message || 'Account or Meter Number not found in the database.');

        form.setFieldsValue({
          address: '',
          NearestMeter: '',
          refAccNo: '',
        });
        setLat(7.0722);
        setLng(125.6131);
      } else {
        showModal('Error', 'Failed to search customer');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <Title level={3} style={{ marginBottom: 0 }}>
        Report A Leak
      </Title>

      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>Create A Report</Breadcrumb.Item>
        <Breadcrumb.Item>Report A Leak</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(changedValues, allValues) => {
            setFormValues(allValues);
          }}
        >
          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>
              Contact Information
            </Text>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span
                    style={{
                      ...labelStyle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <SearchOutlined style={{ fontSize: 15 }} /> Search Account No or Meter No
                  </span>
                }
              >
                <Space.Compact style={{ display: 'flex' }}>
                  <Input
                    style={{ flex: 1 }}
                    placeholder="Enter Account or Meter Number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={handleSearchCustomer}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearchCustomer}
                    loading={searchLoading}
                  >
                    Search
                  </Button>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="Name" label={<span style={labelStyle}>Name</span>}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Number" label={<span style={labelStyle}>Contact No.</span>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>
              Leak Information
            </Text>
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="typeId" label={<span style={labelStyle}>Leak Type</span>}>
                <Select placeholder="-SELECT-">
                  <Option value="1">Service Line</Option>
                  <Option value="2">Main Line</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="leakPressure" label={<span style={labelStyle}>Leak Pressure</span>}>
                <Select placeholder="-SELECT-">
                  <Option value="1">High</Option>
                  <Option value="2">Low</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visibility" label={<span style={labelStyle}>Visibility</span>}>
                <Select placeholder="-SELECT-">
                  <Option value="1">Exposed Leak</Option>
                  <Option value="2">Underground Leak</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Landmark" label={<span style={labelStyle}>Landmark</span>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="NearestMeter" label="Nearest Meter">
                <Input />
              </Form.Item>
              <Form.Item name="refAccNo" label={<span style={labelStyle}>RecAddress</span>}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Remarks" label={<span style={labelStyle}>Remarks</span>}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>
              Search Address
            </Text>
          </Divider>

          <Form.Item label={<span style={labelStyle}>Search</span>}>
            <Input placeholder="e.g., Matina, Davao City, Davao del Sur" addonAfter={<EnvironmentOutlined />} />
          </Form.Item>

          <div style={{ height: 400, border: '1px solid #ccc', marginBottom: 24 }}>
            <MapComponent lat={lat} lng={lng} onMapClick={handleMapClick} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button danger>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </div>
        </Form>
      </div>

      <Modal
        title={modalContent.title}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="OK"
      >
        <p>{modalContent.content}</p>
      </Modal>
    </div>
  );
};

export default ReportALeak;
