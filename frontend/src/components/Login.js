// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "./AuthContext";
// import { useNavigate } from "react-router-dom";
// import { ethers } from "ethers";


// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState(null); // New state for handling error messages
//   const { setToken } = useContext(AuthContext);

//   const [data, setdata] = useState({
//     address: "",
//     Balance: null,
//   });
//   const btnhandler = () => {
//     // Asking if metamask is already present or not
//     if (window.ethereum) {
//         // res[0] for fetching a first wallet
//         window.ethereum
//             .request({ method: "eth_requestAccounts" })
//             .then((res) =>
//                 accountChangeHandler(res[0])
//             );
//     } else {
//         alert("install metamask extension!!");
//     }
// };
// const getbalance = (address) => {
//   // Requesting balance method
//   window.ethereum
//       .request({
//           method: "eth_getBalance",
//           params: [address, "latest"],
//       })
//       .then((balance) => {
//           // Setting balance
//           setdata({
//             address: address
//             ,
//               Balance:
//               ethers.formatEther(balance),
//           });
//       });
// };
// // Function for getting handling all events
// const accountChangeHandler = (account) => {
//   // Setting an address data
//   console.log(account);
  
//   console.log(data.address);
//   // Setting a balance
//   getbalance(account);
  
// };

//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/auth/login", {
//         name:"harsh",
//         email:"test@gmail.com",
//         blockchainAddress: "12345678"
//       });
//       setToken(response.data.token);
//       localStorage.setItem("token", response.data.token);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Authentication failed:", error);
//       setToken(null);
//       localStorage.removeItem("token");
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data); // Set the error message if present in the error response
//       } else {
//         setErrorMessage("An unexpected error occurred. Please try again.");
//       }
//     }
//   };

//   return (
//     <div>
//       {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
//       <form onSubmit={handleSubmit}>
//         <input
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <button type="submit">Login</button>
//       </form>
//       <div className="App">
//             {/* Calling all values which we 
//        have stored in usestate */}
 
//             <div className="text-center">
//                 <div>
//                     <strong>Address: </strong>
//                     {data.address}
//                 </div>
//                 <div>
//                     <p>
//                         <strong>Balance: </strong>
//                         {data.Balance}
//                     </p>
//                     <button
//                         onClick={btnhandler}
//                         variant="primary"
//                     >
//                         Connect to wallet
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
    
    
//   );
// };

// export default Login;
