export default function Button({
	children,
	variant = 'primary',
	size = 'md',
	disabled = false,
	onClick,
	type = 'button',
	className = '',
	...props
}) {
	const baseClasses =
		'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

	const variants = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
	};

	const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

	return (
		<button type={type} className={classes} disabled={disabled} onClick={onClick} {...props}>
			{children}
		</button>
	);
}
