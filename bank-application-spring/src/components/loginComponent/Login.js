import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { isAdmin, isCustomer, login } from "../../services/loginAuthService";
import { useNavigate } from "react-router-dom";
import "./Login.css"

function Login() {
  const formRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.email.value;
    const password = e.target.password.value;

    try {
      const credential = await login({ userInput: username, passwordInput: password });
      if (credential.role === "ROLE_ADMIN") {
        localStorage.clear();
        localStorage.setItem("Authorization", credential.accessToken);
        if(!await isAdmin()){
          navigate(`/`);
        }else{
          navigate(`/admin-dashboard`);
        }
      }

      if (credential.role === "ROLE_CUSTOMER") {
        localStorage.clear();
        localStorage.setItem("Authorization", credential.accessToken);
        localStorage.setItem("userId", credential.userId);
        if(!await isCustomer()){
          navigate(`/`);
        }else{
          navigate(`/customer-dashboard`);
        }
      }
    } catch (error) {
      alert("Uncaught error");
    }
  };


  const handleRegisterClick=()=>{
      navigate("/register")
  }

  return (
    <div className="login-container">
      <div className="card login-card">
        Login
        <div className="card-body">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Username</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required />
            </Form.Group>
            <Button className="mb-2" variant="primary" type="submit">
              Login
            </Button>
            <Button variant="secondary" onClick={handleRegisterClick}>
            Don't Have an Account? Sign Up Now
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
