import React from 'react';
import ListItem from '@mui/material/ListItem';

const styles = {
	item: {
		paddingTop: 0,
		paddingBottom: 0,
	},
};

function CustomListItem(props) {
	return (
		<ListItem {...props} style={styles.item}>
			{props.children}
		</ListItem>
	);
}

export default CustomListItem;
