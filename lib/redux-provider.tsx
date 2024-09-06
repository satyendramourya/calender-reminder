'use client';

import { Provider } from 'react-redux';

import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

/**
 * ReduxProvider component.
 *
 * This component is responsible for providing the Redux store and persistor to its children components.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the ReduxProvider.
 * @returns {JSX.Element} The rendered ReduxProvider component.
 */
export const ReduxProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	);
};
