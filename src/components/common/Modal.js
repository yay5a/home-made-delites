'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
	const modalRef = useRef();

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	const handleBackdropClick = (e) => {
		if (e.target === modalRef.current) {
			onClose();
		}
	};

	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
	};

	return (
		<div
			ref={modalRef}
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
			onClick={handleBackdropClick}>
			<div
				className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
				{title && (
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600 focus:outline-none'>
							<svg
								className='w-6 h-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				)}
				<div className='p-6'>{children}</div>
			</div>
		</div>
	);
}
