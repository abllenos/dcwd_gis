import React from 'react';
import { Modal, Image } from 'antd';

interface RepairPhotoModalProps {
  visible: boolean
  onCancel: () => void;
  images: string[];
}

const RepairPhotoModal: React.FC<RepairPhotoModalProps> = ({ visible, onCancel, images }) => {
  return (
    <Modal
      visible={visible}
      title="Submitted Photos"
      footer={null}
      onCancel={onCancel}
      width={800}
    >
      {images.length > 0 ? (
        <Image.PreviewGroup>
          {images.map((url, index) => (
            <Image
              key={index}
              src={url}
              width={150}
              style={{ margin: 10, borderRadius: 8 }}
              alt={`User submitted ${index + 1}`}
            />
          ))}
        </Image.PreviewGroup>
      ) : (
        <p>No photos submitted.</p>
      )}
    </Modal>
  );
};

export default RepairPhotoModal;
