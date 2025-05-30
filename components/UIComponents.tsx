
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'default' | 'light-bg';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }) => {
  const baseStyle = 'font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-150 ease-in-out flex items-center justify-center';
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-app-accent text-app-text hover:bg-opacity-80 focus:ring-app-accent';
      break;
    case 'secondary':
      variantStyle = 'bg-app-secondary text-app-bg hover:bg-opacity-80 focus:ring-app-secondary';
      break;
    case 'danger':
      variantStyle = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400';
      break;
    case 'light-bg':
      variantStyle = 'bg-gray-100 text-app-text hover:bg-gray-200 focus:ring-gray-300 border border-gray-200';
      break;
    default: // default/transparent
      variantStyle = 'bg-transparent text-app-text hover:bg-gray-100 border border-app-secondary focus:ring-gray-300';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'py-2 px-4 text-base'; 
      break;
    case 'md':
      sizeStyle = 'py-3 px-6 text-lg'; 
      break;
    case 'lg':
      sizeStyle = 'py-4 px-8 text-xl'; 
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-app-bg p-5 rounded-xl shadow-lg ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-app-bg p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-app-text break-words flex-1">{title}</h2>
          <button onClick={onClose} className="text-app-secondary hover:text-app-text text-3xl ml-4">&times;</button>
        </div>
        <div className="overflow-y-auto mb-4 flex-grow">
          {children}
        </div>
        {footer && <div className="mt-auto pt-4 border-t border-gray-200">{footer}</div>}
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactElement<{ className?: string }>;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, icon, error, className, ...props }) => {
  return (
    <div className="mb-5 w-full">
      {label && <label htmlFor={id || props.name} className="block text-lg font-medium text-app-text mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-6 h-6 text-app-secondary"})}</div>}
        <input
          id={id || props.name}
          className={`w-full p-3.5 text-lg border border-app-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-app-accent focus:border-app-accent ${icon ? 'pl-12' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: React.ReactElement<{ className?: string }>;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, icon, error, className, ...props }) => {
  return (
    <div className="mb-5 w-full">
      {label && <label htmlFor={id || props.name} className="block text-lg font-medium text-app-text mb-1.5">{label}</label>}
      <div className="relative">
         {icon && <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">{React.cloneElement(icon, { className: "w-6 h-6 text-app-secondary"})}</div>}
        <textarea
          id={id || props.name}
          rows={3}
          className={`w-full p-3.5 text-lg border border-app-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-app-accent focus:border-app-accent resize-y ${icon ? 'pl-12' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactElement<{ className?: string }>;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, options, icon, error, className, ...props }) => {
  return (
    <div className="mb-5 w-full">
      {label && <label htmlFor={id || props.name} className="block text-lg font-medium text-app-text mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-6 h-6 text-app-secondary"})}</div>}
        <select
          id={id || props.name}
          className={`w-full p-3.5 text-lg border border-app-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-app-accent focus:border-app-accent appearance-none bg-white ${icon ? 'pl-12' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactElement<{ className?: string }>;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, icon }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer mb-5 p-3.5 border border-app-secondary rounded-lg shadow-sm hover:bg-gray-50">
      <div className="flex items-center">
        {icon && <span className={`mr-3 ${checked ? 'text-app-accent' : 'text-app-secondary'}`}>{React.cloneElement(icon, { className: "w-6 h-6"})}</span>}
        <span className="text-lg text-app-text">{label}</span>
      </div>
      <div className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-app-accent' : 'bg-gray-300'}`}>
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        ></div>
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
};

interface DateTimePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string; // Expected format YYYY-MM-DDTHH:mm
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactElement<{ className?: string }>;
  error?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange, icon, error, id, ...props }) => {
  return (
    <div className="mb-5 w-full">
      <label htmlFor={id || props.name} className="block text-lg font-medium text-app-text mb-1.5">{label}</label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">{React.cloneElement(icon, { className: "w-6 h-6 text-app-secondary"})}</div>}
        <input
          type="datetime-local"
          id={id || props.name}
          value={value}
          onChange={onChange}
          className={`w-full p-3.5 text-lg border border-app-secondary rounded-lg shadow-sm focus:ring-2 focus:ring-app-accent focus:border-app-accent ${icon ? 'pl-12' : ''} ${error ? 'border-red-500' : ''}`}
          {...props}
        />
      </div>
       {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// New PageHeader component
interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void; // Optional custom back action
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, showBackButton = true, onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className={`flex items-center py-3 px-1 mb-6 sm:mb-8 sticky top-0 bg-app-bg z-30 shadow-sm`}> {/* Increased mb-4 sm:mb-6 to mb-6 sm:mb-8 */}
      {showBackButton && (
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-app-text"
          aria-label="Go back" // Consider translating this if needed
        >
          {React.cloneElement(ICONS.back, { className: "w-7 h-7" })}
        </button>
      )}
      <h1 className="text-xl sm:text-2xl font-bold text-app-text text-center flex-grow break-words px-2">
        {title}
      </h1>
      {showBackButton && <div className="w-11 h-11"></div> /* Spacer to balance the back button, same size as button */}
    </div>
  );
};
