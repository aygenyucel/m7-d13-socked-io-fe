import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
  Button,
} from "react-bootstrap";
import { io } from "socket.io-client";
import { User } from "../types";

// 1. When we jump into this page, the socket.io client needs to connect to the server
const socket = io("http://localhost:3001", { transports: ["websocket"] });

// 2. If the connection happens successfully, the server will emit an event called "welcome"
// 3. If we want to do something when that event happens we shall LISTEN to that event by using socket.on("welcome")

// 4. Once we are connected we want to submit the username to the server --> we shall EMIT an event called "setUsername" (containing the username itself as payload)
// 5. The server is listening for the "setUsername" event, when that event is fired the server will broadcast that username to whoever is listening for an event called "loggedIn"

const Home = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on("welcome", (message) => {
      console.log(message);

      socket.on("loggedIn", (onlineUsers) => {
        console.log("logged in event:", onlineUsers);
        setLoggedIn(true);
        setOnlineUsers(onlineUsers);
      });

      socket.on("updateOnlineUsersList", (onlineUsers) => {
        console.log("A new user connected/disconnected");
        setOnlineUsers(onlineUsers);
      });
    });
  });

  const submitUsername = () => {
    socket.emit("setUsername", username);
  };

  return (
    <Container fluid>
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              submitUsername();
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup></ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
