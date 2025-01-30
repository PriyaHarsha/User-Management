import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async (reset = false) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
        {
          params: { _page: page, _limit: 6 },
        }
      );
      setUsers((prev) => (reset ? response.data : [...prev, ...response.data]));
      setHasMore(response.data.length > 0);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, department } = formData;
    if (!firstName || !lastName || !email || !department) {
      setError("All fields are required");
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await axios.put(
          `https://jsonplaceholder.typicode.com/users/${formData.id}`,
          formData
        );
      } else {
        await axios.post(
          "https://jsonplaceholder.typicode.com/users",
          formData
        );
      }
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setIsEditing(false);
      setPage(1);
      fetchUsers(true);
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      firstName: user.name.split(" ")[0] || "",
      lastName: user.name.split(" ")[1] || "",
      email: user.email,
      department: user.company.name || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setPage(1);
      fetchUsers(true);
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const loadMoreUsers = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Management</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="First Name"
                    type="text"
                    aria-label="Username"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </div>
              <div className="col-md-6">
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </div>
              <div className="col-md-6">
                <InputGroup className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </div>
              <div className="col-md-6">
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </div>
              <Button type="submit" variant="primary w-100">
                {isEditing ? "Update User" : "Add User"}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <div className="row g-3">
        {users.map((user) => (
          <div className="col-lg-4 col-md-6" key={user.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">
                  Department: {user.company?.name || "N/A"}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="primary" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={loadMoreUsers}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
