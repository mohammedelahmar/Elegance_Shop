import React from 'react';
import PropTypes from 'prop-types';

const ProfileInput = ({ 
  label, 
  name, 
  value, 
  onChange,
  type = 'text', 
  placeholder = '',
  required = false,
  disabled = false,
  icon: Icon,
  helperText
}) => {
  return (
    <div className="profile-input-container mb-4">
      {label && (
        <label htmlFor={name} className="d-block mb-2">
          {label}
          {required && <span style={{ color: '#e94560', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      
      <div className="profile-input-wrapper position-relative">
        <div className="profile-input-icon">
          <Icon />
        </div>
        
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="profile-input-field"
        />
      </div>
      
      {helperText && (
        <small className="profile-input-helper mt-1 d-block">{helperText}</small>
      )}
    </div>
  );
};

const ProfileTextarea = ({ 
  label, 
  name, 
  value, 
  onChange,
  placeholder = '',
  required = false,
  rows = 3,
  icon: Icon
}) => {
  return (
    <div className="profile-input-container mb-4">
      {label && (
        <label htmlFor={name} className="d-block mb-2">
          {label}
          {required && <span style={{ color: '#e94560', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      
      <div className="profile-input-wrapper position-relative">
        <div className="profile-input-icon">
          <Icon />
        </div>
        
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="profile-input-field"
        />
      </div>
    </div>
  );
};

ProfileInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType.isRequired,
  helperText: PropTypes.string
};

ProfileTextarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  icon: PropTypes.elementType.isRequired
};

export { ProfileInput, ProfileTextarea };