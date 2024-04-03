import React, { useState, useMemo} from 'react';
import getFiordStyle from '../lib/getFiordStyle';
import getBrightStyle from '../lib/getBrightStyle';

const Context = React.createContext({});
const ContextProvider = Context.Provider;

const StyleContextProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(false);

	// Function to extract layer IDs from a style object
	const extractLayerIds = (style) => {
		return style.layers.map((layer) => layer.id);
	};
	const brightStyleIds = useMemo(() => extractLayerIds(getBrightStyle()), []);
	const fiordStyleIds = useMemo(() => extractLayerIds(getFiordStyle()), []);

	const backgroundStyle = useMemo(() => {
		if (!darkMode) {
			return getBrightStyle();
		}
		return getFiordStyle();
	}, [darkMode]);

	var value = {
		darkMode,
		setDarkMode,
		backgroundStyle,
		brightStyleIds,
		fiordStyleIds,
	};
	return <ContextProvider value={value}>{children}</ContextProvider>;
};

export { Context as StyleContext, StyleContextProvider };
