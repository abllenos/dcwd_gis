import React, { useEffect } from 'react';
import { Modal, Select, Button, message, Tooltip, Spin, Alert } from 'antd';
import { ExclamationOutlined, UserOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import '../../styles/modal.css';
import { dispatchStore } from '../../stores/dispatchStore';

const { Option } = Select;

// MobX UI store for modal state
class DispatchModalUIStore {
  selectedDispatcher: string = '';
  loading: boolean = false;
  showConfirmation: boolean = false;
  showSuccess: boolean = false;
  dispatchedCaretaker: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedDispatcher(val: string) {
    this.selectedDispatcher = val;
  }
  setLoading(val: boolean) {
    this.loading = val;
  }
  setShowConfirmation(val: boolean) {
    this.showConfirmation = val;
  }
  setShowSuccess(val: boolean) {
    this.showSuccess = val;
  }
  setDispatchedCaretaker(val: string) {
    this.dispatchedCaretaker = val;
  }
  reset() {
    this.selectedDispatcher = '';
    this.loading = false;
    this.showConfirmation = false;
    this.showSuccess = false;
    this.dispatchedCaretaker = '';
  }
}

const uiStore = new DispatchModalUIStore();

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
  useEffect(() => {
    if (visible) {
      dispatchStore.fetchCaretakers();
      uiStore.reset();
    }
  }, [visible]);

  const handleRefresh = () => {
    dispatchStore.refresh();
  };

  const handleDispatchClick = () => {
    if (!uiStore.selectedDispatcher) {
      message.warning({
        content: 'Please select a caretaker before dispatching',
        duration: 3,
        style: { fontFamily: 'Noto Sans' }
      });
      return;
    }
    uiStore.setShowConfirmation(true);
  };

  const handleConfirmDispatch = async () => {
    uiStore.setShowConfirmation(false);
    uiStore.setLoading(true);
    try {
      let refNo: string | null = null;
      if (record?.referenceNo && record.referenceNo !== '' && record.referenceNo !== 'null') {
        refNo = String(record.referenceNo);
      } else if (record?.id) {
        refNo = String(record.id);
      } else {
        throw new Error('Missing leak report reference number and ID for dispatch.');
      }
      if (!uiStore.selectedDispatcher) {
        throw new Error('No caretaker selected for dispatch');
      }
      await dispatchStore.dispatchToCrew(
        refNo,
        uiStore.selectedDispatcher
      );
      if (onDispatch) {
        onDispatch(uiStore.selectedDispatcher);
      }
      const caretaker = dispatchStore.mappedCaretakers.find(c => c.value === uiStore.selectedDispatcher);
      const caretakerName = caretaker?.label || 'Unknown Caretaker';
      uiStore.setDispatchedCaretaker(caretakerName);
      uiStore.setShowSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to dispatch leak report. Please try again.';
      message.error({
        content: errorMessage,
        duration: 6,
        style: { fontFamily: 'Noto Sans' }
      });
    } finally {
      uiStore.setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    uiStore.setShowSuccess(false);
    uiStore.setSelectedDispatcher('');
    uiStore.setDispatchedCaretaker('');
    onCancel();
  };

  const handleCancelConfirmation = () => {
    uiStore.setShowConfirmation(false);
  };

  const handleCancel = () => {
    uiStore.reset();
    onCancel();
  };

  const availableCaretakers = dispatchStore.mappedCaretakers;

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
                    loading={dispatchStore.loading}
                    size="small"
                    type="text"
                  />
                </Tooltip>
              </div>
              {dispatchStore.error && (
                <Alert
                  message="Error loading caretakers"
                  description={dispatchStore.error}
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
              placeholder={dispatchStore.loading ? "Loading caretakers..." : "-- Select Dispatcher --"}
              value={uiStore.selectedDispatcher}
              onChange={val => uiStore.setSelectedDispatcher(val)}
              className="dispatch-modal-select"
              optionFilterProp="children"
              size="large"
              loading={dispatchStore.loading}
              notFoundContent={dispatchStore.loading ? <Spin size="small" /> : "No caretakers available"}
              filterOption={(input, option) =>
                typeof option?.children === 'string' &&
                (option.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {availableCaretakers.map((caretaker) => (
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
            <Tooltip title={!uiStore.selectedDispatcher ? "Please select a caretaker first" : "Send dispatch to selected caretaker"}>
              <Button
                type="primary"
                onClick={handleDispatchClick}
                loading={uiStore.loading}
                className="dispatch-modal-dispatch-btn"
                disabled={!uiStore.selectedDispatcher}
              >
                {uiStore.loading ? 'DISPATCHING...' : 'DISPATCH LEAK'}
              </Button>
            </Tooltip>
          </div>
        </div>
        {/* Confirmation Modal */}
        <Modal
          open={uiStore.showConfirmation}
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
              {availableCaretakers.find(c => c.value === uiStore.selectedDispatcher)?.label || 'Unknown Caretaker'}
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
      <Modal
        open={uiStore.showSuccess}
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
