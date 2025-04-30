import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Modal = ({
  show,
  onHide,
  title,
  children,
  size,
  centered = false,
  backdrop = true,
  animation = true,
  scrollable = false,
  fullscreen = false,
  dialogClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  showCloseButton = true,
  confirmText = 'Confirm',
  cancelText = 'Cancel', 
  confirmVariant = 'primary',
  cancelVariant = 'outline-secondary',
  showFooter = true,
  onConfirm,
  isConfirmLoading = false,
  isConfirmDisabled = false,
  confirmIcon: ConfirmIcon,
  ...props
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };
  
  return (
    <BootstrapModal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop={backdrop}
      animation={animation}
      scrollable={scrollable}
      fullscreen={fullscreen}
      dialogClassName={dialogClassName}
      contentClassName={contentClassName}
      {...props}
    >
      <BootstrapModal.Header closeButton={showCloseButton} className={headerClassName}>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      
      <BootstrapModal.Body className={bodyClassName}>
        {children}
      </BootstrapModal.Body>
      
      {showFooter && (
        <BootstrapModal.Footer className={footerClassName}>
          <Button variant={cancelVariant} onClick={onHide}>
            {cancelText}
          </Button>
          <Button 
            variant={confirmVariant} 
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isConfirmLoading}
          >
            {isConfirmLoading && (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            {!isConfirmLoading && ConfirmIcon && <ConfirmIcon className="me-2" />}
            {confirmText}
          </Button>
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};

// Confirmation Modal - a special version for simple confirmation dialogs
export const ConfirmationModal = ({
  show,
  onHide,
  title = 'Confirmation',
  message,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isConfirmLoading = false,
  ...props
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={confirmVariant}
      onConfirm={onConfirm}
      isConfirmLoading={isConfirmLoading}
      {...props}
    >
      <p>{message}</p>
    </Modal>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  size: PropTypes.string,
  centered: PropTypes.bool,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  animation: PropTypes.bool,
  scrollable: PropTypes.bool,
  fullscreen: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  dialogClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.string,
  cancelVariant: PropTypes.string,
  showFooter: PropTypes.bool,
  onConfirm: PropTypes.func,
  isConfirmLoading: PropTypes.bool,
  isConfirmDisabled: PropTypes.bool,
  confirmIcon: PropTypes.elementType
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.node,
  message: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.string,
  isConfirmLoading: PropTypes.bool
};

export default Modal;