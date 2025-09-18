import React, { useState } from 'react';
import { Modal, Button, Image, Tabs } from 'antd';
import { FileSearchOutlined, EnvironmentOutlined, FileImageOutlined } from '@ant-design/icons';
import { LeakData } from '../../types/Leakdata';
import { MODAL_SIZES, SECTION_STYLES, BUTTON_STYLES, GRID_LAYOUTS } from './ModalDesignSystem';

interface ReportDetailsProps {
  visible: boolean;
  record: LeakData | null;
  onCancel: () => void;
  activeTab: string;
  columnMap: Record<string, { title: string; dataIndex: string }>;
  columnPresets: Record<string, string[]>;
}

const dummyImages = [
  'https://via.placeholder.com/150?text=Image+1',
  'https://via.placeholder.com/150?text=Image+2',
  'https://via.placeholder.com/150?text=Image+3',
];

const ReportDetails: React.FC<ReportDetailsProps> = ({
  visible,
  record,
  onCancel,
  activeTab,
  columnMap,
  columnPresets,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showImagesSection, setShowImagesSection] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTabKey, setActiveTabKey] = useState('details');

  // Use record.images if available, else fallback to dummy images
  const imagesArray =
    record?.images && record.images.length > 0 ? record.images : dummyImages;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="close"
          type="primary"
          style={BUTTON_STYLES.primary}
          onClick={onCancel}
        >
          Close
        </Button>,
      ]}
      width={MODAL_SIZES.large}
      closeIcon={false}
      styles={{ body: {padding: 0 }}}

      centered
      title={null}
    >
      {record && (
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
                    Report Details
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0' }}>
                    {/* Details Section */}
                    <div style={SECTION_STYLES.content}>
                      <div style={GRID_LAYOUTS.twoColumn}>
                        {/* Left Column */}
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 20px 1fr', rowGap: 12, columnGap: 10 }}>
                          <div><strong>REPORT ID</strong></div>
                          <div>:</div>
                          <div>{record.id || 'N/A'}</div>
                          
                          <div><strong>LANDMARK</strong></div>
                          <div>:</div>
                          <div>{record.landmark || 'N/A'}</div>
                          
                          <div><strong>LOCATION</strong></div>
                          <div>:</div>
                          <div>{record.location || 'N/A'}</div>
                          
                          <div><strong>DATE REPORTED</strong></div>
                          <div>:</div>
                          <div>{record.dateReported || 'N/A'}</div>
                        </div>
                        
                        {/* Right Column */}
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 20px 1fr', rowGap: 12, columnGap: 10 }}>
                          <div><strong>REFERENCE METER</strong></div>
                          <div>:</div>
                          <div>{record.referenceMeter || 'N/A'}</div>
                          
                          <div><strong>LEAK TYPE</strong></div>
                          <div>:</div>
                          <div>{record.leakType || 'N/A'}</div>
                          
                          <div><strong>PRESSURE</strong></div>
                          <div>:</div>
                          <div>{record.leakPressure || 'N/A'}</div>
                          
                          <div><strong>CONTACT NO</strong></div>
                          <div>:</div>
                          <div>{record.referenceNo || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'location',
                label: (
                  <span style={{ color: activeTabKey === 'location' ? '#1890ff' : '#666' }}>
                    <EnvironmentOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                    Report Location
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0', minHeight: 300 }}>
                    <div
                      style={{
                        padding: 40,
                        background: '#f0f9ff',
                        border: '1px solid #91d5ff',
                        borderRadius: 8,
                        textAlign: 'center',
                        fontStyle: 'italic',
                        color: '#555',
                      }}
                    >
                      <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
                      <div style={{ fontSize: 16, marginBottom: 8 }}>Location Map</div>
                      <div>Latitude: {record.latitude || 'N/A'}</div>
                      <div>Longitude: {record.longitude || 'N/A'}</div>
                      <div style={{ marginTop: 16, fontSize: 14, color: '#999' }}>
                        Interactive map would be displayed here
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'images',
                label: (
                  <span style={{ color: activeTabKey === 'images' ? '#1890ff' : '#666' }}>
                    <FileImageOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                    Report Images
                  </span>
                ),
                children: (
                  <div style={{ padding: '16px 0', minHeight: 300 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, textAlign: 'center' }}>
                      {imagesArray.map((imgUrl: string, idx: number) => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              width: 140,
                              height: 140,
                              border: '2px dashed #d9d9d9',
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 12px',
                              backgroundColor: '#fafafa',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => setPreviewImage(imgUrl)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#1890ff';
                              e.currentTarget.style.backgroundColor = '#f0f9ff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d9d9d9';
                              e.currentTarget.style.backgroundColor = '#fafafa';
                            }}
                          >
                            <div style={{ textAlign: 'center', color: '#999' }}>
                              <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                              <div style={{ fontSize: 11 }}>IMAGE NOT FOUND</div>
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Leak Image {idx + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ]}
          />

          {/* Image Preview Modal */}
          <Modal
            open={!!previewImage}
            footer={null}
            onCancel={() => setPreviewImage(null)}
            centered
            styles={{body: {padding: 0 }}}

          >
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}
          </Modal>
        </div>
      )}
    </Modal>
  );
};

export default ReportDetails;
