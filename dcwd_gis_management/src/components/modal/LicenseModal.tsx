import React from 'react';
import { Typography, Form, DatePicker, Button, Row, Col, message, Table, Modal, Switch, Input, Select } from 'antd';
import { CalendarOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { licenseStore } from '../../stores/licenseStore';

const { Option } = Select;

interface LicenseModalProps {
  // Props can be added here if needed for external control
}

const LicenseModal: React.FC<LicenseModalProps> = observer(() => {
  const [renewForm] = Form.useForm();

  const handleStatusChange = (checked: boolean) => {
    licenseStore.setUserStatus(checked);
    message.success(`Status ${checked ? 'activated' : 'deactivated'} successfully!`);
  };

  const handleRenew = () => {
    licenseStore.openRenewModal();
  };

  const handleRenewSubmit = (values: any) => {
    message.success('License renewed successfully!');
    licenseStore.setRenewModalVisible(false);
    renewForm.resetFields();
  };

  const installationLogsColumns = [
    {
      title: 'Installation Date',
      dataIndex: 'installationDate',
      key: 'installationDate',
      sorter: true,
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      sorter: true,
    },
    {
      title: 'Remaining Days',
      dataIndex: 'remainingDays',
      key: 'remainingDays',
      sorter: true,
    },
    {
      title: 'Administered By',
      dataIndex: 'administeredBy',
      key: 'administeredBy',
      sorter: true,
    },
  ];

  return (
    <>
      {/* Installation Details Modal */}
      <Modal
        title="Installation Details"
        open={licenseStore.modalVisible}
        onCancel={() => licenseStore.setModalVisible(false)}
        footer={null}
        width={1000}
        closeIcon={<CloseOutlined />}
      >
        {licenseStore.selectedUser && (
          <div>
            {/* Installation Details Section */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 20px', marginBottom: '20px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <Typography.Text strong style={{ color: 'var(--text-secondary)' }}>Installation Details</Typography.Text>
            </div>

            <Row gutter={[24, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Typography.Text strong>Registered To: </Typography.Text>
                <Typography.Text>{licenseStore.selectedUser.userId || 'mpbaron'}</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Department: </Typography.Text>
                <Typography.Text>{licenseStore.selectedUser.department}</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Software Version: </Typography.Text>
                <Typography.Text>MapInfo Professional 19</Typography.Text>
              </Col>
              <Col span={6}>
                <Typography.Text strong>License Type: </Typography.Text>
                <Typography.Text>Trial Version</Typography.Text>
              </Col>
              <Col span={6}>
                <Typography.Text strong>PC Name: </Typography.Text>
                <Typography.Text>{licenseStore.selectedUser.deviceName}</Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text strong>Status: </Typography.Text>
                <Switch 
                  checked={licenseStore.userStatus} 
                  size="small" 
                  style={{ marginLeft: 8 }}
                  onChange={handleStatusChange}
                />
              </Col>
            </Row>

            {/* Installation Logs Section */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 20px', marginBottom: '20px', borderRadius: '4px' }}>
              <Typography.Text strong style={{ color: 'var(--text-secondary)' }}>Installation logs</Typography.Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Typography.Text>Display </Typography.Text>
                  <Select defaultValue="10" size="small" style={{ width: 60, margin: '0 8px' }}>
                    <Option value="10">10</Option>
                    <Option value="25">25</Option>
                    <Option value="50">50</Option>
                  </Select>
                  <Typography.Text> records per page</Typography.Text>
                </Col>
                <Col>
                  <Typography.Text>Search: </Typography.Text>
                  <Input.Search
                    size="small"
                    placeholder=""
                    style={{ width: 200, marginLeft: 8 }}
                    enterButton
                    onSearch={(value) => {
                      // Add search functionality here if needed
                    }}
                    onChange={(e) => {
                      // Add onChange functionality here if needed
                    }}
                  />
                </Col>
              </Row>
            </div>

            <Table
              columns={installationLogsColumns}
              dataSource={licenseStore.installationLogs}
              pagination={false}
              size="small"
              style={{ marginBottom: '16px' }}
            />

            <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
              <Col>
                <Typography.Text>Showing page 1 of 1</Typography.Text>
              </Col>
              <Col>
                <Button size="small" disabled>Previous</Button>
                <Button size="small" type="primary" style={{ margin: '0 4px' }}>1</Button>
                <Button size="small" disabled>Next</Button>
              </Col>
            </Row>

            <div style={{ textAlign: 'left' }}>
              <Button 
                type="primary" 
                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                onClick={handleRenew}
              >
                Renew
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Renew Trial Version Modal */}
      <Modal
        title="Renew Trial Version"
        open={licenseStore.renewModalVisible}
        onCancel={() => licenseStore.setRenewModalVisible(false)}
        footer={null}
        width={600}
        closeIcon={<CloseOutlined />}
      >
        <Form
          form={renewForm}
          layout="vertical"
          onFinish={handleRenewSubmit}
          style={{ padding: '20px 0' }}
        >
          <Form.Item
            label={<span style={{ fontWeight: 'bold' }}>Installation Date<span style={{ color: 'red' }}>*</span></span>}
            name="installationDate"
            rules={[{ required: true, message: 'Please select installation date!' }]}
          >
            <DatePicker 
              style={{ width: '100%', height: '40px' }} 
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ 
                backgroundColor: 'var(--primary-color)', 
                borderColor: 'var(--primary-color)',
                height: '36px',
                padding: '0 20px'
              }}
            >
              Save
            </Button>
            <Button 
              onClick={() => licenseStore.setRenewModalVisible(false)}
              style={{ 
                height: '36px',
                padding: '0 20px'
              }}
            >
              Close
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
});

export default LicenseModal;