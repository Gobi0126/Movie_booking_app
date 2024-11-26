import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import {  deleteMovie, getAdminById } from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { DeleteForeverOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
const AdminProfile = () => {
  const [admin, setAdmin] = useState();
  useEffect(() => {
    getAdminById()
      .then((res) => setAdmin(res.admin))
      .catch((err) => console.log(err));
  },[admin]);

   const handleDelete = (id) => {
    deleteMovie(id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <Box width={"100%"} display="flex">
      <Fragment>
        {" "}
        {admin && (
          <Box
            flexDirection={"column"}
            justifyContent="center"
            alignItems={"center"}
            width={"30%"}
            padding={3}
          >
            <AccountCircleIcon
              sx={{ fontSize: "10rem", textAlign: "center", ml: 3 ,paddingLeft:"100px",paddingBottom:"30px"}}      
            />

            <Typography
              mt={1}
              padding={1}
              width={"auto"}
              textAlign={"center"}
              border={"1px solid #ccc"}
              borderRadius={6}
            >
              Email: {admin.email}
            </Typography>
            <Button
            
              LinkComponent={Link}
              to="/admin-add"
              sx={{ mt: 2, borderRadius: 10, bgcolor: "#2b2d42" }}            
              fullWidth
              variant="contained"
            >
              Add new Admin
            </Button>
          </Box>
        )}
        {admin && admin.addedMovies.length > 0 && (
          <Box width={"70%"} display="flex" flexDirection={"column"}>
            <Typography
              variant="h3"
              fontFamily={"verdana"}
              textAlign="center"
              padding={2}
            >
              Added Movies
            </Typography>
            <Box
              margin={"auto"}
              display="flex"
              flexDirection={"column"}
              width="80%"
            >
              <List>
                {admin.addedMovies.map((movie, index) => (
                  <ListItem
                    sx={{
                      bgcolor: "#00d386",
                      color: "white",
                      textAlign: "center",
                      margin: 1,
                    }}
                  >
                    <ListItemText
                      sx={{ margin: 1, width: "auto", textAlign: "left" }}
                    >
                      Movie: {movie.title}
                    </ListItemText>

                    <IconButton
                        onClick={() => handleDelete(movie._id)}
                        color="error" 
                        >
                      <DeleteForeverOutlined />
                    </IconButton>

                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </Fragment>
    </Box>
  );
};

export default AdminProfile;
