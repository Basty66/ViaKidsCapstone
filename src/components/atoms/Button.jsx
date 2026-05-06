export const Button = ({ children, type = "button", className = "", ...props }) => {
    return (
        <button
            type={type}
            className={`font-semibold transition-all duration-200 shadow-sm flex justify-center items-center ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};