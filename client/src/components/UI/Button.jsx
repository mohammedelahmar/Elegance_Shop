import React from 'react';
import { Button as BootstrapButton, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size,
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <BootstrapButton
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      className={`${fullWidth ? 'd-block w-100' : ''} ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="me-2" />
      )}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="ms-2" />
      )}
    </BootstrapButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
};

export default Button;