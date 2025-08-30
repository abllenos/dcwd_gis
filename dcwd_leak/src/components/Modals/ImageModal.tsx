import React, { useState } from 'react';
import { Modal, Image } from 'antd';

interface RepairPhotoModalProps {
  visible: boolean
  onCancel: () => void;
  images: string[];
}

const RepairPhotoModal: React.FC<RepairPhotoModalProps> = ({ visible, onCancel, images }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <Modal
      open={visible}
      title="Report Images"
      footer={null}
      onCancel={onCancel}
      width={1000}
      centered
      styles={{ body: {padding: 16 }}}
    >
      <div
        style={{
          padding: 24,
          background: '#f0f9ff',
          border: '1px solid #91d5ff',
          borderRadius: 8,
          minHeight: 300,
        }}
      >
        {images.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: images.length === 1 ? '1fr' : images.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
            gap: 20, 
            textAlign: 'center',
            justifyItems: 'center'
          }}>
            {images.map((imgUrl: string, idx: number) => (
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
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={`Image ${idx + 1}`}
                      width={136}
                      height={136}
                      style={{ 
                        objectFit: 'cover', 
                        borderRadius: 6,
                        border: 'none'
                      }}
                      preview={false}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontSize: 11 }}>IMAGE NOT FOUND</div>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Image {idx + 1}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <div style={{ fontSize: 16 }}>No images available</div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
        styles={{ body: {padding: 0 }}}
      >
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        )}
      </Modal>
    </Modal>
  );
};

export default RepairPhotoModal;
