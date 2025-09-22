import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Tooltip } from 'antd';
import { ExclamationOutlined, UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import '../../styles/modal.css';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dispatchedCaretaker, setDispatchedCaretaker] = useState<string>('');

  const handleDispatchClick = () => {
    if (!selectedDispatcher) {
      message.warning({
        content: 'Please select a caretaker before dispatching',
        duration: 3,
        style: { fontFamily: 'Noto Sans' }
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmDispatch = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      // Simulate API call with more realistic timing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onDispatch) {
        onDispatch(selectedDispatcher);
      }
      
      // Store the dispatched caretaker name for success modal
      const caretakerName = dispatchers.find(d => d.value === selectedDispatcher)?.label || '';
      setDispatchedCaretaker(caretakerName);
      
      // Show success modal instead of message
      setShowSuccess(true);
      
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

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSelectedDispatcher('');
    setDispatchedCaretaker('');
    onCancel();
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedDispatcher('');
    setShowConfirmation(false);
    setShowSuccess(false);
    setDispatchedCaretaker('');
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
    <>
      <Modal
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={480}
        closeIcon={true}
        centered
        className="dispatch-modal"
        maskClosable={false}
        title={null}
      >
      <div className="dispatch-modal-header">
        <span className="dispatch-modal-title">CONTROL - DISPATCH LEAK</span>
      </div>

      <div className="dispatch-modal-body">
        <div className="dispatch-modal-warning-icon">
          <ExclamationOutlined />
        </div>

        <div className="dispatch-modal-main-text">
          DISPATCH TO REPAIR CREW
        </div>

        <div className="dispatch-modal-form-section">
          <div className="dispatch-modal-label-text">
            <UserOutlined style={{ marginRight: 8, color: '#ff4d4f', fontSize: 16 }} />
            DISPATCH TO :
          </div>
          
          <Select
            showSearch
            placeholder="-- Select Dispatcher --"
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
          <Tooltip title={!selectedDispatcher ? "Please select a caretaker first" : "Send dispatch to selected caretaker"}>
            <Button
              type="primary"
              onClick={handleDispatchClick}
              loading={loading}
              className="dispatch-modal-dispatch-btn"
              disabled={!selectedDispatcher}
            >
              {loading ? 'DISPATCHING...' : 'DISPATCH LEAK'}
            </Button>
          </Tooltip>
        </div>
      </div>

      <Modal
        open={showConfirmation}
        onCancel={handleCancelConfirmation}
        footer={null}
        width={450}
        centered
        maskClosable={false}
        closable={false}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <QuestionCircleOutlined 
            style={{ 
              fontSize: 48, 
              color: '#faad14', 
              marginBottom: 16 
            }} 
          />
          <h3 style={{ 
            fontSize: 18, 
            fontWeight: 600, 
            marginBottom: 12, 
            color: '#262626' 
          }}>
            Confirm Dispatch
          </h3>
          <p style={{ 
            fontSize: 14, 
            color: '#595959', 
            marginBottom: 8 
          }}>
            Are you sure you want to dispatch this leak report to:
          </p>
          <p style={{ 
            fontSize: 16, 
            fontWeight: 500, 
            color: '#1890ff', 
            marginBottom: 24 
          }}>
            {dispatchers.find(d => d.value === selectedDispatcher)?.label}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button
              onClick={handleCancelConfirmation}
              style={{
                borderColor: '#d9d9d9',
                color: '#595959'
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmDispatch}
              style={{
                backgroundColor: '#52c41a',
                borderColor: '#52c41a'
              }}
            >
              Yes, Dispatch
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>

    {/* Success Modal */}
    <Modal
      open={showSuccess}
      onCancel={handleSuccessClose}
      footer={null}
      width={400}
      centered
      maskClosable={false}
      closable={false}
      style={{
        borderRadius: 12
      }}
    >
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        backgroundColor: '#fff',
        borderRadius: 12
      }}>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 600, 
          marginBottom: 24, 
          color: '#00d084',
          fontFamily: 'Noto Sans, sans-serif'
        }}>
          Dispatched Successfully!
        </h2>
        <p style={{ 
          fontSize: 16, 
          color: '#666',
          marginBottom: 32,
          lineHeight: 1.5,
          fontFamily: 'Noto Sans, sans-serif'
        }}>
          Your changes has been successfully saved.
        </p>
        <Button
          type="primary"
          onClick={handleSuccessClose}
          size="large"
          style={{
            backgroundColor: '#00d084',
            borderColor: '#00d084',
            fontWeight: 500,
            height: 44,
            paddingLeft: 40,
            paddingRight: 40,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: 'Noto Sans, sans-serif'
          }}
        >
          Done
        </Button>
      </div>
    </Modal>
    </>
  );
};

export default DispatchModal;
