import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const UserManagement = () => {
  //create states to store users, formData, error, pageNo, loding
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

  // Fetch users from Mockend API
  const fetchUsers = async (reset) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
        {
          params: { _page: page, _limit: 6 },
        }
      );
      //update users
      setUsers((prev) => (reset ? response.data : [...prev, ...response.data]));
      setHasMore(response.data.length > 0);
    } catch (err) {
      //update error
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  //side effect to fetch the data when page number changes
  useEffect(() => {
    fetchUsers();
  }, [page]);

  //Handle change in the inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //validate the form
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

  //Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    //check for validation
    if (!validateForm()) return;
    let newuser = {
      id: formData.id,
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      company: { name: formData.department },
    };
    try {
      if (isEditing) {
        //update the existing if it is an edit
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users/${formData.id}`,
          newuser
        );
        setUsers((prevUsers) => {
          // Find the index of the user to be replaced
          const index = prevUsers.findIndex(
            (user) => user.id === response.data.id
          );
          if (index === -1) {
            return prevUsers; // Return the original array if the user is not found
          }

          // Create a copy of the users array
          const newUsers = [...prevUsers];

          // Replace the user at the found index using splice
          newUsers.splice(index, 1, response.data);

          // Return the updated array
          return newUsers;
        });
      } else {
        //add new user
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/users",
          newuser
        );
        setUsers((prevUsers) => [...prevUsers, response.data]);
      }
      //clear form data
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save user");
    }
  };

  //handle edit
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

  //handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  //update page number to load more
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
