import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { isAdmin, isCustomer, login } from "../../services/loginAuthService";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { showValidationMessages, validateForm, validatePassword, validateUsername } from "../../utils/validator/validator";
import { errorToast } from "../../utils/Toast/Toast";

function Login() {
  const formRef = useRef();
  const navigate = useNavigate();
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }
    const { email, password } = formData;

    try {
      const credential = await login({ userInput: email, passwordInput: password });
      localStorage.clear();
      localStorage.setItem("Authorization", credential.accessToken);

      if (credential.role === "ROLE_ADMIN") {
        if (!(await isAdmin())) {
          navigate(`/`);
        } else {
          navigate(`/admin-dashboard`);
        }
      }

      if (credential.role === "ROLE_CUSTOMER") {
        localStorage.setItem("userId", credential.userId);
        if (!(await isCustomer())) {
          navigate(`/`);
        } else {
          navigate(`/customer-dashboard`);
        }
      }
    } catch (error) {
      errorToast(error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="card-header">Login</div>
        <div className="card-body">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter email" value={formData.email} onChange={handleInputChange} onBlur={(e) => validateUsername(formData.email)} />
              {isTouched && validateUsername(formData.email)}
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} onBlur={(e) => validatePassword(formData.password)} />
              {isTouched && validatePassword(formData.password)}
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
