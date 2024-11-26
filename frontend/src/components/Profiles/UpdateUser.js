import {
    Box,
    Button,
    Dialog,
    FormLabel,
    IconButton,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
  import { Link, useNavigate } from "react-router-dom";
import { getUserDetails, updateUser } from "../../api-helpers/api-helpers";
  const labelStyle = { mt: 1, mb: 1 };

  const UpdateUser = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
      name: "",
      email: "",
    });
    
    useEffect(() => {

      getUserDetails()
        .then((res) => setInputs(res.user,res.email))
        .catch((err) => console.log(err));
    }, []);
    
    const handleChange = (e) => {
      setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
    //   console.log("sub",inputs);
    updateUser(inputs)
        .then((res)=> navigate("/user"))
        .catch((err)=>console.log(err));
     
    };
    return (
      <Dialog PaperProps={{ style: { borderRadius: 20 } }} open={true}>
        <Box sx={{ ml: "auto", padding: 1 }}>
          <IconButton LinkComponent={Link} to="/user">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" textAlign={"center"}>
            Update Profile
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
           
            <FormLabel sx={labelStyle}>Name</FormLabel>
            <TextField
            value={inputs.name}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"text"}
            name="name"
            />
              
            
            <FormLabel sx={labelStyle}>Email</FormLabel>
            <TextField
              value={inputs.email}
              onChange={handleChange}
              margin="normal"
              variant="standard"
              type={"email"}
              name="email"
            />
            
            <Button
            sx={{ mt: 2, borderRadius: 10, bgcolor: "#2b2d42" }}
            type="submit"
            fullWidth
            variant="contained"
            >
            Update profile
            </Button>
           
          </Box>
        </form>
      </Dialog>
    );
  };
  
  export default UpdateUser;
  