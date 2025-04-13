import { Box, Paper, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { loginService } from "../../services/user/UserService";
import LoginRegisterBtn from "../buttons/LoginRegisterBtn";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useUserContext();
  const navigate = useNavigate();

  const handleMailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

   

    setError(""); 

    const response = await loginService({ email, password });

    if (response.success && response.user) {
      login(response.user); 
      navigate("/"); 
    } else {
      if (response.error) {
        setError("Email ou mot de passe incorrect.");
      }
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "20rem",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        borderRadius: "0.5rem",
        paddingBottom: "1rem",
      }}
    >
      <Typography
        textAlign="center"
        variant="h1"
        sx={{
          fontSize: "1.5rem",
          pt: "1.5rem",
          pl: "0.8rem",
          pr: "0.8rem",
          lineHeight: 1.5,
          color: "#321F47",
        }}
      >
        Se connecter
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          value={email}
          onChange={handleMailChange}
          sx={{
            width: "85%",
            marginBottom: "1rem",
            "& .MuiOutlinedInput-root ": {
              height: "5.5vh",
              "&.Mui-focused fieldset": {
                borderColor: "#321F47",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#321F47",
              fontFamily: "Montserrat",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#321F47",
            },
          }}
        />
        <TextField
          variant="outlined"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          sx={{
            width: "85%",
            marginBottom: "0.5rem",
            "& .MuiOutlinedInput-root ": {
              height: "5.5vh",
              "&.Mui-focused fieldset": {
                borderColor: "#321F47",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#321F47",
              fontFamily: "Montserrat",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#321F47",
            },
          }}
        />
        {error && (
          <Typography
            sx={{
              color: "red",
              fontSize: "0.75rem",
              width: "85%",
              textAlign: "left",
              marginBottom: "0.5rem",
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#321F47",
          }}
        >
          Pas encore de compte ?{" "}
          <NavLink
            to="/register"
            style={{
              color: "#321F47",
              textDecoration: "none",
              fontFamily: "Montserrat",
              fontWeight: 500,
            }}
          >
            Inscris-toi !
          </NavLink>
        </Typography>
        <LoginRegisterBtn label="Se connecter" type="submit" />
      </Box>
    </Paper>
  );
}
