'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

/**
 * Hook for subscription-related functionality
 * Provides subscription status and feature access checks
 */
export function useSubscription() {
	const { user, isAuthenticated } = useAuth();
	const [subscriptionStatus, setSubscriptionStatus] = useState({
		plan: 'free',
		isActive: true,
		features: {},
	});

	// Fetch and set subscription status when user changes
	useEffect(() => {
		if (user?.subscription) {
			setSubscriptionStatus({
				plan: user.subscription.plan || 'free',
				isActive: user.subscription.status === 'active',
				features: user.subscription.features || {},
			});
		} else {
			setSubscriptionStatus({
				plan: 'free',
				isActive: true,
				features: {},
			});
		}
	}, [user]);

	/**
	 * Check if user has access to a specific feature
	 * @param {string} featureName - Name of the feature to check
	 * @param {Object} options - Additional options
	 * @returns {boolean} - Whether user has access
	 */
	const hasFeatureAccess = (featureName, options = {}) => {
		const { allowPreview = false, previewMode = false } = options;

		// Non-authenticated users never have access unless preview allowed
		if (!isAuthenticated) {
			return allowPreview && previewMode;
		}

		// Check specific feature access
		switch (featureName) {
			case 'recipeAssistant':
				// Premium feature requires subscription
				return (
					subscriptionStatus.isActive &&
					(subscriptionStatus.plan === 'premium' ||
						subscriptionStatus.features.recipeAssistant)
				);

			case 'unlimitedSearches':
				// Basic+ feature
				return (
					subscriptionStatus.isActive && ['basic', 'premium'].includes(subscriptionStatus.plan)
				);

			default:
				// Free features available to all authenticated users
				return true;
		}
	};

	/**
	 * Get subscription data for display
	 */
	const getSubscriptionData = () => {
		return {
			plan: subscriptionStatus.plan,
			isActive: subscriptionStatus.isActive,
			displayName: getPlanDisplayName(subscriptionStatus.plan),
			features: subscriptionStatus.features,
		};
	};

	/**
	 * Get plan display name
	 */
	const getPlanDisplayName = (plan) => {
		switch (plan) {
			case 'premium':
				return 'Premium';
			case 'basic':
				return 'Basic';
			case 'free':
			default:
				return 'Free';
		}
	};

	return {
		hasFeatureAccess,
		getSubscriptionData,
		isPremium: subscriptionStatus.plan === 'premium' && subscriptionStatus.isActive,
		isBasic: subscriptionStatus.plan === 'basic' && subscriptionStatus.isActive,
		isFree: subscriptionStatus.plan === 'free' || !subscriptionStatus.isActive,
	};
}
