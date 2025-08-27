import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Tooltip } from 'antd';
import { ExclamationOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import '../../styles/modals.css';

const { Option } = Select;

interface DispatchModalProps {
  visible: boolean;
  onCancel: () => void;
  onDispatch?: (dispatcher: string) => void;
  record: any | null;
  fields: { label: string; value?: string }[];
}

const DispatchModal: React.FC<DispatchModalProps> = ({
  visible,
  onCancel,
  onDispatch,
  record,
  fields,
}) => {
  const [selectedDispatcher, setSelectedDispatcher] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleDispatch = async () => {
    if (!selectedDispatcher) {
      message.warning({
        content: 'Please select a caretaker before dispatching',
        duration: 3,
        style: { fontFamily: 'Noto Sans' }
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call with more realistic timing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onDispatch) {
        onDispatch(selectedDispatcher);
      }
      
      message.success({
        content: `Leak report successfully dispatched to ${dispatchers.find(d => d.value === selectedDispatcher)?.label}`,
        duration: 4,
        style: { fontFamily: 'Noto Sans' }
      });
      setSelectedDispatcher('');
      onCancel();
    } catch (error) {
      message.error({
        content: 'Failed to dispatch leak report. Please try again.',
        duration: 4,
        style: { fontFamily: 'Noto Sans' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedDispatcher('');
    onCancel();
  };

  const dispatchers = [
    { value: 'caretaker1', label: 'John Smith - District A', status: 'available', experience: '5 years' },
    { value: 'caretaker2', label: 'Maria Garcia - District B', status: 'busy', experience: '3 years' },
    { value: 'caretaker3', label: 'Robert Johnson - District C', status: 'available', experience: '7 years' },
    { value: 'caretaker4', label: 'Sarah Wilson - District D', status: 'available', experience: '4 years' },
    { value: 'caretaker5', label: 'Michael Brown - District E', status: 'offline', experience: '6 years' },
  ];

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      closeIcon={true}
      centered
      className="dispatch-modal"
      maskClosable={false}
      title={null}
    >
      <div className="dispatch-modal-header">
        <span className="dispatch-modal-title">Dispatch Leak</span>
      </div>

      <div className="dispatch-modal-body">
        <div className="dispatch-modal-warning-icon">
          <ExclamationOutlined />
        </div>

        <div className="dispatch-modal-main-text">
          Dispatch to Repair Crew
        </div>

        <div className="dispatch-modal-form-section">
          <div className="dispatch-modal-label-text">
            Dispatched to
          </div>
          
          <Select
            showSearch
            placeholder="- Select CARETAKER -"
            value={selectedDispatcher}
            onChange={setSelectedDispatcher}
            className="dispatch-modal-select"
            optionFilterProp="children"
            size="large"
            filterOption={(input, option) =>
              typeof option?.children === 'string' &&
              (option.children as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {dispatchers.map(dispatcher => (
              <Option 
                key={dispatcher.value} 
                value={dispatcher.value}
                disabled={dispatcher.status === 'offline' || dispatcher.status === 'busy'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    <UserOutlined style={{ marginRight: 8, color: '#6782f5' }} />
                    {dispatcher.label}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: dispatcher.status === 'available' ? '#28a745' : 
                          dispatcher.status === 'busy' ? '#ffc107' : '#dc3545',
                    fontWeight: 500
                  }}>
                    {dispatcher.status} • {dispatcher.experience}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <div className="dispatch-modal-button-container">
          <Tooltip title="Cancel dispatch operation">
            <Button
              onClick={handleCancel}
              className="dispatch-modal-cancel-btn"
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
          </Tooltip>

          <Tooltip title={!selectedDispatcher ? "Please select a caretaker first" : "Send dispatch to selected caretaker"}>
            <Button
              type="primary"
              onClick={handleDispatch}
              loading={loading}
              className="dispatch-modal-dispatch-btn"
              disabled={!selectedDispatcher}
            >
              {loading ? 'Dispatching...' : 'Dispatch Leak'}
            </Button>
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
};

export default DispatchModal;
