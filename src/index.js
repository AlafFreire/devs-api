const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const devs = [];

const GITHUB_URL = "https://api.github.com/users";

async function getUserFromGitHub(username) {
	try {
		const { data } = await axios.get(`${GITHUB_URL}/${username}`);

		return data;
	} catch (error) {
		console.log(error.response.data);
	}
}

app.post("/devs", async (req, res) => {
	const { username } = req.body;

	const devAlreadyExists = devs.some((dev) => dev.username === username);

	if (devAlreadyExists) {
		return res.status(400).json({ message: "Dev already exists!" });
	};
  const user = await getUserFromGitHub(username);

  if (!user) {
    return res.status(400).json({message:"User not found on GitHub!"});
  };
  const dev= {
    id: user.id,
    name: user.name,
    username
  }
  devs.push(dev)

  return res.status(201).json({message: "Dev created successfully!", dev})
});

app.get('/devs', (req, res) => { 
  const {username} = req.headers
  const user = devs.find((dev) => dev.username === username)
  if (!user) {
    return res.status(400).json({message: "Unregistered user"})
  }
    
  return res.json(devs);
  
});

app.listen(3333);