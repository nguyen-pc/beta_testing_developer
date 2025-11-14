// src/pages/settings/PaymentInfo.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
} from "@mui/material";

export default function PaymentInfo() {
  const [tab, setTab] = useState(0);
  const handleChange = (_: any, val: number) => setTab(val);

  const [info, setInfo] = useState({
    name: "Nguyen Nguyen",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo({ ...info, [e.target.name]: e.target.value });

  const handleSubmit = () => console.log(info);

  return (
    <Box>
      <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Contact Info" />
        <Tab label="Account Balance" />
      </Tabs>

      {tab === 0 && (
        <Paper variant="outlined" className="p-4 bg-gray-50">
          <Typography mb={2}>
            If you receive any incentives via Tremendous (gift card, PayPal,
            etc), please complete your full address below to process rewards.
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Name" value={info.name} disabled />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="address1"
                value={info.address1}
                onChange={handleChangeInfo}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address2"
                value={info.address2}
                onChange={handleChangeInfo}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={info.city}
                onChange={handleChangeInfo}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={info.state}
                onChange={handleChangeInfo}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Zip / Postal"
                name="zip"
                value={info.zip}
                onChange={handleChangeInfo}
              />
            </Grid>
          </Grid>

          <Box textAlign="right" mt={3}>
            <Button variant="contained" onClick={handleSubmit}>
              Save Payment Info
            </Button>
          </Box>
        </Paper>
      )}

      {tab === 1 && (
        <Paper variant="outlined" className="p-4 text-center">
          <Typography variant="h6">Account Balance</Typography>
          <Typography color="text.secondary" mt={1}>
            Coming soon: You’ll be able to track your rewards here.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
