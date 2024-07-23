import React from 'react';
import './Button.css'; // Importing the CSS file for button styles
import { Link } from 'react-router-dom'; // Importing the Link component from react-router-dom for navigation

// Defining available button styles and sizes
const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

// Button component definition
export const Button = ({ 
    children, // Content inside the button
    type, // Button type (e.g., 'button', 'submit')
    onClick, // onClick event handler
    buttonStyle, // Style of the button
    buttonSize, // Size of the button
    to // New prop for navigation path
}) => { 
    // Check if the provided buttonStyle is valid, if not, use the default style
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    // Check if the provided buttonSize is valid, if not, use the default size
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        // Link component for navigation to the sign-up page
        <Link to={to} className='btn-mobile'> {/* Use the 'to' prop for the Link */}
            <button
                className={`btn ${checkButtonStyle} ${checkButtonSize}`} // Applying the button styles and sizes
                onClick={onClick} // Setting the onClick event handler
                type={type} // Setting the button type
            >
                {children} 
            </button>
        </Link>
    );
};
