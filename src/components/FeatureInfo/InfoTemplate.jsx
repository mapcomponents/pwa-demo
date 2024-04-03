import React from "react";
import List from "@mui/material/List";
import ListItem from "./ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function InfoTemplate(props) {
  return (
    <>
      {props.geometry.properties && (
        <List
          disablePadding={true}
          sx={{
            width: "100%",
            maxWidth: 360,
          }}
        >
          {Object.entries(props.geometry.properties).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemText primary={key} secondary={value} />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
