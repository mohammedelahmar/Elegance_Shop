import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  error,
  touched,
  isValid,
  disabled = false,
  readOnly = false,
  required = false,
  helperText,
  as,
  rows,
  options = [],
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  inputClassName = '',
  size,
  min,
  max,
  step,
  ...props
}) => {
  const controlId = id || name;
  const isInvalid = touched && error;
  
  const renderInput = () => {
    // For select dropdown
    if (as === 'select') {
      return (
        <Form.Select
          id={controlId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          isInvalid={isInvalid}
          isValid={touched && isValid}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClassName}
          size={size}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      );
    }
    
    // For textarea
    if (as === 'textarea') {
      return (
        <Form.Control
          id={controlId}
          as="textarea"
          rows={rows || 3}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          isInvalid={isInvalid}
          isValid={touched && isValid}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClassName}
          {...props}
        />
      );
    }
    
    // For regular input
    return (
      <Form.Control
        id={controlId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        isInvalid={isInvalid}
        isValid={touched && isValid}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={inputClassName}
        size={size}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    );
  };

  return (
    <Form.Group className={`mb-3 ${fullWidth ? 'w-100' : ''} ${className}`}>
      {label && <Form.Label htmlFor={controlId}>{label}{required && <span className="text-danger">*</span>}</Form.Label>}
      
      {Icon ? (
        <InputGroup>
          {iconPosition === 'left' && (
            <InputGroup.Text>
              <Icon />
            </InputGroup.Text>
          )}
          
          {renderInput()}
          
          {iconPosition === 'right' && (
            <InputGroup.Text>
              <Icon />
            </InputGroup.Text>
          )}
        </InputGroup>
      ) : (
        renderInput()
      )}
      
      {helperText && !isInvalid && (
        <Form.Text className="text-muted">{helperText}</Form.Text>
      )}
      
      {isInvalid && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  isValid: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  as: PropTypes.string,
  rows: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired
    })
  ),
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  size: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Input;