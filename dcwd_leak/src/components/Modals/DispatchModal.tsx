import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Tooltip, Spin, Alert } from 'antd';
import { ExclamationOutlined, UserOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { caretakersStore } from '../../stores/caretakersStore';
import type { MappedCaretaker } from '../../types/caretaker';
import '../../styles/modal.css';

const { Option } = Select;

interface DispatchModalProps {
  visible: boolean;
  onCancel: () => void;
  onDispatch?: (dispatcher: string) => void;
  record: any | null;
  fields: { label: string; value?: string }[];
}

const DispatchModal: React.FC<DispatchModalProps> = observer(({
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

  // Fetch caretakers when modal opens
  useEffect(() => {
    if (visible) {
      caretakersStore.fetchCaretakers();
    }
  }, [visible]);

  const handleRefresh = () => {
    caretakersStore.refresh();
  };

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
      // Debug logging to understand the record structure
      console.log('DispatchModal record:', record);
      console.log('Record keys:', record ? Object.keys(record) : 'null');
      console.log('Full record object:', JSON.stringify(record, null, 2));
      
      // Validate required data
      // Use referenceNo first (now properly mapped), then fallback to id
      let refNo: string | null = null;
      
      if (record?.referenceNo && record.referenceNo !== '' && record.referenceNo !== 'null') {
        refNo = String(record.referenceNo);
        console.log('Using record.referenceNo as refNo for dispatch:', refNo);
      } else if (record?.id) {
        refNo = String(record.id);
        console.log('Using record.id (spool_ID) as refNo fallback for dispatch:', refNo);
      } else {
        throw new Error('Missing leak report reference number and ID for dispatch. This leak report may not be properly saved yet.');
      }
      
      console.log('Record dispatchStat:', record.dispatchStat);
      console.log('Record flgLeakDetection:', record.flgLeakDetection);
      console.log('Record status:', record.status);
      
      // Validate that record is in dispatchable state
      if (record.dispatchStat === 2) {
        console.warn('Record is already dispatched (dispatchStat=2)');
      } else if (record.dispatchStat !== 1) {
        console.warn('Record may not be dispatchable. Expected dispatchStat=1, got:', record.dispatchStat);
      }
      
      // Check if it's a test/dummy record that might not exist in backend
      if (refNo === "1" || parseInt(refNo) < 100) {
        console.warn('This appears to be test data that may not exist in the backend database');
      }
      
      if (!selectedDispatcher) {
        throw new Error('No caretaker selected for dispatch');
      }

      console.log('Dispatching with refNo:', refNo, 'to:', selectedDispatcher);

      // Call the actual dispatch API
      const response = await caretakersStore.dispatchToCrew(
        refNo,
        selectedDispatcher
      );

      console.log('Dispatch successful:', response);
      
      if (onDispatch) {
        onDispatch(selectedDispatcher);
      }
      
      // Store the dispatched caretaker name for success modal
      const caretaker = caretakersStore.mappedCaretakers.find(c => c.value === selectedDispatcher);
      const caretakerName = caretaker?.label || 'Unknown Caretaker';
      setDispatchedCaretaker(caretakerName);
      
      // Show success modal
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Dispatch error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to dispatch leak report. Please try again.';
        
      message.error({
        content: errorMessage,
        duration: 6,
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

  // Get available caretakers from store
  const availableCaretakers = caretakersStore.mappedCaretakers;

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
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="dispatch-modal-label-text">
                <UserOutlined style={{ marginRight: 8, color: '#ff4d4f', fontSize: 16 }} />
                DISPATCH TO :
              </div>
              <Tooltip title="Refresh caretakers list">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={caretakersStore.loading}
                  size="small"
                  type="text"
                />
              </Tooltip>
            </div>
            
            {caretakersStore.error && (
              <Alert
                message="Error loading caretakers"
                description={caretakersStore.error}
                type="error"
                showIcon
                style={{ marginBottom: 12 }}
                action={
                  <Button size="small" onClick={handleRefresh}>
                    Retry
                  </Button>
                }
              />
            )}
          </div>
          
          <Select
            showSearch
            placeholder={caretakersStore.loading ? "Loading caretakers..." : "-- Select Dispatcher --"}
            value={selectedDispatcher}
            onChange={setSelectedDispatcher}
            className="dispatch-modal-select"
            optionFilterProp="children"
            size="large"
            loading={caretakersStore.loading}
            notFoundContent={caretakersStore.loading ? <Spin size="small" /> : "No caretakers available"}
            filterOption={(input, option) =>
              typeof option?.children === 'string' &&
              (option.children as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {availableCaretakers.map((caretaker: MappedCaretaker) => (
              <Option 
                key={caretaker.value} 
                value={caretaker.value}
                disabled={caretaker.status === 'inactive'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    <UserOutlined style={{ marginRight: 8, color: '#6782f5' }} />
                    {caretaker.label}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: caretaker.status === 'active' ? '#28a745' : '#dc3545',
                    fontWeight: 500
                  }}>
                    {caretaker.status}
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

      {/* Confirmation Modal */}
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
            {availableCaretakers.find(c => c.value === selectedDispatcher)?.label || 'Unknown Caretaker'}
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
});

export default DispatchModal;
