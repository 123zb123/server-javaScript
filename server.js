import express from 'express';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const app = express();

const port = 3000;
app.use(express.json());

let arr = [
  { id: uuid(), name: 'zviak', email: 'zviak@example.com', password: 'password1' },
  { id: uuid(), name: 'john', email: 'john@example.com', password: 'password2' },
  { id: uuid(), name: 'alice', email: 'alice@example.com', password: 'password3' },
  { id: uuid(), name: 'bob', email: 'bob@example.com', password: 'password4' },
  { id: uuid(), name: 'emma', email: 'emma@example.com', password: 'password5' },
  { id: uuid(), name: 'david', email: 'david@example.com', password: 'password6' },
  { id: uuid(), name: 'sara', email: 'sara@example.com', password: 'password7' }
];

app.get('/', (req, res) => {
  res.send("Server Working");
});

app.get('/users', (req, res) => {
  const userInterface = arr.map((element) => `Name: ${element.name}, Email: ${element.email}, Id: ${element.id} password ${element.password}`);
  res.send(userInterface.join('\n'));
});

app.get('/users/:name', (req, res) => {
  const user = arr.find(element => String(req.params.name) === element.name);
  if (user) {
    const userInformation = `Name: ${user.name}, Email: ${user.email}, Id: ${user.id}`;
    res.send(userInformation);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/users', (req, res) => {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
    if (err) {
      res.status(500).send('Error while hashing password');
    } else {
      const addUser = {
        id: uuid(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      };
      arr.push(addUser);
      res.send('User added successfully');
    }
  });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = arr.find(user => user.email === email);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).send("User is connected");
    } else {
      res.status(400).send("Wrong credentials");
    }
  });
  
  

app.put('/users/:name', (req, res) => {
  const userIndex = arr.findIndex(element => String(req.params.name) === element.name);
  if (userIndex !== -1) {
    arr[userIndex] = {
      id: uuid(),
      name: req.body.name,
      email: req.body.email,
      password: arr[userIndex].password
    };
    res.send(`User updated successfully`);
  } else {
    res.status(404).send('User not found');
  }
});

app.delete('/users/:name', (req, res) => {
  const userIndex = arr.findIndex(element => String(req.params.name) === element.name);
  if (userIndex !== -1) {
    arr.splice(userIndex, 1);
    res.send(`User deleted successfully`);
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
