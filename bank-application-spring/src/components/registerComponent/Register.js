import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/loginAuthService";
import "./Register.css";
import { successToast } from "../../utils/Toast/Toast";
import { showValidationMessages, validateField, validateForm, validatePassword } from "../../utils/validator/validator";

function Register() {
  const formRef = useRef();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    file: "",
  });

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleBack = (e) => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.email.value;
    const password = e.target.password.value;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const file = role === "customer" ? e.target.file.files[0] : null;
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }

    try {
      const response = await register({ username, password, firstName, lastName, role, file });
      if (response) {
        successToast("Customer Registered Successfully");
      }

      navigate("/");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
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
        Register
        <div className="card-body">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter First Name" onChange={handleInputChange} onBlur={() => validateField("firstName", formData.firstName, "required|min:2|max:50")} />
              {isTouched && validateField("firstName", formData.firstName, "required|min:2|max:50")}
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name" onChange={handleInputChange} onBlur={() => validateField("lastName", formData.lastName, "required|min:2|max:50")} />
              {isTouched && validateField("lastName", formData.lastName, "required|min:2|max:50")}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Username</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={handleInputChange} onBlur={() => validatePassword(formData.password)} />
              {isTouched && validatePassword(formData.password)}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <div>
                <Form.Check inline type="radio" label="Customer" name="role" value="customer" checked={role === "customer"} onChange={handleRoleChange} />
                <Form.Check inline type="radio" label="Admin" name="role" value="admin" checked={role === "admin"} onChange={handleRoleChange} />
              </div>
            </Form.Group>

            {role === "customer" && (
              <Form.Group className="mb-3" controlId="file">
                <Form.Label>Upload File</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
            )}

            <Button className="mb-2" variant="primary" type="submit">
              Signup
            </Button>

            <Button className="mb-2" variant="secondary" onClick={handleBack}>
              Back To Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
