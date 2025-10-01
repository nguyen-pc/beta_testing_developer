import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Checklist from "./CheckList";
import UserProfile from "./UserProfile";
import EditProfileForm from "./EditProfile";

const profileData = [
  { label: "Gender", value: "Male" },
  { label: "Age", value: "21" },
  { label: "Household income ($)", value: "Less than $19,999" },
  { label: "Web expertise", value: "Average" },
  { label: "Employment status", value: "Full Time Student" },
  { label: "Country", value: "Vietnam" },
  { label: "Social networks", value: "Facebook, Twitter" },
  { label: "Web browsers", value: "Chrome, Firefox, Opera" },
  { label: "Gaming genres", value: "Arcade, Casino" },
  { label: "Language", value: "English" },
  {
    label: "Devices",
    value:
      "Android phone, Android tablet, Smart TV (with built-in apps), Windows",
  },
];

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Checklist" {...a11yProps(0)} />
          <Tab label="Test history" {...a11yProps(1)} />
          <Tab label="My Profile" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Checklist />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}></CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {!isEditing ? (
          <UserProfile profile={profileData} onEdit={handleEdit} />
        ) : (
          <EditProfileForm onCancel={handleCancel} />
        )}
      </CustomTabPanel>
    </Box>
  );
}
