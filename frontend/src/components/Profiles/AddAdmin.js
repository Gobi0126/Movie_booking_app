import {
    Box,
    Button,
    Dialog,
    FormLabel,
    IconButton,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useState } from "react";
  import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
  import { Link, useNavigate } from "react-router-dom";
import { sendAdmin } from "../../api-helpers/api-helpers";

  const labelStyle = { mt: 1, mb: 1 };

  const AddAdmin = () => {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
      email: "",
      password: "",
    });
    
    const handleChange = (e) => {
      setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      sendAdmin(inputs)
        .then((res)=>{
            navigate("/user-admin")
            console.log(res.data)
        })
        .catch((err)=>console.log(err))
    };
    return (
      
      <Dialog PaperProps={{ style: { borderRadius: 20 } }} open={true}>
        <Box sx={{ ml: "auto", padding: 1 }}>
          <IconButton LinkComponent={Link} to="/user-admin">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" textAlign={"center"}>
           Add Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            padding={6}
            display={"flex"}
            justifyContent={"center"}
            flexDirection="column"
            width={400}
            margin="auto"
            alignContent={"center"}
          >
           
            <FormLabel sx={labelStyle}>Email</FormLabel>
            <TextField
              value={inputs.email}
              onChange={handleChange}
              margin="normal"
              variant="standard"
              type={"email"}
              name="email"
            />
            <FormLabel sx={labelStyle}>Password</FormLabel>
            <TextField
              value={inputs.password}
              onChange={handleChange}
              margin="normal"
              variant="standard"
              type={"password"}
              name="password"
            />
            <Button
              sx={{ mt: 2, borderRadius: 10, bgcolor: "#2b2d42" }}
              type="submit"
              fullWidth
              variant="contained"
            >
              Add 
            </Button>
            
          </Box>
        </form>
      </Dialog>
    
    );
  };
  
  export default AddAdmin;
  