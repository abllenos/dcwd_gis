import React, { useState } from 'react';
import { Modal, Button, Image } from 'antd';
import { FileSearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { LeakData } from '../../types/Leakdata';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
          style={{ backgroundColor: '#00B4D8', borderColor: '#00B4D8', fontWeight: 500 }}
          onClick={onCancel}
        >
          Close
        </Button>,
      ]}
      width={900}
      closeIcon={false}
      bodyStyle={{ paddingTop: 0, paddingBottom: 8 }}
      centered
      title={
        <div
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '10px 10px 0 0',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          <FileSearchOutlined style={{ marginRight: 8 }} />
          Report Details
        </div>
      }
    >
      {record && (
        <div
          style={{
            backgroundColor: '#f8fbfe',
            border: '1px solid #bcdfff',
            borderRadius: '0 0 10px 10px',
            padding: '20px 24px',
            marginTop: -16,
            fontSize: 15,
            lineHeight: '1.8',
          }}
        >
          {/* Details Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 7 }}>
            {(columnPresets[activeTab] || []).map((key) => (
              <React.Fragment key={key}>
                <div>
                  <strong>{columnMap[key]?.title}:</strong>
                </div>
                <div>{(record as any)[key] || 'N/A'}</div>
              </React.Fragment>
            ))}
            <div>
              <strong>Leak Pressure:</strong>
            </div>
            <div>{record.leakPressure || 'N/A'}</div>
          </div>

          {/* Repaired Summary */}
          {activeTab === 'repaired' && (
            <div
              style={{
                marginTop: 20,
                padding: '12px',
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: 6,
              }}
            >
              <strong>Repaired Summary:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Repaired Leak: {record.repairedLeaks || 'N/A'}</li>
                <li>Date Repaired: {record.dateRepaired || 'N/A'}</li>
                <li>Team Leader: {record.teamLeader || 'N/A'}</li>
              </ul>
            </div>
          )}

          {/* Toggle Buttons for Location and Images */}
          <div style={{ marginTop: 20 }}>
            <Button
              type="dashed"
              icon={<EnvironmentOutlined />}
              onClick={() => setShowMap((prev) => !prev)}
              style={{ marginRight: 12 }}
            >
              {showMap ? 'Hide Location' : 'View Location'}
            </Button>

            <Button type="dashed" onClick={() => setShowImages((prev) => !prev)}>
              {showImages ? 'Hide Images' : 'View Images'}
            </Button>
          </div>

          {/* Dummy Location Content */}
          {showMap && (
            <div
              style={{
                marginTop: 16,
                padding: 20,
                background: '#f0f9ff',
                border: '1px solid #91d5ff',
                borderRadius: 8,
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#555',
              }}
            >
              📍 Location Map Placeholder (Latitude: {record.latitude || 'N/A'}, Longitude: {record.longitude || 'N/A'})
            </div>
          )}

          {/* Images Section */}
          {showImages && (
            <div style={{ marginTop: 24 }}>
              <strong>Images:</strong>
              <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {imagesArray.map((imgUrl: string, idx: number) => (
                  <Image
                    key={idx}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', cursor: 'pointer', borderRadius: 6 }}
                    src={imgUrl}
                    alt={`Image ${idx + 1}`}
                    preview={false}
                    onClick={() => setPreviewImage(imgUrl)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          <Modal
            visible={!!previewImage}
            footer={null}
            onCancel={() => setPreviewImage(null)}
            centered
            bodyStyle={{ padding: 0 }}
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
