// src/components/Modals/ReportDetails.tsx

import React from 'react';
import { Modal, Button } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import { LeakData } from '../../types/Leakdata';

interface ReportDetailsProps {
  visible: boolean;
  record: LeakData | null;
  onCancel: () => void;
  activeTab: string;
  columnMap: Record<string, { title: string; dataIndex: string }>;
  columnPresets: Record<string, string[]>;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  visible,
  record,
  onCancel,
  activeTab,
  columnMap,
  columnPresets,
}) => {
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
      width={720}
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
        </div>
      )}
    </Modal>
  );
};

export default ReportDetails;
