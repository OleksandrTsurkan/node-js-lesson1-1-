const { Router } = require("express");
const fs = require("fs/promises");

const path = require("path");

const { randomUUID } = require("crypto");
const { pathToFileURL } = require("url");

const usersPath = path.join(__dirname, "/../db/users.json");
// console.log(userPath);
const router = Router();

const getUsersList = async () => {
  return JSON.parse(await fs.readFile(userPath));
};

const writeUsers = async (users) => {
  fs.writeFile(usersPath, JSON.stringify(users));
};

router.get("/users", async (req, res) => {
  try {
    const users = await getUsersList();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const users = await getUsersList();

    const user = users.find((user) => String(user.id) === id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/users", async (req, res) => {
  try {
    const body = req.body;
    const users = await getUsersList();
    const user = { id: randomUUID(), ...body };

    users.push(user);
    await writeUsers(users);
    res.status(201).json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const users = await getUsersList();
console.log('helli')
    const index = users.findIndex((user) => String(user.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = { ...users[index], ...body };
    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const users = await getUsersList();

    const filteredUsers = users.filter((user) => String(user.id) !== id);
    if (filteredUsers.length === users.length) {
      return res.status(404).json({ message: "user not found" });
    }
    await writeUsers(filteredUsers);
    res.status(200).json({ message: "user was deleted" });
  } catch (error) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
