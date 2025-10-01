import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

export default function Detail() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6} alignItems="center">
        {/* Bên trái - nội dung */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            In partnership with <b>Dribbble</b>
          </Typography>

          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            The business software for design agencies
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Designed to simplify project management, delight clients, and increase profitability.
            Book your free demo or sign up today and get 30% off.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" size="large">
              Register
            </Button>
            <Button variant="outlined" size="large">
              Book a demo
            </Button>
          </Box>

          <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
            ★★★★★ 1000+ Reviews
          </Typography>
        </Grid>

        {/* Bên phải - hình ảnh */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1611224923853-80b219d8a6a3?auto=format&fit=crop&w=800&q=80"
            alt="Dashboard Preview"
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
