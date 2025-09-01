import React from 'react';
import { Modal, Button, Tabs } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

interface QualityComplaintData {
  key: string;
  id: string;
  accountNumber: string;
  location: string;
  remarks: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
}

interface QualityComplaintDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedRecord: QualityComplaintData | null;
}

const QualityComplaintDetailsModal: React.FC<QualityComplaintDetailsModalProps> = ({
  visible,
  onCancel,
  selectedRecord,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState('details');

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="close"
          type="primary"
          style={{ backgroundColor: '#00B4D8', borderColor: '#00B4D8', fontWeight: 500 }}
          onClick={onCancel}
        >
          Close
        </Button>,
      ]}
      width={1000}
      closeIcon={false}
      style={{ padding: 0 }}
      centered
      title={null}
    >
      {selectedRecord && (
        <div style={{ padding: 16 }}>
          <Tabs 
            activeKey={activeTabKey} 
            onChange={setActiveTabKey}
            centered
            tabBarStyle={{ 
              borderBottom: 'none',
              marginBottom: 0,
            }}
            items={[
              {
                key: 'details',
                label: (
                  <span style={{ color: activeTabKey === 'details' ? '#1890ff' : '#666' }}>
                    <FileSearchOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    Complaint Details
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0' }}>
                    {/* Details Section */}
                    <div
                      style={{
                        padding: 24,
                        background: '#f0f9ff',
                        border: '1px solid #91d5ff',
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40 }}>
                        {/* Left Column */}
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 20px 1fr', rowGap: 12, columnGap: 10 }}>
                          <div><strong>COMPLAINT ID</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.id || 'N/A'}</div>
                          
                          <div><strong>ACCOUNT NUMBER</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.accountNumber || 'N/A'}</div>
                          
                          <div><strong>LOCATION</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.location || 'N/A'}</div>
                          
                          <div><strong>DATE REPORTED</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.dateTimeReported || 'N/A'}</div>
                        </div>
                        
                        {/* Right Column */}
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 20px 1fr', rowGap: 12, columnGap: 10 }}>
                          <div><strong>REFERENCE METER</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.referenceMeter || 'N/A'}</div>
                          
                          <div><strong>REMARKS</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.remarks || 'N/A'}</div>
                          
                          <div><strong>CONTACT NO</strong></div>
                          <div>:</div>
                          <div>{selectedRecord.contactNo || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </Modal>
  );
};

export default QualityComplaintDetailsModal;
