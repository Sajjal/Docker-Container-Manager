const express = require("express");
const router = express.Router();

const verifyToken = require("../config/verifyToken");
const { addData, searchData, removeData } = require("../config/dbConfig");
const { dockerScaleContainerWithVolume, dockerScaleContainerNoVolume } = require("../modules/dockerCommands");
const { generateConf, generateConfSSL } = require("../modules/generateConf");
const { healthCheck } = require("../modules/healthCheck");

router.get("/", verifyToken, async (req, res) => {
  let projects = await searchData("projects", { postedBy: req.user.id });
  res.render("dashboard", { projects });
});

router.get("/projects/add", verifyToken, (req, res) => {
  res.render("addProject");
});

router.post("/projects/add", verifyToken, async (req, res) => {
  let data = {
    projectName: req.body.name.toString(),
    imageID: req.body.imageID.toString(),
    imageName: req.body.imageName.toString(),
    containerPort: req.body.containerPort.toString(),
    portRange: req.body.portRange.toString(),
    containerVolume: req.body.containerVolume.toString(),
    hostVolume: req.body.hostVolume.toString(),
    serverName: req.body.serverName.toString(),
    postedBy: req.user.id,
  };
  await addData("projects", data);
  res.redirect("/");
});

router.get("/project/scale", verifyToken, async (req, res) => {
  if (!req.query.id) return res.redirect("/");
  const project = await searchData("projects", { _id: req.query.id });
  const data = project[0];
  const containers = await searchData("containers", { containerImage: data.imageID });
  let healthStatus = [];
  const noOfContainers = containers.length;
  for (let i = 0; i < noOfContainers; i++) {
    healthStatus.push(await healthCheck(containers[i].port));
  }
  res.render("scale", { data, containers, image: data.imageID, healthStatus, noOfContainers });
});

router.post("/project/scale", verifyToken, async (req, res) => {
  const project = await searchData("projects", { _id: req.body.id });
  const data = project[0];
  const maxScale = req.body.maxScale;
  if (!data.containerVolume || !data.hostVolume) await dockerScaleContainerNoVolume(data, maxScale);
  else await dockerScaleContainerWithVolume(data, maxScale);
  res.redirect(`/dashboard/project/scale?id=${req.body.id}`);
});

router.get("/project/generateConf", verifyToken, async (req, res) => {
  if (!req.query.id) return res.redirect("/");
  const containers = await searchData("containers", { containerImage: req.query.id });
  const server = await searchData("projects", { imageID: req.query.id });
  let serverName = "";
  if (server) {
    serverName = server[0].serverName;
  }
  let confFile = await generateConf(containers, serverName);
  confFile = confFile.split("\n");
  let newConfFile = [];
  for (let i = 0; i < confFile.length; i++) {
    newConfFile.push({ value: confFile[i] });
  }
  res.render("viewConf", { newConfFile, serverName });
});

router.get("/project/generateConfSSL", verifyToken, async (req, res) => {
  if (!req.query.id) return res.redirect("/");
  const containers = await searchData("containers", { containerImage: req.query.id });
  const server = await searchData("projects", { imageID: req.query.id });
  let serverName = "";
  let sudoPass = "";
  if (server) {
    serverName = server[0].serverName;
  }
  let confFile = await generateConfSSL(containers, serverName);
  confFile = confFile.split("\n");
  let newConfFile = [];
  for (let i = 0; i < confFile.length; i++) {
    newConfFile.push({ value: confFile[i] });
  }
  res.render("viewConf", { newConfFile, serverName });
});

router.post("/search", verifyToken, async (req, res) => {
  let projects = await searchData("projects", { postedBy: req.user.id, projectName: new RegExp(req.body.search, "i") });
  res.render("dashboard", { projects });
});

router.get("/project/delete", verifyToken, async (req, res) => {
  if (!req.query.id) return res.redirect("/");
  await removeData("projects", req.query.id);
  res.redirect("/");
});

module.exports = router;
