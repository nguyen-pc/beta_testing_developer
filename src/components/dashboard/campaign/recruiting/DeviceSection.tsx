import React from "react";
import {
  Card,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  RadioGroup,
  Radio,
} from "@mui/material";

interface Props {
  devices: string;
  setDevices: (v: string) => void;
  whitelist: string;
  setWhitelist: (v: string) => void;
}

const DeviceSection: React.FC<Props> = ({
  devices,
  setDevices,
  whitelist,
  setWhitelist,
}) => {
  const toggleStringValue = (
    value: string,
    current: string,
    setter: (v: string) => void
  ) => {
    const arr = current ? current.split(", ").filter((v) => v.trim()) : [];
    if (arr.includes(value)) setter(arr.filter((v) => v !== value).join(", "));
    else setter([...arr, value].join(", "));
  };

  return (
    <Card variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Typography fontWeight={600} mb={2}>
        Which devices can testers use for your test?
      </Typography>
      <FormGroup>
        {["iPhone", "Android", "iPad", "Windows", "Mac", "Linux"].map(
          (device) => (
            <FormControlLabel
              key={device}
              control={
                <Checkbox
                  checked={devices.includes(device)}
                  onChange={() =>
                    toggleStringValue(device, devices, setDevices)
                  }
                />
              }
              label={device}
            />
          )
        )}
      </FormGroup>

      <Typography variant="body2" color="text.secondary" mt={2}>
        Need specific numbers per platform?{" "}
        <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>
          Show device quotas
        </a>
      </Typography>

      <Box mt={4}>
        <Typography fontWeight={600} mb={1}>
          Do you need to whitelist testers' emails?
        </Typography>
        <RadioGroup
          value={whitelist}
          onChange={(e) => setWhitelist(e.target.value)}
        >
          <FormControlLabel
            value="no"
            control={<Radio />}
            label="No, testers can start immediately"
          />
          <FormControlLabel
            value="yes"
            control={<Radio />}
            label="Yes, we will manually approve each tester’s email"
          />
        </RadioGroup>
      </Box>
    </Card>
  );
};

export default DeviceSection;
